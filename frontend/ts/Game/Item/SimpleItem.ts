import { Coord } from "../../Tools/Tool";
import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { ImgType, ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';

import itemVsSource from '../../../shaders/ItemShader/vsSource.glsl';
import itemFsSource from '../../../shaders/ItemShader/fsSource.glsl';
import { WebGL } from '../../Tools/WebGLUtils';
import { mat4 } from "gl-matrix";

const MATCH_WIDTH = 0.05;
const MATCH_HEIGHT = 0.6;

const WOOD_WITDH = 0.2;
const WOOD_HEIGHT = 0.7;

const POWDER_X = 0.5;
const POWDER_Y = 0.3;
const POWDER_Z = 0.8;

class SimpleItem implements ItemInfo {
    pos: Coord;
    type: ItemType;
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
        let xLength, yLength, zLength;
        switch (item.type) {
            case ItemType.match:
                xLength = MATCH_WIDTH;
                yLength = MATCH_WIDTH;
                zLength = MATCH_HEIGHT;
                break;
            case ItemType.wood:
                xLength = WOOD_WITDH;
                yLength = WOOD_WITDH;
                zLength = WOOD_HEIGHT;
                break;
            case ItemType.powderBox:
                xLength = POWDER_X;
                yLength = POWDER_Y;
                zLength = POWDER_Z;
                break;
        }

        this.mesh.getVAO([
            //back
            0, 0, 0, 0, 0, 0, 0, -1,
            0, yLength, 0, 0, 1, 0, 0, -1,
            xLength, yLength, 0, 1, 1, 0, 0, -1,
            xLength, 0, 0, 1, 0, 0, 0, -1,

            //right
            xLength, 0, 0, 1, 1, 1, 0, 0,
            xLength, yLength, 0, 0, 1, 1, 0, 0,
            xLength, yLength, zLength, 0, 0, 1, 0, 0,
            xLength, 0, zLength, 1, 0, 1, 0, 0,

            //front
            0, 0, zLength, 0, 0, 0, 0, 1,
            xLength, 0, zLength, 1, 0, 0, 0, 1,
            xLength, yLength, zLength, 1, 1, 0, 0, 1,
            0, yLength, zLength, 0, 1, 0, 0, 1,

            //left
            0, 0, 0, 0, 1, -1, 0, 0,
            0, 0, zLength, 0, 0, -1, 0, 0,
            0, yLength, zLength, 1, 0, -1, 0, 0,
            0, yLength, 0, 1, 1, -1, 0, 0,

            //up
            0, yLength, 0, 0, 1, 0, 1, 0,
            0, yLength, zLength, 0, 0, 0, 1, 0,
            xLength, yLength, zLength, 1, 0, 0, 1, 0,
            xLength, yLength, 0, 1, 1, 0, 1, 0,

            //down
            0, 0, 0, 0, 1, 0, -1, 0,
            xLength, 0, zLength, 0, 0, 0, -1, 0,
            xLength, 0, zLength, 1, 0, 0, -1, 0,
            0, 0, zLength, 1, 1, 0, -1, 0,
        ], [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ]);
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