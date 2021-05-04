import { ItemType } from "../../Tools/interface";
import { Coord } from "../../Tools/Tool";
import Player from ".";
declare class NativePlayer extends Player {
    private blood;
    private bloodInterval;
    death: boolean;
    constructor(gl: WebGL2RenderingContext, size: Coord, img: HTMLImageElement);
    eat: (item: ItemType) => void;
    private deathAct;
}
export default NativePlayer;
