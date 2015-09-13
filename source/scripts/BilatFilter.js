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

	this._render = function(srcTex,options,destTex) {
		// Resize the canvas and viewport
		gl.canvas.width = options.width;
		gl.canvas.height = options.height;
		gl.viewport(0, 0, options.width, options.height);
		
		// Set up the render target
		var multY;
		if (!destTex) {
			// Render to the screen
			gl.bindFramebuffer(gl.FRAMEBUFFER,null);
			multY = -1;
		} else {
			// Create the framebuffer to draw to, with the buffer texture attached
			twgl.resizeTexture(gl,destTex,{},options.width,options.height);
			twgl.createFramebufferInfo(gl,[{attachment: destTex}],gl.canvas.width,gl.canvas.height);
			multY = 1;
		}
		
		// Use the bilateral filter shader program
		gl.useProgram(this.programInfo.program);
		
		// Set the uniforms to send to the shader program
		twgl.setUniforms(this.programInfo,{
			u_resolution: [gl.canvas.width,gl.canvas.height],
			u_multY: multY,
			u_image: srcTex,
			u_gaussian: this.lookupTex
		});
		
		// Render the image and return the output texture
		twgl.drawBufferInfo(gl, gl.TRIANGLES, this.bufferInfo);
	}

	this.filter = function(srcTex,options,destTex) {
		// Create the texture to render to if one was not supplied
		if (!destTex) {
			destTex = twgl.createTexture(gl,{
				min: gl.LINEAR, 
				mag: gl.LINEAR, 
				wrap: gl.CLAMP_TO_EDGE
			});
		}
		
		this._render(srcTex,options,destTex);
		return destTex;
	}

	this.draw = function(srcTex,width,height) {
		this._render(srcTex,width,height,null);
	}
}
