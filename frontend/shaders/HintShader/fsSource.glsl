#version 300 es

precision mediump float;

uniform sampler2D u_image;

out vec4 outPutColor;

in vec2 v_texCoord;

void main() {
    outPutColor = texture(u_image, v_texCoord);
}