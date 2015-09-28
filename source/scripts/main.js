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

class Bilateral extends GL.Component {
	constructor(props) {
		super(props);
		this.defaultValues = {
			ssig: 10,
			ssigTmp: 10,
			rsig: 0.3,
			rsigTmp: 0.3,
			sobelFactor: 0.5,
			sobelFactorTmp: 0.5,
			imgPath: "images/birds.png",
			image: "",
			width: 1,
			height: 1,
			gaussian: this.generateLookup()
		};
		this.state = this.defaultValues;

		this.inputChange = this.inputChange.bind(this);
		this.loadImg = this.loadImg.bind(this);
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

	inputChange(e) {
		var state = {};
		var val = e.target.value;
		if (e.target.type == "range")
			val = Number(val);
		state[e.target.name] = val;
		this.setState(state);
	}

	loadImg(e) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var image = new Image();

		image.onload = (function() {
			canvas.width = image.width;
			canvas.height = image.height;

			ctx.drawImage(image, 0, 0, image.width, image.height);

			var dataUrl = canvas.toDataURL();
			this.setState({image: dataUrl, width: image.width, height: image.height});
			console.log("Image size:",image.width,image.height);
			this.forceUpdate();
		}).bind(this);
		image.src = this.state.imgPath;

		if (e)
			e.preventDefault();
	}

	componentWillMount() {
		console.log("ComponentWillMount");
		this.loadImg();
	}

	render() {
		const {width, height, ssig, rsig, sobelFactor, imgPath, image} = this.state;
		const {ssigDef, rsigDef, sobelFactorDef} = this.defaultValues;
		
		const gaussian = this.state.gaussian;

		console.log("State size:",width,height);
		return <div>
			<form onSubmit={this.loadImg}>
				<input type="text" name="imgPath" onChange={this.inputChange}/>
				<button type="submit">Load Image</button>
			</form>
			<GL.View
				shader={shaders.sobel}
				width={width}
				height={height}
				uniforms={{width,height,factor:sobelFactor}}
			>
				<GL.Uniform name="image">
					<GL.View ref="view"
						shader={shaders.bilat}
						width={width}
						height={height}
						uniforms={{width,height,gaussian,ssig,rsig}}
					>
						<GL.Uniform name="image">
							<GL.View ref="view"
								shader={shaders.bilat}
								width={width}
								height={height}
								uniforms={{image,width,height,gaussian,ssig,rsig}}
							/>
						</GL.Uniform>
					</GL.View>
				</GL.Uniform>
			</GL.View>
			<form>
				<input type="range" name="ssig" defaultValue={ssigDef} min={1} max={25} step={1} onMouseUp={this.inputChange}/>
				<input type="range" name="rsig" defaultValue={rsigDef} min={0.1} max={0.7} step={0.02} onMouseUp={this.inputChange}/>
				<input type="range" name="sobelFactor" defaultValue={sobelFactorDef} min={0} max={1} step={0.02} onMouseUp={this.inputChange}/>
			</form>
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
