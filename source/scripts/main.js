"use strict";

var $ = require("jquery");
var React = require("react");
var GL = require("gl-react");
var bilatfs = require("./shaders/bilat.glsl");

const shaders = GL.Shaders.create({
	bilat: {
		frag: require('./shaders/bilat.glsl')
	},
	sobel: {
		frag: require('./shaders/sobel.glsl')
	}
});

var SelectImageForm = React.createClass({
	loadImageFromUrl: function(imgPath) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var image = new Image();

		image.onload = (function() {
			canvas.width = image.width;
			canvas.height = image.height;

			ctx.drawImage(image, 0, 0, image.width, image.height);

			var dataUrl = canvas.toDataURL();
			this.props.onChange({image: dataUrl, width: image.width, height: image.height});
		}).bind(this);
		image.src = imgPath;
	},
	openGallery: function(e) {
		e.preventDefault();
	},
	loadRemoteImage: function(e) {
		var imgPath = this.refs.imgPath.getDOMNode().value;
		this.loadImageFromUrl(imgPath);
		if (e)
			e.preventDefault();
	},
	loadLocalImage: function(e) {
		var reader = new FileReader();
		console.log("Loading local image");
		reader.onload = (function(e) {
			console.log("Local image loaded");
			var dataUrl = e.target.result;
			var img = new Image();
			img.onload = (function(e) {
				console.log("Local image ready");
				this.props.onChange({image: dataUrl, width: img.width, height: img.height});
			}).bind(this);
			img.src = dataUrl;
		}).bind(this);
		reader.readAsDataURL(e.target.files[0]);
	},
	clearLocalImage: function(e) {
		e.target.value = "";
	},
	componentDidMount: function() {
		this.loadImageFromUrl("images/birds.png");
	},
	render: function() {
		return <div>
			1. Select an Image
			{/* Select from sample gallery */}
			<a href="#" onClick={this.openGallery}>Choose a Sample Image</a>
			{/* Load a local file */}
			<input type="file" name="imgLocal" onChange={this.loadLocalImage} onClick={this.clearLocalImg}/>
			{/* Load a remote file */}
			<form onSubmit={this.loadRemoteImage}>
				<input type="text" ref="imgPath" name="imgPath"/>
				<button type="submit">Load Image</button>
			</form>
		</div>
	}
});

var OptionsForm = React.createClass({
	inputChange: function(e) {
		var option = {};
		var val = e.target.value;
		if (e.target.type == "range")
			val = Number(val);
		option[e.target.name] = val;
		this.props.onChange(option);
	},
	render: function() {
		return <form>
			<label for="ssig">Blur</label>
			<input type="range" name="ssig" defaultValue={this.props.ssigDef} min={1} max={10} step={1} onMouseUp={this.inputChange}/>
			<label for="rsig">Edge Preservation</label>
			<input type="range" name="rsig" defaultValue={this.props.rsigDef} min={0.1} max={0.7} step={0.02} onMouseUp={this.inputChange}/>
			<label for="sobelFactor">Edge Emphasis</label>
			<input type="range" name="sobelFactor" defaultValue={this.props.sobelFactorDef} min={0} max={1} step={0.02} onMouseUp={this.inputChange}/>
		</form>
	}
});

class Bilateral extends GL.Component {
	constructor(props) {
		super(props);
		this.defaultValues = {
			ssig: 10,
			rsig: 0.3,
			sobelFactor: 0.5,
			image: "",
			width: 1,
			height: 1,
			gaussian: this.generateLookup()
		};
		this.state = this.defaultValues;

		this.setState = this.setState.bind(this);
	}

	generateLookup() {
		const lookupLength = 512;
		const lookupDevs = 3;

		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = lookupLength;
		canvas.height = 1;

		var val;
		for (var i = 0; i < lookupLength; i++) {
			val = Math.pow(i*lookupDevs/lookupLength,2);
			val = Math.pow(Math.E,val*-1);
			val = Math.round(val*255);

			ctx.fillStyle = "rgb(" + val + "," + val + "," + val + ")";
			ctx.fillRect(i,0,1,1);
		}

		return canvas.toDataURL();
	}

	render() {
		const {width, height, ssig, rsig, sobelFactor, imgPath, image} = this.state;
		const {ssigDef, rsigDef, sobelFactorDef} = this.defaultValues;
		
		const gaussian = this.state.gaussian;
		return <div>
			<SelectImageForm onChange={this.setState} />
			<GL.View
				shader={shaders.sobel}
				width={width}
				height={height}
				uniforms={{width,height,factor:sobelFactor}}
			>
				<GL.Uniform name="image">
					<GL.View ref="view"
						shader={shaders.bilat}
						uniforms={{width,height,gaussian,ssig,rsig}}
					>
						<GL.Uniform name="image">
							<GL.View ref="view"
								shader={shaders.bilat}
								uniforms={{image,width,height,gaussian,ssig,rsig}}
							/>
						</GL.Uniform>
					</GL.View>
				</GL.Uniform>
			</GL.View>
			<OptionsForm onChange={this.setState} props={{ssigDef,rsigDef,sobelFactorDef}} />
		</div>;
	}
}

React.render(
	<div>
		<Bilateral/>
	</div>
	,
	document.getElementById('app')
);
