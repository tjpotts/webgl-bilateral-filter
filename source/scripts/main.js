$(function() {
	// Initial setup
	var gl = twgl.getWebGLContext($("canvas")[0]);
	var programInfo = twgl.createProgramInfo(gl, ["bilateral-vs", "bilateral-fs"]);
	var arrays = {
    	position: { numComponents: 2, data: [
    		0, 0,
    		100, 0,
    		0, 100,
    		0, 100,
    		100, 0,
    		100, 100,
    	]},
    	texCoord: { numComponents: 2, data: [
    		0, 0,
    		1, 0,
    		0, 1,
    		0, 1,
    		1, 0,
    		1, 1
    	]}
    };
    twgl.setAttributePrefix('a_');
    var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
 
 	var texture = twgl.createTexture(gl,{src: 'images/birds.png'},function() {
 		// Repeat every update
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
