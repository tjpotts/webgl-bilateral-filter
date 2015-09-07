$(function() {
	// Initial setup
	var gl = twgl.getWebGLContext($("canvas")[0]);
	var programInfo = twgl.createProgramInfo(gl, ["bilateral-vs", "bilateral-fs"]);
	var arrays = {
    	position: { numComponents: 2, data: [
    		-1, -1,
    		 1, -1,
    		-1, 1,
    		-1, 1,
    		1, -1,
    		1, 1,
    	]}
    };
    var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
 
 	// Repeat every update
	twgl.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.useProgram(programInfo.program);
	twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
	twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
});
