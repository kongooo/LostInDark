#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;

out vec4 v_color;

void main() {
    vec2 zeroToOne = (a_position + u_translation) / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0, 1);
    v_color = gl_Position * 0.5 + 0.5;
}