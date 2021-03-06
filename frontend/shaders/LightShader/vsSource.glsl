#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;

uniform vec2 u_cameraWorldPos;

uniform vec2 u_worldPos;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

uniform float u_lightScale;

//0: player
//1: fire
uniform int u_type;

out vec4 v_color;
out vec2 v_texCoord;
out vec2 v_samplePos;

void main() {
    vec2 screenPos = (a_position * vec2(u_lightScale) + u_worldPos - u_cameraWorldPos);
    vec2 zeroToOne = screenPos / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);

    if(u_type == 1) v_samplePos = a_texCoord;
    else v_samplePos = zeroToOne;
    // v_samplePos = a_texCoord;
    v_texCoord = a_texCoord;
}