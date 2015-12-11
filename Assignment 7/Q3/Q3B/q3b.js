lightColor = {x: 150, y: 150, z: 150};
prevCanvas = null;

function loadImage(){
	var img = new Image();
	var img2 = new Image();

	if(navigator.appVersion.search(/chrome/i) > -1){
		img.src = document.getElementById("imgFileName").value.replace("c:\\fakepath\\", " ");
		img.crossOrigin = "Anonymous";
		img2.src = document.getElementById("img2FileName").value.replace("c:\\fakepath\\", " ");
		img2.crossOrigin = "Anonymous";
	}
	else if(navigator.appVersion.search(/safari/i) > -1) {
		img.src = document.getElementById("imgFileName").value.replace("C:\\fakepath\\", " ");		
		img2.src = document.getElementById("img2FileName").value.replace("C:\\fakepath\\", " ");
	}
	else {
		img.src = document.getElementById("imgFileName").value;
		img2.src = document.getElementById("img2FileName").value;
	}
	bumpMapping(img, img2);
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

function bumpMapping(image, image2) {
	if(prevCanvas == null) {
		var myCanvas = document.createElement("canvas");
	}
	else {
		myCanvas = prevCanvas;
	}
	var myCanvasContext = myCanvas.getContext("2d");
	myCanvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);

	var imgWidth = image.width;
	var imgHeight = image.height;

	var lightX = Number(document.getElementById("lightX").value);
	var lightY = Number(document.getElementById("lightY").value);
	var lightZ = Number(document.getElementById("lightZ").value);


	var lightDirect = Vector.unitVector({x:lightX, y:lightY, z:lightZ});

	myCanvas.width = imgWidth + image2.width + 20;
	myCanvas.height = image2.height;

	myCanvasContext.drawImage(image, 0, 0);
	myCanvasContext.drawImage(image2, imgWidth + 10, 0);

	image = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);	
	image = imgScale(image.data, imgWidth, imgHeight);

	var img2Data = myCanvasContext.getImageData(imgWidth + 10, 0, image2.width, image2.height);
	var imoutData = myCanvasContext.getImageData(0, 0, image2.width, image2.height);

	for(var x = 0; x < image2.height; x ++) {
		for(var y = 0; y < image2.width; y ++) {
			var colorFactor = calcFactor(image, lightDirect, x % imgHeight, y % imgWidth, imgWidth, imgHeight);
			var imgIndex = x * image2.width * 4 + y * 4

			var img2Color = {x: img2Data.data[imgIndex + 0], y: img2Data.data[imgIndex + 1], z: img2Data.data[imgIndex + 2]};

			var color = Vector.scale(img2Color, colorFactor);
			imoutData.data[imgIndex + 0] = Math.floor(color.x);
			imoutData.data[imgIndex + 1] = Math.floor(color.y);
			imoutData.data[imgIndex + 2] = Math.floor(color.z);
			imoutData.data[imgIndex + 3] = 255;
		}
	}
	myCanvasContext.putImageData(imoutData, imgWidth + 10, 0, 0, 0, image2.width, image2.height);

	document.body.appendChild(myCanvas);
	prevCanvas = myCanvas;
}