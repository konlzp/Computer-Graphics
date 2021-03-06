/* Phong reflection model (per-pixel)
/*****************************************************************************/

var PerPixelPhong_vs = "\
precision highp float;                                               \n\
                                                                     \n\
uniform mat4 uModelViewProjectionMatrix;                             \n\
uniform mat4 uModelViewMatrix;                                       \n\
uniform mat3 uViewSpaceNormalMatrix;                                 \n\
                                                                     \n\
attribute vec3 aPosition;                                            \n\
attribute vec3 aNormal;                                              \n\
                                                                     \n\
varying vec3 vpos;                                                   \n\
varying vec3 vnormal;                                                \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // vertex normal (in view space)                                   \n\
  vnormal = normalize(uViewSpaceNormalMatrix * aNormal);             \n\
                                                                     \n\
  // vertex position (in view space)                                 \n\
  vec4 position = vec4(aPosition, 1.0);                              \n\
  vpos = vec3(uModelViewMatrix * position);                          \n\
                                                                     \n\
  // output                                                          \n\
  gl_Position = uModelViewProjectionMatrix * position;               \n\
}                                                                    \n\
"; 

var PerPixelPhong_fs = "\
precision highp float;                                               \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
// positional light: position and color                              \n\
uniform vec3 uLightPosition;                                         \n\
uniform vec3 uLightColor;                                            \n\
// shininess exponent                                                \n\
uniform float uShininess;                                            \n\
// amount of ambient component                                       \n\
uniform float uKa;                                                   \n\
// amount of diffuse component                                       \n\
uniform float uKd;                                                   \n\
// amount of specular component                                      \n\
uniform float uKs;                                                   \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // material propertise                                             \n\
  vec3 mat_ambient = vec3(1.0, 1.0, 1.0);                            \n\
  vec3 mat_diffuse = vec3(1.0, 1.0, 1.0);                            \n\
  vec3 mat_specular= vec3(1.0, 1.0, 1.0);                            \n\
                                                                     \n\
  // normalize interpolated normal                                   \n\
  vec3 N = normalize(vnormal);	                                     \n\
                                                                     \n\
  // light vector (positional light)                                 \n\
  vec3 L = normalize(uLightPosition - vpos);                         \n\
                                                                     \n\
  // vertex-to-eye (view vector)                                     \n\
  vec3 V = normalize(-vpos);                                         \n\
                                                                     \n\
  // ambient component (ambient light is assumed white)              \n\
  vec3 ambient = mat_ambient;                                        \n\
                                                                     \n\
  // diffuse component                                               \n\
  float NdotL = max(0.0, dot(N, L));                                 \n\
  vec3 diffuse = (mat_diffuse * uLightColor) * NdotL;                \n\
                                                                     \n\
  // specular component                                              \n\
  vec3 R = (2.0 * NdotL * N) - L;                                    \n\
  float RdotV = max(0.0, dot(R, V));                                 \n\
  float spec = pow(RdotV, uShininess);                               \n\
  vec3 specular = (mat_specular * uLightColor) * spec;               \n\
	                                                                 \n\
  vec3 finalcolor = uKa * ambient + uKd * diffuse + uKs * specular;  \n\
  gl_FragColor  = vec4(finalcolor, 1.0);                             \n\
}                                                                    \n\
";

/* Cook-Torrance reflectance model (per-pixel)
/*****************************************************************************/

var PerPixelCookTorrance_vs = "\
precision highp float;                                               \n\
                                                                     \n\
uniform mat4 uModelViewProjectionMatrix;                             \n\
uniform mat4 uModelViewMatrix;                                       \n\
uniform mat3 uViewSpaceNormalMatrix;                                 \n\
                                                                     \n\
attribute vec3 aPosition;                                            \n\
attribute vec3 aNormal;                                              \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // vertex normal (in view space)                                   \n\
  vnormal = normalize(uViewSpaceNormalMatrix * aNormal);             \n\
                                                                     \n\
  // vertex position (in view space)                                 \n\
  vec4 position = vec4(aPosition, 1.0);                              \n\
  vpos = vec3(uModelViewMatrix * position);                          \n\
                                                                     \n\
  // output                                                          \n\
  gl_Position = uModelViewProjectionMatrix * position;               \n\
}                                                                    \n\
";

