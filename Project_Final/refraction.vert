#version 330 compatibility

out float vST;
out vec3  vEye;
out vec3  vNormal;
out vec3  vLight;

void main() {
    vST = gl_MultiTexCoord0.st;

    vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
    vNormal = normalize(gl_NormalMatrix * gl_Normal);
    vLight = LightPosition - ECposition.xyz;
    vEye = vec3(0,0,0) - ECposition.xyz;

    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
