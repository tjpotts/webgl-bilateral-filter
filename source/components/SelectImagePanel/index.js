var React = require("react");
var InputImageDisplay = require("./InputImageDisplay");
var AppPage = require("./../AppPage");

var SelectImagePanel = React.createClass({
	getFilenameFromPath: function(path) {
		return path.replace(/^.*[\\\/]/,'');
	},
	loadImageFromUrl: function(imgPath) {
		var filename = this.getFilenameFromPath(imgPath);
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var image = new Image();

		image.onload = (function() {
			canvas.width = image.width;
			canvas.height = image.height;

			ctx.drawImage(image, 0, 0, image.width, image.height);

			var dataUrl = canvas.toDataURL();
			this.props.onChange({filename, image: dataUrl, width: image.width, height: image.height});
		}).bind(this);
		image.src = imgPath;
	},
	openGallery: function(e) {
		e.preventDefault();
	},
	loadRemoteImage: function(e) {
		var imgPath = this.refs.imgPath.getDOMNode().value;
		this.loadImageFromUrl(imgPath);
		if (e)
			e.preventDefault();
	},
	loadLocalImage: function(e) {
		var reader = new FileReader();
		var file = e.target.files[0];
		reader.onload = (function(e) {
			var dataUrl = e.target.result;
			var img = new Image();
			img.onload = (function(e) {
				this.props.onChange({filename: file.name, image: dataUrl, width: img.width, height: img.height});
			}).bind(this);
			img.src = dataUrl;
		}).bind(this);
		reader.readAsDataURL(file);
	},
	clearLocalImage: function(e) {
		e.target.value = "";
	},
	componentDidMount: function() {
		this.loadImageFromUrl("images/birds.png");
	},
	render: function() {
		const {activePage, nextPage, image, width, height} = this.props;

		return <AppPage id="SelectImage" activePage={activePage}>
			<div className="md-panel">
				1. Select an Image
				{/* Select from sample gallery */}
				<a href="#" onClick={this.openGallery}>Choose a Sample Image</a>
				{/* Load a local file */}
				<input type="file" name="imgLocal" onChange={this.loadLocalImage} onClick={this.clearLocalImg}/>
				{/* Load a remote file */}
				<form onSubmit={this.loadRemoteImage}>
					<input type="text" ref="imgPath" name="imgPath"/>
					<button type="submit">Load Image</button>
				</form>
				<InputImageDisplay image={image} width={width} height={height} />
				<button type="button" onClick={nextPage}>Next</button>
			</div>
		</AppPage>
	}
});

module.exports = SelectImagePanel;
