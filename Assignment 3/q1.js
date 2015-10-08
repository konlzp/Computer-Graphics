var canvas = document.getElementById('canvas');
var width = 512;
var height = 512;

canvas.width = width;
canvas.height = height;
canvas.style.cssText = 'width:' + width + 'px;height:' + height + 'px';
var ctx = canvas.getContext('2d');
var myImage = ctx.getImageData(0, 0, width, height);

var xFlag = 1;
var playFlag = 0;
var interval = 0;

var eye = {
	point: {
		x: 6,
		y: 0,
		z: 0
	},
	fieldOfView: 40,
	direction: {
		x: -1,
		y: 0,
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
		type: 'sphere',
		point: {
			x:0,
			y:0,
			z:0
		},
		color: {
			x: 80,
			y: 80,
			z: 80
		},
		lambert: 0.8,
		ambient: 0.3,
		radius: 4,
		hidden: 0
	},
	{
		type: 'triangle',
		vertices: [
		{
			x: -2,
			y: -2.5,
			z: 0
		},
		{
			x: 1,
			y: 0.5,
			z: 1
		},
		{
			x: 1,
			y: -1.5,
			z: -1
		}
		],
		color: {
			x: 100,
			y: 100,
			z: 100
		},
		lambert: 0.8,
		ambient: 0.3,
		hidden: 0
	},
	{
		type: 'cone',
		center: {
			x: 0,
			y: 0,
			z: 0
		},
		color: {
			x: 255,
			y: 255,
			z: 0
		},
		radius: 1.3,
		height: 2.5,
		lambert: 0.8,
		ambient: 0.3,
		hidden: 0
	},
	{
		type: 'triangle',
		vertices: [
		{
			x: -2,
			y: -2.5,
			z: 0
		},
		{
			x: 1,
			y: 0.5,
			z: -1
		},
		{
			x: 1,
			y: -1.5,
			z: 1
		}
		],
		color: {
			x: 100,
			y: 100,
			z: 100
		},
		lambert: 0.8,
		ambient: 0.3,
		hidden: 0
	}
]

var currentAngle = 0;
var angleStep = 10 * Math.PI / 180;

//Recursively trace in order to accomplish anti-aliasing

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
		
	objects[0].color.x = Number(document.getElementById('color_r1').value);
	objects[0].color.y = Number(document.getElementById('color_g1').value);
	objects[0].color.z = Number(document.getElementById('color_b1').value);
	objects[0].radius = Number(document.getElementById('diameter').value);
	
	objects[1].color.x = Number(document.getElementById('color_r2').value);
	objects[1].color.y = Number(document.getElementById('color_g2').value);
	objects[1].color.z = Number(document.getElementById('color_b2').value);
	
	objects[2].color.x = Number(document.getElementById('color_r3').value);
	objects[2].color.y = Number(document.getElementById('color_g3').value);
	objects[2].color.z = Number(document.getElementById('color_b3').value);
	
	objects[3].color.x = Number(document.getElementById('color_r4').value);
	objects[3].color.y = Number(document.getElementById('color_g4').value);
	objects[3].color.z = Number(document.getElementById('color_b4').value);
	
	for(var primitive in objects) {
		if(document.getElementById(objects[primitive].type).checked){
			objects[primitive].hidden = 0;
		}
		else {
			objects[primitive].hidden = 1;
		}
	}
	
	if(playFlag == 1) {
		lights[0].x = 6 * Math.cos(currentAngle);
		lights[0].z = 6 * Math.sin(currentAngle);
		lights[0].y = 0;
	}
	else {
		lights[0].x = Number(document.getElementById("light_x").value);
		lights[0].y = Number(document.getElementById("light_y").value);
		lights[0].z = Number(document.getElementById("light_z").value);
	}
	
	if(document.getElementById("parallel").checked){
		lights[0] = Vector.scale(lights[0], 512);
	}
	
	
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
			if(document.getElementById("recursive").checked){
				color.push(recursiveTrace(ray, eye, deltaX, deltaY, delta2X, delta2Y));
			}
			else {
				color.push(trace(ray));
			}
			
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
		if(primitive.type == 'sphere'){
			dist = sphereIntersection(primitive, ray);
		}
		else if(primitive.type == 'triangle') {
			dist = triangIntersection(primitive, ray);
		}
		else if(primitive.type == 'cone') {
			dist = coneIntersection(primitive, ray);
		}
		if(dist != undefined && dist < closest[0]) {
			closest = [dist, primitive];
		}
	}

	return closest;
}

