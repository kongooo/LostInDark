#version 300 es

in vec2 a_position;
in vec2 a_texCoord;

uniform vec2 u_resolution;

uniform vec2 u_cameraWorldPos;

uniform float u_mapSize;

uniform vec2 u_worldPos;

uniform mat4 u_projectionMatrix;

uniform mat4 u_viewMatrix;

out vec4 v_color;
out vec2 v_texCoord;
out vec2 v_samplePos;

void main() {
    vec2 screenPos = (a_position + u_worldPos - u_cameraWorldPos) * vec2(u_mapSize);
    vec2 zeroToOne = screenPos / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);

    // switch(gl_VertexID)
    // {
    //     case 0:
    //         gl_Position = vec4(-1, -1, 0, 1);
    //         break;
    //     case 1:
    //         gl_Position = vec4(1, -1, 0, 1);
    //         break;
    //     case 2:
    //         gl_Position = vec4(1, 1, 0, 1);
    //         break;
    //     case 3:
    //         gl_Position = vec4(a_position + vec2(-0.5, 0.5), 0, 1);
    //         break;
    // }

    // vec2 worldPos = a_position + u_worldPos;
    // gl_Position = u_projectionMatrix * u_viewMatrix * vec4(worldPos.x, 0, worldPos.y, 1.0);
    v_texCoord = a_texCoord;
    v_samplePos = zeroToOne;
}