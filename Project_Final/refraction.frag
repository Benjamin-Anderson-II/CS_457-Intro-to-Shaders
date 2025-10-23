#version 330 compatibility

in float vST;
in vec3  vEye;
in vec3  vNormal;
in vec3  vLight;

void main(){
    float iorRatio = 1.000293/1.333;
    vec3 refractVec = refract(vEye, vNormal, iorRatio);
}
