var React = require("react");
var GL = require("gl-react");

var ImageFilter = require("./../ImageFilter");
var SelectImageForm = require("./../SelectImageForm");
var OptionsForm = require("./../OptionsForm");
var SaveForm = require("./../SaveForm");

var ImageFilterApp = React.createClass({
	getInitialState: function() {
		this.defaultValues = {
			ssig: 10,
			rsig: 0.3,
			sobelFactor: 0.5,
			image: "",
			width: 1,
			height: 1,
			gaussian: this.generateLookup()
		};
		return this.defaultValues;
	},
	generateLookup: function() {
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
	},
	onChangeHandler: function(data) {
		this.setState(data);
	},
	render: function() {
		const {width, height, ssig, rsig, sobelFactor, imgPath, image} = this.state;
		const [ssigDef, rsigDef, sobelFactorDef] = [this.defaultValues.ssig, this.defaultValues.rsig,this.defaultValues.sobelFactor];
		
		const gaussian = this.state.gaussian;

		const filterProps = {width,height,sobelFactor,bilatIters:3,gaussian,ssig,rsig}
		
		return <div>
			<SelectImageForm onChange={this.onChangeHandler} />
			<ImageFilter {...filterProps}>{image}</ImageFilter>
			<OptionsForm onChange={this.onChangeHandler} {...{ssigDef,rsigDef,sobelFactorDef}} />
			<SaveForm />
		</div>;
	}
});

module.exports = ImageFilterApp;
