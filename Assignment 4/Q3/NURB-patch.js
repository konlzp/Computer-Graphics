var cycle = 5;
var knots ;
var degree = 3;
var pointCount = 4;

function Bspline_patch(zCoordinates, wCoordinates) {
	this.name = "bspline-patch";
	
	index = 0;
	points = [];
	for(i = 0; i < pointCount; i ++){
		for(j = 0; j < pointCount; j ++){
			points.push(i);
			points.push(j);
			points.push(zCoordinates[index]);
			index ++;
		}
	}
	
	cycle = Number(document.getElementById("cycle").value);
	
	knots = [];
	for(i = 0; i < 4 + degree + 1; i ++) {
		knots.push(i / (4 + degree )); 
	}
	


	this.vertices = [];
	var uTemp = new Array(knots.length);
	for(var i = 0; i < knots.length; i ++){
		uTemp[i] = new Array(degree + 1);
	}
	var vTemp = new Array(4);
	for(var i = 0; i < knots.length; i ++){
		vTemp[i] = new Array(degree + 1);
	}
	
	for(var u = 0; u <= 1; u += 1 / (cycle - 1)){
		for(var v = 0; v <= 1; v += 1 / (cycle - 1)) {
			var bSplineValue = [0, 0, 0];
			fillArray(uTemp, 0);
			fillArray(vTemp, 0);
			for(var i = 0; i < pointCount; i ++) {
				for(var j = 0; j < pointCount; j ++) {
					bSplineValue[0] += calcBspline(points[3 * (i * pointCount + j) + 0], u, v, i, j, uTemp, vTemp, pointCount, wCoordinates);
					bSplineValue[1] += calcBspline(points[3 * (i * pointCount + j) + 1], u, v, i, j, uTemp, vTemp, pointCount, wCoordinates);
					bSplineValue[2] += calcBspline(points[3 * (i * pointCount + j) + 2], u, v, i, j, uTemp, vTemp, pointCount, wCoordinates);
				}
			}
			this.vertices.push(bSplineValue[0]);
			this.vertices.push(bSplineValue[1]);
			this.vertices.push(bSplineValue[2]);
		}
	}
	this.vertices = new Float32Array(this.vertices);

	this.triangleIndices = [];
	for(var i = 0; i < cycle - 1; i ++) {
		for(var j = 0; j < cycle - 1; j ++) {
			this.triangleIndices.push(i * cycle + j);
			this.triangleIndices.push(i * cycle + j + cycle);
			this.triangleIndices.push(i * cycle + j + cycle + 1);

			this.triangleIndices.push(i * cycle + j);
			this.triangleIndices.push(i * cycle + j + 1);
			this.triangleIndices.push(i * cycle + j + cycle + 1);
		}
	}
	this.triangleIndices = new Uint16Array(this.triangleIndices);

	this.numVertices = this.vertices.length / 3;
	this.numTriangles = this.triangleIndices.length / 3;
}

function fillArray(array, x) {
	for(var i = 0; i < array.length; i ++){
		for(var j = 0; j < array[i].length; j ++){
			array[i][j] = x;
		}
	}
}
			

function findSec(u) {
	for(i = 0; i < knots.length - 1; i ++) {
		if(u < knots[i + 1]){
			return i;
		}
	}
}

function calcBspline(point, u, v, i, j, uTemp, vTemp, pointCount, weights){
	/*var secU = findSec(u);
	var secV = findSec(v);
	
	if(secU < i || secU > i + degree || secV < j || secV > j + degree){
		return 0;
	}*/
	
	var NURB = Bspline(u, i, degree, uTemp) * Bspline(v, j, degree, vTemp) * point * weights[i * 4 + j];
	
	var deno = 0;
	for(var i = 0; i < pointCount; i ++){
		for(var j = 0; j < pointCount; j ++) {
			deno += Bspline(u, i, degree, uTemp) * Bspline(v, j, degree, vTemp) * weights[i * 4 + j];
		}
	}
	
	return NURB / deno;
}

function Bspline(u, i, p, uTemp) {
	if(uTemp[i][p] != 0) {
		return uTemp[i][p];
	}
	switch(i) {
		case 0 :
			uTemp[i][p] = 1 / 6 * Math.pow(u, 3);
			return uTemp[i][p];
		case 1 :
			uTemp[i][p] = 1 / 6 * (-3 * Math.pow(u, 3) + 3 * Math.pow(u, 2) + 3 * u + 1);
			return uTemp[i][p];
		case 2 :
			uTemp[i][p] = 1 / 6 * (3 * Math.pow(u, 3) - 6 * Math.pow(u, 2) + 4);
			return uTemp[i][p];
		case 3 :
			uTemp[i][p] = 1 / 6 * (- Math.pow(u, 3) + 3 * Math.pow(u, 2) - 3 * u + 1);
			return uTemp[i][p];
	}
}

/*function Bspline(u, i, p, uTemp) {
	if(uTemp[i][p] != 0){
		return uTemp[i][p];
	}
	if(p == 0){
		if(u >= knots[i] && u <= knots[i + 1]){
			uTemp[i][p] = 1;
			return 1;
		}
		else {
			uTemp[i][p] = 0;
			return 0;
		}
	}
	else {
		uTemp[i][p] = (u - knots[i]) / (knots[i + p] - knots[i]) * Bspline(u, i, p - 1, uTemp) + (knots[i + p + 1] - u) / (knots[i + p + 1] - knots[i + 1]) * Bspline(u, i + 1, p - 1, uTemp);
		return uTemp[i][p];
	}
}*/