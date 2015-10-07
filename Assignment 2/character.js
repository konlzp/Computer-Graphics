var shaderProgram  = null;
var uModelViewProjectionLocation = -1;
var uColorLocation = -1;
var aPositionIndex = 0;
var vertexBuffer = null;
var indexBufferTriangles = null;
var indexBufferEdges = null;
var currentAngle = 0;
var incAngle = 0.3;
var res = 20;
var upperArm = null;
var lowerArm = null;
var dick = null;
var cone = null;
var cube = null;
var penta = null;
var stack = new SglMatrixStack();
var incAngle = 0;
var sphere = null;

updateIncAngle = function() {
	incAngle = Number(document.getElementById("spinAngle").value);
}

createObjectBuffer = function (gl, obj) {
	obj.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	obj.indexBufferTriangles = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.triangleIndices, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	// create edges
	var edges = new Uint16Array(obj.numTriangles * 3 * 2);
	for (var i = 0; i < obj.numTriangles; ++i) {
		edges[i * 6 + 0] = obj.triangleIndices[i * 3 + 0];
		edges[i * 6 + 1] = obj.triangleIndices[i * 3 + 1];
		edges[i * 6 + 2] = obj.triangleIndices[i * 3 + 0];
		edges[i * 6 + 3] = obj.triangleIndices[i * 3 + 2];
		edges[i * 6 + 4] = obj.triangleIndices[i * 3 + 1];
		edges[i * 6 + 5] = obj.triangleIndices[i * 3 + 2];
	}

	obj.indexBufferEdges = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

drawObject = function (gl, obj, fillColor, lineColor) {
	
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
	gl.enableVertexAttribArray(aPositionIndex);
	gl.vertexAttribPointer(aPositionIndex, 3, gl.FLOAT, false, 0, 0);
	
	gl.enable(gl.POLYGON_OFFSET_FILL);
	
	gl.polygonOffset(1.0, 1.0);
		
	gl.uniform3f(uColorLocation, fillColor[0], fillColor[1], fillColor[2]);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles);
    gl.drawElements(gl.TRIANGLES, obj.triangleIndices.length, gl.UNSIGNED_SHORT, 0);
	
	gl.disable(gl.POLYGON_OFFSET_FILL);
	
	gl.uniform3f(uColorLocation, fillColor[0] - 0.12, fillColor[1] - 0.12, fillColor[2] - 0.12);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges);	
	gl.drawElements(gl.LINES, obj.numTriangles*3*2, gl.UNSIGNED_SHORT, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	gl.disableVertexAttribArray(aPositionIndex);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

drawFingers = function(gl) {
	stack.push();
	//fingers
	stack.multiply(SglMat4.translation([0, -1.5, -1.1]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(30),[1, 0, 0]));
	
	//leftmost one
	stack.push();
	stack.multiply(SglMat4.translation([0, 0.2, 0]));
	stack.multiply(SglMat4.scaling([0.05, 0.3, 0.05]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	//second left
	stack.push();
	stack.multiply(SglMat4.translation([0, 0, 0.6]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(-15), [1, 0, 0]));
	stack.multiply(SglMat4.scaling([0.05, 0.6, 0.05]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	//middle
	stack.push();
	stack.multiply(SglMat4.translation([0, 0, 1.2]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(-30), [1, 0, 0]));
	stack.multiply(SglMat4.scaling([0.05, 0.7, 0.05]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	//second right
	stack.push()
	stack.multiply(SglMat4.translation([0, 0.5, 1.6]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(-45), [1, 0, 0]));
	stack.multiply(SglMat4.scaling([0.05, 0.6, 0.05]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	//rightmost
	stack.push();
	stack.multiply(SglMat4.translation([0, 1.2, 1.6]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(-60), [1, 0, 0]));
	stack.multiply(SglMat4.scaling([0.05, 0.5, 0.05]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	stack.pop();
}

drawHand = function(gl) {
	
	//upper hand
	stack.push();
	stack.multiply(SglMat4.scaling([0.4, 2.0, 0.8]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, cone, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();//{mV, mV * location}
	
	//lower hand
	stack.multiply(SglMat4.translation([0, -0.8, 0]));
	
	stack.push();
	stack.multiply(SglMat4.scaling([0.3, 0.8, 0.7]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, cube, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();//{mV, mV * location}
	
	drawFingers(gl);
}

drawRightArm = function(gl) {
	stack.push();
	
	stack.multiply(SglMat4.translation([0, 4, 0]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(-120),[0,0,1]));
	stack.multiply(SglMat4.translation([0, -4, 0]));
	stack.push(); //{modelView, modelView, modelView}
	stack.multiply(SglMat4.translation([0,4,-6]));
	stack.multiply(SglMat4.scaling([0.5,0.5,1.5]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(90),[1,0,0]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop(); //{modelView, modelView}
	
	stack.push();
	stack.multiply(SglMat4.translation([0, 0, -5]));
	stack.multiply(SglMat4.scaling([0.5,2,0.5]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(180), [0, 0, 1]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, lowerArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop(); //{mv}
	
	stack.push(); //{mV, mV}
	stack.multiply(SglMat4.translation([0, -5, -5]));
	drawHand(gl);
	stack.pop();
	
	stack.pop();
}

drawLeftArm = function(gl) {
	stack.push();
	
	stack.push(); //{mV, mV, mV}
	stack.multiply(SglMat4.translation([0,4,3]));
	stack.multiply(SglMat4.scaling([0.5,0.5,1.5]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(90),[1,0,0]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop(); //{mV, mV}
	
	stack.multiply(SglMat4.translation([0, 0, 5]));
	stack.multiply(SglMat4.scaling([0.5,2,0.5]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	/*stack.multiply(SglMat4.translation([0, -2, 0]));*/
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(180), [0, 0, 1]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, lowerArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop(); //{mV}
	
	stack.push();
	stack.multiply(SglMat4.translation([0, -5, 5]));
	drawHand(gl);
	stack.pop();
	
	stack.pop();
}

drawHead = function(gl) {
	stack.push();
	
	//Draw Neck
	stack.multiply(SglMat4.translation([0, 6.5, 0]));
	stack.push();
	stack.multiply(SglMat4.scaling([0.6, 1, 0.7]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	//Draw Head
	stack.multiply(SglMat4.translation([0, 3.5, 0]));
	stack.push();
	stack.multiply(SglMat4.scaling([1.8, 2.3, 1.8]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, sphere, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	//Draw Eye
	stack.push();
	stack.multiply(SglMat4.translation([-1.1, 0.5, -0.6]));
	stack.multiply(SglMat4.scaling([0.6, 0.6, 0.6]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, sphere, [0.2, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	stack.push();
	stack.multiply(SglMat4.translation([-1.1, 0.5, 0.6]));
	stack.multiply(SglMat4.scaling([0.6, 0.6, 0.6]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, sphere, [0.2, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	//Draw Mouth
	stack.push();
	stack.multiply(SglMat4.translation([-1.2, -0.7, 0]));
	stack.multiply(SglMat4.scaling([0.6, 0.2, 1]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, cube, [0.8, 0.8, 0.8], [0, 0, 0]);
	stack.pop();
	
	
	stack.pop();
}

drawBody = function(gl) {
	stack.push();//{mV, mV}
	
	stack.multiply(SglMat4.translation([0, -0.8, 0]));
	
	drawHead(gl);
	
	stack.push();//{mV, mV, mV * loc}
	stack.multiply(SglMat4.scaling([1, 7, 3.5]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, cube, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	stack.push();
	stack.multiply(SglMat4.translation([0, -6.6, 0]));
	stack.multiply(SglMat4.scaling([1.6, 5, 5]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(45), [0, 1, 0]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(90), [1, 0, 0]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, penta, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	stack.pop();
}

drawDick = function(gl) {
	stack.push();
	
	stack.push();
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(-30),[0, 0, 1]));
	stack.multiply(SglMat4.scaling([2,0.2,0.2]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(90),[0, 0, 1]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.2, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	
	stack.pop();
}

drawFoot = function(gl) {
	stack.push();
	
	stack.multiply(SglMat4.translation([-1, -8, 0]));
	stack.multiply(SglMat4.scaling([2, 0.3, 1]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, cube, [0.8, 0.2, 0.2], [0, 0, 0]);
	
	stack.pop();
}

drawLeg = function(gl) {
	// Draw upper leg
	stack.push();
	stack.multiply(SglMat4.scaling([0.8, 4, 0.8]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(180), [0, 0, 1]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, upperArm, [0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	// Draw lower leg
	stack.multiply(SglMat4.translation([0, -8, 0]));
	stack.push()
	stack.multiply(SglMat4.scaling([0.8, 4, 0.8]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(180), [0, 0, 1]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, lowerArm,[0.8, 0.2, 0.2], [0, 0, 0]);
	stack.pop();
	
	drawFoot(gl);
}

drawLegs = function(gl) {
	stack.push();
	
	stack.push();
	stack.multiply(SglMat4.translation([0, -0.5, -2]));
	drawLeg(gl);
	stack.pop();
	
	stack.push();
	stack.multiply(SglMat4.translation([0, -0.5, 2]));
	stack.multiply(SglMat4.rotationAngleAxis(sglDegToRad(20), [0, 0, 1]));
	drawLeg(gl);
	stack.pop();
	
	
	stack.pop();
}

drawThePrimitive = function(gl) {

	// Make sure the canvas is sized correctly.
	var canvas = document.getElementById('canvas');
	var width = canvas.clientWidth;
	var height = canvas.clientHeight;
		
	gl.viewport(0, 0, width, height);
	
	// Clear the canvas
	gl.clearColor(0.309, 0.505, 0.74, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
	// Setup projection matrix
	var projMat = SglMat4.perspective(1.3, width/height, 0.1, 1000.0);
	
	// Setup model/view matrix
	
	var viewMat = SglMat4.lookAt([-30,0,0], [1,0,0], [0,1,0]);
	
	var modelMat = SglMat4.rotationAngleAxis(sglDegToRad(-currentAngle), [0,1,0]);
	
    // Construct the model-view * projection matrix and pass it to the vertex shader
 	var modelviewprojMat = SglMat4.mul(projMat, SglMat4.mul(viewMat, modelMat));
	stack.loadIdentity();
	stack.multiply(modelviewprojMat);
	
	gl.enable(gl.DEPTH_TEST);
		
	// Draw the primitive
	gl.useProgram(shaderProgram);
	
	stack.multiply(SglMat4.translation([0,4,0]));
	
	drawRightArm(gl);
	drawLeftArm(gl);
	drawBody(gl);
	
	stack.multiply(SglMat4.translation([0, -7.5, 0]));
	
	//drawDick(gl);
	drawLegs(gl);
	
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl,  cube, [0.8, 0.2, 0.2], [0.8, 0.2, 0.2]);
	stack.multiply(SglMat4.translation([0,1,0]));
	stack.multiply(SglMat4.scaling([Math.sqrt(2),1,Math.sqrt(2)]));
	gl.uniformMatrix4fv(uModelViewProjectionLocation, false, stack.matrix);
	drawObject(gl, cone, [0.8, 0.8, 0.2], [0.2, 0.8, 0.2]);
	
	gl.useProgram(null);
 
 	gl.disable(gl.DEPTH_TEST);
 
    currentAngle += incAngle;
    if (currentAngle > 360)
         currentAngle -= 360;
}

createObjects = function() {
	 upperArm = new Cylinder(res, 2, 2);
	 lowerArm = new Cylinder(res, 1, 2);
	 dick = new Cylinder(res, 1, 2);
	 cone = new Cone(res, 1, 1);
	cube = new Cube();
	penta = new Pentahedron(1);
	sphere = new Sphere_latlong(30, 30, 1);
}

createBuffers = function(gl) {
	 createObjectBuffer(gl,  upperArm);
	 createObjectBuffer(gl,  lowerArm);
	 createObjectBuffer(gl,  dick);
	 createObjectBuffer(gl,  cube);
	 createObjectBuffer(gl,  cone);
	 createObjectBuffer(gl, 	 penta);
	 createObjectBuffer(gl, sphere);
}

initializeObjects = function(gl) {
	 createObjects();
	 createBuffers(gl);
}

init = function(gl) {
	 initializeObjects(gl);
	 initShaders(gl);
}

initShaders = function(gl) {
	var vertexShaderSource = "\
  	uniform   mat4 u_modelviewprojection;\n\
	attribute vec3 a_position;\n\
	void main(void)\n\
	{\n\
		gl_Position = u_modelviewprojection * vec4(a_position, 1.0);\n\
	}\n\
	";
  
  var fragmentShaderSource = "\
	precision highp float;\n\
	uniform vec3 u_color;\n\
	void main(void)\n\
	{\n\
		gl_FragColor = vec4(u_color, 1.0);\n\
	}\n\
	";
  
  // create the vertex shader
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  
  // create the fragment shader
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  
  // Create the shader program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.bindAttribLocation(shaderProgram, aPositionIndex, "a_position");
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
	var str = "";
	str += "VS:\n" + gl.getShaderInfoLog(vertexShader) + "\n\n";
	str += "FS:\n" + gl.getShaderInfoLog(fragmentShader) + "\n\n";
    str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
	alert(str);
  }

  uColorLocation = gl.getUniformLocation(shaderProgram, "u_color");
  uModelViewProjectionLocation = gl.getUniformLocation(shaderProgram, "u_modelviewprojection");
};

