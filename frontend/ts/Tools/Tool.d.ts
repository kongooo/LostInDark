interface Coord {
    x: number;
    y: number;
}
interface FrameBufferInfo {
    renderFrameBuffer: WebGLFramebuffer;
    textureFrameBuffer: WebGLFramebuffer;
    targetTexture: WebGLTexture;
}
declare class CoordUtils {
    static add: (aPos: Coord, bPos: Coord | number) => {
        x: number;
        y: number;
    };
    static sub: (aPos: Coord, bPos: Coord | number) => {
        x: number;
        y: number;
    };
    static division: (aPos: Coord, bPos: Coord | number) => {
        x: number;
        y: number;
    };
    static mult: (aPos: Coord, bPos: Coord | number) => {
        x: number;
        y: number;
    };
    static len: (pos: Coord) => number;
    /**
     *
     * @param pos
     * @returns 返回一个向量的单位向量
     */
    static normalize: (pos: Coord) => {
        x: number;
        y: number;
    };
    /**
     *
     * @param vector 旋转向量
     * @param theta 旋转角度
     * @returns 顺时针旋转theta角度后的向量
     */
    static rotate: (vector: Coord, theta: number) => {
        x: number;
        y: number;
    };
    /**
     *
     * @param aVector
     * @param bVector
     * @returns 计算a、b向量之间的夹角
     */
    static angle: (aVector: Coord, bVector: Coord) => number;
    static dot: (aVector: Coord, bVector: Coord) => number;
    static calTheta: (vector: Coord) => number;
    static calDistance: (aPos: Coord, bPos: Coord) => number;
    static calPointToLineDis: (point: Coord, aPos: Coord, bPos: Coord) => number;
    static calLineIntersection: (aPos: Coord, aVector: Coord, bPos: Coord, bVector: Coord) => {
        x: number;
        y: number;
    };
    static calCircleLinePos: (circlePos: Coord, radius: number, aPos: Coord, bPos: Coord) => {
        x: number;
        y: number;
    };
    /**
     *
     * @param vector
     * @returns 向量取反
     */
    static reverseVector: (vector: Coord) => {
        x: number;
        y: number;
    };
    /**
     *
     * @param circlePos 圆心坐标
     * @param point 圆外点坐标
     * @param radius 圆半径
     * @returns 过point对圆的两条切线，单位向量方向圆心朝外
     */
    static calCircleTangent: (circlePos: Coord, point: Coord, radius: number) => {
        leftVector: {
            x: number;
            y: number;
        };
        rightVector: {
            x: number;
            y: number;
        };
    };
    static equal: (a: Coord, b: Coord) => boolean;
    /**
     *
     * @param aVector
     * @param bVector
     * @returns 向量叉积
     */
    static cross: (aVector: Coord, bVector: Coord) => number;
    static flipXY: (vector: Coord) => {
        x: number;
        y: number;
    };
    static absolute: (vector: Coord) => {
        x: number;
        y: number;
    };
}
declare const clamp: (num: number, min: number, max: number) => number;
declare const lerp: (a: number, b: number, t: number) => number;
declare const getDir: (a: number) => 1 | -1 | 0;
declare const swap: (a: Coord, b: Coord) => void;
declare const randomInt: (min: number, max: number) => number;
export { Coord, CoordUtils, FrameBufferInfo, clamp, lerp, getDir, swap, randomInt };
