#version 300 es

in vec2 a_position;
in vec4 a_ABposition;
in float a_situation;

uniform vec2 u_resolution;

uniform vec2 u_cameraWorldPos;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

out vec4 v_ABposition;
// out vec2 v_texCoord;
out vec2 v_pos;
out float v_situation;

void main() {
    vec2 screenPos = (a_position - u_cameraWorldPos);
    vec2 zeroToOne = screenPos / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);

    v_ABposition = a_ABposition;
    // v_texCoord = zeroToOne;
    v_pos = a_position;
    v_situation = a_situation;
}