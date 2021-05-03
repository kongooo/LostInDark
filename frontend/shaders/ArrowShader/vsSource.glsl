#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_worldPos;
uniform float u_scale;
uniform mat4 u_rotateMatrix;

out vec2 v_texCoord;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

void main() {

    vec3 rotatePos = (u_rotateMatrix * vec4(vec3(a_position.x * u_scale, 0.1, a_position.y * u_scale), 1)).xyz;
    vec3 worldPos = rotatePos + vec3(u_worldPos.x + 0.5, 0.0, u_worldPos.y + 0.5);

    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(worldPos, 1);
    v_texCoord = vec2(a_texCoord.x, a_texCoord.y);
}   