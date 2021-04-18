import { Coord, CoordUtils, randomInt } from "../../Tools/Tool";
import { ImgType, ItemInfo, ItemType, UniformLocationObj } from "../../Tools/interface";
import PerlinMap from "../Map";
import { SimpleItem } from "./SimpleItem";

const MATCH_MIN_COUNT = 5;
const MATCH_MAX_COUNT = 10;
const WOOD_MIN_COUNT = 3;
const WOOD_MAX_COUNT = 10;
const POWDERBOX_MIN_COUNT = 2;
const POWDERBOX_MAX_COUNT = 10;

const CHUNCK_SIZE = 2;

class ItemManager {
    private static instance: ItemManager;

    private itemChuncks: Map<string, Map<string, ItemInfo>> = new Map();
    private map: PerlinMap;
    private gl: WebGL2RenderingContext;
    private imgs: Map<ImgType, HTMLImageElement>;
    private chunckSize: Coord;

    private constructor(gl: WebGL2RenderingContext, map: PerlinMap, imgs: Map<ImgType, HTMLImageElement>) {
        this.map = map;
        this.gl = gl;
        this.imgs = imgs;
        this.chunckSize = CoordUtils.mult(map.mapCount, CHUNCK_SIZE);
    }

    public static getInstance(gl: WebGL2RenderingContext, map: PerlinMap, imgs: Map<ImgType, HTMLImageElement>) {
        if (!ItemManager.instance) {
            ItemManager.instance = new ItemManager(gl, map, imgs);
        }
        return ItemManager.instance;
    }


    /**
     * 
     * @param chunckIndex 
     * @returns 随机出该chunck区域内的道具
     */
    private randomChunckItem = (chunckIndex: string) => {
        const map: Map<string, ItemInfo> = new Map();
        const [chunckX, chunckY] = chunckIndex.split(',').map(Number);
        const leftDownPos = CoordUtils.mult({ x: chunckX, y: chunckY }, this.chunckSize);
        const rightUpPos = CoordUtils.add(leftDownPos, this.chunckSize);

        let matchCount = randomInt(MATCH_MIN_COUNT, MATCH_MAX_COUNT);
        let woodCount = randomInt(WOOD_MIN_COUNT, WOOD_MAX_COUNT);
        let powderBoxCount = randomInt(POWDERBOX_MIN_COUNT, POWDERBOX_MAX_COUNT);

        this.randomItem(matchCount, map, leftDownPos, rightUpPos, ItemType.match, this.getMatchImgs());

        this.randomItem(woodCount, map, leftDownPos, rightUpPos, ItemType.wood, this.getWoodImgs());

        this.randomItem(powderBoxCount, map, leftDownPos, rightUpPos, ItemType.powderBox, this.getPowderBoxImgs());

        this.itemChuncks.set(chunckIndex, map);
        return map;
    }

    private getMatchImgs = () => [this.imgs.get(ImgType.matchUp), this.imgs.get(ImgType.matchFront), this.imgs.get(ImgType.matchFront)]
    private getWoodImgs = () => [this.imgs.get(ImgType.woodUp), this.imgs.get(ImgType.woodFront), this.imgs.get(ImgType.woodFront)];
    private getPowderBoxImgs = () => [this.imgs.get(ImgType.powderUp), this.imgs.get(ImgType.powderFront), this.imgs.get(ImgType.powderSide)];


    private randomItem = (count: number, map: Map<string, ItemInfo>, leftDownPos: Coord, rightUpPos: Coord, type: ItemType, imgs: Array<HTMLImageElement>) => {
        while (count--) {
            const randomX = randomInt(leftDownPos.x, rightUpPos.x);
            const randomY = randomInt(leftDownPos.y, rightUpPos.y);
            if (!this.map.obstacled(randomX, randomY)) {
                const item = new SimpleItem(this.gl, {
                    pos: { x: randomX, y: randomY },
                    type,
                    img: imgs
                });
                map.set(`${randomX},${randomY}`, item);
            }
        }
    }

    drawItems = (defaultUniform: Array<UniformLocationObj>) => {
        const mapPos = CoordUtils.floor(this.map.mapPos);
        const chunckPos = [
            mapPos,
            CoordUtils.add(mapPos, { x: this.map.mapCount.x, y: 0 }),
            CoordUtils.add(mapPos, { x: 0, y: this.map.mapCount.y }),
            CoordUtils.add(mapPos, this.map.mapCount)
        ];
        chunckPos.forEach(pos => {
            const chunckIndex = this.getChunckIndexByPos(pos);
            let itemChunck = this.itemChuncks.get(chunckIndex);
            if (!itemChunck) {
                itemChunck = this.randomChunckItem(chunckIndex);
            }
            itemChunck.forEach((item, key) => {
                const [x, y] = key.split(',').map(Number);
                if (x >= mapPos.x && x <= mapPos.x + this.map.mapCount.x && y >= mapPos.y && y <= mapPos.y + this.map.mapCount.y) {
                    item.draw(defaultUniform);
                }
            })
        })

    }

    /**
     * 
     * @param pos x,y: int
     * @returns 
     */
    hasItem = (pos: Coord) => {
        const chunckIndex = this.getChunckIndexByPos(pos);
        return this.itemChuncks.get(chunckIndex) && this.itemChuncks.get(chunckIndex).get(`${pos.x},${pos.y}`);
    }

    /**
     * 
     * @param pos x,y: int
     * @returns 
     */
    deleteItem = (pos: Coord) => {
        const chunckIndex = this.getChunckIndexByPos(pos);
        this.itemChuncks.get(chunckIndex).delete(`${pos.x},${pos.y}`);
    }

    /**
     * 
     * @param pos x, y: int
     * @param type 
     */
    addItem = (pos: Coord, type: ItemType) => {
        const chunckIndex = this.getChunckIndexByPos(pos);
        if (!this.itemChuncks.has(chunckIndex)) {
            this.itemChuncks.set(chunckIndex, new Map());
        }
        const chunck = this.itemChuncks.get(chunckIndex);
        let item: SimpleItem;
        switch (type) {
            case ItemType.match:
                item = new SimpleItem(this.gl, {
                    pos,
                    type,
                    img: this.getMatchImgs()
                });
                break;
            case ItemType.wood:
                item = new SimpleItem(this.gl, {
                    pos,
                    type,
                    img: this.getWoodImgs()
                });
                break;
            case ItemType.powderBox:
                item = new SimpleItem(this.gl, {
                    pos,
                    type,
                    img: this.getPowderBoxImgs()
                });
                break;
        }
        chunck.set(`${pos.x},${pos.y}`, item);
    }

    /**
     * 
     * @param pos x, y: int
     * @returns ItemType
     */
    getItemType = (pos: Coord) => {
        const chunckIndex = this.getChunckIndexByPos(pos);
        const chunck = this.itemChuncks.get(chunckIndex);
        return chunck.get(`${pos.x},${pos.y}`).type;
    }

    private getChunckIndexByPos = (pos: Coord) => {
        const chunck = CoordUtils.division(pos, this.chunckSize);
        return `${Math.floor(chunck.x)},${Math.floor(chunck.y)}`;
    }
}

export default ItemManager;