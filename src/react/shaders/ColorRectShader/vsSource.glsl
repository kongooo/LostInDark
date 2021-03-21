#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

uniform vec2 u_translation;

void main() {
    vec2 zeroToOne = (a_position + u_translation) / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);
}