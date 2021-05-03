#version 300 es

precision mediump float;

#define POINT_LIGHT_COUNT 9

struct PointLight {
    vec3 position;
    vec3 color;
    float linear;
    float quadratic;
};

uniform vec3 u_color;

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
    
    vec3 color = min((0.7 + diff) * attenuation, 1.0) * lightColor;

    return color;
}

void main() {
    
    vec3 color = vec3(0);
    vec3 norm = normalize(v_normal);

    for(int i = 0; i < u_lightCount; i++) {
        color += calPointLight(pointLights[i], norm, v_fragPos, u_viewPos);
    }

    outPutColor = vec4((u_color / vec3(255.0)) * color, 1.0);
}