var canvas = document.getElementById('canvas');
var width = 512;
var height = 512;

canvas.width = width;
canvas.height = height;
canvas.style.cssText = 'width:' + width + 'px;height:' + height + 'px';
var ctx = canvas.getContext('2d');
var myImage = ctx.getImageData(0, 0, width, height);
var step = 0.01;

var xFlag = 1;
var playFlag = 0;
var interval = 0;

var eye = {
	point: {
		x: 10,
		y: 10,
		z: 0
	},
	fieldOfView: 40,
	direction: {
		x: 0 ,
		y: 0 ,
		z: 0 
	}
};

var lights = [{
	x: 1,
	y: 0,
	z: 2
}];

// Define the primitives

var objects = [
	{
		type: 'supercalifragilisticexpialidocious',
		color: {
			x: 80,
			y: 80,
			z: 80
		},
		t: 2,
		q: 2,
		lambert: 0.7,
		ambient: 0.2,
		hidden: 0
	}
]

var currentAngle = 0;
var angleStep = 0;

function recursiveTrace(ray, eye, deltaX, deltaY, delta2X, delta2Y) {
	var delta3X = Vector.scale(Vector.add(deltaX, delta2X), 1 / 2);
	var delta3Y = Vector.scale(Vector.add(deltaY, delta2Y), 1 / 2);
	var returnColor = 0;
	
	ray.direction = Vector.unitVector(Vector.add3(eye.direction, deltaX, deltaY));
	color1 = trace(ray);
	ray.direction = Vector.unitVector(Vector.add3(eye.direction, deltaX, delta2Y));
	color2 = trace(ray);
	ray.direction = Vector.unitVector(Vector.add3(eye.direction, delta2X, deltaY));
	color3 = trace(ray);
	ray.direction = Vector.unitVector(Vector.add3(eye.direction, delta2X, delta2Y));
	color4 = trace(ray);
	
	avgColor = Vector.scale(Vector.add4(color1, color2, color3, color4), 1 / 4);
	
	returnColor = avgColor;
	var count = 0;
	
	diffColor1 = Vector.subtract(avgColor, color1);
	if(Vector.dotProduct(diffColor1, diffColor1) > 0.5){
		count += 1;
		returnColor = Vector.add(returnColor, recursiveTrace(ray, eye, deltaX, deltaY, delta3X, delta3Y));
	}
	
	diffColor2 = Vector.subtract(avgColor, color2);
	if(Vector.dotProduct(diffColor2, diffColor2) > 0.5){
		count += 1;
		returnColor = Vector.add(returnColor, recursiveTrace(ray, eye, deltaX, delta3Y, delta3X, delta2Y));
	}
	
	diffColor3 = Vector.subtract(avgColor, color3);
	if(Vector.dotProduct(diffColor3, diffColor3) > 0.5){
		count += 1;
		returnColor = Vector.add(returnColor, recursiveTrace(ray, eye, delta3X, deltaY, delta2X, delta3Y));
	}
	
	diffColor4 = Vector.subtract(avgColor, color4);
	if(Vector.dotProduct(diffColor4, diffColor4) > 0.5){
		count += 1;
		returnColor = Vector.add(returnColor, recursiveTrace(ray, eye, delta3X, delta3Y, delta2X, delta2Y));
	}
	
	return Vector.scale(returnColor, 1 / (count + 1));
}


/* NO REFLECTION is considered.*/
function render() {
	eye.point.x = Number(document.getElementById("eyeX").value);
	eye.point.y = Number(document.getElementById("eyeY").value);
	eye.point.z = Number(document.getElementById("eyeZ").value);
	eye.direction.x = 0 - eye.point.x;
	eye.direction.y = 0 - eye.point.y;
	eye.direction.z = 0 - eye.point.z;
	eye.direction = Vector.unitVector(eye.direction);

	var rightDir = Vector.unitVector(Vector.crossProduct(eye.direction, Vector.UP)),
		upDir = Vector.unitVector(Vector.crossProduct(rightDir, eye.direction)),
		fovRadians = Math.PI * (eye.fieldOfView / 2) / 180,
        heightWidthRatio = height / width,
        halfWidth = Math.tan(fovRadians),
        halfHeight = heightWidthRatio * halfWidth,
        camerawidth = halfWidth * 2,
        cameraheight = halfHeight * 2,
        pixelWidth = camerawidth / (width - 1),
        pixelHeight = cameraheight / (height - 1);
		
	//Set the colors and size of primitives, all that kind of stuff	
	
	//Define the colors
		
	objects[0].color.x = Number(document.getElementById('rValue').value);
	objects[0].color.y = Number(document.getElementById('gValue').value);
	objects[0].color.z = Number(document.getElementById('bValue').value);
	objects[0].q = Number(document.getElementById('qValue').value);
	objects[0].t = Number(document.getElementById('tValue').value);
	
	
	lights[0].x = Number(document.getElementById("light_x").value) * 512;
	lights[0].y = Number(document.getElementById("light_y").value) * 512;
	lights[0].z = Number(document.getElementById("light_z").value) * 512;
	
	currentAngle += angleStep;
	
    var ray = {
    	point: eye.point
    };

    for(var i = 0; i < width; i ++) {
    	for(var j = 0; j < height; j ++) {
    		deltaX = Vector.scale(rightDir, (i * pixelWidth - halfWidth));
    		deltaY = Vector.scale(upDir, (j * pixelHeight - halfHeight));
    		delta2X = Vector.scale(rightDir, ((i + 1) * pixelWidth - halfWidth));
    		delta2Y = Vector.scale(upDir, ((j + 1) * pixelHeight - halfHeight));

    		ray.direction = Vector.unitVector(Vector.add3(eye.direction, deltaX, deltaY));
    		var color = [];
			color.push(trace(ray));
			//color.push(recursiveTrace(ray, eye, deltaX, deltaY, delta2X, delta2Y));

    		index = (i * 4) + j * width * 4;
			myImage.data[index + 0] = color[0].x ;
    		myImage.data[index + 1] = color[0].y;
    		myImage.data[index + 2] = color[0].z;
    		myImage.data[index + 3] = 255;
    	}
    }

    ctx.putImageData(myImage, 0, 0);
	if(currentAngle > 2 * Math.PI){
		currentAngle -= 2 * Math.PI;
	}
}

