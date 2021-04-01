import lightVsSource from '../../shaders/LightShader/vsSource.glsl';
import lightFsSource from '../../shaders/LightShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';

import { WebGL } from '../../Tools/WebGLUtils';
import { Coord, FrameBufferInfo } from '../../Tools/Tool';

class Light {

    private lightMesh: VaryMesh;
    private gl: WebGL2RenderingContext;
    lightRadius: number;
    fBufferInfo: FrameBufferInfo;

    constructor(gl: WebGL2RenderingContext) {
        const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        const LightMesh = new VaryMesh(gl, lightVsSource, lightFsSource);

        LightMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])
        LightMesh.getUniformLocations(['u_resolution', 'u_cameraWorldPos', 'u_mapSize', 'u_shadow']);
        LightMesh.getBuffer();

        this.lightMesh = LightMesh;
        this.fBufferInfo = fBufferInfo;
        this.gl = gl;
    }

    /**
     * 
     * @param pos 光源中心世界坐标
     * @param lightRadius 光源半径(单位为世界坐标单位)
     * @param cameraWorldPos 摄像机世界坐标
     * @param mapSize 网格像素大小
     */
    draw = (pos: Coord, lightRadius: number, cameraWorldPos: Coord, mapSize: number, texture: WebGLTexture) => {
        this.lightMesh.drawWithBuffer([
            pos.x - lightRadius, pos.y - lightRadius, 0, 0,
            pos.x + lightRadius, pos.y - lightRadius, 1, 0,
            pos.x + lightRadius, pos.y + lightRadius, 1, 1,
            pos.x - lightRadius, pos.y + lightRadius, 0, 1
        ], [
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height] },
            { name: 'u_cameraWorldPos', data: [cameraWorldPos.x, cameraWorldPos.y] },
            { name: 'u_mapSize', data: [mapSize] },
            { name: 'u_shadow', data: [0] }
        ], [0, 1, 2, 0, 2, 3], texture);
    }
}

export default Light;