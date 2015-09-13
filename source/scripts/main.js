"use strict";

$(function() {
	// Initial setup
	var gl = twgl.getWebGLContext($("canvas")[0]);
	var programInfo = twgl.createProgramInfo(gl, ["bilateral-vs", "bilateral-fs"]);
	
	var filt = new BilatFilter(gl);
	filt.init();

	$("#runBtn").click(function() {
		var imgUrl = $('input[name="imageUrl"]').val();

		twgl.createTexture(gl,{src: imgUrl, wrap: gl.CLAMP_TO_EDGE},function(err, texture, img) {
			var options = {
				width: img.width,
				height: img.height
			};
			texture = filt.filter(texture,options);
			filt.draw(texture,options);
		});
	});
});
