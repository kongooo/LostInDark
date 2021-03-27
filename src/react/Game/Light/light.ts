import lightVsSource from '../../shaders/LightShader/vsSource.glsl';
import lightFsSource from '../../shaders/LightShader/fsSource.glsl';

import StaticMesh from '../../Tools/Mesh/StaticMesh';

import { WebGL } from '../../Tools/WebGLUtils';

const SIZE = 40;


class Light {

    private lightMesh: StaticMesh;
    private gl: WebGL2RenderingContext;
    fBufferInfo: { frameBuffer: WebGLFramebuffer, targetTexture: WebGLTexture };

    constructor(gl: WebGL2RenderingContext) {
        const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        const LightMesh = new StaticMesh(gl, lightVsSource, lightFsSource);
        const lightRadius = 150;
        LightMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])
        LightMesh.getUniformLocations(['u_resolution', 'u_translation', 'u_scale']);
        LightMesh.getVAO([
            -lightRadius, -lightRadius, 0, 0,
            lightRadius, -lightRadius, 1, 0,
            lightRadius, lightRadius, 1, 1,
            -lightRadius, lightRadius, 0, 1
        ], [0, 1, 2, 0, 2, 3]);
        this.lightMesh = LightMesh;
        this.fBufferInfo = fBufferInfo;
        this.gl = gl;
    }

    draw = (pos: { x: number, y: number }, size: number) => {
        this.lightMesh.drawWithAVO([
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height] },
            { name: 'u_translation', data: [pos.x * SIZE + 0.5 * SIZE, pos.y * SIZE + 0.5 * SIZE] },
            { name: 'u_scale', data: [size] }
        ])
    }
}

export default Light;