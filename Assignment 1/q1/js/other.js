function doStuff()
{

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var imgWidth = 500;
var imgHeight = 500;
var vcy = document.getElementById("verticalpara").value;
var hcy = document.getElementById("horizontalpara").value;
 var vco = [255, 255, 255];
 vco[0] = document.getElementById("verticalr").value;
 vco[1] = document.getElementById("verticalg").value;
 vco[2] = document.getElementById("verticalb").value;
 var hco = [255, 255, 255];
 hco[0] = document.getElementById("horizontalr").value;
 hco[1] = document.getElementById("horizontalg").value;
 hco[2] = document.getElementById("horizontalb").value;
var imgData = ctx.createImageData(imgWidth, imgHeight);
// modify this section to make colors varying with sine functions

var vPix = Math.ceil(imgHeight / vcy);
var hPix = Math.ceil(imgWidth / hcy);
for (jj = 0; jj < imgWidth; jj++)
{ var qq = jj*4;
	for(ii = 0; ii < imgHeight; ii += 1)
{
  var pp = (ii*imgWidth*4)+qq;
  var vicSinValue = Math.exp((ii % vPix) / vPix);
  var horSinValue = Math.exp((jj % hPix) / hPix);
  for (var temp = 0; temp < 3; temp ++){
	var pixelData = imgData.data[pp + temp];
  	pixelData = Math.ceil(128 + vicSinValue * (vco[temp] - 128));
	pixelData = Math.ceil(pixelData + horSinValue * (hco[temp] - pixelData));
	imgData.data[pp + temp] = pixelData % 255;
  }
  imgData.data[pp + 3] = 255;
}
}
ctx.putImageData(imgData, 20, 20);
}