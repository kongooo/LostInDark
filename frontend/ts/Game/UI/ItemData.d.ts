import { BagItem } from "../../Tools/interface";
declare class ItemData {
    static matchData: () => BagItem;
    static woodData: () => BagItem;
    static powderBoxData: () => BagItem;
    static fireWoodData: () => BagItem;
    static firePileData: () => BagItem;
}
export default ItemData;
