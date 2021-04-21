declare class ItemVertex {
    static getCubeVertices: (xLength: number, yLength: number, zLength: number) => number[];
    static cubeIndices: number[];
    static getSquareVertices: (width: number, height: number) => number[];
    static squareIndices: number[];
}
export { ItemVertex };
