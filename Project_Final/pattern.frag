#version 330 compatibility

layout(location = 0) out vec3 color;

// Texture Unit
uniform sampler2D   uTexUnit;

// in variables from the vertex shader and interpolated in the rasterizer:
in  vec2  vST;


void main() {
    vec3 rgb = texture(uTexUnit, vST).rgb;
    gl_FragColor = vec4(rgb, 1);
}


