"use strict";

function BilatFilter(gl) {
	this.gl = gl;

	this.init = function() {
		// Create the filter shader program
		this.programInfo = twgl.createProgramInfo(this.gl, ["bilateral-vs", "bilateral-fs"]);

		// Create the Gaussian lookup texture
		var lookupData = generateGaussianLookup(512,3);
		this.lookupTex = twgl.createTexture(gl,{
			src: lookupData,
			width: 512,
			height: 1,
			format: gl.LUMINANCE,
			wrap: gl.CLAMP_TO_EDGE
		});

		// Create the vertex position buffer 
		this.attrArrays = {
			a_position: { numComponents: 2, data: [
				0, 0,
				1, 0,
				0, 1,
				0, 1,
				1, 0,
				1, 1
			]}
		};
		this.bufferInfo = twgl.createBufferInfoFromArrays(gl, this.attrArrays);
		twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);

	}

	this.filter = function(srcTex,width,height,destTex) {
		// Create the texture to render to if one was not supplied
		if (!destTex) {
			destTex = twgl.createTexture(gl,{
				min: gl.LINEAR, 
				mag: gl.LINEAR, 
				wrap: gl.CLAMP_TO_EDGE
			});
		}
		
		// Resize the canvas, viewport and buffer texture
		gl.canvas.width = width;
		gl.canvas.height = height;
		gl.viewport(0, 0, width, height);
		twgl.resizeTexture(gl,destTex,{},width,height);

		// Create the framebuffer to draw to, with the buffer texture attached
		var fbi = twgl.createFramebufferInfo(gl,[{attachment: destTex}],gl.canvas.width,gl.canvas.height);
		
		// Use the bilateral filter shader program
		gl.useProgram(this.programInfo.program);
		
		// Set the uniforms to send to the shader program
		twgl.setUniforms(this.programInfo,{
			u_resolution: [gl.canvas.width,gl.canvas.height],
			u_multY: 1,
			u_image: srcTex,
			u_gaussian: this.lookupTex
		});
		
		// Render the image and return the output texture
		twgl.drawBufferInfo(gl, gl.TRIANGLES, this.bufferInfo);
		return destTex;
	}
}

$(function() {
	// Initial setup
	var gl = twgl.getWebGLContext($("canvas")[0]);
	var programInfo = twgl.createProgramInfo(gl, ["bilateral-vs", "bilateral-fs"]);
	
	var filt = new BilatFilter(gl);
	filt.init();

	$("#runBtn").click(function() {
		twgl.createTexture(gl,{src: 'images/birds.png', wrap: gl.CLAMP_TO_EDGE},function(err, texture, img) {
			var outTex = filt.filter(texture,img.width,img.height);
			twgl.setUniforms(filt.programInfo,{
				u_multY: -1,
				u_image: outTex
			});
			gl.bindFramebuffer(gl.FRAMEBUFFER,null);
			twgl.drawBufferInfo(gl, gl.TRIANGLES, filt.bufferInfo);
		});
	});
});
