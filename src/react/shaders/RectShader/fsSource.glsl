#version 300 es

precision mediump float;

uniform sampler2D u_image;

in vec2 v_texCoord;

out vec4 outPutColor;

void main() {
    // vec2 pos = (v_texCoord - vec2(0.5)) * vec2(2);
    // float r = pos.x * pos.x + pos.y*pos.y;
    // if (r >= 1.0f)
    //     outPutColor = vec4(0,0,0,1);
    // else 
    //     outPutColor = vec4(1);
    // outPutColor = v_color;
    // outPutColor = texture(u_image, v_texCoord);// v_color;//vec4(0.5,0.5,0.5,1);
    vec3 rgb = vec3(132.0, 103.0, 42.0);
    
    outPutColor = vec4(rgb/vec3(255.0),1);
}