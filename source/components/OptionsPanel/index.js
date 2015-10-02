var React = require("react");
var AppPage = require("./../AppPage")
var ImageFilter = require("./../ImageFilter");

var OptionsPanel = React.createClass({
	inputChange: function(e) {
		var option = {};
		var val = e.target.value;
		if (e.target.type == "range")
			val = Number(val);
		option[e.target.name] = val;
		this.props.onChange(option);
	},
	nextPage: function() {
		var  view = this.refs.filter.topView;
		view.captureFrame.call(view,(function(dataUrl) {
			this.props.onChange({filterImage:dataUrl});
			this.props.nextPage();
		}).bind(this));
	},
	render: function() {
		const {activePage, prevPage, width, height, ssig, rsig, sobelFactor, image} = this.props;
		
		const filterProps = {width,height,sobelFactor,bilatIters:3,ssig,rsig}
		
		return <AppPage id="Options" activePage={activePage}>
			<div className="md-panel">
				<ImageFilter ref="filter" {...filterProps}>{image}</ImageFilter>
				<form>
					<label htmlFor="ssig">Blur</label>
					<input type="range" name="ssig" defaultValue={this.props.ssigDef} min={1} max={10} step={1} onMouseUp={this.inputChange}/>
					<label htmlFor="rsig">Edge Preservation</label>
					<input type="range" name="rsig" defaultValue={this.props.rsigDef} min={0.1} max={0.7} step={0.02} onMouseUp={this.inputChange}/>
					<label htmlFor="sobelFactor">Edge Emphasis</label>
					<input type="range" name="sobelFactor" defaultValue={this.props.sobelFactorDef} min={0} max={1} step={0.02} onMouseUp={this.inputChange}/>
				</form>
				<button type="button" onClick={prevPage}>Back</button>
				<button type="button" onClick={this.nextPage}>Next</button>
			</div>
		</AppPage>
	}
});

module.exports = OptionsPanel;
