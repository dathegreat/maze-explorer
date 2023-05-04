import { Player } from "./Player";
import { Point } from "./Point";
import { Ray } from "./Ray";
import { Wall } from "./Wall";

export const collisionRayWall = (ray: Ray, wall: Point[]) =>{
        const x1 = ray.origin.x
        const x2 = ray.terminus.x
        const x3 = wall[0].x
        const x4 = wall[1].x
        const y1 = ray.origin.y
        const y2 = ray.terminus.y
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

export const collisionPlayerWalls = (startPosition: Point, endPosition: Point, walls: Wall[][]) =>{
    for(let wall=0; wall<walls.length; wall++){
        const x1 = startPosition.x
        const x2 = endPosition.x
        const x3 = walls[wall][0].x
        const x4 = walls[wall][1].x
        const y1 = startPosition.y
        const y2 = endPosition.y
        const y3 = walls[wall][0].y
        const y4 = walls[wall][1].y
        // calculate the distance to intersection point
        const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    
        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            const intersectionX = x1 + (uA * (x2-x1));
            const intersectionY = y1 + (uA * (y2-y1));
    
            return {x: intersectionX, y: intersectionY};
        }
    }
    return false;
}