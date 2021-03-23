#version 300 es

precision mediump float;

in vec4 v_color;
in vec2 v_texCoord;

out vec4 outPutColor;

void main() {
    vec2 circle_pos = (v_texCoord - vec2(0.5)) * vec2(2.0);
    float distance = circle_pos.x * circle_pos.x + circle_pos.y * circle_pos.y;
    float t = 0.3;
    float l = exp(-distance * t) - distance * exp(-t);
    outPutColor = vec4(l, l, l, 1);
}