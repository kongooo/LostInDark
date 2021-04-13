import lightVsSource from '../../../shaders/LightShader/vsSource.glsl';
import lightFsSource from '../../../shaders/LightShader/fsSource.glsl';

import StaticMesh from '../../Tools/Mesh/StaticMesh';

import { WebGL } from '../../Tools/WebGLUtils';
import { Coord, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';

class Light {

    private lightMesh: StaticMesh;
    private gl: WebGL2RenderingContext;
    lightRadius: number;
    fBufferInfo: FrameBufferInfo;

    constructor(gl: WebGL2RenderingContext, lightRadius: number, defaultUniformName: Array<string>) {
        const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        const LightMesh = new StaticMesh(gl, lightVsSource, lightFsSource);

        LightMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])
        // lightRadius = 0;
        // LightMesh.getUniformLocations(['u_shadow', 'u_worldPos', ...defaultUniformName]);
        LightMesh.getVAO([
            - lightRadius, - lightRadius, 0, 0,
            - lightRadius, lightRadius, 0, 1,
            lightRadius, lightRadius, 1, 1,
            lightRadius, - lightRadius, 1, 0,
        ], [0, 2, 1, 0, 3, 2]);

        // LightMesh.getVAO([
        //     0, 0, 0, 0,
        //     0, 0, 0, 1,
        //     0, 0, 1, 1,
        //     0, 0, 1, 0,
        // ], [0, 2, 1, 0, 3, 2]);

        this.lightMesh = LightMesh;
        this.fBufferInfo = fBufferInfo;
        this.lightRadius = lightRadius;
        this.gl = gl;
    }

    /**
     * 
     * @param worldPos 光源世界坐标
     * @param texture shadow贴图
     */
    draw = (worldPos: Coord, texture: WebGLTexture, defaultUniform: Array<UniformLocationObj>) => {
        this.lightMesh.drawWithAVO([
            { name: 'u_shadow', data: [0], texture, type: 'texture' },
            { name: 'u_worldPos', data: [worldPos.x, worldPos.y], type: 'vec2' },
            ...defaultUniform
        ]);
    }
}

export default Light;