var React = require("react");

var SelectImageForm = React.createClass({
	loadImageFromUrl: function(imgPath) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var image = new Image();

		image.onload = (function() {
			canvas.width = image.width;
			canvas.height = image.height;

			ctx.drawImage(image, 0, 0, image.width, image.height);

			var dataUrl = canvas.toDataURL();
			this.props.onChange({image: dataUrl, width: image.width, height: image.height});
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
		reader.onload = (function(e) {
			var dataUrl = e.target.result;
			var img = new Image();
			img.onload = (function(e) {
				this.props.onChange({image: dataUrl, width: img.width, height: img.height});
			}).bind(this);
			img.src = dataUrl;
		}).bind(this);
		reader.readAsDataURL(e.target.files[0]);
	},
	clearLocalImage: function(e) {
		e.target.value = "";
	},
	componentDidMount: function() {
		this.loadImageFromUrl("images/birds.png");
	},
	render: function() {
		return <div>
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
		</div>
	}
});

module.exports = SelectImageForm;
