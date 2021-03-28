interface Coord {
    x: number;
    y: number;
}

class CoordUtils {

    static add = (aPos: Coord, bPos: Coord | number) =>
    ({
        x: aPos.x + (typeof bPos === 'number' ? bPos : bPos.x),
        y: aPos.y + (typeof bPos === 'number' ? bPos : bPos.y)
    })

    static sub = (aPos: Coord, bPos: Coord | number) =>
    ({
        x: aPos.x - (typeof bPos === 'number' ? bPos : bPos.x),
        y: aPos.y - (typeof bPos === 'number' ? bPos : bPos.y)
    })

    static division = (aPos: Coord, bPos: Coord | number) =>
    ({
        x: aPos.x / (typeof bPos === 'number' ? bPos : bPos.x),
        y: aPos.y / (typeof bPos === 'number' ? bPos : bPos.y)
    })

    static mult = (aPos: Coord, bPos: Coord | number) =>
    ({
        x: aPos.x * (typeof bPos === 'number' ? bPos : bPos.x),
        y: aPos.y * (typeof bPos === 'number' ? bPos : bPos.y)
    })

    static len = (pos: Coord) => Math.sqrt(pos.x * pos.x + pos.y * pos.y);

    static normalize = (pos: Coord) => {
        const len = CoordUtils.len(pos);
        return { x: pos.x / len, y: pos.y / len };
    }

    static rotate = (vector: Coord, theta: number) => {
        const normVector = CoordUtils.normalize(vector);
        const curTheta = Math.acos(normVector.x);
        return { x: Math.cos(curTheta - theta), y: Math.sin(curTheta - theta) };
    }

}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const lerp = (a: number, b: number, t: number) => a + t * (b - a);

const getDir = (a: number) => a === 0 ? 0 : (a < 0 ? -1 : 1);

export { Coord, CoordUtils, clamp, lerp, getDir };
