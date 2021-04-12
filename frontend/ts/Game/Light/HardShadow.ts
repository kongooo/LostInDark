import shadowVsSource from '../../../shaders/HardShadowShader/vsSource.glsl';
import shadowFsSource from '../../../shaders/HardShadowShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';

import { WebGL } from '../../Tools/WebGLUtils';

import { Coord, CoordUtils, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';

class HardShadow {

    private shadowMesh: VaryMesh;
    private gl: WebGL2RenderingContext;
    fBufferInfo: FrameBufferInfo;
    private mapSize: number;

    constructor(gl: WebGL2RenderingContext, mapSize: number, defaultUniformName: Array<string>) {
        const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        const shadowMesh = new VaryMesh(gl, shadowVsSource, shadowFsSource);
        shadowMesh.getAttributeLocations([
            { name: 'a_position', size: 2 }
        ]);
        shadowMesh.getUniformLocations(['u_image', ...defaultUniformName]);
        shadowMesh.getBuffer();

        this.fBufferInfo = fBufferInfo;
        this.shadowMesh = shadowMesh;
        this.gl = gl;
        this.mapSize = mapSize;
    }


    /**
     * 
     * @param obstacleVertics 障碍物世界坐标
     * @param lightPos 光源世界坐标
     * @param radius 光源半径
     * @param defaultUniform 坐标转换uniform
     */
    drawHardShadow = (lineVertics: Array<Coord>, lightPos: Coord, radius: number, defaultUniform: Array<UniformLocationObj>, texture: WebGLTexture) => {
        let vertices = [];

        for (let i = 0; i < lineVertics.length - 1; i += 2) {

            let aPos = lineVertics[i];
            let bPos = lineVertics[i + 1];

            if (CoordUtils.len(CoordUtils.sub(aPos, lightPos)) > radius || CoordUtils.len(CoordUtils.sub(bPos, lightPos)) > radius) continue;

            const aVector = CoordUtils.normalize(CoordUtils.sub(aPos, lightPos));
            const bVector = CoordUtils.normalize(CoordUtils.sub(bPos, lightPos));
            let aCirclePos = CoordUtils.add(lightPos, CoordUtils.mult(aVector, radius));
            let bcirclePos = CoordUtils.add(lightPos, CoordUtils.mult(bVector, radius));

            let intersectPos = CoordUtils.calCircleLinePos(lightPos, radius, aCirclePos, bcirclePos);

            vertices.push(...[

                aCirclePos.x, aCirclePos.y,
                intersectPos.x, intersectPos.y,
                aPos.x, aPos.y,

                aPos.x, aPos.y,
                intersectPos.x, intersectPos.y,
                bPos.x, bPos.y,

                bPos.x, bPos.y,
                intersectPos.x, intersectPos.y,
                bcirclePos.x, bcirclePos.y,

            ])
        }

        this.shadowMesh.drawWithBuffer(vertices, [
            { name: 'u_image', data: [0] },
            ...defaultUniform
        ], undefined, texture)
    }
}

export default HardShadow;
