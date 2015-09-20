"use strict";

var $ = require("jquery");
var React = require("react");
var twgl = require("twgl.js");
var BilatFilter = require("./BilatFilter.js").BilatFilter;

var FilterApp = React.createClass({
	gl: null,
	getInitialState: function() {
		return {
			imgUrl: "",
			options: {}
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
	setOption: function(option,value) {
		var options = {};
		options[option] = value;
		this.setState({"options":options});
	},
	run: function() {		
		twgl.createTexture(this.gl,{src: this.state.options.imgUrl, wrap: this.gl.CLAMP_TO_EDGE},(function(err, texture, img) {
			var options = {
				width: img.width,
				height: img.height
			};
			texture = this.filt.filter(texture,options);
			this.filt.draw(texture,options);
		}).bind(this));

		return false;
	},
	componentDidMount: function() {
		this.loadShaders((function(){
			this.init();
		}).bind(this));
	},
	render: function() {
		return (
			<div>
				<FilterApp.OptionsForm ref="optionsForm" onChange={this.setOption} onSubmit={this.run} />
				<FilterApp.Canvas ref="canvas" />
			</div>
		);
	}
});

FilterApp.OptionsForm = React.createClass({
	handleChange: function(event) {
		this.props.onChange(event.target.name,event.target.value);
	},
	render: function() {
		return (
			<form id="optionsForm" onSubmit={this.props.onSubmit}>
				<label htmlFor="imgUrl">Image URL:</label>
				<input name="imgUrl" ref="imgUrl" type="text" onChange={this.handleChange} />
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
