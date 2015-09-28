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
			gaussian: this.generateLookup()
		};
		this.state = this.defaultValues;

		this.inputChange = this.inputChange.bind(this);
		this.inputSave = this.inputSave.bind(this);
	}

	generateLookup() {
		const lookupLength = 512;
		const lookupDevs = 3;

		//var canvas = this.refs.lookupCanvas.getDOMNode();
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
		//state[e.target.name + "Tmp"] = Number(e.target.value);
		state[e.target.name] = Number(e.target.value);
		console.log("Input change",e.target.name,e.target.value);
		this.setState(state);
	}

	inputSave(e) {
		var state = {};
		state[e.target.name] = state[e.target.name + "Tmp"];
		console.log("Input save",e.target.name,state[e.target.name+"Tmp"]);
		this.setState(state);
	}

	render() {
		const {width, height, image} = this.props;
		const {ssig, rsig, sobelFactor} = this.state;
		const {ssigDef, rsigDef, sobelFactorDef} = this.defaultValues;
		
		const gaussian = this.state.gaussian;
		return <div>
			<form>
				<input type="range" name="ssig" defaultValue={ssigDef} min={1} max={25} step={1} onMouseUp={this.inputChange}/>
				<input type="range" name="rsig" defaultValue={rsigDef} min={0.1} max={0.7} step={0.02} onMouseUp={this.inputChange}/>
				<input type="range" name="sobelFactor" defaultValue={sobelFactorDef} min={0} max={1} step={0.02} onMouseUp={this.inputChange}/>
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
			<canvas ref="lookupCanvas" style={{display:"none"}} />
		</div>;
	}
}

React.render(
	<div>
		<Bilateral width={768} height={512} image="images/birds.png" />
	</div>
	,
	document.getElementById('app')
);
