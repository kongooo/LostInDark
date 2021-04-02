#version 300 es

precision mediump float;

uniform sampler2D u_image;

out vec4 outPutColor;

in vec2 v_texCoord;

void main() {
    float alpha = texture(u_image, v_texCoord).a;
    vec4 color = vec4(vec3(0.0), 0.0);

    //除去障碍物部分
    if(alpha == 0.0) {
        color.a = 1.0;
    }

    outPutColor = color;
}