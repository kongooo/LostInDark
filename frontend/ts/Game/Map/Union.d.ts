import { Coord } from "../../Tools/Tool";
/**
 * dir：
 *      右：1，0
 *      左：-1，0
 *      上：0，1
 *      下：0，-1
 * edge：
 *      dir在x轴上时，1为上边，-1为下边
 *      dir在y轴上时，1为右边，-1为左边
 */
declare class Union {
    private noise;
    private mapCount;
    private obstacleBlocks;
    lineVertices: Array<Coord>;
    private gridsMap;
    private grids;
    private traversedSet;
    private toTraverseQueue;
    private startPos;
    private threshold;
    private zoom;
    private spreadSize;
    constructor(noise: any, mapCount: Coord, threshod: number, zoom: number, spreadSize: number);
    /**
     * 初始化Union数据
     */
    init: (startPos: Coord) => void;
    /**
     *
     * @param x 为坐标x,y的障碍物设置属于的Block
     * @param y
     * @param startPos
     */
    setBlock: (x: number, y: number) => void;
    /**
     * 绘制所有block的外边框
     */
    getBlocksLine: () => Coord[];
    /**
     * 绘制当前block包含的所有格子的外边框
     */
    private drawBlockLine;
    /**
     *
     * @param grid 当前格子
     * @param aDir a方向
     * @param aGridDir a方向对应的起点到格子pos的offset
     * @param bDir b方向
     * @param bGridDir b方向对应的起点到格子pos的offset
     * @param edge
     * 得到a方向到b方向的edge边的两端点
     */
    private getLineVertices;
    /**
     *
     * @param grid
     * @param dir
     * @param edge 上1下-1，右1左-1
     * @returns 从grid开始，朝着dir方向，从edge边开始取得最大长度，并且实时更新遍历到的grid的状态
     */
    private travelWithEdgeAndDir;
    /**
     *
     * @param grid
     * 通过四周是否有障碍物来更新grid的状态
     */
    private updateGridStateWithObstacle;
    /**
     *
     * @param grid
     * @param dir
     * @param edge
     *  将遍历过的边标记为不可用
     */
    private updateGridStateWithTraverse;
    /**
     *
     * @param grid
     * 判断当前grid四个边是否还可用，若不可用加入已遍历过集合
     */
    private addToTraversedSet;
    /**
     *
     * @param dir 方向
     * @param edge -1下1上，-1左1右
     * @returns 得到起始点到Grid坐标的偏移
     */
    private getStartPosOffset;
    isObstacle: (pos: Coord) => boolean;
    /**
     *
     * @param pos
     * @returns 找到该pos所在的block，没有则返回null
     */
    getBlockIndex: (pos: Coord) => number;
    /**
     *
     * @param pos
     * 将pos加入新建的block
     */
    addToBlock: (pos: Coord) => number;
    addToBlockIndex: (pos: Coord, index: number) => void;
    unionBlock: (index1: number, index2: number) => number;
    CoordToNumber: (pos: Coord) => number;
    NumberToCoord: (num: number) => {
        x: number;
        y: number;
    };
    obstacled: (pos: Coord) => boolean;
    localToWorldPos: (pos: Coord) => {
        x: number;
        y: number;
    };
}
export default Union;
