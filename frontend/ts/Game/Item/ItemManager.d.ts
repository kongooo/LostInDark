import { Coord } from "../../Tools/Tool";
import { ImgType, ItemType, LightInfo, UniformLocationObj, Item } from "../../Tools/interface";
import PerlinMap from "../Map";
import Light from "../Light/light";
declare class ItemManager {
    private static instance;
    private itemChuncks;
    private map;
    private gl;
    private imgs;
    private chunckSize;
    private ws;
    private constructor();
    static getInstance(gl: WebGL2RenderingContext, map: PerlinMap, imgs: Map<ImgType, HTMLImageElement>): ItemManager;
    /**
     *
     * @param chunckIndex
     * @returns 随机出该chunck区域内的道具
     */
    private getMatchImgs;
    private getWoodImgs;
    private getPowderBoxImgs;
    addChunck: (chuncksIdnex: Array<string>, chuncks: Array<Array<Item>>) => void;
    drawItems: (chuncksIndex: Array<string>, defaultUniform: Array<UniformLocationObj>, lights: Array<LightInfo>, fireFrame: number, fireShadowsTexture: Array<WebGLTexture>, fireLights: Array<Light>) => void;
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
    private getChunckPosByIndex;
}
export default ItemManager;
