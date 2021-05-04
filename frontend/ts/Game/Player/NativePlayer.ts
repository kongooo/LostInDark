import { ItemType } from "../../Tools/interface";
import { Coord } from "../../Tools/Tool";
import Player from ".";
import EventBus from "../../Tools/Event/EventBus";

const DEATH_SPEED = 0.2;
const MAX_BLOOD = 100;

class NativePlayer extends Player {
    private blood: number = MAX_BLOOD;
    private bloodInterval;
    death: boolean = false;

    constructor(gl: WebGL2RenderingContext, size: Coord, img: HTMLImageElement) {
        super(gl, size, img);
        const bloodProgress = <HTMLProgressElement>document.querySelector('#blood');
        this.bloodInterval = setInterval(() => {
            this.blood -= DEATH_SPEED;
            bloodProgress.value = this.blood;
            if (this.blood <= 0 && !this.death) {
                this.deathAct();
            }
        }, 500);
    }

    eat = (item: ItemType) => {
        let energy = 0;
        switch (item) {
            case ItemType.sandwich:
                energy = 50;
                break;
            case ItemType.toast:
                energy = 30;
                break;
        }
        this.blood = Math.min(this.blood + energy, MAX_BLOOD + DEATH_SPEED);
    }

    private deathAct = () => {
        clearInterval(this.bloodInterval);
        this.death = true;
        EventBus.dispatch('death');
    }
}

export default NativePlayer;