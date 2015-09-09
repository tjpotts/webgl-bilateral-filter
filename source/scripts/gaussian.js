
// Generates a Gaussian lookup array from 0 to <devs> standard deviations,
// with <size> elements which is normalized to the range [0,1]
function generateGaussianLookup(size, devs) {
	var lookup = [];
	var sum = 0;

	for (var x = 0; x <= size; x++) {
		val = Math.pow(x*devs/size,2);
		val = Math.pow(Math.E,val*-1);

		lookup.push(val*255);
	}

	return lookup;
}

$(function() {
	console.log(generateGaussianLookup(512,3));
});
