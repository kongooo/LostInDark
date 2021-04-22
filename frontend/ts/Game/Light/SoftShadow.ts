import shadowVsSource from '../../../shaders/SoftShadowShader/vsSource.glsl';
import shadowFsSource from '../../../shaders/SoftShadowShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';

import { WebGL } from '../../Tools/WebGLUtils';

import { Coord, CoordUtils, FrameBufferInfo, swap } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';

class SoftShadow {

    private shadowMesh: VaryMesh;
    private gl: WebGL2RenderingContext;
    fBufferInfo: FrameBufferInfo;

    constructor(gl: WebGL2RenderingContext) {
        const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        const shadowMesh = new VaryMesh(gl, shadowVsSource, shadowFsSource);
        shadowMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_ABposition', size: 4 },
            { name: 'a_situation', size: 1 }
        ]);

        shadowMesh.getBuffer();

        this.fBufferInfo = fBufferInfo;
        this.shadowMesh = shadowMesh;
        this.gl = gl;
    }

    drawSoftShadow = (lineVertics: Array<Coord>, lightPos: Coord, sLightRadius: number, bLightRadius: number, defaultUniform: Array<UniformLocationObj>) => {
        let vertices = [];

        for (let i = 0; i < lineVertics.length - 1; i += 2) {

            let A = lineVertics[i];
            let B = lineVertics[i + 1];

            if (CoordUtils.len(CoordUtils.sub(A, lightPos)) > bLightRadius && CoordUtils.len(CoordUtils.sub(B, lightPos)) > bLightRadius) continue;

            //如果B在A左边(相对于光源坐标)，则交换AB位置，保证A一直在B左边
            if (CoordUtils.cross(CoordUtils.sub(B, A), CoordUtils.sub(lightPos, A)) <= 0) {
                swap(A, B);
            }

            const Atangent = CoordUtils.calCircleTangent(lightPos, A, sLightRadius);
            const Btangent = CoordUtils.calCircleTangent(lightPos, B, sLightRadius);

            const ABvector = CoordUtils.normalize(CoordUtils.sub(B, A));
            const BAvector = CoordUtils.reverseVector(ABvector);

            const OKvector = CoordUtils.normalize(CoordUtils.rotate(ABvector, Math.PI / 2));

            //如果A在B上方
            if (CoordUtils.cross(BAvector, CoordUtils.reverseVector(Btangent.leftVector)) >= 0 && CoordUtils.cross(BAvector, CoordUtils.reverseVector(Btangent.rightVector)) <= 0) {

                const R = CoordUtils.add(A, CoordUtils.mult(ABvector, bLightRadius));
                const ASR = CoordUtils.calTheta(CoordUtils.reverseVector(OKvector)) - CoordUtils.calTheta(CoordUtils.reverseVector(Atangent.rightVector));
                const ATR = CoordUtils.calTheta(OKvector) - CoordUtils.calTheta(CoordUtils.reverseVector(Atangent.leftVector));
                const SR = Math.abs(bLightRadius / Math.tan(ASR));
                const TR = Math.abs(bLightRadius / Math.tan(ATR));
                const S = CoordUtils.add(R, CoordUtils.mult(OKvector, SR));
                const T = CoordUtils.add(R, CoordUtils.mult(CoordUtils.reverseVector(OKvector), TR));

                // console.log(SR, TR);

                vertices.push(...[
                    S.x, S.y, A.x, A.y, B.x, B.y, 1,
                    T.x, T.y, A.x, A.y, B.x, B.y, 1,
                    A.x, A.y, A.x, A.y, B.x, B.y, 1
                ])
            }
            //如果B在A上方
            else if (CoordUtils.cross(ABvector, CoordUtils.reverseVector(Atangent.rightVector)) <= 0 && CoordUtils.cross(ABvector, CoordUtils.reverseVector(Atangent.leftVector)) >= 0) {

                const R = CoordUtils.add(B, CoordUtils.mult(BAvector, bLightRadius));
                const BSR = Math.abs(CoordUtils.calTheta(OKvector) - CoordUtils.calTheta(CoordUtils.reverseVector(Btangent.rightVector)));
                const BTR = Math.abs(CoordUtils.calTheta(CoordUtils.reverseVector(OKvector)) - CoordUtils.calTheta(CoordUtils.reverseVector(Btangent.leftVector)));
                const SR = Math.abs(bLightRadius / Math.tan(BSR));
                const TR = Math.abs(bLightRadius / Math.tan(BTR));
                const S = CoordUtils.add(R, CoordUtils.mult(CoordUtils.reverseVector(OKvector), SR));
                const T = CoordUtils.add(R, CoordUtils.mult(OKvector, TR));

                vertices.push(...[
                    S.x, S.y, A.x, A.y, B.x, B.y, -1,
                    T.x, T.y, A.x, A.y, B.x, B.y, -1,
                    B.x, B.y, A.x, A.y, B.x, B.y, -1
                ])

            } else {

                const K = CoordUtils.add(lightPos, CoordUtils.mult(OKvector, bLightRadius));

                let ACD, BDC;

                if (ABvector.y === 0) {
                    if (ABvector.x === 1) {
                        ACD = CoordUtils.calTheta(CoordUtils.reverseVector(Atangent.rightVector));
                        BDC = Math.PI - CoordUtils.calTheta(CoordUtils.reverseVector(Btangent.leftVector));
                    } else {
                        ACD = CoordUtils.calTheta(Atangent.rightVector);
                        BDC = Math.PI - CoordUtils.calTheta(Btangent.leftVector);
                    }
                } else {
                    if (ABvector.y === 1) {
                        ACD = Math.PI / 2 + CoordUtils.calTheta(Atangent.rightVector);
                        BDC = Math.PI / 2 - CoordUtils.calTheta(Btangent.leftVector);
                    } else {
                        ACD = Math.PI / 2 + CoordUtils.calTheta(CoordUtils.reverseVector(Atangent.rightVector));
                        BDC = Math.PI / 2 - CoordUtils.calTheta(CoordUtils.reverseVector(Btangent.leftVector));
                    }
                }

                //计算C点坐标
                const KOF = ACD;
                const OQ = Math.cos(KOF) * sLightRadius;
                const QK = Math.abs(bLightRadius - OQ);
                const CK = Math.abs(QK / Math.tan(ACD));
                let C = CoordUtils.add(K, CoordUtils.mult(BAvector, CK));
                if (ACD > Math.PI / 2) {
                    C = CoordUtils.add(K, CoordUtils.mult(ABvector, CK));
                }

                //计算D点坐标
                const KOE = BDC;
                const OP = Math.cos(KOE) * sLightRadius;
                const PK = Math.abs(bLightRadius - OP);
                const DK = Math.abs(PK / Math.tan(BDC));
                let D = CoordUtils.add(K, CoordUtils.mult(ABvector, DK));
                if (BDC > Math.PI / 2) {
                    D = CoordUtils.add(K, CoordUtils.mult(BAvector, DK));
                }

                vertices.push(...[
                    C.x, C.y, A.x, A.y, B.x, B.y, 0,
                    D.x, D.y, A.x, A.y, B.x, B.y, 0,
                    A.x, A.y, A.x, A.y, B.x, B.y, 0,
                    A.x, A.y, A.x, A.y, B.x, B.y, 0,
                    D.x, D.y, A.x, A.y, B.x, B.y, 0,
                    B.x, B.y, A.x, A.y, B.x, B.y, 0
                ])
            }

        }
        this.gl.disable(this.gl.CULL_FACE);
        // console.log(vertices);
        this.shadowMesh.drawWithBuffer(vertices, [
            { name: 'u_lightPos', data: [lightPos.x, lightPos.y], type: 'vec2' },
            { name: 'u_lightSize', data: [sLightRadius], type: 'float' },
            ...defaultUniform
        ]);
        this.gl.enable(this.gl.CULL_FACE);
    }


}

export default SoftShadow;
