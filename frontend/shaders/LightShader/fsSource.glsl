#version 300 es

precision mediump float;

uniform sampler2D u_shadow;

in vec4 v_color;
in vec2 v_texCoord;
in vec2 v_samplePos;

out vec4 outPutColor;

void main() {
    vec2 circle_pos = (v_texCoord - vec2(0.5)) * vec2(2.0);
    float distance = sqrt(circle_pos.x * circle_pos.x + circle_pos.y * circle_pos.y);
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
    

    vec4 color = vec4(l, l, l, 1) * 0.7;
    float brightness = clamp(texture(u_shadow, v_samplePos).a, 0.0, 1.0);
    color = color * vec4(vec3(brightness), 1);

    outPutColor = color;
}