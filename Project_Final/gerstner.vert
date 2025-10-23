#version 330 compatibility


/* Uniform Variables */
uniform vec2    uWaveVector0;
uniform float   uTime;
/*
*/
uniform vec2    uWaveVector1;
/*
*/
uniform float   uPhase1;
uniform vec2    uWaveVector2;
/*
*/

/* Variables Passed to Fragment Shader */
out vec3 vMC;   // Model Coordinates (x,y,z)
out vec3 vN;    // normal
out vec3 vL;    // light
out vec3 vE;    // eye
out vec2 vST;   // tex coords

/* Constants */
const vec3 LightPosition = vec3( 0., 5., 0. );
const float PI = 3.14159265;
const float TWO_PI = 2 * PI;
const float G = 9.8; // m/s^2

struct Wave{
    float angle;        // vector component
    float magnitude;    // vector component
    float amplitude;
    float frequency;
    float phase;
};

/* Fuction Prototypes */
vec3 gerstnerWave(vec3 vertex, Wave wave, float time);
vec3 gerstnerWave(vec3 vertex, Wave waves[2], float time);
vec3 gerstnerWave(vec3 vertex, Wave waves[3], float time);
vec3 gerstnerWave(vec3 vertex, Wave waves[4], float time);
vec3 gerstnerNormal(vec3 vertex, Wave waves[4], float time);
vec3 gerstnerNormal(vec3 vertex, Wave waves[2], float time);


void main() {
    vST = gl_MultiTexCoord0.st;

    Wave wave0;
    wave0.angle     = PI/6;
    wave0.magnitude = 2;
    wave0.amplitude = .3;
    wave0.frequency = 3 * PI * int(sqrt(G*wave0.magnitude));
    wave0.phase     = 0;

    Wave wave1;
    wave1.angle     = -PI/6;
    wave1.magnitude = 2;
    wave1.amplitude = .1;
    wave1.frequency = 1 * PI * int(sqrt(G*wave1.magnitude));
    wave1.phase     = 2.5;

    Wave wave2;
    wave2.angle     = PI/3;
    wave2.magnitude = 10;
    wave2.amplitude = .025;
    wave2.frequency = 4 * PI * int(sqrt(G*wave2.magnitude));
    wave2.phase     = 4.3;

    Wave wave3;
    wave3.angle     = -PI/3;
    wave3.magnitude = 10;
    wave3.amplitude = .025;
    wave3.frequency = 5 * PI * int(sqrt(G*wave3.magnitude));
    wave3.phase     = 4;

    Wave waves[4];
    waves[0] = wave0;
    waves[1] = wave1;
    waves[2] = wave2;
    waves[3] = wave3;

    vec4 newVertex = vec4( gerstnerWave(gl_Vertex.xyz, waves, uTime), 1);

    vec4 ECposition = gl_ModelViewMatrix * newVertex;
    vN = -gerstnerNormal(gl_Vertex.xyz, waves, uTime);
    vL = LightPosition - ECposition.xyz;
    vE = vec3(0,0,0) - ECposition.xyz;
    vMC = newVertex.xyz;

    gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}



vec3 gerstnerWave(vec3 vertex, Wave wave, float time){
    float theta = wave.magnitude*cos(wave.angle)*vertex.x +
                  wave.magnitude*sin(wave.angle)*vertex.z -
                  wave.frequency*time;

    float x = vertex.x - cos(wave.angle) * wave.amplitude * sin(theta);
    float y =                              wave.amplitude * cos(theta);
    float z = vertex.z - sin(wave.angle) * wave.amplitude * sin(theta);

    return vec3(x,y,z);
}

vec3 gerstnerWave(vec3 vertex, Wave waves[2], float time){
    float x = vertex.x;
    float y = 0;
    float z = vertex.z;
    for(int i = 0; i < 2; i++){
        Wave wave = waves[i];
        float theta =   wave.magnitude*cos(wave.angle)*vertex.x +
                        wave.magnitude*sin(wave.angle)*vertex.z -
                        wave.frequency*time;
        x -= cos(wave.angle) * wave.amplitude * sin(theta);
        y +=                   wave.amplitude * cos(theta);
        z -= sin(wave.angle) * wave.amplitude * sin(theta);
    }

    return vec3(x,y,z);
}

