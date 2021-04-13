#version 300 es

in vec3 a_position;
in vec2 a_texCoord;
in vec2 a_offset;

uniform vec2 u_resolution;

uniform vec2 u_cameraWorldPos;

uniform float u_mapSize;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

out vec2 v_texCoord;

void main() {
    // vec2 screenPos = (a_position - u_cameraWorldPos) * u_mapSize;
    // vec2 zeroToOne = screenPos / vec2(u_resolution);
    // vec2 zeroToTwo = zeroToOne * 2.0;
    // vec2 clipSpace = zeroToTwo - 1.0;
    // gl_Position = vec4(clipSpace, 0.0, 1.0);

    vec4 pos = vec4(a_position.x + a_offset.x, a_position.y, a_position.z + a_offset.y, 1);
    gl_Position = u_projectionMatrix * u_viewMatrix * pos;

    v_texCoord = a_texCoord;
}