#version 300 es

precision mediump float;

in vec4 v_ABposition;
in vec2 v_texCoord;

uniform sampler2D u_map;

uniform vec2 u_lightPos;
uniform float u_lightSize;

out vec4 outPutColor;

void main() {
    float alpha = texture(u_map, v_texCoord).a;
    vec4 color = vec4(vec3(0.0), 0.0);

    //除去障碍物部分
    if(alpha == 0.0) {
        color.a = 1.0;
    }

    outPutColor = color;
}