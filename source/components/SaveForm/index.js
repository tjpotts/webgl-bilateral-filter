var React = require("react");

var SaveForm = React.createClass({
	saveImage: function(e) {
		this.props.saveCallback();
		e.preventDefault();
	},
	render: function() {
		return <form onSubmit={this.saveImage}>
			<button type="submit">Save Image</button>
		</form>
	}
});

module.exports = SaveForm;
