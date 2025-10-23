#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uTol, uDist, uP;

// For Chroma Key
uniform int     uUseChromaKey;
uniform float   uBlueDepth;
uniform float   uRedDepth;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates
in  float vZ;           // for chroma key

float smoothPulse(float left, float right, float value, float tol){
    float t =   smoothstep(left-tol, left+tol, value) -
                smoothstep(right-tol, right+tol, value);
    return t;
}

vec3 Rainbow(float t) {
    t = clamp(t, 0, 1);

    float r = 1.;
    float g = 0.;
    float b = 1. - 6. * (t - (5./6.));

    if(t <= 5./6.) {
        r = 6. * (t-(4./6.));
        g = 0.;
        b = 1.;
    }
    if(t <= 4./6.) {
        r = 0.;
        g = 1. - 6. * (t-(3./6.));
        b = 1.;
    }
    if(t <= 3./6.) {
        r = 0.;
        g = 1.;
        b = 6. * (t-(2./6.));
    } 
    if(t <= 2./6.) {
        r = 1. - 6. * (t-(1./6.));
        g = 1.;
        b = 0.;
    }
    if(t <= 1./6.) {
        r = 1.;
        g = 6. * t;
    }

    return vec3(r,g,b);
}

void
main( )
{
    vec3 myColor = uColor;

    if(uUseChromaKey == 0){
        float numins = int(vST.s/uDist);
        float sc = numins*uDist + uDist/2;
        float tps = smoothPulse(0.5-uP, 0.5+uP, abs(vST.s-sc)/uDist, uTol);

        float numint = int(vST.t/uDist);
        float tc = numint*uDist + uDist/2;
        float tpd = smoothPulse(0.5-uP, 0.5+uP, abs(vST.t-tc)/uDist, uTol);

        myColor = mix(myColor, vec3(0,0,0), tps);
        myColor = mix(myColor, vec3(0,0,0), tpd);
    } else {
        float t = (2./3.) * (abs(vZ) - uRedDepth) / (uBlueDepth - uRedDepth);
        t = clamp(t, 0, 2./3.);
        myColor = Rainbow(t);
    }

	// apply the per-fragment lighting to myColor:

	vec3 Normal = normalize(vN);
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

