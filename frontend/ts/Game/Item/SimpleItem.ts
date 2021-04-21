import { Coord } from "../../Tools/Tool";
import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { ImgType, ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';

import itemVsSource from '../../../shaders/ItemShader/vsSource.glsl';
import itemFsSource from '../../../shaders/ItemShader/fsSource.glsl';
import { WebGL } from '../../Tools/WebGLUtils';
import { mat4 } from "gl-matrix";
import { ItemVertex } from "./ItemVertex";

const MATCH_WIDTH = 0.05;
const MATCH_HEIGHT = 0.6;

const WOOD_WITDH = 0.2;
const WOOD_HEIGHT = 0.7;

const POWDER_BOX_X = 0.5;
const POWDER_BOX_Y = 0.3;
const POWDER_BOX_Z = 0.8;

class SimpleItem implements ItemInfo {
    pos: Coord;
    type: ItemType;
    move: boolean;
    private mesh: StaticMesh;
    private textureUp: WebGLTexture;
    private textureSide: WebGLTexture;
    private textureFront: WebGLTexture;
    private rotateMatrix: mat4;

    constructor(gl: WebGL2RenderingContext, item: ItemInfo) {
        this.type = item.type;
        this.pos = item.pos;
        this.mesh = new StaticMesh(gl, itemVsSource, itemFsSource);
        this.mesh.getAttributeLocations([
            { name: 'a_position', size: 3 },
            { name: 'a_texCoord', size: 2 },
            { name: 'a_normal', size: 3 }
        ]);
        let vertices, indices;
        switch (item.type) {
            case ItemType.match:
                this.move = true;
                vertices = ItemVertex.getCubeVertices(MATCH_WIDTH, MATCH_WIDTH, MATCH_HEIGHT);
                indices = ItemVertex.cubeIndices;
                break;
            case ItemType.wood:
                this.move = true;
                vertices = ItemVertex.getCubeVertices(WOOD_WITDH, WOOD_WITDH, WOOD_HEIGHT);
                indices = ItemVertex.cubeIndices;
                break;
            case ItemType.powderBox:
                this.move = true;
                vertices = ItemVertex.getCubeVertices(POWDER_BOX_X, POWDER_BOX_Y, POWDER_BOX_Z);
                indices = ItemVertex.cubeIndices;
                break;
        }

        this.mesh.getVAO(vertices, indices);
        this.textureUp = WebGL.getTexture(gl, item.img[0]);
        this.textureFront = WebGL.getTexture(gl, item.img[1]);
        this.textureSide = WebGL.getTexture(gl, item.img[2]);
        const rotateMatrix = mat4.create();
        mat4.identity(rotateMatrix);
        mat4.rotateY(rotateMatrix, rotateMatrix, 45 * Math.PI / 180);
        this.rotateMatrix = rotateMatrix;
    }

    draw(defaultUniforms: Array<UniformLocationObj>) {
        this.mesh.drawWithAVO([
            { name: 'u_worldPos', data: [this.pos.x, this.pos.y], type: 'vec2' },
            { name: 'u_image_up', data: [0], type: 'texture', texture: this.textureUp },
            { name: 'u_image_front', data: [1], type: 'texture', texture: this.textureFront },
            { name: 'u_image_side', data: [2], type: 'texture', texture: this.textureSide },
            { name: 'u_rotateMatrix', data: this.rotateMatrix, type: 'matrix' },
            ...defaultUniforms
        ])
    }
}

export { SimpleItem };