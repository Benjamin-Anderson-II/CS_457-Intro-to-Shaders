#version 330 compatibility
layout (location = 0) in vec3 aPos;

out vec3 vTexCoords;

void main() {
    vTexCoords = aPos;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
