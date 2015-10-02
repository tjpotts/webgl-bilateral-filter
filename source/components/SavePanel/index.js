var React = require("react");
var AppPage = require("./../AppPage");

var SavePanel = React.createClass({
	saveImage: function() {
		var link = document.createElement("a");
		link.download = this.props.filename;
		link.href = this.props.filterImage;
		link.click();
	},
	render: function() {
		const {activePage,prevPage} = this.props;
		
		return <AppPage id="Save" activePage={activePage}>
			<div className="md-panel">
				<img src={this.props.filterImage} />
				<button type="button" onClick={prevPage}>Back</button>
				<button type="button" onClick={this.saveImage}>Save Image</button>
			</div>
		</AppPage>
	}
});

module.exports = SavePanel;
