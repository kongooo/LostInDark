#version 300 es

precision mediump float;

uniform sampler2D u_image;
 
out vec4 outPutColor;

in vec2 v_texCoord;
in vec2 v_resolution;
 
void main() {
    // vec2 v_resolution = vec2(375.0, 667.0);
    vec2 step = vec2(5.5) / v_resolution; 

    float weight[9];
    weight[0] = 0.0625;
    weight[1] = 0.125;
    weight[2] = 0.0625;
    weight[3] = 0.125;
    weight[4] = 0.25;
    weight[5] = 0.125;
    weight[6] = 0.0625;
    weight[7] = 0.125;
    weight[8] = 0.0625;

    vec4 color = vec4(0);

    int count = 0;

    for(int x = -1; x < 2; x++) {
        for(int y = -1; y < 2; y++) {
            color += texture(u_image, v_texCoord + step * vec2(x, y)) * weight[count];
            count++;
        }
    }
    outPutColor = texture(u_image, v_texCoord);
}
