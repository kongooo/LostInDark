#version 300 es

precision mediump float;

uniform vec4 u_color;

out vec4 outPutColor;

void main() {
    outPutColor = u_color;
}