function gaussian2D(x,y,ux,uy,sigx,sigy) {
	var exp = Math.pow(x-ux,2) / (2.0*Math.pow(sigx,2)) + Math.pow(y-uy,2) / (2.0*Math.pow(sigy,2));
	//return 1;
	return Math.pow(Math.E,exp*-1);
}

function generateGaussianMask(size) {
	var halfSize = Math.floor(size/2);
	var maskValues = [];
	var val = 255 / Math.pow(size,2);
	var sum = 0;
	for (var x = -halfSize; x <= halfSize; x++) {
		for (var y = -halfSize; y <= halfSize; y++) {
			val = gaussian2D(x,y,0,0,1,1);
			sum += val;
			maskValues.push(val);
		}
	}
	var mask = [];
	for (var i = 0; i < maskValues.length; i++) {
		val = maskValues[i] / sum * 255;
		mask.push(val,val,val,255);
	}
	return mask;
}

$(function() {
	generateGaussianMask(5);
});
