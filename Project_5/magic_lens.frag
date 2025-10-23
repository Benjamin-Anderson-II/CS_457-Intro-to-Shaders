#version 330 compatibility

// uniform variables for image manipulation
uniform sampler2D   ImageTexture;
uniform float       uLensRad;
uniform float       uCenterS;
uniform float       uCenterT;
uniform float       uMagFactor;
uniform float       uWhirlFactor;
uniform float       uMosaicFactor;

// in variables from the vertex shader and interpolated in the rasterizer:
in  vec2  vST;

// LENS TYPE CONSTANTS
const int NONE     = 0;
const int MAGNIFY  = 1;
const int WHIRL    = 2;
const int MOSAIC   = 3;

void main() {
    vec2 st = vST - vec2(uCenterS, uCenterT);

    if(st.s*st.s + st.t*st.t > uLensRad*uLensRad) {
        vec3 rgb = texture(ImageTexture, vST).rgb;
        gl_FragColor = vec4(rgb, 1);
    } else {
        float r = sqrt(st.s*st.s+st.t*st.t);
        r /= uMagFactor;
        float theta = atan(st.t, st.s);
        theta -= uWhirlFactor * r;

        st = r * vec2(cos(theta), sin(theta));
        st += vec2(uCenterS, uCenterT);

        int numins = int(st.s/uMosaicFactor);
        int numint = int(st.t/uMosaicFactor);
        float sc = numins * uMosaicFactor + (uMosaicFactor/2);
        float tc = numint * uMosaicFactor + (uMosaicFactor/2);
        st.s = sc;
        st.t = tc;

        vec3 rgb = texture(ImageTexture, st).rgb;
        gl_FragColor = vec4(rgb, 1);
    }
}

