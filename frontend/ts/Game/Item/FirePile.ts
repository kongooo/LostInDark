import { Coord } from "../../Tools/Tool";
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


const WOOD_HEIGHT = 0.3;
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