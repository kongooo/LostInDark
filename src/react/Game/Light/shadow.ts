import shadowVsSource from '../../shaders/ShadowShader/vsSource.glsl';
import shadowFsSource from '../../shaders/ShadowShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';

import { WebGL } from '../../Tools/WebGLUtils';

import { Coord, CoordUtils, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';

class Shadow {

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
    draw = (obstacleVertics: Array<number>, lightPos: Coord, radius: number, defaultUniform: Array<UniformLocationObj>, texture: WebGLTexture) => {
        let vertices = [];

        for (let i = 0; i < obstacleVertics.length - 3; i += 2) {

            let aPos = { x: obstacleVertics[i], y: obstacleVertics[i + 1] };
            let bPos = (i + 2) % 8 === 0 ? { x: obstacleVertics[i - 6], y: obstacleVertics[i - 5] } : { x: obstacleVertics[i + 2], y: obstacleVertics[i + 3] };

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

        this.shadowMesh.drawWithBuffer(vertices, defaultUniform, undefined, texture)
    }
}

export default Shadow;
