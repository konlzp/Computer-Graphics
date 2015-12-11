// for Assign 6
// Compute normal of object

function objectNormal(object, point){

	if (object.type == 'sphere') return (sphereNormal (object, point));

	else if (object.type == 'spheretex'){
		var newnorm = Vector.subtract(point, object.point);
// angle to vertical is theta
newnorm=Vector.unitVector(newnorm);
diff = Math.cos(20*3.14159*Math.abs(point.y - object.point.y)/object.radius)
newnorm.y += .2*diff;
newnorm= Vector.unitVector(newnorm);
return (newnorm);
}

else if (object.type == 'spherelong'){
	var newnorm = Vector.subtract(point, object.point);
// angle to vertical is theta
newnorm=Vector.unitVector(newnorm);

var pointVec = Vector.subtract(point, object.point);
pointVec = Vector.unitVector({x: pointVec.x, y: 0, z: pointVec.z});
var standardVec = {x: 1, y: 0, z: 0};

diff = Math.cos(40 * Math.acos(Vector.dotProduct(pointVec, standardVec)));
newnorm.x += .1*diff;
newnorm= Vector.unitVector(newnorm);
return (newnorm);
}

else if (object.type == 'mysphere') {
	var newnorm = Vector.subtract(point, object.point);
	// angle to vertical is theta
	newnorm=Vector.unitVector(newnorm);

	var pointVec = Vector.subtract(point, object.point);
	var pointVec1 = Vector.unitVector({x: pointVec.x, y: 0, z: pointVec.z});
	var standardVec = {x: 1, y: 0, z: 0};
	diff1 = Math.cos(20 * Math.acos(Vector.dotProduct(pointVec1, standardVec)));

	var pointVec2 = Vector.unitVector({x: 0, y: pointVec.y, z: pointVec.z})
	standardVec = {x: 0, y: 1, z: 0};
	diff2 = Math.cos(20 * Math.acos(Vector.dotProduct(pointVec2, standardVec)));
	newnorm.x += .1*diff1;
	newnorm.y += .1*diff2;

	newnorm= Vector.unitVector(newnorm);
	return (newnorm);
}

else if (object.type == 'triangle') return (triNormal(object));

}
