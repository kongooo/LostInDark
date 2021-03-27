class Coord {
    x: number;
    y: number;

    constructor(x: number, y?: number) {
        this.x = x;
        this.y = y ? y : x;
    }

    add = (pos: Coord | number) => {
        return new Coord(this.x + (typeof pos === 'number' ? pos : pos.x), this.y + (typeof pos === 'number' ? pos : pos.y));
    }

    sub = (pos: Coord) => {
        return new Coord(this.x - pos.x, this.y - pos.y);
    }

    divison = (num: number | Coord) => {
        return new Coord(Math.floor(this.x / (typeof num === 'number' ? num : num.x)), Math.floor(this.y / (typeof num === 'number' ? num : num.y)));
    }

    mult = (num: number | Coord) => {
        return new Coord(Math.floor(this.x * (typeof num === 'number' ? num : num.x)), Math.floor(this.y * (typeof num === 'number' ? num : num.y)));
    }

    normalize = () => {
        const len = this.length();
        return new Coord(this.x / len, this.y / len);
    }

    rotate = (theta: number) => {
        const vector = this.normalize();
        const curTheta = Math.acos(vector.x);
        return new Coord(Math.cos(curTheta - theta), Math.sin(curTheta - theta));
    }

    length = () => Math.sqrt(this.x * this.x + this.y * this.y);

}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const lerp = (a: number, b: number, t: number) => a + t * (b - a);

const getDir = (a: number) => a === 0 ? 0 : (a < 0 ? -1 : 1);

export { Coord, clamp, lerp, getDir };