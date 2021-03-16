#version 300 es

precision mediump float;

uniform vec4 u_color;

in vec4 v_color;

out vec4 outPutColor;

void main() {
    outPutColor = vec4(1,1,1,1);
}