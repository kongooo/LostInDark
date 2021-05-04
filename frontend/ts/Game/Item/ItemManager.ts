import { Coord, CoordUtils, randomInt } from "../../Tools/Tool";
import { ImgType, ItemInfo, ItemType, LightInfo, UniformLocationObj, Item } from "../../Tools/interface";
import PerlinMap from "../Map";
import { SimpleItem } from "./SimpleItem";
import { Item2D } from "./Item2D";
import { FirePile } from "./FirePile";
import Light from "../Light/light";
import { Transmit } from "./Transmit";

const MATCH_MIN_COUNT = 5;
const MATCH_MAX_COUNT = 20;
const WOOD_MIN_COUNT = 10;
const WOOD_MAX_COUNT = 25;
const POWDERBOX_MIN_COUNT = 3;
const POWDERBOX_MAX_COUNT = 7;

const CHUNCK_SIZE = 1.5;

class ItemManager {
    private static instance: ItemManager;

    private itemChuncks: Map<string, Map<string, ItemInfo>> = new Map();
    private map: PerlinMap;
    private gl: WebGL2RenderingContext;
    private imgs: Map<ImgType, HTMLImageElement>;
    private chunckSize: Coord;
    private ws: any;

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
    // private randomChunckItem = (chunckIndex: string) => {
    //     const map: Map<string, ItemInfo> = new Map();
    //     const [chunckX, chunckY] = chunckIndex.split(',').map(Number);
    //     const leftDownPos = CoordUtils.mult({ x: chunckX, y: chunckY }, this.chunckSize);
    //     const rightUpPos = CoordUtils.add(leftDownPos, this.chunckSize);

    //     let matchCount = randomInt(MATCH_MIN_COUNT, MATCH_MAX_COUNT);
    //     let woodCount = randomInt(WOOD_MIN_COUNT, WOOD_MAX_COUNT);
    //     let powderBoxCount = randomInt(POWDERBOX_MIN_COUNT, POWDERBOX_MAX_COUNT);

    //     this.randomItem(matchCount, map, leftDownPos, rightUpPos, ItemType.match, this.getMatchImgs());

    //     this.randomItem(woodCount, map, leftDownPos, rightUpPos, ItemType.wood, this.getWoodImgs());

    //     this.randomItem(powderBoxCount, map, leftDownPos, rightUpPos, ItemType.powderBox, this.getPowderBoxImgs());

    //     this.itemChuncks.set(chunckIndex, map);
    //     return map;
    // }

    private getMatchImgs = () => [this.imgs.get(ImgType.matchUp), this.imgs.get(ImgType.matchFront), this.imgs.get(ImgType.matchFront)]
    private getWoodImgs = () => [this.imgs.get(ImgType.woodUp), this.imgs.get(ImgType.woodFront), this.imgs.get(ImgType.woodFront)];
    private getPowderBoxImgs = () => [this.imgs.get(ImgType.powderUp), this.imgs.get(ImgType.powderFront), this.imgs.get(ImgType.powderSide)];
    private getBatteryImgs = () => [this.imgs.get(ImgType.batteryUp), this.imgs.get(ImgType.batteryFront), this.imgs.get(ImgType.batteryFront)];
    private getCircuitImgs = () => [this.imgs.get(ImgType.powderUp), this.imgs.get(ImgType.circuitBoard), this.imgs.get(ImgType.powderUp)];
    private getToastImgs = () => [this.imgs.get(ImgType.toastUp), this.imgs.get(ImgType.toastFront), this.imgs.get(ImgType.toastUp)];
    private getSandwichImgs = () => [this.imgs.get(ImgType.sandwichUp), this.imgs.get(ImgType.sandwichFront), this.imgs.get(ImgType.sandwichUp)];

    // private randomItem = (count: number, map: Map<string, ItemInfo>, leftDownPos: Coord, rightUpPos: Coord, type: ItemType, imgs: Array<HTMLImageElement>) => {
    //     while (count--) {
    //         const randomX = randomInt(leftDownPos.x, rightUpPos.x);
    //         const randomY = randomInt(leftDownPos.y, rightUpPos.y);
    //         if (!this.map.obstacled(randomX, randomY)) {
    //             const item = new SimpleItem(this.gl, {
    //                 pos: { x: randomX, y: randomY },
    //                 type,
    //                 img: imgs
    //             });
    //             map.set(`${randomX},${randomY}`, item);
    //         }
    //     }
    // }

    addChunck = (chuncksIdnex: Array<string>, chuncks: Array<Array<Item>>) => {
        chuncksIdnex.forEach((chunckIndex, index) => {
            if (!this.itemChuncks.has(chunckIndex)) {
                chuncks[index].forEach((item) => {
                    this.addItem(item.pos, item.type);
                })
            }
        })
    }

