#version 300 es

in vec2 a_position;
in vec3 a_color;

uniform vec2 u_resolution;

out vec4 v_color;

void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0, 1);
    v_color = vec4(a_color / 255.0, 1);
}