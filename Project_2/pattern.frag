#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float uAd, uBd, uTol;
uniform int uSmooth;

uniform sampler3D Noise3;
uniform float uNoiseFreq, uNoiseAmp;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates


void
main( )
{
    vec4 nv = texture(Noise3, uNoiseFreq * vec3(vST,0.));
    float n = nv.r + nv.g + nv.b + nv.a;
    n -= 2.;
    n *= uNoiseAmp;

    vec2 st = vST.st;
    float Ar = uAd/2;
    float Br = uBd/2;
    int numins = int(st.s/uAd);
    int numint = int(st.t/uBd);
    float sc = numins * uAd + Ar;
    float tc = numint * uBd + Br;

    float ds = st.s - sc;
    float dt = st.t - tc;
    float oldDist = sqrt(ds*ds + dt*dt);
    float newDist = oldDist + n;
    float scale = newDist / oldDist;

    ds = ds * scale / Ar;
    dt = dt * scale / Br;
    float d = ds*ds + dt*dt;
    float t = smoothstep((1.-uTol)*uSmooth, (1+uTol)*uSmooth, d);

	// determine the color using the eliptical-boundary equations:

	vec3 myColor = uColor;
	if( d <= 1-uTol )
    {
		myColor = vec3( 1., 0.5, 0. );
	}
    
    if(1-uTol <= d && d <= 1+uTol){
        myColor = mix(vec3(1.,0.5,0.), uColor, t);
    }
    

	// apply the per-fragmewnt lighting to myColor:

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

