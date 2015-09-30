
precision mediump float;

varying vec2 uv;
uniform sampler2D image;
uniform sampler2D gaussian;
uniform float width;
uniform float height;

uniform float ssig;
uniform float rsig;

const int c_winSize = 25;

void main() {
	vec3 color = vec3(0.0,0.0,0.0);

	vec2 pixSize = 1.0 / vec2(width,height); // Distance between pixels in clipspace
	
	vec3 startColor = texture2D(image, uv).rgb;
	
	float sum = 0.0;
	for (int x = -1 * c_winSize / 2; x <= c_winSize / 2; x++) {
		for (int y = -1 * c_winSize / 2; y <= c_winSize / 2; y++) {
			// Get the color of the current pixel
			vec2 texCoord = uv + vec2(x,y) * pixSize;
			vec3 curColor = texture2D(image, texCoord).rgb;

			// Get the spatial gaussian lookup value
			vec2 luCoordS = vec2(length(vec2(x,y)) / (ssig * 3.0),0.0);
			float luValS = texture2D(gaussian,luCoordS).r;
			// Get the range gaussian lookup value
			vec2 luCoordR = vec2(distance(startColor,curColor) / (rsig * 3.0),0.0);
			float luValR = texture2D(gaussian,luCoordR).r;

			sum += luValS * luValR;
			color += curColor * luValS * luValR;
		}
	}

	gl_FragColor = vec4(color/sum,1.0);
}
