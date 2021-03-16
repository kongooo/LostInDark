#version 300 es

precision mediump float;

in vec4 v_color;

out vec4 outPutColor;

void main() {
    outPutColor = v_color;//vec4(0.5,0.5,0.5,1);
}