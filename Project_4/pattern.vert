// make this 120 for the mac:
#version 330 compatibility

// out variables to be interpolated in the rasterizer and sent to each fragment shader:
out vec3    vNormal;
out vec3    vEyeDir;
out vec3    vMC;

void
main( )
{
    vMC = gl_Vertex.xyz;
    vec3 ECposition = (gl_ModelViewMatrix * gl_Vertex).xyz;
    vEyeDir = ECposition - vec3(0,0,0);
    vNormal = normalize(gl_Normal);
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
