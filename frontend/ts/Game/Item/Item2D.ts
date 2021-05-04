import { Coord } from "../../Tools/Tool";
import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';

import powderVsSource from '../../../shaders/PowderShader/vsSource.glsl';
import powderFsSource from '../../../shaders/PowderShader/fsSource.glsl';
import wireVsSource from '../../../shaders/WireShader/vsSource.glsl';
import wireFsSource from '../../../shaders/WireShader/fsSource.glsl';
import { ItemVertex } from "./ItemVertex";
import { WebGL } from "../../Tools/WebGLUtils";

class Item2D implements ItemInfo {
    pos: Coord;
    type: ItemType;
    move: boolean;
    private mesh: StaticMesh;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, itemInfo: ItemInfo, light: boolean, move = true) {
        this.type = itemInfo.type;
        this.pos = itemInfo.pos;
        if (light) {
            this.mesh = new StaticMesh(gl, wireVsSource, wireFsSource);
            this.mesh.getAttributeLocations([
                { name: 'a_position', size: 2 },
                { name: 'a_texCoord', size: 2 },
            ]);

            this.mesh.getVAO(ItemVertex.getSquareVertices(0.5, 0.5), ItemVertex.squareIndices);
        } else {
            this.mesh = new StaticMesh(gl, powderVsSource, powderFsSource);
            this.mesh.getAttributeLocations([
                { name: 'a_position', size: 2 },
                { name: 'a_texCoord', size: 2 },
            ]);

            this.mesh.getVAO(ItemVertex.getSquareVertices(1, 1), ItemVertex.squareIndices);
        }

        this.texture = WebGL.getTexture(gl, itemInfo.img[0]);
        this.move = move;
    }

    draw(defaultUniforms: Array<UniformLocationObj>) {
        this.mesh.drawWithAVO([
            { name: 'u_worldPos', data: [this.pos.x, this.pos.y], type: 'vec2' },
            { name: 'u_image', data: [0], type: 'texture', texture: this.texture },
            ...defaultUniforms
        ])
    }
}

export { Item2D };