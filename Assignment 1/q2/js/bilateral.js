function createCanvas(image){
	//document.body.removeChild(document.getElementById("canvas"));
	var myCanvas = document.createElement("canvas");
	var myCanvasContext = myCanvas.getContext("2d");
	
	var imgWidth = image.width;
	var imgHeight = image.height;
	
	var nValue = Number(document.getElementById("nValue").value);
	var mValue = Number(document.getElementById("mValue").value);
	
	myCanvas.width = 3 * imgWidth + 20;
	myCanvas.height = imgHeight;
	
	myCanvasContext.drawImage(image, 0, 0);
	
	var imageData = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);
	var imoutData = myCanvasContext.getImageData(0,0, imgWidth, imgHeight);
	var diffImgData = myCanvasContext.getImageData(0,0, imgWidth, imgHeight);
	
	var intensityMat = []
	for(var i = 0; i < imgHeight; i ++){
		for(var j = 0; j < imgWidth; j ++) {
			var index = computeIndex(i * 4, j * 4, imgWidth);
			intensityMat.push(0.3 * imageData.data[index] + 0.5 * imageData.data[index + 1] + 0.2 * imageData.data[index + 2]);
		}
	}
	for(i = 0; i < imgHeight; i ++){
		for(j = 0; j < imgWidth; j ++){
			if(i - nValue < 0){
				upperBound = 0;
			}else {
				upperBound = i - nValue;
			}
			if(i + nValue >= imgHeight){
				lowerBound = imgHeight - 1;
			}else {
				lowerBound = i + nValue;
			}
			if(j - nValue < 0){
				leftBound = 0;
			}else {
				leftBound = j - nValue;
			}
			if(j + nValue >= imgWidth){
				rightBound = imgWidth - 1;
			}else {
				rightBound = j + nValue;
			}
			var sum = [0, 0, 0];
			var count = 0;
			var currentIntensity = intensityMat[computeIndex(i, j, imgWidth)];
			for(k = upperBound; k <= lowerBound; k ++){
				for(l = leftBound; l <= rightBound; l ++){
					if(Math.abs(intensityMat[computeIndex(k, l, imgWidth)] - currentIntensity) <= mValue){
						var imageIndex = computeIndex(4 * k, 4 * l, imgWidth)
						for(m = 0; m < 3; m ++){
							sum[m] += imageData.data[imageIndex + m];
						}
						count ++;
					}
				}
			}
			imageIndex = computeIndex(4 * i, 4 * j, imgWidth);
			for(m = 0; m < 3; m ++){
				imoutData.data[imageIndex + m] = Math.round(sum[m] / count);
				diffImgData.data[imageIndex + m] = Math.round(Math.abs(imoutData.data[imageIndex + m] - imageData.data[imageIndex + m])) * 5;
			}
		}
	}
	myCanvasContext.putImageData(imoutData, imageData.width+10,0,0,0, imageData.width, imageData.height);
	myCanvasContext.putImageData(diffImgData, imageData.width * 2 + 20, 0, 0, 0, imageData.width, imageData.height);
	
  	document.body.appendChild(myCanvas);
}

function computeIndex(verIndex, horIndex, width) {
	return verIndex * width + horIndex;
}

function loadImage(){
	var img = new Image();
	img.onload = function() {
		createCanvas(img);
	}
	if(navigator.appVersion.search(/chrome/i) > -1){
		img.src = document.getElementById("imagefilename").value.replace("c:\\fakepath\\", " ");
		img.crossOrigin = "Anonymous";
	}
	else if(navigator.appVersion.search(/safari/i) > -1) {
		img.src = document.getElementById("imagefilename").value.replace("C:\\fakepath\\", " ");
	}
	console.log(navigator.appVersion);
}