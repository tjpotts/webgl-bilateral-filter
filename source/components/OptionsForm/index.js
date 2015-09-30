var React = require("react");

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
			<label htmlFor="ssig">Blur</label>
			<input type="range" name="ssig" defaultValue={this.props.ssigDef} min={1} max={10} step={1} onMouseUp={this.inputChange}/>
			<label htmlFor="rsig">Edge Preservation</label>
			<input type="range" name="rsig" defaultValue={this.props.rsigDef} min={0.1} max={0.7} step={0.02} onMouseUp={this.inputChange}/>
			<label htmlFor="sobelFactor">Edge Emphasis</label>
			<input type="range" name="sobelFactor" defaultValue={this.props.sobelFactorDef} min={0} max={1} step={0.02} onMouseUp={this.inputChange}/>
		</form>
	}
});

module.exports = OptionsForm;
