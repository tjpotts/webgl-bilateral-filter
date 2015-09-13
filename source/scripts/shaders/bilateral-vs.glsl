precision mediump float;
		
uniform float u_multY;

attribute vec2 a_position;

varying vec2 v_texCoord;

void main() {
	gl_Position = vec4((a_position * 2.0 - 1.0) * vec2(1.0,u_multY),0,1);
	v_texCoord = a_position;
}
