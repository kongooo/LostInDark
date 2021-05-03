import { BagItem } from "../../Tools/interface";
declare class ItemData {
    static matchData: () => BagItem;
    static woodData: () => BagItem;
    static powderBoxData: () => BagItem;
    static fireWoodData: () => BagItem;
    static firePileData: () => BagItem;
    static transmitData: () => BagItem;
    static receiveData: () => BagItem;
    static batteryData: () => BagItem;
    static wireData: () => BagItem;
    static circuitData: () => BagItem;
}
export default ItemData;
