#version 300 es

in vec3 a_position;
in vec2 a_texCoord;
in vec3 a_normal;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_rotateMatrix;
uniform vec2 u_worldPos;

out vec2 v_texCoord;
out vec3 v_normal;
out vec3 v_fragPos;

void main() {

    vec3 rotatePos = (u_rotateMatrix * vec4(a_position, 1)).xyz;
    vec3 vertexWorldPos = rotatePos + vec3(u_worldPos.x, 0, u_worldPos.y);// + vec3(0, 0, 0.5);
    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(vertexWorldPos, 1);

    v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
    v_normal = a_normal;
    v_fragPos = vertexWorldPos;
}