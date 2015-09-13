"use strict";

var FilterApp = React.createClass({
	gl: null,
	getInitialState: function() {
		return {
			initialized: false
		};
	},
	loadShaders: function(cb) {
		var shaders = $('script[type="x-shader/x-vertex"][src],script[type="x-shader/x-fragment"][src]');
		var shadersLoaded = 0;
		shaders.each(function(i, s) {
			$.get(s.src,function(data) {
				s.text = data;
				shadersLoaded++;
				if (shadersLoaded >= shaders.length)
					cb();
			});
		});
	},
	init: function() {
		var canvas = this.refs.canvas.getDOMNode();
		this.gl = twgl.getWebGLContext($("canvas")[0]);
		
		this.filt = new BilatFilter(this.gl);
		this.filt.init();
	},
	run: function() {
		var imgUrl = $('input[name="imgUrl"]').val();
		var self = this;

		twgl.createTexture(this.gl,{src: imgUrl, wrap: this.gl.CLAMP_TO_EDGE},function(err, texture, img) {
			var options = {
				width: img.width,
				height: img.height
			};
			texture = self.filt.filter(texture,options);
			self.filt.draw(texture,options);
		});

		return false;
	},
	componentDidMount: function() {
		var self = this;
		this.loadShaders(function(){
			self.init();
			$("#optionsFrm").submit(self.run);
		});
	},
	render: function() {
		return (
			<div>
				<FilterApp.Form />
				<FilterApp.Canvas ref="canvas" />
			</div>
		);
	}
});

FilterApp.Form = React.createClass({
	render: function() {
		return (
			<form id="optionsFrm">
				<label htmlFor="imgUrl">Image URL:</label>
				<input name="imgUrl" type="text" />
				<button id="runButton" type="submit">Run</button>
			</form>
		);
	}
});

FilterApp.Canvas = React.createClass({
	render: function() {
		return (
			<canvas />
		);
	}
});

React.render(
	<FilterApp />,
	document.getElementById('app')
);
