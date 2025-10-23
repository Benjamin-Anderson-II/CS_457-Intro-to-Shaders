// make this 120 for the mac:
#version 330 compatibility

// uniform variables
uniform float uA, uP;   // amplitude and period

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye
out  vec2  vST;	  // (s,t) texture coordinates
out  vec3  vMC;

// 2*pi constant
const float TWO_PI = 2*3.14159265;

// where the light is:
const vec3 LightPosition = vec3(  0., 5., 5. );

void
main( )
{
    vMC = gl_Vertex.xyz;
    vec4 vert = gl_Vertex;
    vert.z = uA * (1. - vert.y) * sin(TWO_PI * vert.x / uP);

    // tangent vectors
    float dzdx = uA * (1-vert.y) * (TWO_PI/uP) * cos(TWO_PI*vert.x/uP);
    float dzdy = -uA * sin(TWO_PI*vert.x/uP);
    vec3 Tx = vec3(1,0,dzdx);
    vec3 Ty = vec3(0,1,dzdy);

	vST = gl_MultiTexCoord0.st;
	vec4 ECposition = gl_ModelViewMatrix * vert;
	vN = normalize( gl_NormalMatrix * cross(Tx, Ty) );  // normal vector
	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vert;
}
