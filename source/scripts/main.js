$(function() {
	// Initial setup
	var gl = twgl.getWebGLContext($("canvas")[0]);
	var programInfo = twgl.createProgramInfo(gl, ["bilateral-vs", "bilateral-fs"]);
	twgl.setAttributePrefix("a_");
	$("#runBtn").click(function() {
	
		// Generate vertex buffer
		var arrays = {
			position: { numComponents: 2, data: [
				0, 0,
				1, 0,
				0, 1,
				0, 1,
				1, 0,
				1, 1,
			]}
		};
		var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
		
		var lookup = generateGaussianLookup(512,3);
		var lookupTex = twgl.createTexture(gl,{src: lookup, width: 512, height: 1, format: gl.LUMINANCE, wrap: gl.CLAMP_TO_EDGE});
		// Generate gaussian mask
		twgl.createTexture(gl,{src: 'images/birds.png', wrap: gl.CLAMP_TO_EDGE},function(err, texture, img) {
			
			canvas.width = img.width;
			canvas.height = img.height;

			twgl.resizeCanvasToDisplaySize(gl.canvas);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			var fbi = twgl.createFramebufferInfo(gl,null,gl.canvas.width,gl.canvas.height);
		
			gl.useProgram(programInfo.program);
			twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

			twgl.setUniforms(programInfo,{
				u_resolution: [gl.canvas.width,gl.canvas.height],
				u_multY: 1,
				u_image: texture,
				u_gaussian: lookupTex
			});
			
			twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);

			twgl.setUniforms(programInfo,{
				u_multY: -1,
				u_image: fbi.attachments[0]
			});
			gl.bindFramebuffer(gl.FRAMEBUFFER,null);
			twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
		});
	});
});
