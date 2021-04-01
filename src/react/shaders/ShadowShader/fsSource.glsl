#version 300 es

precision mediump float;

uniform sampler2D u_image;

out vec4 outPutColor;

in vec2 v_texCoord;

void main() {
    float r = texture(u_image, v_texCoord).r;
    vec4 color = vec4(vec3(0.0), 1.0);

    //除去障碍物部分
    if(r == 0.0) {
        color.r = 1.0;
    }

    outPutColor = color;
}