vec3 gerstnerWave(vec3 vertex, Wave waves[3], float time){
    float x = vertex.x;
    float y = 0;
    float z = vertex.z;
    for(int i = 0; i < 3; i++){
        Wave wave = waves[i];
        float theta =   wave.magnitude*cos(wave.angle)*vertex.x +
                        wave.magnitude*sin(wave.angle)*vertex.z -
                        wave.frequency*time;
        x -= cos(wave.angle) * wave.amplitude * sin(theta);
        y +=                   wave.amplitude * cos(theta);
        z -= sin(wave.angle) * wave.amplitude * sin(theta);
    }

    return vec3(x,y,z);
}

vec3 gerstnerWave(vec3 vertex, Wave waves[4], float time){
    float x = vertex.x;
    float y = 0;
    float z = vertex.z;
    for(int i = 0; i < 4; i++){
        Wave wave = waves[i];
        float theta =   wave.magnitude*cos(wave.angle)*vertex.x +
                        wave.magnitude*sin(wave.angle)*vertex.z -
                        wave.frequency*time;
        x -= cos(wave.angle) * wave.amplitude * sin(theta);
        y +=                   wave.amplitude * cos(theta);
        z -= sin(wave.angle) * wave.amplitude * sin(theta);
    }

    return vec3(x,y,z);
}

vec3 gerstnerNormal(vec3 vertex, Wave waves[2], float time){
    float dxdx = 1, dydx = 0, dzdx = 0;
    float dxdz = 0, dydz = 0, dzdz = 1;
    for(int i = 0; i < 2; i++){
        Wave wave = waves[i];
        float dtheta_dx = wave.magnitude*cos(wave.angle);
        float dtheta_dz = wave.magnitude*sin(wave.angle);
        float theta = dtheta_dx*vertex.x +
                      dtheta_dz*vertex.z -
                      wave.frequency*time;
        dxdx -= wave.amplitude*cos(wave.angle)*cos(theta)*dtheta_dx;
        dydx -= wave.amplitude*sin(theta)*dtheta_dx;
        dzdx -= wave.amplitude*sin(wave.angle)*cos(theta)*dtheta_dx;
        dxdz -= wave.amplitude*cos(wave.angle)*cos(theta)*dtheta_dz;
        dydz -= wave.amplitude*sin(theta)*dtheta_dz;
        dzdz -= wave.amplitude*sin(wave.angle)*cos(theta)*dtheta_dz;
    }
    vec3 tangentA = vec3(dxdx, dydx, dzdx);
    vec3 tangentB = vec3(dxdz, dydz, dzdz);
    return normalize(gl_NormalMatrix*cross(tangentA, tangentB));
}

vec3 gerstnerNormal(vec3 vertex, Wave waves[4], float time){
    float dxdx = 1, dydx = 0, dzdx = 0;
    float dxdz = 0, dydz = 0, dzdz = 1;
    for(int i = 0; i < 4; i++){
        Wave wave = waves[i];
        float dtheta_dx = wave.magnitude*cos(wave.angle);
        float dtheta_dz = wave.magnitude*sin(wave.angle);
        float theta = dtheta_dx*vertex.x +
                      dtheta_dz*vertex.z -
                      wave.frequency*time;
        dxdx -= wave.amplitude*cos(wave.angle)*cos(theta)*dtheta_dx;
        dydx -= wave.amplitude*sin(theta)*dtheta_dx;
        dzdx -= wave.amplitude*sin(wave.angle)*cos(theta)*dtheta_dx;
        dxdz -= wave.amplitude*cos(wave.angle)*cos(theta)*dtheta_dz;
        dydz -= wave.amplitude*sin(theta)*dtheta_dz;
        dzdz -= wave.amplitude*sin(wave.angle)*cos(theta)*dtheta_dz;
    }
    vec3 tangentA = vec3(dxdx, dydx, dzdx);
    vec3 tangentB = vec3(dxdz, dydz, dzdz);
    return normalize(gl_NormalMatrix*cross(tangentA, tangentB));
}
