#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;

uniform vec2 u_cameraWorldPos;

uniform float u_mapSize;

uniform vec2 u_worldPos;

out vec4 v_color;
out vec2 v_texCoord;
out vec2 v_samplePos;

void main() {
    vec2 screenPos = (a_position + u_worldPos - u_cameraWorldPos) * vec2(u_mapSize);
    vec2 zeroToOne = screenPos / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);
    v_texCoord = a_texCoord;
    v_samplePos = zeroToOne;
}