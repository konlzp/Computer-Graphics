
var sampleNum = 10;

// # Surface
//

// If `trace()` determines that a ray intersected with an object, `surface`
// decides what color it acquires from the interaction.

//updated for Assn 6 to have types for lights and colors for lambertAmount to account for light colors

function getPoint(light) {
  var randomLen = Math.random() * light.radius;

  var randomX = Math.random() * randomLen * 2 - randomLen;

  var YZLen = Math.sqrt(Math.pow(randomLen, 2) - Math.pow(randomX, 2));

  var randomY = Math.random() * YZLen * 2 - YZLen;

  var randomZ = Math.sqrt(Math.pow(YZLen, 2), Math.pow(randomY, 2));

  return {x: light.point.x + randomX, y: light.point.y + randomY, z: light.point.z + randomZ};
}

function phongContribution(ray, pointAtTime, lightPoint, normal, n) {
  var H = Vector.scale(Vector.add(Vector.unitVector(
    Vector.subtract(lightPoint, pointAtTime)), Vector.unitVector(
    Vector.subtract(ray.point, pointAtTime))), 1 / 2);
  var cosAlpha = Math.abs(Vector.dotProduct(H, normal));

  return Math.pow(cosAlpha, n); 
}

function surface(ray, scene, object, pointAtTime, normal, depth) {

  var objColor= scene.mats[object.mat].color,
  c = Vector.ZERO,
  specReflect = Vector.ZERO,
  lambertAmount = Vector.ZERO;

    // **[Lambert shading](http://en.wikipedia.org/wiki/Lambertian_reflectance)**
    // is our pretty shading, which shows gradations from the most lit point on
    // the object to the least.


    if (scene.mats[object.mat].lambert) {
      for (var i = 0; i < scene.lights.length; i++) {
        var lightPoint = scene.lights[i].point;
        var light = scene.lights[i];
        var phongContri = 0
            // First: can we see the light? If not, this is a shadowy area
            // and it gets no light from the lambert shading process.


            if (isLightVisible(pointAtTime, scene, lightPoint)){
    					// Otherwise, calculate the lambertian reflectance, which
    					// essentially is a 'diffuse' lighting system - direct light
    					// is bright, and from there, less direct light is gradually,
    					// beautifully, less light.

              if(light.type == 'spherical') {
                var contribution = 0;
                for(var j = 0; j < sampleNum; j ++) {
                  lightPoint = getPoint(light);
                  if (isLightVisible(pointAtTime, scene, lightPoint)){
                    contribution += Vector.dotProduct(Vector.unitVector(Vector.subtract(lightPoint, pointAtTime)), normal)
                  }
                  if(scene.mats[object.mat].type == 'phong') {
                    phongContri += scene.mats[object.mat].specular * phongContribution(ray, pointAtTime, lightPoint, normal, scene.mats[object.mat].n);
                  }
                }
                contribution /= sampleNum;
                phongContri /= sampleNum;
              }

              if(light.type == 'omni') {
                var contribution = Vector.dotProduct(Vector.unitVector(
                 Vector.subtract(lightPoint, pointAtTime)), normal);
                if(scene.mats[object.mat].type == 'phong') {
                  phongContri += scene.mats[object.mat].specular * phongContribution(ray, pointAtTime, lightPoint, normal, scene.mats[object.mat].n);
                }
              }
              else if(light.type == 'spot') {
                if(Vector.dotProduct(Vector.unitVector(Vector.subtract(lightPoint, light.topoint)), 
                  Vector.unitVector(Vector.subtract(lightPoint, pointAtTime))) > Math.cos(30 / 180 * Math.PI)) {
                 var contribution = Vector.dotProduct(Vector.unitVector(
                   Vector.subtract(lightPoint, pointAtTime)), normal);
               if(scene.mats[object.mat].type == 'phong') {
                phongContri += scene.mats[object.mat].specular * phongContribution(ray, pointAtTime, lightPoint, normal, scene.mats[object.mat].n);
              }
            }
          }

        }
        if(contribution > 0)
          lambertAmount = Vector.add(lambertAmount, Vector.scale(scene.lights[i].color, contribution)); 
    }
  }




    // for assn 6, adjust lit color by object color and divide by 255 since light color is 0 to 255
    lambertAmount = Vector.compScale(lambertAmount, objColor);
    lambertAmount = Vector.scale (lambertAmount, scene.mats[object.mat].lambert);
    lambertAmount = Vector.scale(lambertAmount, 1./255.);
    if(scene.mats[object.mat].type == 'phong' && scene.mats[object.mat].metal) {
      if (phongContri > 0){ 
        lambertAmount = Vector.add(lambertAmount, Vector.scale(scene.mats[object.mat].color, phongContri));
      }
    }
    else {
     if (phongContri > 0) {
      lambertAmount = Vector.add(lambertAmount, Vector.scale(Vector.WHITE, phongContri));
    }
  }


    // **[Specular](https://en.wikipedia.org/wiki/Specular_reflection)** is a fancy word for 'reflective': rays that hit objects
    // with specular surfaces bounce off and acquire the colors of other objects
    // they bounce into.
    if (scene.mats[object.mat].specular && scene.mats[object.mat].type != 'phong'){

        // This is basically the same thing as what we did in `render()`, just
        // instead of looking from the viewpoint of the camera, we're looking
        // from a point on the surface of a shiny object, seeing what it sees
        // and making that part of a reflection.
        var reflectedRay = {
          point: pointAtTime,
          vector: Vector.reflectThrough(Vector.scale(ray.vector, -1), normal)
        };

        var reflectedColor = trace(reflectedRay, scene, ++depth);
        if (reflectedColor) {
      //     specReflect = Vector.add(specReflect, Vector.scale(reflectedColor, scene.mats[object.mat].specular));
       //  alert(specReflect.x);
       c = Vector.add(c,Vector.scale(reflectedColor, scene.mats[object.mat].specular));
     }
   }

    // lambert should never 'blow out' the lighting of an object,
    // even if the ray bounces between a lot of things and hits lights
//updated for Assn 6 lambertAmount is scaled and clamped
 //   lambertAmount = Vector.scale(lambertAmount, 1./255.);
//    lambertAmount = Math.min(1, lambertAmount);

    // **Ambient** colors shine bright regardless of whether there's a light visible -
    // a circle with a totally ambient blue color will always just be a flat blue
    // circle.
    return Vector.add3(c,
      //  Vector.scale(b, lambertAmount * object.lambert),
      lambertAmount,
      Vector.scale(objColor, scene.mats[object.mat].ambient));
  }


