#version 300 es

precision mediump float;

uniform vec3 u_color;

out vec4 outPutColor;

void main() {
    outPutColor = vec4(u_color/vec3(255.0),1);
}