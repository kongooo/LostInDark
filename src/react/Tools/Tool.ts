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

    static calTheta = (vector: Coord) => Math.acos(vector.x);

    static calDistance = (aPos: Coord, bPos: Coord) => {
        const x = bPos.x - aPos.x;
        const y = bPos.y - aPos.y;
        return Math.sqrt(x * x + y * y);
    }

    static calPointToLineDis = (point: Coord, aPos: Coord, bPos: Coord) => {
        const a = CoordUtils.calDistance(aPos, bPos);
        const b = CoordUtils.calDistance(aPos, point);
        const c = CoordUtils.calDistance(bPos, point);
        const s = (a + b + c) / 2;
        const A = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return A / (2 * a);
    }

    static calLineIntersection = (aPos: Coord, aVector: Coord, bPos: Coord, bVector: Coord) => {
        const k1 = aVector.y / aVector.x;
        const k2 = bVector.y / bVector.x;
        const b1 = aPos.y - aPos.x * k1;
        const b2 = bPos.y - bPos.x * k2;

        const x = (b2 - b1) / (k1 - k2);
        const y = k1 * x + b1;
        return { x, y };
    }

    static calCircleLinePos = (circlePos: Coord, radius: number, aPos: Coord, bPos: Coord) => {
        const centerPos = CoordUtils.division(CoordUtils.add(aPos, bPos), 2);
        const centerToCircle = CoordUtils.calDistance(centerPos, circlePos);
        const len = (radius * radius) / centerToCircle;
        const centerVector = CoordUtils.normalize(CoordUtils.sub(centerPos, circlePos));
        return CoordUtils.add(circlePos, CoordUtils.mult(centerVector, len));
    }
}

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const lerp = (a: number, b: number, t: number) => a + t * (b - a);

const getDir = (a: number) => a === 0 ? 0 : (a < 0 ? -1 : 1);

export { Coord, CoordUtils, clamp, lerp, getDir };
