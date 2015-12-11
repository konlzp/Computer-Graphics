function loopSub(layer) {
	this.name = "loopSub";

	this.radius = 1;

	this.vertices = [];

	for(var i = 1; i <= 4; i ++) {
		for(var j = 1; j <= 3; j ++) {
			this.vertices.push(Number(document.getElementById("p" + i + j).value));
		}
	}

	this.triangleIndices = [
		0, 2, 1,
		0, 3, 2,
		0, 1, 3,
		1, 2, 3
	];

	var adjacentList = []

	for(var i = 0; i < 2 * (Math.pow(4, layer) + 1); i ++) {
		adjacentList.push(new Set());
	}
	var start = 0;
	var end = this.triangleIndices.length;
	updateAdjacent(adjacentList, this.triangleIndices, start, end);

	for(var i = 0; i < layer; i ++) {
		var oldLength = this.triangleIndices.length;
		var startPoint = this.vertices.length;

		var oldTriangles = this.triangleIndices.slice(0);
		var oldVertices = this.vertices.slice(0);

		for(var j = 0; j < oldLength; j += 3) { //Create new vertices & new Triangles; According to current triangle stack
			var triangle = [];
			triangle.push(this.triangleIndices.shift());
			triangle.push(this.triangleIndices.shift());
			triangle.push(this.triangleIndices.shift());
			var newIndexes = [];
			var newPoints = [];

			newPoints.push(calcOddPoint(triangle[0], triangle[1], oldTriangles, oldVertices));
			newPoints.push(calcOddPoint(triangle[2], triangle[0], oldTriangles, oldVertices));
			newPoints.push(calcOddPoint(triangle[2], triangle[1], oldTriangles, oldVertices));

			for(var l = 0; l < 3; l ++) {
				newPoint = newPoints[l];
				if(isNaN(newPoint[0])){
					console.log("what?");
				}
				tempIndex = findPoint(this.vertices, newPoint, startPoint);
				if(tempIndex == -1) {
					this.vertices.push(newPoint[0], newPoint[1], newPoint[2]);
					tempIndex = this.vertices.length / 3 - 1;
				}
				else {
					doSomethin  = 0;
				}
				newIndexes.push(tempIndex);
			}

			this.triangleIndices.push(triangle[0], newIndexes[0], newIndexes[1]);
			this.triangleIndices.push(triangle[1], newIndexes[0], newIndexes[2]);
			this.triangleIndices.push(triangle[2], newIndexes[1], newIndexes[2]);
			this.triangleIndices.push(newIndexes[0], newIndexes[1], newIndexes[2]);
		}
		for(var j = 0; j < startPoint; j += 3) {
			var sum = [0, 0, 0];
			var adjacentSize = adjacentList[j / 3].size;
			adjacentList[j / 3].forEach(function(value) {
				index = value * 3;
				for(var l = 0; l < 3; l ++) {
					sum[l] += oldVertices[index + l];
				}
			})

			var alpha = Math.pow(3 / 8 + Math.cos(2 * Math.PI / adjacentSize) / 4, 2) + 3 / 8;
			var beta = (1 - alpha) / adjacentSize;
			for(var l = 0; l < 3; l ++) {
				sum[l] *= beta;
				sum[l] += oldVertices[j + l] * alpha;
				if(isNaN(sum[l])) {
					console.log("what?2");
				}
				this.vertices[j + l] = sum[l];
			}
		}
		removeAllAdjacent(adjacentList);
		updateAdjacent(adjacentList, this.triangleIndices, 0, this.triangleIndices.length);
	}

	this.triangleIndices = new Uint16Array(this.triangleIndices);
	this.vertices = new Float32Array(this.vertices);

	this.numVertices = this.vertices.length / 3;
	this.numTriangles = this.triangleIndices.length / 3;
}

function removeAllAdjacent(adjacentList) {
	for(var i in adjacentList) {
		adjacentList[i].clear();
	}
}

function calcOddPoint(index1, index2, triangles, vertices) {
	var resultIndex = [];
	for(var i = 0; i < triangles.length && resultIndex.length < 2; i += 3) {
		var triangle = [triangles[i], triangles[i + 1], triangles[i + 2]];
		if(triangle.indexOf(index1) > -1) {
			if(triangle.indexOf(index2) > -1) {
				var tempIndex = triangle.filter(function(x) {
					return x != index1 && x != index2;
				})[0];
				resultIndex.push(tempIndex);
			}
		}
	}

	var results = [];
	for(var i = 0; i < 3; i ++) {
		results.push(3 / 8 * (vertices[3 * index1 + i] + vertices[3 * index2 + i]) + 1 / 8 * (vertices[3 * resultIndex[0] + i] + vertices[3 * resultIndex[1] + i]));
	}

	return results;
}

function findPoint(vertices, point, startPoint) {
	for(var i = startPoint; i < vertices.length; i += 3){
		for(var j = 0; j < 3; j ++) {
			if(vertices[i + j] != point[j]) {
				break;
			}
		}
		if(j == 3) {
			return i / 3;
		}
	}
	return -1;
}

function arrayPlusMean(array1, array2) {
	len = Math.min(array1.length, array2.length);
	
	var returnArr = new Array();
	for(i = 0; i < len; i ++) {
		returnArr.push((array1[i] + array2[i]) / 2);
	}
	
	return returnArr;
}

function updateAdjacent(adjacentList, triangleIndices, start, end) {
	for(var i = start; i < end; i += 3) {
		adjacentList[triangleIndices[i]].add(triangleIndices[i + 1]);
		adjacentList[triangleIndices[i]].add(triangleIndices[i + 2]);

		adjacentList[triangleIndices[i + 1]].add(triangleIndices[i]);
		adjacentList[triangleIndices[i + 1]].add(triangleIndices[i + 2]);

		adjacentList[triangleIndices[i + 2]].add(triangleIndices[i]);
		adjacentList[triangleIndices[i + 2]].add(triangleIndices[i + 1]);
	}
}