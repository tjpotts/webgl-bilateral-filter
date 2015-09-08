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

	twgl.createTexture(gl,{src: 'images/birds.png'},function(err, texture, img) {
		canvas.width = img.width;
		canvas.height = img.height;

		twgl.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.useProgram(programInfo.program);
		twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

		twgl.setUniforms(programInfo,{
			u_resolution: [gl.canvas.width,gl.canvas.height],
			u_texture: texture
		})
		twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
	});
});
