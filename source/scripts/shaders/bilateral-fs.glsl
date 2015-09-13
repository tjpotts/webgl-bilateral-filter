precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_image;
uniform sampler2D u_gaussian;

varying vec2 v_texCoord;

const int c_winSize = 51;

void main() {
	vec2 pixSize = 1.0 / u_resolution; // Distance between pixels in clipspace
	vec3 color = vec3(0.0,0.0,0.0);
	
	vec3 startColor = texture2D(u_image, v_texCoord).rgb;
	
	float u_ssig = 20.0;
	float u_rsig = 0.3;
	float sum = 0.0;

	// Loop through pixels contained in window for current fragment
	for (int x = -1 * c_winSize / 2; x <= c_winSize / 2; x++) {
		for (int y = -1 * c_winSize / 2; y <= c_winSize / 2; y++) {
			// Get the color of current pixel
			vec2 texCoord = v_texCoord + vec2(x,y) * pixSize;
			vec3 curColor = texture2D(u_image, texCoord).rgb;

			// Get the spatial gaussian lookup value
			vec2 luCoordS = vec2(length(vec2(x,y)) / (u_ssig * 3.0),0.0);
			float luValS = texture2D(u_gaussian,luCoordS).r;
			// Get the range gaussian lookup value
			vec2 luCoordR = vec2(distance(startColor,curColor) / (u_rsig * 3.0),0.0);
			float luValR = texture2D(u_gaussian,luCoordR).r;

			// Add the contribution from this pixel
			sum += luValS *luValR;
			color += texture2D(u_image, texCoord).rgb * luValS * luValR;
		}
	}
	gl_FragColor = vec4(color / sum,1.0);
}
