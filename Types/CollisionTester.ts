import { Point } from "./Point";

export const rayWall = (ray: Point[], wall: Point[]) =>{
        const x1 = ray[0].x
        const x2 = ray[1].x
        const x3 = wall[0].x
        const x4 = wall[1].x
        const y1 = ray[0].y
        const y2 = ray[1].y
        const y3 = wall[0].y
        const y4 = wall[1].y
        // calculate the distance to intersection point
        const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    
        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            const intersectionX = x1 + (uA * (x2-x1));
            const intersectionY = y1 + (uA * (y2-y1));
    
            return {x: intersectionX, y: intersectionY};
        }
        return false;
}