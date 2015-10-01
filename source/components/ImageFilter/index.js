var ndarray = require("ndarray");
var React = require("react");
var GL = require("gl-react");

const shaders = GL.Shaders.create({
	bilat: {frag: require('./bilat.glsl')},
	sobel: {frag: require('./sobel.glsl')}
});

var generateLookup = function() {
	const lookupLength = 512;
	const lookupDevs = 3;

	var lookup = [];
	var val;
	for (var i = 0; i < lookupLength; i++) {
		val = Math.pow(i*lookupDevs/lookupLength,2);
		val = Math.pow(Math.E,val*-1);
		val = Math.round(val*255);
		lookup.push(val);
	}

	lookup = ndarray(new Float64Array(lookup),[lookupLength,1]);
	return lookup;
}

class BilatFilter extends GL.Component {
	render() {
		const {children, width, height, gaussian, ssig, rsig} = this.props;
		const uniforms = {width,height,gaussian,ssig,rsig};
		const shader = shaders.bilat;
		return <GL.View
			ref="view"
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
			ref="view"
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
	componentDidMount() {
		this.topView = this.refs.topFilter.refs.view;
	}
	render() {
		const {children,width,height,sobelFactor,bilatIters,ssig,rsig} = this.props;
		const gaussian = this.lookup;

		const sobelProps = {ref:"topFilter",width,height,factor:sobelFactor};
		const bilatProps = {width,height,ssig,rsig,gaussian};

		
		let filter = children;
		for (let i = 0; i < bilatIters; i++) {
			filter = React.createElement(BilatFilter,bilatProps,filter);
		}
		filter = React.createElement(SobelFilter,sobelProps,filter);
		return filter;
	}
}

module.exports = ImageFilter;
