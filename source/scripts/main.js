"use strict";

$(function() {
	// Initial setup
	var gl = twgl.getWebGLContext($("canvas")[0]);
	var programInfo = twgl.createProgramInfo(gl, ["bilateral-vs", "bilateral-fs"]);
	
	var filt = new BilatFilter(gl);
	filt.init();

	$("#runBtn").click(function() {
		twgl.createTexture(gl,{src: 'images/birds.png', wrap: gl.CLAMP_TO_EDGE},function(err, texture, img) {
			var options = {
				width: img.width,
				height: img.height
			};
			texture = filt.filter(texture,options);
			filt.draw(texture,options);
		});
	});
});
