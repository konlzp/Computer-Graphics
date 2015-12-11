

// # The Scene
// In this file, the original red/blue/white room with overhead white light, and orange and blue corner lights
var scene = {};


// ## The Camera
//
// Our camera is pretty simple: it's a point in space, where you can imagine
// that the camera 'sits', a `fieldOfView`, which is the angle from the right
// to the left side of its frame, and a `vector` which determines what
// angle it points in.

// updated for Assn 6 so that camera.vector is more descriptively camera.toPoint
// updated for Assn 6 so that there is a camera.up instead of using vector.UP

scene.camera = {
// the eye location
    point: {
        x: 50,
        y: 50,
        z: 400
    },
    fieldOfView: 40,
// point indicated direction of view
    toPoint: {
        x: 50,
        y: 50,
        z: 0
    },
// added explicitly (this was always the up direction before)
    up: {
	x: 0,
	y: 1,
	z: 0
    }
};

// ## Lights
//
// Lights are defined only as points in space - surfaces that have lambert
// shading will be affected by any visible lights.
// updated for Assn 6 so that lights have a type and color 

scene.lights = [

   /*{
   type: 'omni',
   point: {
    x: 50,
    y: 95,
    z: 50
    },
    radius: 10,
// gray, not very bright
   color: {
   x: 155,
   y: 155,
   z: 155
   },
  
},*/
// front and in the upper left
// bright, reddish
   {
   type: 'omni',
   point: {
    x: 5,
    y: 95,
    z: 100
    },
	topoint: {
		x: 70, y: 25, z: 50},
	angle: 30,
   color: {
   x: 255,
   y: 220,
   z: 200
   },
  
},
// front and lower right
// bluish 
 /*{
   type: 'omni',
   point: {
    x: 95,
    y: 5,
    z: 100
    },
   color: {
   x: 50,
   y: 50,
   z: 200
   },

},*/
];

// ## Objects
//
// This raytracer handles sphere objects, with any color, position, radius,
// and surface properties.
// updated for Assn 6 so that objects and their materials are defined separately

scene.objects = [

// our main test objects
// are spheres sitting on the floor
    {
        type: 'sphere',
        point: {
            x: 70,
            y: 25,
            z: 50
        },
        mat: 5,
        radius: 25
    },

    {
        type: 'spherelong',
        point: {
            x: 20,
            y: 10,
            z: 50
        },
        mat: 0,
        radius: 10
    },
// back wall, ceiling and floor are white

// back wall
{
	type: 'triangle',
	point1: {
	x: 0, y: 0, z: 0
	},
	point2: {
	x: 100, y: 0, z: 0
	},
	point3: {
	x: 0, y: 100, z: 0
	},
	mat: 1
},
{
	type: 'triangle',
	point1: {
	x: 100, y: 0, z: 0
	},
	point2: {
	x: 100, y: 100, z: 0
	},
	point3: {
	x: 0, y: 100, z: 0
	},
	mat: 1
},
// floor
{
	type: 'triangle',
	point1: {
	x: 0, y: 0, z: 0
	},
	point2: {
	x: 0, y: 0, z: 100
	},
	point3: {
	x: 100, y: 0, z: 100
	},
	mat: 1
},
{
	type: 'triangle',
	point1: {
	x: 100, y: 0, z: 100
	},
	point2: {
	x: 100, y: 0, z: 0
	},
	point3: {
	x: 0, y: 0, z: 0
	},
	mat: 1
},
// ceiling
{
	type: 'triangle',
	point1: {
	x: 0, y: 100, z: 0
	},
	point2: {
        x: 100, y: 100, z: 0
	},
	point3: {
        x: 100, y: 100, z: 100	
	},
	mat: 1
},
{
	type: 'triangle',
	point1: {
	x: 100, y: 100, z: 100
	},
	point2: {
	x: 0, y:100, z: 100
	},
	point3: {
	x: 0, y: 100, z: 0
	},
	mat: 1
},

// left wall, red

{
	type: 'triangle',
	point1: {
	x: 0, y: 0, z: 0
	},
	point2: {
        x: 0, y: 100, z: 0
	},
	point3: {
        x: 0, y: 100, z: 100	
	},
	mat: 2
},
{
	type: 'triangle',
	point1: {
	x: 0, y: 100, z: 100
	},
	point2: {
	x: 0, y:0, z: 100
	},
	point3: {
	x: 0, y: 0, z: 0
	},
	mat: 2
},


// right wall, blue

{
	type: 'triangle',
	point1: {
	x: 100, y: 0, z: 0
	},
	point2: {
        x: 100, y: 0, z: 100
	},
	point3: {
        x: 100, y: 100, z: 100	
	},
	mat: 3
},
{
	type: 'triangle',
	point1: {
	x: 100, y: 100, z: 100
	},
	point2: {
	x: 100, y:100, z: 0
	},
	point3: {
	x: 100, y: 0, z: 0
	},
	mat: 3
}

];

scene.mats = [
// material 0

{
	type: 'orig',
	color: {
               x: 255,
               y: 255,
               z: 255
        	},
        specular: 0.0,
        lambert: 0.85,
        ambient: 0.05
},
// material 1
// diffuse white
{
	type: 'orig',
	color: {
               x: 255,
               y: 255,
               z: 255
        	},
       specular: 0.0,
        lambert: 0.9,
        ambient: 0.05
},
// material 2
// diffuse red
{
	type: 'orig',
	color: {
		x: 255,
		y: 90,
		z: 90
		},
        specular: 0.0,
	lambert: 0.9,
	ambient: 0.1
},
// material 3
//diffuse blue
{
	type: 'orig',
	color: {
		x: 90,
		y: 90,
		z: 255
		},
        specular: 0.0,
	lambert: 0.9,
	ambient: 0.1
},
// material 4
//mirror
{
	type: 'orig',
	color: {
		x: 255,
		y: 255,
		z: 255
		},
        specular: 0.9,
	lambert: 0.1,
	ambient: 0.0
},
{
	type: 'phong',
	n: 2,
	metal: 1,
	color: {
		x: 200,
		y: 170,
		z: 60
	},
	specular: 0.7,
	lambert: 0.2,
	ambient: 0.0
}
]


