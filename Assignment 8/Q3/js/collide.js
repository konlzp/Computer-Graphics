// Basic canvas stuff.
var rad1;
var rad2;
var v1;
var v2;
var canvas
var ctx;
var W;
var H;
var interval;

function draw() {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
W = 500; 
H = 100;
canvas.height = H; canvas.width = W;

rad1 = Number(document.getElementById("ball1radius").value);
rad2 = Number(document.getElementById("ball2radius").value);
v1 = Number(document.getElementById("ball1v").value);
v2 = Number(document.getElementById("ball2v").value);


ball1 = new Ball(rad1*50,rad1*50, "red", 1.*v1);
ball2 = new Ball (W-rad2*50, rad2*50, "blue", -v2);

// Now, the animation time!
// In setInterval, 1000/x depicts x fps! So, in this case, we are aiming for 60fps for smoother animations.
clearInterval(interval);
interval = setInterval(update, 1000/60);
}

// Defining the balls that will collide. This will be one dimensional, so the ball only has an x position and x velocity. Each ball has a radius and color, and a method to draw it on the canvas

function Ball(locx, radius, color, velx) {
	
		this.x = locx;
		this.vx = velx;
		this.rad = radius;
		this.c = color;
		this.draw = function() {
		// Here, we'll first begin drawing the path and then use the arc() function to draw a circle. The arc function accepts 6 parameters, x position, y position, radius, start angle, end angle and a boolean for anti-clockwise direction.
		ctx.beginPath();
		ctx.arc(this.x, 50, this.rad, 0, Math.PI*2, false);
		ctx.fillStyle = this.c;
		ctx.fill();
		ctx.closePath();
		} // draw function end
	} // Ball function end

function changeHidden(){
	document.getElementById("nonElasticFactor").hidden = ! document.getElementById("nonElasticFactor").hidden;
}

// When we do animations in canvas, we have to repaint the whole canvas in each frame. Either clear the whole area or paint it with some color. This helps in keeping the area clean without any repetition mess.
// So, lets create a function that will do it for us.

function clearCanvas() {
	ctx.clearRect(0, 0, W, H);
}


// We want balls to change direction when they hit the edge of the canvas

function checkbounce(ball,end) {
	if (ball.x + ball.rad > end) ball.vx *= -1;
	if (ball.x - ball.rad < 0) ball.vx *= -1;
}

function checkElasticCollision(ball1, ball2) {
	if(Math.abs(ball1.x - ball2.x) <= (ball1.rad + ball2.rad + 1)) {
		if(document.getElementById("elastic").checked) {
			var tempv = ball1.vx;
			ball1.vx = ball2.vx;
			ball2.vx = tempv;
		}
		else {
			var nonElasticFactor = 1 - Number(document.getElementById("nonFactor").value);
			var m1 = Math.pow(ball1.rad, 2);
			var m2 = Math.pow(ball2.rad, 2);
			var v1 = ball1.vx;
			var v2 = ball2.vx;
			var x = nonElasticFactor * (m1 * v1 * v1 + m2 * v2 * v2);
			var y = m1 * v1 + m2 * v2;

			var a = m2 * (m2 / m1 + 1);
			var b = - 2 * m2 / m1 * y;
			var c = y * y  / m1 - x;

			// var a = Math.pow(ball1.rad, 2) / Math.pow(ball2.rad, 2) * (Math.pow(ball1.rad, 2) + Math.pow(ball2.rad, 2));
			// var b = - (2 * Math.pow(ball1.rad, 2) * (Math.pow(ball1.rad, 2) * ball1.vx + Math.pow(ball2.rad, 2) * ball2.vx)) / Math.pow(ball2.rad, 2);
			// var c = (Math.pow(ball1.rad, 4) * Math.pow(ball1.vx, 2)) / Math.pow(ball2.rad, 2) + Math.pow(ball2.rad, 2) * Math.pow(ball2.vx, 2) +
			// 2 * Math.pow(ball1.rad, 2) * ball1.vx * ball2.vx - nonElasticFactor * (Math.pow(ball1.rad, 2) * Math.pow(ball1.vx, 2) + Math.pow(ball2.rad, 2) * Math.pow(ball2.vx, 2));

			if(b * b - 4 * a * c < 0) {
				 clearInterval(interval);
				 return ;
			}
			var tempv = (- b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
			//ball1.vx = (Math.pow(ball1.rad, 2) * (ball1.vx - tempv) + Math.pow(ball2.rad, 2) * ball2.vx) / Math.pow(ball2.rad, 2);
			ball1.vx = (y - m2 * tempv) / m1;
			ball2.vx = tempv;
		}
	}
}

// A function that will update the positions of the balls is needed
function update() {
	clearCanvas();
	ball1.draw();
    ball2.draw();
	
	// Now, lets make the ball move by adding the velocity vectors to its position
	ball1.x += ball1.vx;
        ball2.x += ball2.vx;	
	// We will bounce the balls against the edges of the canvas
	checkbounce(ball1,W);
	checkbounce(ball2,W);

	checkElasticCollision(ball1, ball2);
}

