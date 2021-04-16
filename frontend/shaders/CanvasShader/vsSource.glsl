#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

uniform vec2 u_worldPos;

out vec2 v_texCoord;

void main() {

    vec2 worldPos = a_position + u_worldPos;
    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(worldPos.x, 0, worldPos.y, 1.0);
    v_texCoord = a_texCoord;
}