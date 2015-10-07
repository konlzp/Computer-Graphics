function drawLine(){
	var myCanvas = document.getElementById("myCanvas");
	var ctx = myCanvas.getContext("2d");
	
	var horSize = Math.round(document.getElementById("horSize").value);
	var verSize = Math.round(document.getElementById("verSize").value);
	myCanvas.width = horSize;
	myCanvas.height = verSize;
	
	var startX = Math.round(document.getElementById("startXCord").value * horSize);
	var startY = Math.round(document.getElementById("startYCord").value * verSize);
	var endX = Math.round(document.getElementById("endXCord").value * horSize);
	var endY = Math.round(document.getElementById("endYCord").value * verSize);
	
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
	
	var imgData = ctx.createImageData(horSize, verSize);
	
	for(i = 0; i < imgData.data.length; i ++) {
		imgData.data[i] = 0;
		if(i % 4 == 3){
			imgData.data[i] = 255;
		}
	}
	
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
	
	ctx.putImageData(imgData, 0, 0);
}