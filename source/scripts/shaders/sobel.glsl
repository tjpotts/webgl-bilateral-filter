
precision mediump float;

varying vec2 uv;
uniform sampler2D image;
uniform float width;
uniform float height;
uniform float factor;

void main() {
	vec2 pixSize = 1.0 / vec2(width,height);

	// Calculate Gx
	vec4 Gx = vec4(0.0,0.0,0.0,0.0);
	Gx += texture2D(image,uv + vec2(-1,-1) * pixSize) * -1.0;
	Gx += texture2D(image,uv + vec2( 0,-1) * pixSize) * -0.0;
	Gx += texture2D(image,uv + vec2( 1,-1) * pixSize) *  1.0;
	Gx += texture2D(image,uv + vec2(-1, 0) * pixSize) * -2.0;
	Gx += texture2D(image,uv + vec2( 0, 0) * pixSize) *  0.0;
	Gx += texture2D(image,uv + vec2( 1, 0) * pixSize) *  2.0;
	Gx += texture2D(image,uv + vec2(-1, 1) * pixSize) * -1.0;
	Gx += texture2D(image,uv + vec2( 0, 1) * pixSize) *  0.0;
	Gx += texture2D(image,uv + vec2( 1, 1) * pixSize) *  1.0;

	vec4 Gy = vec4(0.0,0.0,0.0,0.0);
	Gy += texture2D(image,uv + vec2(-1,-1) * pixSize) * -1.0;
	Gy += texture2D(image,uv + vec2( 0,-1) * pixSize) * -2.0;
	Gy += texture2D(image,uv + vec2( 1,-1) * pixSize) * -1.0;
	Gy += texture2D(image,uv + vec2(-1, 0) * pixSize) *  0.0;
	Gy += texture2D(image,uv + vec2( 0, 0) * pixSize) *  0.0;
	Gy += texture2D(image,uv + vec2( 1, 0) * pixSize) *  0.0;
	Gy += texture2D(image,uv + vec2(-1, 1) * pixSize) *  1.0;
	Gy += texture2D(image,uv + vec2( 0, 1) * pixSize) *  2.0;
	Gy += texture2D(image,uv + vec2( 1, 1) * pixSize) *  1.0;

	float Gr = sqrt(pow(Gx.r,2.0) + pow(Gy.r,2.0));
	float Gg = sqrt(pow(Gx.g,2.0) + pow(Gy.g,2.0));
	float Gb = sqrt(pow(Gx.b,2.0) + pow(Gy.b,2.0));

	float Gavg = (Gr + Gg + Gb) / 3.0;
	float mult = 1.0 - Gavg*factor;

	//gl_FragColor = vec4(mult,mult,mult,1.0);
	gl_FragColor = vec4(texture2D(image,uv).rgb * mult,1.0);
}
