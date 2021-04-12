#version 300 es

precision mediump float;

uniform sampler2D u_image;

in vec2 v_texCoord;

out vec4 outPutColor;

void main() {
    outPutColor = texture(u_image, v_texCoord);
}