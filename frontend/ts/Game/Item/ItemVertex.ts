const fireDis = 0.1;

class ItemVertex {
    static getCubeVertices = (xLength: number, yLength: number, zLength: number) => [
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
        0, 0, zLength, 1, 1, 0, -1, 0]

    static cubeIndices = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
    ]

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
