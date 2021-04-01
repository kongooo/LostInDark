#version 300 es

precision mediump float;

uniform sampler2D u_image;

uniform vec3 u_backColor;
uniform vec3 u_obstacleColor;

in vec2 v_texCoord;

out vec4 outPutColor;

void main() {
    float r = texture(u_image, v_texCoord).r;
    vec4 backColor = vec4(u_backColor / vec3(255.0), 1);
    vec4 obstacleColor = vec4(u_obstacleColor / vec3(255.0), 1);
    vec4 color = backColor;
    //如果是障碍物
    if(r == 0.0) {
        color = obstacleColor;
    }
    outPutColor = color;
}