function trace(ray) {
	var interObject = intersectObject(ray);

	if(interObject[0] == Infinity) {
		//return {x: 255 - objects[0].color.x, y: 255 - objects[0].color.y, z: 255 - objects[0].color.z};
		return {x: 255, y: 255, z: 255};
	}

	var dist = interObject[0];
	var primitive = interObject[1];

	var currentPos = Vector.add(ray.point, Vector.scale(ray.direction, dist));

	return surface(ray, primitive, currentPos, norm(primitive, currentPos));
}

function intersectObject(ray) {
	var closest = [Infinity, null];

	for(var i = 0; i < objects.length; i ++) {
		primitive = objects[i];
		if(primitive.hidden == 1){
			continue;
		}
		if(primitive.type == 'supercalifragilisticexpialidocious'){
			dist = supercalifragilisticexpialidociousIntersection(primitive, ray);
		}
		else if(primitive.type == 'surface') {
			dist = surfaceIntersection(primitive, ray);
		}
		if(dist != undefined && dist < closest[0]) {
			closest = [dist, primitive];
		}
	}

	return closest;
}

function implicitFunciton(x0, t, q) {
	return Math.pow(Math.pow(Math.abs(x0.x), q) + Math.pow(Math.abs(x0.y), q), t / q) + Math.pow(Math.abs(x0.z), t) - 1;
}

function implicitDerivative(x0, direction, t, q) {
	var xFlag = x0.x > 0 ? 1 : -1;
	var yFlag = x0.y > 0 ? 1 : -1;
	var zFlag = x0.z > 0 ? 1 : -1;
	

	return t * (Math.pow(Math.pow(xFlag * x0.x, q) + Math.pow(yFlag * x0.y, q), t / q - 1) * 
		(Math.pow(xFlag * x0.x, q - 1) * xFlag * direction.x + Math.pow(yFlag * x0.y, q - 1) * yFlag * direction.y)  
		+ Math.pow(zFlag * x0.z, t - 1) * zFlag * direction.z);
}

function supercalifragilisticexpialidociousIntersection(primitive, ray) {
	var prevU0 = 0;
	var x0 = ray.point;
	var u0 = 0;
	var t = primitive.t;
	var q = primitive.q;
	var funcRes = 0;
	var prevRes = 0;
	var count = 0;

	while((funcRes = implicitFunciton(Vector.add(x0, Vector.scale(ray.direction, u0)), t, q)) > 0.01 && count < 10) {
		var k = implicitDerivative(Vector.add(x0, Vector.scale(ray.direction, u0)), ray.direction, t, q);
		u0 = u0 - funcRes / k;
		if(count > 8) {
			something = 1;
		}
		if((u0 < prevU0 && prevRes >= 0 && funcRes >= 0) || (u0 > prevU0 && prevRes < 0 && funcRes < 0)){
			return ;
		}
		prevU0 = u0;
		prevRes = funcRes;
		count ++;
	}

	// if(funcRes < 0 ) {
	// 	return ;
	// }
	// else {
		return u0;
	//}
}

function norm(primitive, pos) {
	if(primitive.type == 'supercalifragilisticexpialidocious') {
		var t = primitive.t;
		var q = primitive.q;
		var newPosX = Vector.add(pos, {x: step, y: 0, z: 0});
		var newPosY = Vector.add(pos, {x: 0, y: step, z: 0});
		var newPosZ = Vector.add(pos, {x: 0, y: 0, z: step});

		return Vector.unitVector({x: (implicitFunciton(newPosX, t, q) - implicitFunciton(pos, t, q)) / step, 
				y: (implicitFunciton(newPosY, t, q) - implicitFunciton(pos, t, q)) / step, 
				z: (implicitFunciton(newPosZ, t, q) - implicitFunciton(pos, t, q)) / step});
	}
}

function surface(ray, primitive, currentPos, norm) {
	var luminantColor = primitive.color;
	var lambertAmount = 0;

	if(primitive.lambert) {
		for(i = 0; i < lights.length; i ++) {
			lightSource = lights[i];

			if(!isVisible(currentPos, lightSource)) continue;

			var contribution = Vector.dotProduct(Vector.unitVector(Vector.subtract(lightSource, currentPos)), norm);
			if (contribution > 0) {lambertAmount += contribution;}
		}
	}

	lambertAmount = Math.min(1, lambertAmount);

	return Vector.add(Vector.scale(luminantColor, lambertAmount * primitive.lambert), Vector.scale(luminantColor, primitive.ambient));
}

function isVisible(currentPos, lightSource) {
	var distObject = intersectObject({
		point: currentPos, direction: Vector.unitVector(Vector.subtract(currentPos, lightSource))
	});

	return distObject[0] > -0.005;
}

function playIt(){
	playFlag = 1;
	render();	
}

function stopInt() {
	playFlag = 0;
}