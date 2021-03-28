import shadowVsSource from '../../shaders/ShadowShader/vsSource.glsl';
import shadowFsSource from '../../shaders/ShadowShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';

import { WebGL } from '../../Tools/WebGLUtils';

import { Coord, CoordUtils } from '../../Tools/Tool';

class Shadow {

    private shadowMesh: VaryMesh;
    private gl: WebGL2RenderingContext;
    fBufferInfo: { frameBuffer: WebGLFramebuffer, targetTexture: WebGLTexture };

    constructor(gl: WebGL2RenderingContext) {
        const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        const shadowMesh = new VaryMesh(gl, shadowVsSource, shadowFsSource);
        shadowMesh.getAttributeLocations([{ name: 'a_position', size: 2 }]);
        shadowMesh.getUniformLocations(['u_resolution']);
        shadowMesh.getBuffer();

        this.fBufferInfo = fBufferInfo;
        this.shadowMesh = shadowMesh;
        this.gl = gl;
    }


    /**
     * 
     * @param obstacleVertics 障碍物世界坐标
     * @param lightPos 光源世界坐标
     * @param radius 光源半径
     */
    draw = (obstacleVertics: Array<number>, lightPos: Coord, radius: number, worldToScreenPixelPos: (worldPos: Coord) => Coord) => {
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

            aPos = worldToScreenPixelPos(aPos);
            bPos = worldToScreenPixelPos(bPos);
            aCirclePos = worldToScreenPixelPos(aCirclePos);
            bcirclePos = worldToScreenPixelPos(bcirclePos);
            intersectPos = worldToScreenPixelPos(intersectPos);

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
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height] }
        ])
    }

}

export default Shadow;
