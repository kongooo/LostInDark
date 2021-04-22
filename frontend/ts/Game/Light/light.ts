import lightVsSource from '../../../shaders/LightShader/vsSource.glsl';
import lightFsSource from '../../../shaders/LightShader/fsSource.glsl';

import StaticMesh from '../../Tools/Mesh/StaticMesh';

import { WebGL } from '../../Tools/WebGLUtils';
import { Coord, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';

class Light {

    private lightMesh: StaticMesh;
    private gl: WebGL2RenderingContext;
    private color: Array<number>;
    lightRadius: number;
    fBufferInfo: FrameBufferInfo;

    constructor(gl: WebGL2RenderingContext, lightRadius: number, color: Array<number>) {
        const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        const LightMesh = new StaticMesh(gl, lightVsSource, lightFsSource);

        LightMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])

        LightMesh.getVAO([
            - lightRadius, - lightRadius, 0, 0,
            - lightRadius, lightRadius, 0, 1,
            lightRadius, lightRadius, 1, 1,
            lightRadius, - lightRadius, 1, 0,
        ], [0, 2, 1, 0, 3, 2]);

        this.lightMesh = LightMesh;
        this.fBufferInfo = fBufferInfo;
        this.lightRadius = lightRadius;
        this.gl = gl;
        this.color = color;
    }

    /**
     * 
     * @param worldPos 
     * @param texture 
     * @param brightNess 
     * @param lightScale 
     * @param defaultUniform 
     * @param type 0: player 1: fire
     */
    draw = (worldPos: Coord, texture: WebGLTexture, brightNess: number, lightScale: number, defaultUniform: Array<UniformLocationObj>, type: 1 | 0) => {
        this.lightMesh.drawWithAVO([
            { name: 'u_shadow', data: [0], texture, type: 'texture' },
            { name: 'u_worldPos', data: [worldPos.x, worldPos.y], type: 'vec2' },
            { name: 'u_brightness', data: [brightNess], type: 'float' },
            { name: 'u_lightScale', data: [lightScale], type: 'float' },
            { name: 'u_lightScale', data: [lightScale], type: 'float' },
            { name: 'u_type', data: [type], type: 'int' },
            { name: 'u_color', data: this.color, type: 'vec3' },
            ...defaultUniform
        ]);
    }
}

export default Light;