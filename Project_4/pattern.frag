#version 330 compatibility

// uniform variables -- these can be set once and left alone:
uniform sampler3D       Noise3;
uniform float           uNoiseAmp;
uniform float           uNoiseFreq;
uniform float           uEta;
uniform float           uMix;
uniform float           uWhiteMix;
uniform samplerCube     uReflectUnit;
uniform samplerCube     uRefractUnit;

// in variables from the vertex shader and interpolated in the rasterizer:
in vec3                 vNormal;
in vec3                 vEyeDir;
in vec3                 vMC;

const vec3  WHITE = vec3(1,1,1);

vec3
PerturbNormal3(float angx, float angy, float angz, vec3 n) {
    float cx = cos(angx);
    float sx = sin(angx);
    float cy = cos(angy);
    float sy = sin(angy);
    float cz = cos(angz);
    float sz = sin(angz);

    // rotate about x:
    float yp =  n.y*cx - n.z*sx;
    n.z      =  n.y*sx + n.z*cx;
    n.y      =  yp;
//  n.x      =  n.x;

    float xp =  n.x*cy + n.z*sy;
    n.z      = -n.x*sy + n.z*cy;
    n.x      =  xp;
//  n.y      =  n.y;

          xp =  n.x*cz - n.y*sz;
    n.y      =  n.x*sz + n.y*cz;
    n.x      =  xp;
//  n.z      =  n.z;

    return normalize(n);
}

void
main( )
{
    vec3 Normal = normalize(vNormal);
    vec3 Eye    = normalize(vEyeDir);

    vec4 nvx    = texture(Noise3, uNoiseFreq*vMC);
    vec4 nvy    = texture(Noise3, uNoiseFreq*vec3(vMC.xy, vMC.z+0.33));
    vec4 nvz    = texture(Noise3, uNoiseFreq*vec3(vMC.xy, vMC.z+0.67));

    float angx  = nvx.r + nvx.g + nvx.b + nvx.a;
    angx    -= 2;
    angx    *= uNoiseAmp;

    float angy  = nvy.r + nvy.g + nvy.b + nvy.a;
    angy    -= 2;
    angy    *= uNoiseAmp;

    float angz  = nvz.r + nvz.g + nvz.b + nvz.a;
    angz    -= 2;
    angz     *= uNoiseAmp;

    Normal = normalize(gl_NormalMatrix * Normal);
    Normal = PerturbNormal3(angx, angy, angz, Normal);
        // apply noise to normal here using vMC
    vec3 reflectVector = reflect(Eye, Normal);
    reflectVector.t = -reflectVector.t;
    vec3 reflectColor  = texture(uReflectUnit, reflectVector).rgb;

    
    vec3 refractVector = refract(Eye, Normal, uEta);
    refractVector.t = -refractVector.t;
    vec3 refractColor;
    if(all(equal(refractVector, vec3(0,0,0)))) {
        refractColor = reflectColor;
    } else {
        refractColor = texture(uRefractUnit, refractVector).rgb;
        refractColor = mix(refractColor, WHITE, uWhiteMix);
    }
    vec3 color = mix(refractColor, reflectColor, uMix);
    color = mix(color, WHITE, uWhiteMix);


    gl_FragColor = vec4(color, 1);
}

