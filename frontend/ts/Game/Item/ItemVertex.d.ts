declare class ItemVertex {
    static getCubeVertices: (xLength: number, yLength: number, zLength: number) => number[];
    static cubeIndices: number[];
    static getSquareVertices: (width: number, height: number) => number[];
    static getFirePileVertex: (height: number, fireFrame: number) => number[];
    static squareIndices: number[];
    static fireIndices: number[];
}
export { ItemVertex };
