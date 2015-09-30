var React = require("react");
var GL = require("gl-react");

const shaders = GL.Shaders.create({
	bilat: {frag: require('./bilat.glsl')},
	sobel: {frag: require('./sobel.glsl')}
});

var generateLookup = function() {
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

class BilatFilter extends GL.Component {
	render() {
		const {children, width, height, gaussian, ssig, rsig} = this.props;
		const uniforms = {width,height,gaussian,ssig,rsig};
		const shader = shaders.bilat;
		return <GL.View
			shader={shader}
			width={width}
			height={height}
			uniforms={uniforms}
		>
			<GL.Uniform name="image">{children}</GL.Uniform>
		</GL.View>
	}
}

class SobelFilter extends GL.Component {
	render() {
		const {children, width, height, factor} = this.props;
		const shader = shaders.sobel;
		return <GL.View
			shader={shader}
			width={width}
			height={height}
			uniforms={{width,height,factor}}
		>
			<GL.Uniform name="image">{children}</GL.Uniform>
		</GL.View>
	}
}

class ImageFilter extends GL.Component {
	constructor(props) {
		super(props);
		this.lookup = generateLookup();
	}
	render() {
		const {children,width,height,sobelFactor,bilatIters,ssig,rsig} = this.props;
		const gaussian = this.lookup;

		const sobelProps = {width,height,factor:sobelFactor};
		const bilatProps = {width,height,gaussian,ssig,rsig};

		
		let filter = children;
		for (let i = 0; i < bilatIters; i++) {
			filter = React.createElement(BilatFilter,bilatProps,filter);
		}
		filter = React.createElement(SobelFilter,sobelProps,filter);
		return filter;
	}
}

module.exports = ImageFilter;
