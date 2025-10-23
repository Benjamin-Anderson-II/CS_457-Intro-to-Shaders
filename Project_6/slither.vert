// make this 120 for the mac:
#version 330 compatibility

// Uniform Variables

uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uSpeed;

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye
out  vec2  vST;	  // (s,t) texture coordinates
out  vec3  vXYZ;

// where the light is:

const vec3 LightPosition = vec3(  0., 5., 5. );
const float PI = 3.14159265;
const float TWOPI = 2 * PI;
const float FRONT_X = 6.814;
const float BACK_X = -11.185;
const float LENGTH = abs(FRONT_X) + abs(BACK_X);
const float HEAD_X = 5.6;
const float BODY_ON_GROUND_X = FRONT_X - ((FRONT_X - HEAD_X) * 5);

const float HEAD_HEIGHT = 1.5;

void
main( )
{
	vST = gl_MultiTexCoord0.st;

    vec3 vert = gl_Vertex.xyz;
    float amp = abs((vert.x-HEAD_X) / (LENGTH-HEAD_X) * 1 * uAmp);
    if(amp > uAmp) amp = uAmp;

    if(vert.x <= HEAD_X)
        vert.z += amp * sin(TWOPI * ((uSpeed*uTime) + (uFreq*vert.x/LENGTH)));

    if(vert.x > HEAD_X) {
        vert.y += HEAD_HEIGHT;
    } else if(vert.x > BODY_ON_GROUND_X) {
        float half_period = (LENGTH + HEAD_X) - (LENGTH + BODY_ON_GROUND_X);
        float wave_shift = HEAD_X;
        vert.y += (cos(((PI/half_period) * vert.x) - ((wave_shift*PI)/half_period)) * HEAD_HEIGHT + HEAD_HEIGHT ) / 2;
    }

    vXYZ = vert;

	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
	vN = normalize( gl_NormalMatrix * gl_Normal );  // normal vector
	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1);
}
