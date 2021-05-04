import { Coord } from "../../Tools/Tool";
declare class ItemVertex {
    static getCubeVertices: (xLength: number, yLength: number, zLength: number, startPos?: Coord, height?: number) => number[];
    static getFoodVertices: (xLength: number, yLength: number, zLength: number, startPos?: Coord, height?: number) => number[];
    static cubeIndices: number[];
    static getCubeIndices: (index: number) => number[];
    static getCubeIndicesByCount: (count: number) => number[];
    static getSquareVertices: (width: number, height: number) => number[];
    static getFirePileVertex: (height: number, fireFrame: number) => number[];
    static squareIndices: number[];
    static fireIndices: number[];
}
export { ItemVertex };
