#version 300 es

precision mediump float;

#define POINT_LIGHT_COUNT 9

struct PointLight {
    vec3 position;
    vec3 color;
    float linear;
    float quadratic;
};

uniform sampler2D u_image_up;
uniform sampler2D u_image_front;
uniform sampler2D u_image_side;


uniform vec3 u_viewPos;
uniform int u_lightCount;
uniform PointLight pointLights[POINT_LIGHT_COUNT];

out vec4 outPutColor;

in vec2 v_texCoord;
in vec3 v_normal;
in vec3 v_fragPos;

vec3 calPointLight(PointLight light, vec3 norm, vec3 fragPos, vec3 viewPos) {
    vec3 lightColor = light.color / vec3(255.0);

    vec3 lightDir = normalize(light.position - fragPos);

    vec3 viewDir = normalize(viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);

    float diff = max(dot(norm, lightDir), 0.0);

    float distance = length(light.position - fragPos);

    float attenuation = 1.0 / (1.0 + light.linear * distance + light.quadratic * distance * distance);
    
    vec3 color = (0.7 + diff) * attenuation * lightColor;

    return color;
}

void main() {
    
    vec3 color = vec3(0);
    vec3 norm = normalize(v_normal);

    for(int i = 0; i < u_lightCount; i++) {
        color += calPointLight(pointLights[i], norm, v_fragPos, u_viewPos);
    }

    vec3 result;

    if(norm.x == 0.0 && norm.y == 0.0) {
        result = texture(u_image_up, v_texCoord).rgb;
    } else if(norm.x == 0.0 && norm.z == 0.0) {
        result = texture(u_image_front, v_texCoord).rgb;
    } else if(norm.y == 0.0 && norm.z == 0.0) {
        result = texture(u_image_side, v_texCoord).rgb;
    }
    

    outPutColor = vec4(result * color, 1.0);
}