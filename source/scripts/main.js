"use strict";

var $ = require("jquery");
var React = require("react");
var GL = require("gl-react");
var bilatfs = require("./shaders/bilat.glsl");

const shaders = GL.Shaders.create({
	bilat: {
		frag: require('./shaders/bilat.glsl')
	}
});

class Bilateral extends GL.Component {
	generateLookup() {
		const lookupLength = 512;
		const lookupDevs = 3;

		var canvas = this.refs.lookupCanvas.getDOMNode();
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

		this.refs.view.props.uniforms["gaussian"] = canvas.toDataURL();
		this.refs.view.forceUpdate();
	}

	componentDidMount() {
		this.generateLookup();
	}

	render() {
		const { width, height, image } = this.props;
		const gaussian = "";
		return <div>
			<GL.View ref="view"
				shader={shaders.bilat}
				width={width}
				height={height}
				uniforms={{image,width,height,gaussian}}
			/>
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
