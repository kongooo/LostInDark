#version 300 es

precision mediump float;

uniform sampler2D u_image;
 
out vec4 outPutColor;

in vec2 v_texCoord;
in vec2 v_resolution;
 
void main() {
    // vec2 v_resolution = vec2(375.0, 667.0);

    float offset[4];
    offset[1] = 0.; offset[2] = 1.3846153846; offset[3] = 3.2307692308;

    float weight[4];
    weight[1] = 0.2270270270; weight[2] = 0.3162162162; weight[3] = 0.0702702703;

    vec4 color = texture(u_image, vec2(v_texCoord)) * weight[0];

    // 垂直
    for (int i=1; i<=3; i++) {
        color +=
            texture(u_image, (vec2(v_texCoord)+vec2(0.0, offset[i])))
                * weight[i];
        color +=
            texture(u_image, (vec2(v_texCoord)-vec2(0.0, offset[i])))
                * weight[i];
    }

    vec4 color2 = texture(u_image, vec2(v_texCoord)) * weight[0];

    // 水平
    for (int i=1; i<=3; i++) {
        color2 +=
            texture(u_image, (vec2(v_texCoord)+vec2(offset[i], 0.0)))
                * weight[i];
        color2 +=
            texture(u_image, (vec2(v_texCoord)-vec2(offset[i], 0.0)))
                * weight[i];
    }

    outPutColor = texture(u_image, v_texCoord);//mix(color, color2, 0.5);
}
