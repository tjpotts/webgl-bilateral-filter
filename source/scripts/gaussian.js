function gaussian1D(x,u,sig) {
	var exp = Math.pow(x-u,2) / (2.0*Math.pow(sig,2));
	return Math.pow(Math.E,exp*-1);
}

function gaussian2D(x,y,ux,uy,sigx,sigy) {
	var exp = Math.pow(x-ux,2) / (2.0*Math.pow(sigx,2)) + Math.pow(y-uy,2) / (2.0*Math.pow(sigy,2));
	//return 1;
	return Math.pow(Math.E,exp*-1);
}

function generateGaussianMask(size) {
	var mean = 0;
	var sigma = 1;

	var halfSize = Math.floor(size/2);
	var mask = [];
	var val = 255 / Math.pow(size,2);
	var sum = 0;
	for (var x = -halfSize; x <= halfSize; x++) {
		for (var y = -halfSize; y <= halfSize; y++) {
			val = gaussian2D(x,y,mean,mean,sigma,sigma);
			sum += val;
			mask.push(val);
		}
	}
	for (var i = 0; i < mask.length; i++) {
		mask[i] = mask[i] / sum * 255;
	}
	return mask;
}

function generateGaussianKernel(size,sig) {
	var mean = 0;

	var kernel = [];
	var sum = 0;
	var val;

	// Generate gaussian function
	for (var x = 0; x <= size; x++) {
		val = gaussian1D(x,mean,sig);
		sum += val;
		kernel.push(val);
	}

	// Normalize to range 0-255
	var factor = kernel[0];
	for (var i = 0; i < kernel.length; i++) {
		kernel[i] = kernel[i] / factor * 255;
	}
	
	return kernel;
}

$(function() {
	generateGaussianMask(5);
	console.log(generateGaussianKernel(3,1));
});
