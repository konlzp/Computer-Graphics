lightColor = {x: 150, y: 150, z: 150};

function loadImage(){
	var img = new Image();
	img.onload = function() {
		bumpMapping(img);
	}
	if(navigator.appVersion.search(/chrome/i) > -1){
		img.src = document.getElementById("imgFileName").value.replace("c:\\fakepath\\", " ");
		img.crossOrigin = "Anonymous";
	}
	else if(navigator.appVersion.search(/safari/i) > -1) {
		img.src = document.getElementById("imgFileName").value.replace("C:\\fakepath\\", " ");
	}
	console.log(navigator.appVersion);
}

function imgScale(image, width, height) {
	var imout = [];

	for(var i = 0; i < height; i ++) {
		for(var j = 0; j < width; j ++) {
			var imgIndex = i * width * 4 + j * 4;
			var tempSum = 0;
			for(var k = 0; k < 3; k ++) {
				tempSum += image[imgIndex + k];
			}
			imout.push(tempSum / (128 * 3) - 1);
		}
	}

	return imout;
}

function calcFactor(image, lightDirect, i, j, width, height) {
	var u0 = i > 0 ? image[(i - 1) * width + j] : image[i * width + j];
	var u1 = i < height - 1 ? image[(i + 1) * width + j] : image[i * width + j];
	var v0 = j > 0 ? image[i * width + (j - 1)] : image[i * width + j];
	var v1 = j < width - 1 ? image[i * width + (j + 1)] : image[i * width + j];

	var Bu = (u0 - u1) / 2;
	var Bv = (v0 - v1) / 2;

	var newNorm = Vector.unitVector({x: Bu, y:Bv, z: 1});

	return Vector.dotProduct(newNorm, lightDirect);
}

function bumpMapping(image) {
	var myCanvas = document.createElement("canvas");
	var myCanvasContext = myCanvas.getContext("2d");

	var imgWidth = image.width;
	var imgHeight = image.height;

	var lightX = Number(document.getElementById("lightX").value);
	var lightY = Number(document.getElementById("lightY").value);
	var lightZ = Number(document.getElementById("lightZ").value);

	var imoutData = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);

	var lightDirect = Vector.unitVector({x:lightX, y:lightY, z:lightZ});

	myCanvas.width = 2 * imgWidth + 20;
	myCanvas.height = imgHeight;

	myCanvasContext.drawImage(image, 0, 0);

	image = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);

	image = imgScale(image.data, imgWidth, imgHeight);

	for(var x = 0; x < imgHeight; x ++) {
		for(var y = 0; y < imgWidth; y ++) {
			var colorFactor = calcFactor(image, lightDirect, x, y, imgWidth, imgHeight);
			var imgIndex = x * imgWidth * 4 + y * 4
			var color = Vector.scale(lightColor, colorFactor);
			imoutData.data[imgIndex + 0] = Math.floor(color.x);
			imoutData.data[imgIndex + 1] = Math.floor(color.y);
			imoutData.data[imgIndex + 2] = Math.floor(color.z);
			imoutData.data[imgIndex + 3] = 255;
		}
	}
	myCanvasContext.putImageData(imoutData, imgWidth + 10, 0, 0, 0, imgWidth, imgHeight);

	document.body.appendChild(myCanvas);
}