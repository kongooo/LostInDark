#version 300 es

precision mediump float;

in vec4 v_color;
in vec2 v_texCoord;

out vec4 outPutColor;

void main() {
    vec2 circle_pos = (v_texCoord - vec2(0.5)) * vec2(2.0);
    float distance = circle_pos.x * circle_pos.x + circle_pos.y * circle_pos.y;
    float attenuation = -0.9;
    float t, l;
    if(attenuation <= 0.0) {
        t = 1.0 / (attenuation + 1.0) - 1.0;
        l = exp(-distance * t) - distance * exp(-t);
    } else if(attenuation < 1.0) {
        t = 1.0 / (1.0 - attenuation) - 1.0;
        distance = 1.0 - distance;
        l = 1.0 - (exp(-distance * t) - distance * exp(-t));
    }
    
    outPutColor = vec4(l, l, l, 1);
}