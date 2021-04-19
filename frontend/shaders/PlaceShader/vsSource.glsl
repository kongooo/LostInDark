#version 300 es

in vec2 a_position;

uniform vec2 u_worldPos;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

void main() {

    vec3 worldPos = vec3(a_position.x, 0.0, a_position.y) + vec3(u_worldPos.x, 0.1, u_worldPos.y);

    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(worldPos, 1);
}   