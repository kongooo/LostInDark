import shadowVsSource from '../../shaders/ShadowShader/vsSource.glsl';
import shadowFsSource from '../../shaders/ShadowShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';

import { WebGL } from '../../Tools/WebGLUtils';

import { Coord } from '../../Tools/Tool';

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
     * @param offset 摄像机偏移
     */
    draw = (obstacleVertics: Array<number>, lightPos: Coord, radius: number, offset: Coord, worldToScreenPixelPos: (worldPos: Coord) => Coord) => {
        let vertices = [];
        lightPos = lightPos.add(new Coord(0.45, 0.55));

        for (let i = 0; i < obstacleVertics.length - 3; i += 2) {
            let aPos = new Coord(obstacleVertics[i], obstacleVertics[i + 1]);
            let bPos = (i + 2) % 8 === 0 ? new Coord(obstacleVertics[i - 6], obstacleVertics[i - 5]) : new Coord(obstacleVertics[i + 2], obstacleVertics[i + 3]);

            if (aPos.sub(lightPos).length() > radius || bPos.sub(lightPos).length() > radius) { continue; }
            const aVector = aPos.sub(lightPos).normalize();
            const bVector = bPos.sub(lightPos).normalize();
            let aCirclePos = lightPos.add(aVector.mult(radius));
            let bcirclePos = lightPos.add(bVector.mult(radius));
            const aVectorVertical = aVector.rotate(-Math.PI / 2);
            const bVectorVertical = bVector.rotate(Math.PI / 2);
            const intersectLength = Math.abs(aCirclePos.sub(bcirclePos).x / (bVectorVertical.x - aVectorVertical.x));
            let intersectPos = aCirclePos.add(aVectorVertical.mult(intersectLength));

            aPos = worldToScreenPixelPos(aPos);
            bPos = worldToScreenPixelPos(bPos);
            aCirclePos = worldToScreenPixelPos(aCirclePos);
            bcirclePos = worldToScreenPixelPos(bcirclePos);
            intersectPos = worldToScreenPixelPos(intersectPos);

            vertices.push(...[

                aCirclePos.x, aCirclePos.y,
                intersectPos.x, intersectPos.y,
                aPos.x, aPos.y,
                //
                aPos.x, aPos.y,
                intersectPos.x, intersectPos.y,
                bPos.x, bPos.y,
                //
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
