import shadowVsSource from '../../shaders/ShadowShader/vsSource.glsl';
import shadowFsSource from '../../shaders/ShadowShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';

import { WebGL } from '../../Tools/WebGLUtils';

import { Coord } from '../../Tools/Tool';

import KeyPress from '../../Tools/Event/KeyEvent';

class Shadow {

    private shadowMesh: VaryMesh;
    private gl: WebGL2RenderingContext;
    fBufferInfo: { frameBuffer: WebGLFramebuffer, targetTexture: WebGLTexture };

    constructor(gl: WebGL2RenderingContext) {
        const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        const shadowMesh = new VaryMesh(gl, shadowVsSource, shadowFsSource);
        shadowMesh.getAttributeLocations([{ name: 'a_position', size: 2 }]);
        shadowMesh.getUniformLocations(['u_resolution', 'u_translation']);
        shadowMesh.getBuffer();

        this.fBufferInfo = fBufferInfo;
        this.shadowMesh = shadowMesh;
        this.gl = gl;
    }

    draw = (obstacleVertics: Array<number>, lightPos: Coord, radius: number, offset: Coord) => {
        let vertices = [];
        lightPos = lightPos.mult(40).add(18);
        if (KeyPress.get('p')) console.log(obstacleVertics, lightPos, radius);
        for (let i = 0; i < obstacleVertics.length - 3; i += 2) {
            const aPos = new Coord(obstacleVertics[i], obstacleVertics[i + 1]);
            const bPos = (i + 2) % 8 === 0 ? new Coord(obstacleVertics[i - 6], obstacleVertics[i - 5]) : new Coord(obstacleVertics[i + 2], obstacleVertics[i + 3]);
            if (KeyPress.get('i') && (i + 2) % 8 !== 0) console.log(i, aPos, bPos);
            if (aPos.sub(lightPos).length() > radius || bPos.sub(lightPos).length() > radius) { continue; }
            const aVector = aPos.sub(lightPos).normalize();
            const bVector = bPos.sub(lightPos).normalize();
            const aCirclePos = lightPos.add(aVector.mult(radius));
            const bcirclePos = lightPos.add(bVector.mult(radius));
            const aVectorVertical = aVector.rotate(-Math.PI / 2);
            const bVectorVertical = bVector.rotate(Math.PI / 2);
            const intersectLength = Math.abs(aCirclePos.sub(bcirclePos).x / (bVectorVertical.x - aVectorVertical.x));
            const intersectPos = aCirclePos.add(aVectorVertical.mult(intersectLength));
            if (KeyPress.get('l')) console.log(aVector, aCirclePos, lightPos, radius);
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

                // aCirclePos.x, aCirclePos.y,
                // bcirclePos.x, bcirclePos.y,
                // aPos.x, aPos.y,

                // aPos.x, aPos.y,
                // bcirclePos.x, bcirclePos.y,
                // bPos.x, bPos.y,

            ])
        }

        if (KeyPress.get('o')) console.log(vertices);
        this.shadowMesh.drawWithBuffer(vertices, [
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height] },
            { name: 'u_translation', data: [offset.x, offset.y] }
        ])
    }

}

export default Shadow;