var PerPixelCookTorrance_fs = "\
precision highp float;                                               \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
// positional light: position and color                              \n\
uniform vec3 uLightPosition;                                         \n\
uniform vec3 uLightColor;                                            \n\
// gaussian coefficient                                              \n\
uniform float uC;                                                    \n\
// reflection coefficient                                            \n\
uniform float uR0;                                                   \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // material properties                                             \n\
  vec3 mat_diffuse = vec3(1.0, 1.0, 1.0);                            \n\
  vec3 mat_specular = vec3(1.0, 1.0, 1.0);                           \n\
                                                                     \n\
  // normalize interpolated normal                                   \n\
  vec3 N = normalize(vnormal);                                       \n\
                                                                     \n\
  // light vector (positional light)                                 \n\
  vec3 L = normalize(uLightPosition - vpos);                         \n\
                                                                     \n\
  // vertex-to-eye space (view vector)                               \n\
  vec3 V = normalize(-vpos);                                         \n\
                                                                     \n\
  // half-vector                                                     \n\
  vec3 H = normalize(L + V);                                         \n\
                                                                     \n\
  // scalar products                                                 \n\
  float NdotH = max(0.0, dot(N, H));                                 \n\
  float VdotH = dot(V, H);                                           \n\
  float NdotV = dot(N, V);                                           \n\
  float NdotL = dot(N, L);                                           \n\
                                                                     \n\
  // ambient component is neglected                                  \n\
                                                                     \n\
  // diffuse component                                               \n\
  //vec3 diffuse = mat_diffuse * NdotL;                                \n\
  vec3 diffuse = uLightColor * NdotL;      \n\
  // specular component (Cook-Torrance reflection model)             \n\
                                                                     \n\
  // D term (gaussian)                                               \n\
  float alpha = acos(NdotH);                                         \n\
  float D = uC * exp(- alpha * alpha * uC);                          \n\
                                                                     \n\
  // Geometric factor (G)                                            \n\
  float G1 = 2.0 * NdotH * NdotV / VdotH;                            \n\
  float G2 = 2.0 * NdotH * NdotL / VdotH;                            \n\
  float G = min(1.0, min(G1, G2));                                   \n\
                                                                     \n\
  // Fresnel Refraction (F) - Schlick's approximation                \n\
  float k = pow(1.0 - NdotV, 5.0);                                   \n\
  float F = uR0 + (1.0 - uR0) * k;                                   \n\
                                                                     \n\
  //vec3 specular = mat_specular * (F * D * G) / NdotV;                \n\
  vec3 specular = uLightColor * (F * D * G) / NdotV;                             \n\
  // final color                                                     \n\
  gl_FragColor = 0.4*vec4(diffuse, 1.0) + 0.8*vec4(specular, 1.0);   \n\
}                                                                    \n\
";



/* Oren-Nayar reflectance model (per-pixel)
/**************************************************************/

var PerPixelOrenNayar_vs = "\
precision highp float;                                               \n\
                                                                     \n\
uniform mat4 uModelViewProjectionMatrix;                             \n\
uniform mat4 uModelViewMatrix;                                       \n\
uniform mat3 uViewSpaceNormalMatrix;                                 \n\
                                                                     \n\
attribute vec3 aPosition;                                            \n\
attribute vec3 aNormal;                                              \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // vertex normal (in view space)                                   \n\
  vnormal = normalize(uViewSpaceNormalMatrix * aNormal);             \n\
                                                                     \n\
  // vertex position (in view space)                                 \n\
  vec4 position = vec4(aPosition, 1.0);                              \n\
  vpos = vec3(uModelViewMatrix * position);                          \n\
                                                                     \n\
  // output                                                          \n\
  gl_Position = uModelViewProjectionMatrix * position;               \n\
}                                                                    \n\
";

