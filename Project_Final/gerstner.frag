#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec4    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent

uniform samplerCube SkyBox;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec3  vMC;		   // model coordinates (x,y,z)
in  vec2  vST;         // texture coordinates (s, t)


void
main( )
{
    float iorRatio = 1.000293/1.333;
    vec3 myColor = uColor.rgb;
    

//    gl_FragColor = vec4(normalize(vN), uColor.a);
    vec3 refractVec = refract(vE, vN, iorRatio);
//    refractVec = reflect(vE, vN);
    refractVec.t = -refractVec.t;
    vec4 refractColor = texture(SkyBox, refractVec).rgba;
    gl_FragColor = vec4(mix(refractColor, uColor, 0.5));
/*
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
	gl_FragColor = vec4( ambient + diffuse + specular,  uColor.a );
    */
}

