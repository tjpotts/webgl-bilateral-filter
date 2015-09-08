function generateGaussianMask(size) {
	var halfSize = Math.floor(size/2);
	var mask = [];
	var val = 255 / Math.pow(size,2);
	for (var x = -halfSize; x <= halfSize; x++) {
		for (var y = -halfSize; y <= halfSize; y++) {
			mask.push(val,val,val,255);
		}
	}
	console.log(mask.length)
	return mask;
}

$(function() {
	console.log(generateGaussianMask(5));
});
