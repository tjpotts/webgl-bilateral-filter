"use strict";

$(function() {
	var gl;
	var filt;

	function loadShaders(cb) {
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
	}

	function init() {
		// Initial setup
		gl = twgl.getWebGLContext($("canvas")[0]);
		
		filt = new BilatFilter(gl);
		filt.init();
	}

	function run() {
		var imgUrl = $('input[name="imageUrl"]').val();

		twgl.createTexture(gl,{src: imgUrl, wrap: gl.CLAMP_TO_EDGE},function(err, texture, img) {
			var options = {
				width: img.width,
				height: img.height
			};
			texture = filt.filter(texture,options);
			filt.draw(texture,options);
		});

		return false;
	}

	loadShaders(function() {
		init();
		$("#optionsForm").submit(run);
	});
});
