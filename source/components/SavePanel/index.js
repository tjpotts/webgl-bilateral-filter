var React = require("react");

var SavePanel = React.createClass({
	saveImage: function(e) {
		this.props.saveCallback();
		e.preventDefault();
	},
	render: function() {
		return <form className="md-panel" onSubmit={this.saveImage}>
			<button type="submit">Save Image</button>
		</form>
	}
});

module.exports = SavePanel;
