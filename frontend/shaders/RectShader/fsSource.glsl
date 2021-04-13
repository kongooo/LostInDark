#version 300 es

precision mediump float;

uniform sampler2D u_image;

uniform sampler2D u_shadow;

in vec2 v_texCoord;

in vec2 v_texCoord1;

out vec4 outPutColor;

void main() {
    vec4 shadowColor = texture(u_shadow, v_texCoord1);
    // shadowColor = shadowColor * vec4(0.7) + vec4(0.3);
    outPutColor = vec4(shadowColor.rgb * texture(u_image, v_texCoord).rgb, 1);
}