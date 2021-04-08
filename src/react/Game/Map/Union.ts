import { CoordUtils, Coord } from "../../Tools/Tool";

interface Grid {
    pos: Coord;
    leftUseful: boolean;
    rightUseful: boolean;
    upUseful: boolean;
    downUseful: boolean;
}

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
class Union {
    private noise: any;
    private mapCount: Coord;
    private obstacleBlocks: Array<Set<number>>;
    lineVertices: Array<Coord>;
    //index 与pos的映射
    private gridsMap: Map<number, number>;
    private grids: Array<Grid>;
    private traversedSet: Set<number>;
    private toTraverseQueue: Array<Grid>;
    private startPos: Coord;
    private threshold: number;
    private zoom: number;

    constructor(noise: any, mapCount: Coord, threshod: number, zoom: number) {
        this.noise = noise;
        this.mapCount = mapCount;
        this.threshold = threshod;
        this.zoom = zoom;
    }

    /**
     * 初始化Union数据
     */
    init = (startPos: Coord) => {
        this.obstacleBlocks = [];
        this.lineVertices = [];
        this.startPos = startPos;
    }

    /**
     * 
     * @param x 为坐标x,y的障碍物设置属于的Block
     * @param y 
     * @param startPos 
     */
    setBlock = (x: number, y: number) => {
        const xHas =
            x > 0 && this.isObstacle({ x: x - 1, y });
        const yHas =
            y > 0 && this.isObstacle({ x, y: y - 1 })
        if (xHas && yHas) {
            let xBlockIndex = this.getBlockIndex({ x: x - 1, y });
            let yBlockIndex = this.getBlockIndex({ x, y: y - 1 });
            if (xBlockIndex === yBlockIndex)
                this.addToBlockIndex({ x, y }, xBlockIndex);
            else {
                const index = this.unionBlock(xBlockIndex, yBlockIndex);
                this.addToBlockIndex({ x, y }, index);
            }
        } else if (xHas) {
            let xBlockIndex = this.getBlockIndex({ x: x - 1, y });
            this.addToBlockIndex({ x, y }, xBlockIndex);
        } else if (yHas) {
            let yBlockIndex = this.getBlockIndex({ x, y: y - 1 });
            this.addToBlockIndex({ x, y }, yBlockIndex);
        } else {
            this.addToBlock({ x, y });
        }
    }

    /**
     * 绘制所有block的外边框
     */
    getBlocksLine = () => {
        for (let i = 0; i < this.obstacleBlocks.length; i++) {
            this.gridsMap = new Map();
            this.grids = Array.from(this.obstacleBlocks[i]).map((num, index) => {
                this.gridsMap.set(num, index);
                return {
                    pos: this.NumberToCoord(num),
                    leftUseful: true,
                    rightUseful: true,
                    upUseful: true,
                    downUseful: true,
                };
            });
            this.drawBlockLine();
        }
        return this.lineVertices;
    };

