function drawLine(startX, startY, endX, endY, horSize, verSize, imgData){
	//var myCanvas = document.getElementById("myCanvas");
	//var ctx = myCanvas.getContext("2d");
	
	if(startX < 0| startY < 0| endX < 0| endY < 0){
		alert("coordinate between 0 and 1");
	}
	
	var deltaX = endX - startX;
	var deltaY = endY - startY;
	var xyFlag = 0;
	var pfFlag = 0;
	
	if(deltaX < 0) {
		temp = startX;
		startX = endX;
		endX = startX;
		temp = startY;
		startY = endY;
		endY = startY;
		deltaX = endX - startX;
		deltaY = endY - startY;
	}
	
	if(deltaY < 0) {
		pfFlag = 1;
		startY = -startY;
		endY = -endY;
		deltaY = endY - startY;
	}
	
	if(deltaY > deltaX){
		temp = startX;
		startX = startY;
		startY = temp;
		temp = endX;
		endX = endY;
		endy = temp;
		temp = deltaX;
		deltaX = deltaY;
		deltaY = temp;
		xyFlag = 1;
	}
	
	var delta = deltaX - 2 * deltaY;
	var x = startX;
	var y = startY;
	var pixelCount = 0;
	
	while(x < endX) {
		var curY = y;
		var curX = x;
		if(pfFlag == 1){
			if(xyFlag == 1){
				curX = - curX;
			}
			else {
				curY = - curY;
			}
		}
		if(xyFlag == 1){
			temp = curX;
			curX = curY;
			curY = temp;
		}
		var curIndex = curY * horSize + curX;
		imgData.data[curIndex * 4 + 0] = (pixelCount % 2 == 0) ? 255 : 0;
		imgData.data[curIndex * 4 + 1] = 0;
		imgData.data[curIndex * 4 + 2] = (pixelCount % 2 ==0) ? 0 : 255;
		imgData.data[curIndex * 4 + 3] = 255;
		curIndex = curIndex + 1;
		if(delta <= 0) {
			x = x + 1;
			y = y + 1;
			delta = delta + 2 *(deltaX - deltaY);
		}
		else {
			x = x + 1;
			delta = delta - 2 * deltaY;
		}
		pixelCount += 1;
	}
	
}

function drawTri(){
	var myCanvas = document.getElementById("myCanvas");
	var ctx = myCanvas.getContext("2d");
	var horSize = Math.round(document.getElementById("horSize").value);
	var verSize = Math.round(document.getElementById("verSize").value);
	myCanvas.width = horSize;
	myCanvas.height = verSize;
	myCanvas.style = "border: 1px solid";
	
	var xCord1 = Math.round(document.getElementById("XCord1").value * horSize);
	var xCord2 = Math.round(document.getElementById("XCord2").value * horSize);
	var xCord3 = Math.round(document.getElementById("XCord3").value * horSize);
	var yCord1 = Math.round(document.getElementById("YCord1").value * verSize);
	var yCord2 = Math.round(document.getElementById("YCord2").value * verSize);
	var yCord3 = Math.round(document.getElementById("YCord3").value * verSize);
	
	var imgData = ctx.createImageData(horSize, verSize);
	for(i = 0; i < imgData.data.length; i ++) {
		imgData.data[i] = 0;
		if(i % 4 == 3){
			imgData.data[i] = 255;
		}
	}
	
	drawLine(xCord1, yCord1, xCord2, yCord2, horSize, verSize, imgData);
	drawLine(xCord1, yCord1, xCord3, yCord3, horSize, verSize, imgData);
	drawLine(xCord2, yCord2, xCord3, yCord3, horSize, verSize, imgData);
	
	ctx.putImageData(imgData, 0, 0);
}