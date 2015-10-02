var React = require("react");
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var InputImageDisplay = React.createClass({
	getInitialState: function() {
		return {key: 0};
	},
	componentWillReceiveProps: function(nextProps) {
		var newKey = this.state.key + 1;
		console.log("Update:",newKey);
		this.setState({key: newKey});
	},
	render: function() {
		const {image, width, height} = this.props;
		const {key} = this.state;

		var imageTag;
		if (this.props.image.length > 0)
			imageTag = <img className="InputImageDisplay" key={key} src={image} />;

		return <div className="InputImageDisplay" style={{width,height}}>
			<ReactCSSTransitionGroup transitionName="InputImageDisplay">
				{imageTag}
			</ReactCSSTransitionGroup>
		</div>
	}
});

module.exports = InputImageDisplay;
