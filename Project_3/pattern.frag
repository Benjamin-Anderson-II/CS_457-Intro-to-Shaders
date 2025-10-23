#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uS0, uT0, uD;

uniform sampler3D Noise3;
uniform float uNoiseFreq, uNoiseAmp;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates
in  vec3  vMC;

vec3 PerturbNormal2(float angx, float angy, vec3 n);

void
main( )
{
    vec4 nvx = texture(Noise3, uNoiseFreq*vMC);
    float angx = nvx.r + nvx.g + nvx.b + nvx.a - 2;
    angx *= uNoiseAmp;

    vec4 nvy = texture(Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5));
    float angy = nvy.r + nvy.b + nvy.g + nvy.a - 2;
    angy *= uNoiseAmp;

	float s = vST.s;
	float t = vST.t;
	vec3 myColor = uColor;
	// apply the per-fragment lighting to myColor:

    vec3 n = PerturbNormal2(angx, angy, vN);
	vec3 Normal = normalize(gl_NormalMatrix * n);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);

	vec3 ambient = uKa * myColor;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * myColor;

	float ss = 0.;
	if( dot(Normal,Light) > 0. )	      // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		ss = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * ss * uSpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}

vec3 PerturbNormal2(float angx, float angy, vec3 n) {
    float cx = cos(angx);
    float sx = sin(angx);
    float cy = cos(angy);
    float sy = sin(angy);

    // Rotate about x:
    float yp =  n.y*cx - n.z*sx;     // y'
    n.z      =  n.y*sx + n.z*cx;     // z'
    n.y      =  yp;
//  n.x      =  n.x;

    // Rotate about y:
    float xp =  n.x*cy + n.z*sy;     // x'
    n.z      = -n.x*sy + n.z*cy;     // z'
    n.x      =  xp;
//  n.y      =  n.y;

    return normalize(n);
}
