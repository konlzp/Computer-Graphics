var shaderProgram  = null;
var vertexBuffer = null;
var vertexColorBuffer = null;
var aPositionIndex = -1;
var aVertexColor = -1;
var gloNumTris = 2;

///// Initialize the data buffer to pass to the rendering pipeline
///// the geometry and its attributes.
function initBuffers(gl) {


	var numTris = Number(document.getElementById("numTri").value);
	if(numTris == 0){
		gloNumTris += 1;
		numTris = gloNumTris;
	}
	var triangleVertices = [];
	var stepAngle = 2 * Math.PI / numTris;
	var curAngle = 0;
	for(i = 0; i < numTris; i ++){
		triangleVertices.push(0.0, 0.0, 0.0);
		triangleVertices.push(Math.cos(curAngle), Math.sin(curAngle), 0);
		curAngle += stepAngle;
		triangleVertices.push(Math.cos(curAngle), Math.sin(curAngle), 0);
	}
	triangleVertices = new Float32Array(triangleVertices);
	
	/*var triangleVerticesColor = new Float32Array([
		1.0, 0.0, 0.0,  // color of the 1st vertex (red)
		0.0, 1.0, 0.0,  // color of the 2nd vertex (green)
		0.0, 0.0, 1.0 ,  // color of the 3rd vertex (blue)
		1.0, 1.0, 0.0,  // color of the 4th vertex (yellow)
		1.0, 1.0, 1.0,
		0.0, 1.0, 1.0
		]);*/
	var colorBuf = [0, 0, 0];
	var colorCount = 0;
	var colorNames = ['red', 'green', 'blue'];
	for(color = 0; color < 3; color ++) {
		if(document.getElementById(colorNames[color]).checked){
			colorBuf[colorCount] = 0.5;
		}
		colorCount += 1;
	}
	var triangleVerticesColor = [];
	if(document.getElementById("gradChange").checked){
		for(i = 0; i < numTris; i ++){
			triangleVerticesColor.push(Math.random(), Math.random(), Math.random());
			rTemp = Math.random() * (1 - colorBuf[0]) + colorBuf[0];
			gTemp = Math.random() * (1 - colorBuf[1]) + colorBuf[1];
			bTemp = Math.random() * (1 - colorBuf[2]) + colorBuf[2];
			triangleVerticesColor.push(rTemp, gTemp, bTemp);
			triangleVerticesColor.push(rTemp, gTemp, bTemp);
		}	
	}
	else {
		for(i = 0; i < numTris; i ++){
			rTemp = Math.random() * (1 - colorBuf[0]) + colorBuf[0];
			gTemp = Math.random() * (1 - colorBuf[1]) + colorBuf[1];
			bTemp = Math.random() * (1 - colorBuf[2]) + colorBuf[2];
			for(j = 0; j < 3; j ++){
				triangleVerticesColor.push(rTemp, gTemp, bTemp);
			}
		}
	}
	
	triangleVerticesColor = new Float32Array(triangleVerticesColor);


	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	vertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesColor, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	

   
	
}

///// Define and compile a very simple shader.
function initShaders(gl) {

  var vertexShaderSource = "\
	attribute vec3 a_position;                  \n\
	attribute vec3 a_color;                     \n\
	varying vec3 vertexcolor;                   \n\
	void main(void)                             \n\
	{                                           \n\
	    vertexcolor = a_color;                  \n\
		gl_Position = vec4(a_position, 1.0);    \n\
	}                                           \n\
	";
  
  var fragmentShaderSource = "\
	precision highp float;                      \n\
	varying vec3 vertexcolor;                   \n\
	void main(void)                             \n\
	{                                           \n\
		gl_FragColor = vec4(vertexcolor, 1.0);  \n\
	}                                           \n\
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
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, we show compilation and linking errors.
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
	var str = "";
	str += "VS:\n" + gl.getShaderInfoLog(vertexShader) + "\n\n";
	str += "FS:\n" + gl.getShaderInfoLog(fragmentShader) + "\n\n";
    str += "PROG:\n" + gl.getProgramInfoLog(shaderProgram);
	alert(str);
  }
}

///// Draw the given triangle interpolating vertices color.
function renderTriangle(gl) {
	
	var numTris = Number(document.getElementById("numTri").value)
	// Clear the framebuffer of the rendering context
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	
	if(numTris == 0){
		initBuffers(gl);
	}
	// enable the current shader program
	gl.useProgram(shaderProgram);
	
	// connect the buffer containing the vertices of the triangle with the position attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	aPositionIndex = gl.getAttribLocation(shaderProgram, "a_position");
	gl.enableVertexAttribArray(aPositionIndex);
	gl.vertexAttribPointer(aPositionIndex, 3, gl.FLOAT, false, 0, 0);
	
	// connect the buffer containing the color of each vertex with the color attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	aVertexColor = gl.getAttribLocation(shaderProgram, "a_color");
	gl.enableVertexAttribArray(aVertexColor);
	gl.vertexAttribPointer(aVertexColor, 3, gl.FLOAT, false, 0, 0);
	
	// start to draw (!)
	if(numTris == 0){
		numTris = gloNumTris;
	}
    gl.drawArrays(gl.TRIANGLES, 0, 3 * numTris);

	// disable the current shading program
	gl.useProgram(null);
}
