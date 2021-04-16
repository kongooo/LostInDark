#version 300 es

in vec2 a_position;
in vec2 a_texCoord;
in vec2 a_texCoord1;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

out vec2 v_texCoord;
out vec2 v_texCoord1;

void main() {

    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position.x, 0, a_position.y, 1.0);
    v_texCoord = a_texCoord;
    v_texCoord1 = a_texCoord1;
}