#version 330 compatibility

uniform samplerCube SkyBox;

in vec3     vTexCoords;

void
main() {
    gl_FragColor = texture(SkyBox, reflect(vTexCoords, vec3(0,1,0)));
}
