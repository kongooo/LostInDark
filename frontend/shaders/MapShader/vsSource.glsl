#version 300 es

in vec3 a_position;
in vec2 a_texCoord;
in vec2 a_offset;
in vec3 a_normal;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

out vec2 v_texCoord;
out vec3 v_normal;
out vec3 v_fragPos;

void main() {

    vec4 pos = vec4(a_position.x + a_offset.x, a_position.y, a_position.z + a_offset.y, 1);
    gl_Position = u_projectionMatrix * u_viewMatrix * pos;

    v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
    v_normal = a_normal;
    v_fragPos = pos.xyz;
}