var PerPixelOrenNayar_fs = "\
precision highp float;                                               \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
// positional light: position and color                              \n\
uniform vec3 uLightPosition;                                         \n\
uniform vec3 uLightColor;                                            \n\
// surface roughness                                                 \n\
uniform float uRoughnessSq;                                          \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // material color                                                  \n\
  vec3 mat_color = vec3(1.0, 1.0, 1.0);                              \n\
                                                                     \n\
  // normalize interpolated normal                                   \n\
  vec3 N = normalize(vnormal);                                       \n\
                                                                     \n\
  // light vector (positional light)                                 \n\
  vec3 L = normalize(uLightPosition - vpos);                         \n\
                                                                     \n\
  // vertex-to-eye (view vector)                                     \n\
  vec3 V = normalize(-vpos);                                         \n\
                                                                     \n\
  // ambient component is neglected                                  \n\
	                                                                 \n\
  // diffuse component (Oren-Nayar reflectance model)                \n\
  vec3 col = mat_color * uLightColor;                                \n\
                                                                     \n\
  float A = 1.0 - (0.5 * uRoughnessSq) / (uRoughnessSq + 0.33);      \n\
  float B = (0.45 * uRoughnessSq) / (uRoughnessSq + 0.09);           \n\
                                                                     \n\
  float VdotN = dot(V, N);                                           \n\
  float LdotN = dot(L, N);                                           \n\
  float irradiance = max(0.0, LdotN);                                \n\
                                                                     \n\
  float angleViewNormal  = acos(VdotN);                              \n\
  float angleLightNormal = acos(LdotN);                              \n\
                                                                     \n\
  // max( 0.0 , cos(phi_incident, phi_reflected) )                   \n\
  float angleDiff = max(0.0, dot(normalize(V - N * VdotN),           \n\
	                        normalize(L - N * LdotN)));              \n\
                                                                     \n\
  float alpha = max(angleViewNormal, angleLightNormal);              \n\
  float beta  = min(angleViewNormal, angleLightNormal);              \n\
                                                                     \n\
  vec3 diffuse = col  * irradiance * (A +                            \n\
	                    B * angleDiff * sin(alpha) * tan(beta));     \n\
                                                                     \n\
  // final color                                                     \n\
  gl_FragColor = vec4(diffuse, 1.0);                                 \n\
}                                                                    \n\
";


/* Minnaert reflectance model (per-pixel)
/*****************************************************************************/

var PerPixelMinnaert_vs = "\
precision highp float;                                               \n\
                                                                     \n\
uniform mat4 uModelViewProjectionMatrix;                             \n\
uniform mat4 uModelViewMatrix;                                       \n\
uniform mat3 uViewSpaceNormalMatrix;                                 \n\
                                                                     \n\
attribute vec3 aPosition;                                            \n\
attribute vec3 aNormal;                                              \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // vertex normal (in view space)                                   \n\
  vnormal = normalize(uViewSpaceNormalMatrix * aNormal);             \n\
                                                                     \n\
  // vertex position (in view space)                                 \n\
  vec4 position = vec4(aPosition, 1.0);                              \n\
  vpos = vec3(uModelViewMatrix * position);                          \n\
                                                                     \n\
  // output                                                          \n\
  gl_Position = uModelViewProjectionMatrix * position;               \n\
}                                                                    \n\
";

var PerPixelMinnaert_fs = "\
precision highp float;                                               \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
// positional light: position and color                              \n\
uniform vec3 uLightPosition;                                         \n\
uniform vec3 uLightColor;                                            \n\
// surface coefficient                                               \n\
uniform float uK;                                                    \n\
                                                                     \n\
void main (void)                                                     \n\
{                                                                    \n\
  // material color                                                  \n\
  vec3 mat_color = vec3(0.8, 0.8, 0.8);                              \n\
                                                                     \n\
  // normalize interpolated normal                                   \n\
  vec3 N = normalize(vnormal);                                       \n\
                                                                     \n\
  // vertex-to-eye (view vector)                                     \n\
  vec3 V = normalize(-vpos);                                         \n\
                                                                     \n\
  // light vector (positional light)                                 \n\
  vec3 L = normalize(uLightPosition - vpos);                         \n\
                                                                     \n\
  // ambient component is neglected                                  \n\
                                                                     \n\
  // diffuse component (Minnaert reflection model)                   \n\
  vec3 col = uLightColor * mat_color;                                \n\
  float NdotV = dot(N,V);                                            \n\
  float NdotL = dot(N,L);                                            \n\
  float darkening_factor = pow(NdotL, uK) * pow(1.0-NdotV, uK-1.0);  \n\
  vec3 diffuse = col * NdotL * max(darkening_factor, 0.0);           \n\
                                                                     \n\
  // final color                                                     \n\
  gl_FragColor = vec4(diffuse, 1.0);                                 \n\
}                                                                    \n\
";


var PerPixelSumup_vs = "\
precision highp float;                                               \n\
                                                                     \n\
uniform mat4 uModelViewProjectionMatrix;                             \n\
uniform mat4 uModelViewMatrix;                                       \n\
uniform mat3 uViewSpaceNormalMatrix;                                 \n\
                                                                     \n\
attribute vec3 aPosition;                                            \n\
attribute vec3 aNormal;                                              \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // vertex normal (in view space)                                   \n\
  vnormal = normalize(uViewSpaceNormalMatrix * aNormal);             \n\
                                                                     \n\
  // vertex position (in view space)                                 \n\
  vec4 position = vec4(aPosition, 1.0);                              \n\
  vpos = vec3(uModelViewMatrix * position);                          \n\
                                                                     \n\
  // output                                                          \n\
  gl_Position = uModelViewProjectionMatrix * position;               \n\
}                                                                    \n\
";

