var skyColor = [50, 150, 255];
var cloudColor = [255, 255, 255];

function draw(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var imgWidth = 512;
	var imgHeight = 512;
	var imgData = ctx.createImageData(imgWidth, imgHeight);

	var circles = [];
	var cValues = [];


	for(var i = 1; i <= 3; i ++) {
		circles.push(Number(document.getElementById("x" + i).value));
		circles.push(Number(document.getElementById("y" + i).value));
		circles.push(Number(document.getElementById("r" + i).value));
	}

	for(var i = 0; i < imgHeight; i ++) {
		for(var j = 0; j < imgWidth; j ++) {
			var index = ((i * imgWidth) + j) * 4;
			var C = 0;
			for(var l = 0; l < 3; l ++) {
				var r = Math.pow(j - circles[3 * l], 2) + Math.pow(i -  circles[3 * l + 1], 2);
				var R = Math.pow(circles[3 * l + 2], 2);
				if(r <= R) {
					var F = (- 4 * Math.pow(r, 3) / (9 * Math.pow(R, 3)) + 
					 17 * Math.pow(r, 2) / (9 * Math.pow(R, 2)) - 
					 22 * r / (9 * R) + 1)
				}
				else {
					var F = 0;
				}
				F = F * R/ 10000;
				C += F;
			}
			if(isNaN(C)) {
				something;
			}
			cValues.push(Math.max(C - 0.1, 0));
		}
	}

	var maxC = 0
	for(var i in cValues) {
		if(maxC < cValues[i]) {
			maxC = cValues[i];
		}
	}
	for(var i = 0; i < imgHeight; i ++) {
		for(var j = 0; j < imgWidth; j ++) {
			var imgIndex = ((i * imgWidth) + j) * 4;
			var cIndex = i * imgWidth + j;
			for(var l = 0; l < 3; l ++) {
				imgData.data[imgIndex + l] = cValues[cIndex] / maxC * (cloudColor[l] - skyColor[l]) + skyColor[l];
			}
			imgData.data[imgIndex + 3] = 255;
		}
	}

	ctx.putImageData(imgData, 0, 0);
}