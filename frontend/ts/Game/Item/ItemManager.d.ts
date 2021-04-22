import { Coord } from "../../Tools/Tool";
import { ImgType, ItemType, LightInfo, UniformLocationObj } from "../../Tools/interface";
import PerlinMap from "../Map";
import Light from "../Light/light";
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
    private getMatchImgs;
    private getWoodImgs;
    private getPowderBoxImgs;
    private randomItem;
    drawItems: (defaultUniform: Array<UniformLocationObj>, lights: Array<LightInfo>, fireFrame: number, playerCount: number, fireShadowsTexture: Array<WebGLTexture>, fireLights: Array<Light>) => void;
    /**
     *
     * @param pos x,y: int
     * @returns
     */
    hasItem: (pos: Coord) => boolean;
    /**
     *
     * @param pos x,y: int
     * @returns
     */
    deleteItem: (pos: Coord) => void;
    /**
     *
     * @param pos x, y: int
     * @param type
     */
    addItem: (pos: Coord, type: ItemType) => void;
    /**
     *
     * @param pos x, y: int
     * @returns ItemType
     */
    getItemType: (pos: Coord) => ItemType;
    private getChunckIndexByPos;
}
export default ItemManager;
