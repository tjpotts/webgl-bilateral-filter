$(function() {
	// Initial setup
	var gl = twgl.getWebGLContext($("canvas")[0]);
	var programInfo = twgl.createProgramInfo(gl, ["bilateral-vs", "bilateral-fs"]);
	twgl.setAttributePrefix("a_");

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

	// Generate gaussian mask
	var lookup = generateGaussianLookup(512,3);
	var lookupTex = twgl.createTexture(gl,{src: lookup, width: 512, height: 1, format: gl.LUMINANCE});
	twgl.createTexture(gl,{src: 'images/birds.png'},function(err, texture, img) {
		canvas.width = img.width;
		canvas.height = img.height;

		twgl.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.useProgram(programInfo.program);
		twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

		twgl.setUniforms(programInfo,{
			u_resolution: [gl.canvas.width,gl.canvas.height],
			u_texture: texture,
			u_gaussian: lookupTex
		});
		console.log(gl.canvas.width,gl.canvas.height);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
	});
});