    /**
     * 绘制当前block包含的所有格子的外边框
     */
    private drawBlockLine = () => {
        this.traversedSet = new Set();
        this.toTraverseQueue = [];

        for (let i = 0; i < this.grids.length; i++) {
            //根据格子周围障碍物来更新当前格子状态
            this.updateGridStateWithObstacle(this.grids[i]);
            if (this.traversedSet.has(this.CoordToNumber(this.grids[i].pos))) {
                continue;
            }

            this.toTraverseQueue.push(this.grids[i]);

            while (this.toTraverseQueue.length > 0) {
                const grid = this.toTraverseQueue.shift();

                //下边
                if (grid.downUseful) {
                    this.getLineVertices(
                        grid,
                        { x: -1, y: 0 },
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 0 },
                        -1
                    );
                }

                //上边
                if (grid.upUseful) {
                    this.getLineVertices(
                        grid,
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: -1, y: 0 },
                        { x: 0, y: 1 },
                        1
                    );
                }

                //右边
                if (grid.rightUseful) {
                    this.getLineVertices(
                        grid,
                        { x: 0, y: -1 },
                        { x: 1, y: 0 },
                        { x: 0, y: 1 },
                        { x: 1, y: 1 },
                        1
                    );
                }

                //左边
                if (grid.leftUseful) {
                    this.getLineVertices(
                        grid,
                        { x: 0, y: 1 },
                        { x: 0, y: 1 },
                        { x: 0, y: -1 },
                        { x: 0, y: 0 },
                        -1
                    );
                }
            }
        }
    };

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
    private getLineVertices = (
        grid: Grid,
        aDir: Coord,
        aGridDir: Coord,
        bDir: Coord,
        bGridDir: Coord,
        edge: number
    ) => {
        const posA = this.travelWithEdgeAndDir(grid, aDir, edge);
        if (!posA) return;
        const posAGrid = CoordUtils.sub(posA, aGridDir);

        if (
            !CoordUtils.equal(grid.pos, posAGrid) &&
            !this.traversedSet.has(this.CoordToNumber(posAGrid)) &&
            this.grids[this.gridsMap.get(this.CoordToNumber(posAGrid))]
        ) {
            this.toTraverseQueue.push(
                this.grids[this.gridsMap.get(this.CoordToNumber(posAGrid))]
            );

        }

        const posB = this.travelWithEdgeAndDir(grid, bDir, edge);
        if (!posB) return;
        const posBGrid = CoordUtils.sub(posB, bGridDir);

        if (
            !CoordUtils.equal(grid.pos, posBGrid) &&
            !this.traversedSet.has(this.CoordToNumber(posBGrid)) &&
            this.grids[this.gridsMap.get(this.CoordToNumber(posBGrid))]
        ) {
            this.toTraverseQueue.push(
                this.grids[this.gridsMap.get(this.CoordToNumber(posBGrid))]
            );

        }

        this.lineVertices.push(...[this.localToWorldPos(posA), this.localToWorldPos(posB)]);
    };

    /**
     *
     * @param grid
     * @param dir
     * @param edge 上1下-1，右1左-1
     * @returns 从grid开始，朝着dir方向，从edge边开始取得最大长度，并且实时更新遍历到的grid的状态
     */
    private travelWithEdgeAndDir = (grid: Grid, dir: Coord, edge: number) => {
        let startPos = CoordUtils.add(grid.pos, this.getStartPosOffset(dir, edge));
        let count = 1;
        const obstacleDir = CoordUtils.mult(
            CoordUtils.absolute(CoordUtils.flipXY(dir)),
            edge
        );
        let offset = CoordUtils.mult(dir, count);
        let offsetObstacle = CoordUtils.add(offset, obstacleDir);
        let nearObstaclePos = CoordUtils.add(grid.pos, offset);
        let curGridPos = CoordUtils.add(grid.pos, offset);
        while (
            curGridPos.x >= 0 &&
            curGridPos.x < this.mapCount.x &&
            curGridPos.y >= 0 &&
            curGridPos.y < this.mapCount.y &&
            this.isObstacle(nearObstaclePos) &&
            !this.isObstacle(CoordUtils.add(grid.pos, offsetObstacle))
        ) {
            curGridPos = CoordUtils.add(grid.pos, offset);
            const curGridIndex = this.gridsMap.get(this.CoordToNumber(curGridPos));
            if (!curGridIndex) {
                return null;
            }
            const curGrid = this.grids[curGridIndex];

            this.updateGridStateWithTraverse(curGrid, dir, edge);

            count++;
            offset = CoordUtils.mult(dir, count);
            offsetObstacle = CoordUtils.add(offset, obstacleDir);
            nearObstaclePos = CoordUtils.add(grid.pos, offset);
        }

        this.updateGridStateWithTraverse(grid, dir, edge);
        let endPos = CoordUtils.add(startPos, offset);
        return endPos;
    };

    /**
     *
     * @param grid
     * 通过四周是否有障碍物来更新grid的状态
     */
    private updateGridStateWithObstacle = (grid: Grid) => {
        if (this.isObstacle(CoordUtils.add(grid.pos, { x: 0, y: -1 })))
            grid.downUseful = false;
        if (this.isObstacle(CoordUtils.add(grid.pos, { x: 0, y: 1 })))
            grid.upUseful = false;
        if (this.isObstacle(CoordUtils.add(grid.pos, { x: 1, y: 0 })))
            grid.rightUseful = false;
        if (this.isObstacle(CoordUtils.add(grid.pos, { x: -1, y: 0 })))
            grid.leftUseful = false;
        this.addToTraversedSet(grid);
    };

    /**
     *
     * @param grid
     * @param dir
     * @param edge
     *  将遍历过的边标记为不可用
     */
    private updateGridStateWithTraverse = (
        grid: Grid,
        dir: Coord,
        edge: number
    ) => {
        this.updateGridStateWithObstacle(grid);
        if (dir.x === 0 && edge === 1) grid.rightUseful = false;
        if (dir.x === 0 && edge === -1) grid.leftUseful = false;
        if (dir.y === 0 && edge === 1) grid.upUseful = false;
        if (dir.y === 0 && edge === -1) grid.downUseful = false;

        this.addToTraversedSet(grid);
    };

    /**
     *
     * @param grid
     * 判断当前grid四个边是否还可用，若不可用加入已遍历过集合
     */
    private addToTraversedSet = (grid: Grid) => {
        if (
            !grid.rightUseful &&
            !grid.leftUseful &&
            !grid.upUseful &&
            !grid.downUseful
        ) {
            this.traversedSet.add(this.CoordToNumber(grid.pos));
        }
    };

    /**
     *
     * @param dir 方向
     * @param edge -1下1上，-1左1右
     * @returns 得到起始点到Grid坐标的偏移
     */
    private getStartPosOffset = (dir: Coord, edge: number) => {
        if (dir.y === 0) {
            if (dir.x === 1) {
                if (edge === 1) return { x: 0, y: 1 };
                else return { x: 0, y: 0 };
            } else {
                if (edge === 1) return { x: 1, y: 1 };
                else return { x: 1, y: 0 };
            }
        } else if (dir.x === 0) {
            if (dir.y === 1) {
                if (edge === 1) return { x: 1, y: 0 };
                else return { x: 0, y: 0 };
            } else {
                if (edge === 1) return { x: 1, y: 1 };
                else return { x: 0, y: 1 };
            }
        }
    };

    //判断该pos是否有障碍物
    isObstacle = (pos: Coord) => {
        if (
            pos.x < 0 ||
            pos.x >= this.mapCount.x ||
            pos.y < 0 ||
            pos.y >= this.mapCount.y
        )
            return false;
        return this.obstacled(pos);
    };

    /**
     *
     * @param pos
     * @returns 找到该pos所在的block，没有则返回null
     */
    getBlockIndex = (pos: Coord) => {
        const num = this.CoordToNumber(pos);
        for (let i = 0; i < this.obstacleBlocks.length; i++) {
            if (this.obstacleBlocks[i].has(num)) {
                return i;
            }
        }
        return null;
    };

    /**
     *
     * @param pos
     * 将pos加入新建的block
     */
    addToBlock = (pos: Coord) => {
        const num = this.CoordToNumber(pos);
        let set: Set<number> = new Set();
        set.add(num);
        this.obstacleBlocks.push(set);
        return this.obstacleBlocks.length - 1;
    };

    addToBlockIndex = (pos: Coord, index: number) => {
        const num = this.CoordToNumber(pos);
        if (this.obstacleBlocks[index]) {
            this.obstacleBlocks[index].add(num);
            return;
        }
    };

    unionBlock = (index1: number, index2: number) => {
        const min = Math.min(index1, index2);
        const max = Math.max(index1, index2);
        this.obstacleBlocks[max].forEach((value) => {
            this.obstacleBlocks[min].add(value);
        });
        this.obstacleBlocks.splice(max, 1);
        return min;
    };

    CoordToNumber = (pos: Coord) => {
        if (!pos) return null;
        return pos.x * this.mapCount.y + pos.y;
    };

    NumberToCoord = (num: number) => {
        let x = Math.floor(num / this.mapCount.y);
        let y = num % this.mapCount.y;
        if (x >= this.mapCount.x) {
            x = this.mapCount.x - 1;
            y = num - x * this.mapCount.y;
        }
        return { x, y };
    };

    //判断该点坐标是否为障碍物
    obstacled = (pos: Coord) => {
        //将0，size+2映射回-1，size+1后映射回世界坐标后用noise取值
        const worldPos = this.localToWorldPos(pos);
        return this.noise.get(worldPos.x / this.zoom, worldPos.y / this.zoom) > this.threshold;
    }

    localToWorldPos = (pos: Coord) => CoordUtils.add(CoordUtils.sub(pos, 1), this.startPos);
}

export default Union;