    drawItems = (chuncksIndex: Array<string>, defaultUniform: Array<UniformLocationObj>, lights: Array<LightInfo>, fireFrame: number, fireShadowsTexture: Array<WebGLTexture>, fireLights: Array<Light>) => {

        lights.length = 0;
        fireShadowsTexture.length = 0;
        fireLights.length = 0;
        const mapPos = CoordUtils.floor(this.map.mapPos);
        // const chunckPos = [
        //     mapPos,
        //     CoordUtils.add(mapPos, { x: this.map.mapCount.x, y: 0 }),
        //     CoordUtils.add(mapPos, { x: 0, y: this.map.mapCount.y }),
        //     CoordUtils.add(mapPos, this.map.mapCount)
        // ];
        // const chuncksIndex = Array.from(new Set(chunckPos.map(pos => this.getChunckIndexByPos(pos))));
        chuncksIndex.forEach(chunckIndex => {
            let itemChunck = this.itemChuncks.get(chunckIndex);
            // if (!itemChunck) {
            //     itemChunck = this.randomChunckItem(chunckIndex);
            // }
            if (itemChunck)
                itemChunck.forEach((item, key) => {
                    const [x, y] = key.split(',').map(Number);
                    if (x >= mapPos.x && x <= mapPos.x + this.map.mapCount.x && y >= mapPos.y && y <= mapPos.y + this.map.mapCount.y) {
                        if (item.type === ItemType.firePile) {
                            item.draw(defaultUniform, fireFrame);
                            lights.push({
                                position: [item.pos.x + 0.5, 2, item.pos.y + 0.5],
                                color: (item as FirePile).lightColor,
                                linear: 0.14,
                                quadratic: 0.07
                            });
                            if (!(item as FirePile).shadowTexture) {
                                (item as FirePile).getShadowTexture(this.map.lineVertices);
                            }
                            fireShadowsTexture.push((item as FirePile).shadowTexture);
                            fireLights.push((item as FirePile).light);
                        } else if (item.type !== ItemType.placeHolder) {
                            item.draw(defaultUniform);
                        }
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
        const chunck = this.itemChuncks.get(chunckIndex);
        if (chunck) {
            const item = chunck.get(`${pos.x},${pos.y}`);
            return item;
        }
        return false;
    }

    canPickup = (pos: Coord) => {
        const chunckIndex = this.getChunckIndexByPos(pos);
        const chunck = this.itemChuncks.get(chunckIndex);
        if (chunck) {
            const item = chunck.get(`${pos.x},${pos.y}`);
            return item && item.move;
        }
        return false;
    }

    /**
     * 
     * @param pos x,y: int
     * @returns 
     */
    deleteItem = (pos: Coord) => {
        const chunckIndex = this.getChunckIndexByPos(pos);
        if (this.itemChuncks.has(chunckIndex)) {
            this.itemChuncks.get(chunckIndex).delete(`${pos.x},${pos.y}`);
        }
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
        let item: SimpleItem | Item2D | FirePile | Transmit | ItemInfo;
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
            case ItemType.sandwich:
                item = new SimpleItem(this.gl, {
                    pos,
                    type,
                    img: this.getSandwichImgs()
                });
                break;
            case ItemType.toast:
                item = new SimpleItem(this.gl, {
                    pos,
                    type,
                    img: this.getToastImgs()
                });
                break;
            case ItemType.powder:
                item = new Item2D(this.gl, {
                    pos,
                    type,
                    img: [this.imgs.get(ImgType.powder)]
                }, false, false)
                break;
            case ItemType.firePile:
                item = new FirePile(this.gl, {
                    pos,
                    type,
                    img: [this.imgs.get(ImgType.woodUp), this.imgs.get(ImgType.fire)]
                })
                break;
            case ItemType.battery:
                item = new SimpleItem(this.gl, {
                    pos,
                    type,
                    img: this.getBatteryImgs()
                });
                break;
            case ItemType.wire:
                item = new Item2D(this.gl, {
                    pos,
                    type,
                    img: [this.imgs.get(ImgType.wire)],
                }, true)
                break;
            case ItemType.circuitBoard:
                item = new SimpleItem(this.gl, {
                    pos,
                    type,
                    img: this.getCircuitImgs()
                })
                break;
            case ItemType.transmit:
                item = new Transmit(this.gl, {
                    pos,
                    type
                })
                chunck.set(`${pos.x},${pos.y}`, item);
                for (let x = pos.x; x < pos.x + 2; x++) {
                    for (let y = pos.y; y < pos.y + 2; y++) {
                        if (x !== pos.x || y !== pos.y) {
                            chunck.set(`${x},${y}`, {
                                type: ItemType.placeHolder,
                                pos: { x, y }
                            });
                        }
                    }
                }
                break;
        }
        if (item && type !== ItemType.transmit) {
            chunck.set(`${pos.x},${pos.y}`, item);
        }
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

    private getChunckPosByIndex = (index: string) => {
        const [x, y] = index.split(',').map(Number);
        return { x, y };
    }
}

export default ItemManager;