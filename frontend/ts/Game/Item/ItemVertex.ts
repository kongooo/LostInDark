import { Coord } from "../../Tools/Tool";

const fireDis = 0.1;

class ItemVertex {
    static getCubeVertices = (xLength: number, yLength: number, zLength: number, startPos: Coord = { x: 0, y: 0 }, height: number = 0) => [
        //back
        startPos.x, height, startPos.y, 0, 0, 0, 0, -1,
        startPos.x, height + yLength, startPos.y, 0, 1, 0, 0, -1,
        startPos.x + xLength, height + yLength, startPos.y, 1, 1, 0, 0, -1,
        startPos.x + xLength, height, startPos.y, 1, 0, 0, 0, -1,

        //right
        startPos.x + xLength, height, startPos.y, 1, 1, 1, 0, 0,
        startPos.x + xLength, height + yLength, startPos.y, 0, 1, 1, 0, 0,
        startPos.x + xLength, height + yLength, startPos.y + zLength, 0, 0, 1, 0, 0,
        startPos.x + xLength, height, startPos.y + zLength, 1, 0, 1, 0, 0,

        //front
        startPos.x, height, startPos.y + zLength, 0, 0, 0, 0, 1,
        startPos.x + xLength, height, startPos.y + zLength, 1, 0, 0, 0, 1,
        startPos.x + xLength, height + yLength, startPos.y + zLength, 1, 1, 0, 0, 1,
        startPos.x, height + yLength, startPos.y + zLength, 0, 1, 0, 0, 1,

        //left
        startPos.x, height, startPos.y, 0, 1, -1, 0, 0,
        startPos.x, height, startPos.y + zLength, 0, 0, -1, 0, 0,
        startPos.x, height + yLength, startPos.y + zLength, 1, 0, -1, 0, 0,
        startPos.x, height + yLength, startPos.y, 1, 1, -1, 0, 0,

        //up
        startPos.x, height + yLength, startPos.y, 0, 1, 0, 1, 0,
        startPos.x, height + yLength, startPos.y + zLength, 0, 0, 0, 1, 0,
        startPos.x + xLength, height + yLength, startPos.y + zLength, 1, 0, 0, 1, 0,
        startPos.x + xLength, height + yLength, startPos.y, 1, 1, 0, 1, 0
    ]

    static getFoodVertices = (xLength: number, yLength: number, zLength: number, startPos: Coord = { x: 0, y: 0 }, height: number = 0) => [
        //back
        startPos.x, height, startPos.y, 0, 0, 0, 0, -1,
        startPos.x, height + yLength, startPos.y, 0, 1, 0, 0, -1,
        startPos.x + xLength, height + yLength, startPos.y, 1, 1, 0, 0, -1,
        startPos.x + xLength, height, startPos.y, 1, 0, 0, 0, -1,

        //right
        startPos.x + xLength, height, startPos.y, 1, 0, 1, 0, 0,
        startPos.x + xLength, height + yLength, startPos.y, 1, 1, 1, 0, 0,
        startPos.x + xLength, height + yLength, startPos.y + zLength, 0, 1, 1, 0, 0,
        startPos.x + xLength, height, startPos.y + zLength, 0, 0, 1, 0, 0,

        //front
        startPos.x, height, startPos.y + zLength, 0, 0, 0, 0, 1,
        startPos.x + xLength, height, startPos.y + zLength, 1, 0, 0, 0, 1,
        startPos.x + xLength, height + yLength, startPos.y + zLength, 1, 1, 0, 0, 1,
        startPos.x, height + yLength, startPos.y + zLength, 0, 1, 0, 0, 1,

        //left
        startPos.x, height, startPos.y, 0, 0, -1, 0, 0,
        startPos.x, height, startPos.y + zLength, 1, 0, -1, 0, 0,
        startPos.x, height + yLength, startPos.y + zLength, 1, 1, -1, 0, 0,
        startPos.x, height + yLength, startPos.y, 0, 1, -1, 0, 0,

        //up
        startPos.x, height + yLength, startPos.y, 0, 1, 0, 1, 0,
        startPos.x, height + yLength, startPos.y + zLength, 0, 0, 0, 1, 0,
        startPos.x + xLength, height + yLength, startPos.y + zLength, 1, 0, 0, 1, 0,
        startPos.x + xLength, height + yLength, startPos.y, 1, 1, 0, 1, 0
    ]

    static cubeIndices = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
    ]

    static getCubeIndices = (index: number) => ItemVertex.cubeIndices.map(i => i + index * 20)

    static getCubeIndicesByCount = (count: number) => {
        let indices = [], i = 0;
        while (i < count) {
            indices.push(...ItemVertex.getCubeIndices(i));
            i++;
        }
        return indices;
    }

    static getSquareVertices = (width: number, height: number) => [
        0, 0, 0, 0,
        0, height, 0, 1,
        width, height, 1, 1,
        width, 0, 1, 0
    ]

    static getFirePileVertex = (height: number, fireFrame: number) => [

        //fire 
        0, height, 0, fireFrame * 0.25, 0,
        1, height, 1, (fireFrame + 1) * 0.25, 0,
        1, height + 1, 1, (fireFrame + 1) * 0.25, 1,
        0, height + 1, 0, fireFrame * 0.25, 1,

        1, height, 0, fireFrame * 0.25, 0,
        0, height, 1, (fireFrame + 1) * 0.25, 0,
        0, height + 1, 1, (fireFrame + 1) * 0.25, 1,
        1, height + 1, 0, fireFrame * 0.25, 1,
    ]

    static squareIndices = [0, 1, 2, 0, 2, 3];
    static fireIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7,];
}



export { ItemVertex };
