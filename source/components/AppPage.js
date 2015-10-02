var React = require("react");

var AppPage = React.createClass({
	render: function() {
		const {activePage, id, children} = this.props
		var active = (activePage == id);
		var style = active ? {} : {display:"none"};
		return <div style={style}>
			{active ? children : ""}
		</div>
	}
});

module.exports = AppPage;
