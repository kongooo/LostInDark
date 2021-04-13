#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;

uniform vec2 u_cameraWorldPos;

uniform float u_mapSize;

uniform vec2 u_worldPos;

uniform float u_scale;

out vec2 v_texCoord;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

void main() {
    // vec2 scalePos = a_position * vec2(u_scale);
    // vec2 screenPos = (scalePos + u_worldPos - u_cameraWorldPos) * vec2(u_mapSize);
    // vec2 zeroToOne = screenPos / u_resolution;
    // vec2 zeroToTwo = zeroToOne * 2.0;
    // vec2 clipSpace = zeroToTwo - 1.0;
    // gl_Position = vec4(clipSpace, 0, 1);

    vec3 worldPos = vec3(a_position, 1.0) + vec3(u_worldPos.x, 0, u_worldPos.y);

    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(worldPos, 1);
    v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
}   