var PerPixelSumup_fs = "\
precision highp float;                                               \n\
                                                                     \n\
varying vec3 vnormal;                                                \n\
varying vec3 vpos;                                                   \n\
                                                                     \n\
// positional light: position and color                              \n\
uniform vec3 uLightPosition;                                         \n\
uniform vec3 uLightColor;                                            \n\
// surface roughness                                                 \n\
uniform float uRoughnessSq;                                          \n\
// gaussian coefficient                                              \n\
uniform float uC;                                                    \n\
// reflection coefficient                                            \n\
uniform float uR0;                                                   \n\
                                                                     \n\
void main()                                                          \n\
{                                                                    \n\
  // material color                                                  \n\
  vec3 mat_color = vec3(1.0, 1.0, 1.0);                              \n\
                                                                     \n\
  // normalize interpolated normal                                   \n\
  vec3 N = normalize(vnormal);                                       \n\
                                                                     \n\
  // light vector (positional light)                                 \n\
  vec3 L = normalize(uLightPosition - vpos);                         \n\
                                                                     \n\
  // vertex-to-eye (view vector)                                     \n\
  vec3 V = normalize(-vpos);                                         \n\
                                                                     \n\
  // ambient component is neglected                                  \n\
                                                                   \n\
  // diffuse component (Oren-Nayar reflectance model)                \n\
  vec3 col = mat_color * uLightColor;                                \n\
                                                                     \n\
  float A = 1.0 - (0.5 * uRoughnessSq) / (uRoughnessSq + 0.33);      \n\
  float B = (0.45 * uRoughnessSq) / (uRoughnessSq + 0.09);           \n\
                                                                     \n\
  float VdotN = dot(V, N);                                           \n\
  float LdotN = dot(L, N);                                           \n\
  float irradiance = max(0.0, LdotN);                                \n\
                                                                     \n\
  float angleViewNormal  = acos(VdotN);                              \n\
  float angleLightNormal = acos(LdotN);                              \n\
                                                                     \n\
  // max( 0.0 , cos(phi_incident, phi_reflected) )                   \n\
  float angleDiff = max(0.0, dot(normalize(V - N * VdotN),           \n\
                          normalize(L - N * LdotN)));              \n\
                                                                     \n\
  float alpha = max(angleViewNormal, angleLightNormal);              \n\
  float beta  = min(angleViewNormal, angleLightNormal);              \n\
                                                                     \n\
  vec3 diffuse = col  * irradiance * (A +                            \n\
                      B * angleDiff * sin(alpha) * tan(beta));     \n\
                                                                     \n\
  // final color                                                     \n\
  gl_FragColor = vec4(diffuse, 1.0); \n\
  vec4 tempGl_FragColor = vec4(diffuse, 1.0);                                 \n\
  // half-vector              \n\
  vec3 H = normalize(L + V); \n\
  float NdotH = max(0.0, dot(N, H)); \n\
  float VdotH = dot(V, H); \n\
  float NdotV = dot(N, V); \n\
  float NdotL = dot(N, L); \n\
  // diffuse component                                               \n\
  //vec3 diffuse = mat_diffuse * NdotL;                                \n\
  diffuse = uLightColor * NdotL;      \n\
  // specular component (Cook-Torrance reflection model)             \n\
                                                                     \n\
  // D term (gaussian)          \n\
  alpha = acos(NdotH);        \n\
  float D = uC * exp(- alpha * alpha * uC);                          \n\
                                                                     \n\
  // Geometric factor (G)                                            \n\
  float G1 = 2.0 * NdotH * NdotV / VdotH;                            \n\
  float G2 = 2.0 * NdotH * NdotL / VdotH;                            \n\
  float G = min(1.0, min(G1, G2));                                   \n\
                                                                     \n\
  // Fresnel Refraction (F) - Schlick's approximation                \n\
  float k = pow(1.0 - NdotV, 5.0);                                   \n\
  float F = uR0 + (1.0 - uR0) * k;                                   \n\
                                                                     \n\
  vec3 specular = uLightColor * (F * D * G) / NdotV;                             \n\
  // final color                                                     \n\
  gl_FragColor = (tempGl_FragColor + 0.4*vec4(diffuse, 1.0) + 0.8 * vec4(specular, 1.0)) / 2.0; \n\
}                                                                    \n\
";




