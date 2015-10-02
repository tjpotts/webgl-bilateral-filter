var React = require("react");
var GL = require("gl-react");

var ImageFilter = require("./../ImageFilter");
var SelectImagePanel = require("./../SelectImagePanel");
var OptionsPanel = require("./../OptionsPanel");
var SavePanel = require("./../SavePanel");

var ImageFilterApp = React.createClass({
	getInitialState: function() {
		this.defaultValues = {
			ssig: 10,
			rsig: 0.3,
			sobelFactor: 0.5,
			filename: "",
			image: "",
			width: 1,
			height: 1
		};
		return this.defaultValues;
	},
	onChangeHandler: function(data) {
		this.setState(data);
	},
	saveImage: function() {
		this.refs.filter.topView.captureFrame.call(this.refs.filter.topView,(function(dataUrl) {
			console.log("Saving:",dataUrl);
			var link = document.createElement("a");
			link.download = this.state.filename;
			link.href = dataUrl;
			link.click();
		}).bind(this));
	},
	render: function() {
		const {width, height, ssig, rsig, sobelFactor, imgPath, image} = this.state;
		const [ssigDef, rsigDef, sobelFactorDef] = [this.defaultValues.ssig, this.defaultValues.rsig,this.defaultValues.sobelFactor];
		
		const filterProps = {width,height,sobelFactor,bilatIters:3,ssig,rsig}
		
		return <div>
			<SelectImagePanel onChange={this.onChangeHandler} />
			<div className="md-panel"><ImageFilter ref="filter" {...filterProps}>{image}</ImageFilter></div>
			<OptionsPanel onChange={this.onChangeHandler} {...{ssigDef,rsigDef,sobelFactorDef}} />
			<SavePanel saveCallback={this.saveImage} />
		</div>;
	}
});

module.exports = ImageFilterApp;
