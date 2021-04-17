import { Coord } from "../../Tools/Tool";
import { ImgType, ItemInfo, UniformLocationObj } from "../../Tools/interface";
import PerlinMap from "../Map";
declare class ItemManager {
    private static instance;
    private itemChuncks;
    private map;
    private gl;
    private imgs;
    private chunckSize;
    private constructor();
    static getInstance(gl: WebGL2RenderingContext, map: PerlinMap, imgs: Map<ImgType, HTMLImageElement>): ItemManager;
    /**
     *
     * @param chunckIndex
     * @returns 随机出该chunck区域内的道具
     */
    private randomChunckItem;
    private randomItem;
    drawItems: (defaultUniform: Array<UniformLocationObj>) => void;
    /**
     *
     * @param pos x,y: int
     * @returns
     */
    hasItem: (pos: Coord) => ItemInfo;
    private getChunckIndexByPos;
}
export default ItemManager;
