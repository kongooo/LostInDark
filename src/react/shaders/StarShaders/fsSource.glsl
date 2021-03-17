#version 300 es

precision mediump float;

uniform vec4 u_color;

in vec4 v_color;
in vec2 v_texCoord;

out vec4 outPutColor;

void main() {
    vec2 circle_pos = (v_texCoord - vec2(0.5)) * vec2(2.0);
    float distance = circle_pos.x * circle_pos.x + circle_pos.y * circle_pos.y;
    if(distance < 1.0) 
        outPutColor = vec4(1.0);
    else
        outPutColor = vec4(0, 0, 0, 0);
    // outPutColor = vec4(1,1,1,1);
}