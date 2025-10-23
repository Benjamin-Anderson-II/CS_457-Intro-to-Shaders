#version 330 compatibility

uniform sampler2D uTexUnit;

in  vec3 vN;
in  vec3 vE;
in  vec2 vST;

void main(){
    float iorRatio = 1.000293/1.333;
    vec3 refractVec = refract(vE, vN, iorRatio);
    vec4 color = texture2D(uTexUnit, vST+refractVec.xy);

    gl_FragColor = color;
}
