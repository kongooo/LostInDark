#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;

out vec4 v_color;
out vec2 v_texCoord;

void main() {
    vec2 zeroToOne = (a_position * vec2(u_scale, u_scale) + u_translation) / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0, 1);
    v_texCoord = a_texCoord;
}