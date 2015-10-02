var React = require("react");
var GL = require("gl-react");

var AppPage = require("./../AppPage");
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
			filterImage: "",
			width: 1,
			height: 1,
			activePage: "SelectImage"
		};
		return this.defaultValues;
	},
	onChangeHandler: function(data) {
		this.setState(data);
	},
	changePage: function(page) {
		console.log("Changing Page:",page);
		this.setState({activePage:page});
	},
	render: function() {
		const {activePage, width, height, ssig, rsig, sobelFactor, imgPath, image, filename, filterImage} = this.state;
		const [ssigDef, rsigDef, sobelFactorDef] = [this.defaultValues.ssig, this.defaultValues.rsig,this.defaultValues.sobelFactor];
		
		const filterProps = {width,height,sobelFactor,bilatIters:3,ssig,rsig}
		
		return <div>
			<SelectImagePanel onChange={this.onChangeHandler} nextPage={this.changePage.bind(this,"Options")} {...{activePage,image,width,height}} />
			<OptionsPanel onChange={this.onChangeHandler} {...filterProps} prevPage={this.changePage.bind(this,"SelectImage")} nextPage={this.changePage.bind(this,"Save")} {...{activePage,image,ssigDef,rsigDef,sobelFactorDef}} />
			<SavePanel prevPage={this.changePage.bind(this,"Options")} {...{activePage,filename,filterImage}} />
		</div>;
	}
});

module.exports = ImageFilterApp;
