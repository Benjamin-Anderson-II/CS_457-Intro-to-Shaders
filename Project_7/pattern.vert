// make this 120 for the mac:
#version 330 compatibility


uniform float uTwist;

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye
out  vec2  vST;	  // (s,t) texture coordinates
out  float vZ;

const float PI = 3.14159265;

// where the light is:

const vec3 LightPosition = vec3(  0., 5., 5. );

vec3 RotateX(vec3 xyz, float radians) {
    float c = cos(radians);
    float s = sin(radians);
    vec3 newxyz = xyz;
    newxyz.yz = vec2(
        dot(xyz.yz, vec2(c,-s)),
        dot(xyz.yz, vec2(s, c))
    );
    return newxyz;
}

vec3 RotateY(vec3 xyz, float radians) {
    float c = cos(radians);
    float s = sin(radians);
    vec3 newxyz = xyz;
    newxyz.xz = vec2(
        dot(xyz.xz, vec2( c,s)),
        dot(xyz.xz, vec2(-s,c))
    );
    return newxyz;
}

vec3 RotateZ(vec3 xyz, float radians) {
    float c = cos(radians);
    float s = sin(radians);
    vec3 newxyz = xyz;
    newxyz.xy = vec2(
        dot(xyz.xy, vec2(c,-s)),
        dot(xyz.xy, vec2(s, c))
    );
    return newxyz;
}

void
main( )
{
    vec4 newVertex = gl_Vertex;
    newVertex.xyz = RotateY(newVertex.xyz, newVertex.y*uTwist);
    newVertex.xyz = RotateZ(newVertex.xyz, newVertex.z*uTwist/3);

	vST = gl_MultiTexCoord0.st;
	vec4 ECposition = gl_ModelViewMatrix * newVertex;
    vZ = -ECposition.z;
	vN = normalize( gl_NormalMatrix * gl_Normal );  // normal vector
	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}
