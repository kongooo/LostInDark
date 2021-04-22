import { Coord, CoordUtils } from "../../Tools/Tool";
import VaryMesh from '../../Tools/Mesh/VaryMesh';
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';

import fireVsSource from '../../../shaders/FirePileShader/vsSource.glsl';
import fireFsSource from '../../../shaders/FirePileShader/fsSource.glsl';
import itemVsSource from '../../../shaders/ItemShader/vsSource.glsl';
import itemFsSource from '../../../shaders/ItemShader/fsSource.glsl';
import { ItemVertex } from "./ItemVertex";
import { WebGL } from "../../Tools/WebGLUtils";
import StaticMesh from "../../Tools/Mesh/StaticMesh";
import { mat4 } from "gl-matrix";
import SoftShadow from "../Light/SoftShadow";
import Light from "../Light/light";


const WOOD_HEIGHT = 0.3;
const FIRE_LIGHT_RADIUS = 20;
const FIRE_COLOR = [254, 254, 204];

class FirePile implements ItemInfo {
    pos: Coord;
    type: ItemType;
    move: boolean;
    private gl: WebGL2RenderingContext;
    private woodMesh: StaticMesh;
    private fireMesh: VaryMesh;
    private woodTexture: WebGLTexture;
    private fireTexture: WebGLTexture;
    private rotateMatrix;
    shadowTexture: WebGLTexture;
    light: Light;
    lightColor: Array<number> = FIRE_COLOR;

    constructor(gl: WebGL2RenderingContext, itemInfo: ItemInfo) {
        this.type = itemInfo.type;
        this.pos = itemInfo.pos;
        this.gl = gl;
        this.fireMesh = new VaryMesh(gl, fireVsSource, fireFsSource);
        this.fireMesh.getAttributeLocations([
            { name: 'a_position', size: 3 },
            { name: 'a_texCoord', size: 2 },
        ]);
        this.fireMesh.getBuffer();

        this.woodMesh = new StaticMesh(gl, itemVsSource, itemFsSource);
        this.woodMesh.getAttributeLocations([
            { name: 'a_position', size: 3 },
            { name: 'a_texCoord', size: 2 },
            { name: 'a_normal', size: 3 }
        ])
        this.woodMesh.getVAO(ItemVertex.getCubeVertices(1, WOOD_HEIGHT, 1), ItemVertex.cubeIndices);

        this.woodTexture = WebGL.getTexture(gl, itemInfo.img[0]);
        this.fireTexture = WebGL.getTexture(gl, itemInfo.img[1]);
        const rotateMatrix = mat4.create();
        mat4.identity(rotateMatrix);
        mat4.rotateY(rotateMatrix, rotateMatrix, 0);
        this.rotateMatrix = rotateMatrix;
    }

    getShadowTexture = (mapLines: Array<Coord>) => {
        //generate shadow texture
        const gl = this.gl;
        const shadow = new SoftShadow(gl);
        const { textureFrameBuffer } = shadow.fBufferInfo;

        gl.enable(gl.BLEND);
        //1 - 遮挡率 = 亮度
        gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.disable(gl.CULL_FACE);

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);
        gl.disable(gl.DEPTH_TEST);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        shadow.drawSoftShadow(mapLines, this.pos, 0.44, FIRE_LIGHT_RADIUS, [
            { name: 'u_resolution', data: [FIRE_LIGHT_RADIUS * 2, FIRE_LIGHT_RADIUS * 2], type: 'vec2' },
            { name: 'u_cameraWorldPos', data: [this.pos.x - FIRE_LIGHT_RADIUS + 0.5, this.pos.y - FIRE_LIGHT_RADIUS + 0.5], type: 'vec2' }
        ])
        this.shadowTexture = shadow.fBufferInfo.targetTexture;
        this.light = new Light(gl, FIRE_LIGHT_RADIUS, FIRE_COLOR);

        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }


    draw(defaultUniforms: Array<UniformLocationObj>, fireFrame: number) {
        this.woodMesh.drawWithAVO([
            { name: 'u_worldPos', data: [this.pos.x, this.pos.y], type: 'vec2' },
            { name: 'u_image_up', data: [0], type: 'texture', texture: this.woodTexture },
            { name: 'u_image_front', data: [1], type: 'texture', texture: this.woodTexture },
            { name: 'u_image_side', data: [2], type: 'texture', texture: this.woodTexture },
            { name: 'u_rotateMatrix', data: this.rotateMatrix, type: 'matrix' },
            ...defaultUniforms
        ])

        this.gl.disable(this.gl.CULL_FACE);
        this.fireMesh.drawWithBuffer(ItemVertex.getFirePileVertex(WOOD_HEIGHT, fireFrame), [
            { name: 'u_worldPos', data: [this.pos.x, this.pos.y], type: 'vec2' },
            { name: 'u_image_fire', data: [0], type: 'texture', texture: this.fireTexture },
            ...defaultUniforms
        ], ItemVertex.fireIndices);
        this.gl.enable(this.gl.CULL_FACE);
    }
}

export { FirePile };