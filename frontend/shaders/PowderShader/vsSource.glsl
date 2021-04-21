#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_worldPos;

out vec2 v_texCoord;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

void main() {

    vec3 worldPos = vec3(a_position.x, 0.1, a_position.y) + vec3(u_worldPos.x, 0.0, u_worldPos.y);

    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(worldPos, 1);
    v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
}   