//Calculate the intersection with triangles

function triangIntersection(primitive, ray){
	var triangNorm = norm(primitive, 0);
	
	var t = - (Vector.dotProduct(ray.point, triangNorm) / Vector.dotProduct(ray.direction, triangNorm));
	
	var PVector = Vector.add(ray.point, Vector.scale(ray.direction, t));
	
	var x1 = primitive.vertices[0].x, x2 = primitive.vertices[1].x, x3 = primitive.vertices[2].x;
	var y1 = primitive.vertices[0].y, y2 = primitive.vertices[1].y, y3 = primitive.vertices[2].y;
	
	var alpha = ((PVector.x - x1) * (y3 - y1) - (PVector.y - y1) * (x3 - x1))   						/			    ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1));
	var beta = - ((x1 - PVector.x) + alpha * (x2 - x1)) / (x3 - x1);
	
	if(alpha >= 0 && alpha <= 1 && beta >= 0 && beta <= 1 && alpha + beta <= 1) {
		return t;
	}
	else {
		return ;
	}
}

function sphereIntersection(sphere, ray) {
	var eyeToCenter = Vector.subtract(sphere.point, ray.point);
	var sphereCross = Vector.dotProduct(eyeToCenter, ray.direction);
	eyeToCenter = Vector.dotProduct(eyeToCenter, eyeToCenter);

	crossDist = sphere.radius * sphere.radius - eyeToCenter + sphereCross * sphereCross;

	if(crossDist < 0) {
		return ;
	}
	else {
		return sphereCross - Math.sqrt(crossDist);
	}

}

//Calculate the intersection with cones

function coneIntersection(cone, ray) {
	var h = cone.height;
	var r = cone.radius;
	var apex = Vector.add(cone.center, {x: 0, y: h, z: 0});
	var alpha = Math.acos(h / (Math.sqrt(h * h + r * r)));
	var va = Vector.UP;
	var v = ray.direction;
	var deltaP = Vector.subtract(ray.point, apex);
	var sta1 = Vector.subtract(v, Vector.scale(va, Vector.dotProduct(v, va)));
	var sta2 = Vector.subtract(deltaP, Vector.scale(va, Vector.dotProduct(deltaP, va)))
	var A = Math.pow(Math.cos(alpha), 2) * Vector.dotProduct(sta1, sta1) - Math.pow(Math.sin(alpha), 2) * Math.pow(Vector.dotProduct(v, va), 2);
	var B = 2 * Math.pow(Math.cos(alpha), 2) * Vector.dotProduct(sta1, sta2) - 2 * Math.pow(Math.sin(alpha), 2) * Vector.dotProduct(v, va) * Vector.dotProduct(deltaP, va);
	var C = Math.pow(Math.cos(alpha), 2) * Vector.dotProduct(sta2, sta2) - Math.pow(Math.sin(alpha), 2) * Vector.dotProduct(deltaP, va) * Vector.dotProduct(deltaP, va);
	
	if(B * B - 4 * A * C >= 0) {
		var res1 = (- B + Math.sqrt(B * B - 4 * A * C)) / (2 * A);
		var res2 = (- B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
		var res = res1 > res2 ? res2 : res1;
		
		if(res >= 0){
			var resV = Vector.add(ray.point, Vector.scale(ray.direction, res));
			if(resV.y - cone.center.y <= h && resV.y >= cone.center.y) {
				return res;
			}
			else {
				return ;
			}
		}
		else {
			return ;
		}
	}
	else {
		return ;
	}
}

function norm(primitive, pos) {
	if(primitive.type == 'sphere') {
		return Vector.unitVector(Vector.subtract(pos, primitive.point));
	}
	else if(primitive.type == 'triangle') {
		return Vector.unitVector(Vector.crossProduct(Vector.subtract(primitive.vertices[1], primitive.vertices[0]), Vector.subtract(primitive.vertices[2], primitive.vertices[0])));
	}
	else if(primitive.type == 'cone') {
		var h = primitive.height;
		var r = primitive.radius;
		
		return Vector.unitVector({x: (pos.x * h) / (Math.sqrt(h * h + r * r)), y: ((Math.sqrt(pos.x * pos.x + pos.z * pos.z) * r) / Math.sqrt(h * h + r * r)), z : (pos.z * h) / (Math.sqrt(h * h + r * r))});
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

function play(){
	playFlag = 1;
	interval = setInterval(render, 100);
}

function stopInt() {
	clearInterval(interval);
	playFlag = 0;
}

render();