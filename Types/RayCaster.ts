import { Point } from "../Types/Point"
import { rayWall } from "../Types/CollisionTester"

const rayLength = (ray: Point) =>{
    return Math.sqrt(Math.pow(ray.x, 2) + Math.pow(ray.y, 2))
}

const vectorSubtract = (a: Point, b: Point) =>{
    return {x: a.x - b.x, y: a.y - b.y}
}

const scaleVector = (vector: Point, scale: number) =>{
    return {x: vector.x * scale, y: vector.y * scale}
}

const rotateVector = (vector: Point, angle: number) =>{
    return {
        x: (Math.cos(angle) * vector.x) - (Math.sin(angle) * vector.y),
        y: (Math.sin(angle) * vector.x) + (Math.cos(angle) * vector.y)
    }
}

export class RayCaster{
    center: Point
    direction: Point
    FOV: number
    resolution: number
    rays: Point[][]
    renderDistance: number

    constructor(center: Point, direction: Point, FOV: number, resolution: number){
        this.center = center
        this.direction = direction
        this.FOV = FOV
        this.resolution = resolution
        this.renderDistance = 100
        this.rays = this.castRays()
    }

    castRays(){
        const rays: Point[][] = []
        const halfFOV = this.FOV / 2
        for(let theta = -this.FOV; theta < this.FOV; theta += (this.FOV / this.resolution)){
            rays.push(
                [   
                    this.center,
                    scaleVector( rotateVector(this.direction, theta), (this.renderDistance / Math.cos(theta)) )
                ]
            )
        }
        return rays
    }
    //returns length of cast rays left to right 
    getRayLengths(){
        const rayLengths: number[] = new Array(this.rays.length)
        for(let i=0; i < this.rays.length; i++){
            rayLengths[i] = (rayLength(vectorSubtract(this.rays[i][1], this.rays[i][0])))
        }
        return rayLengths
    }

    drawRays(ctx: CanvasRenderingContext2D, color: string){
        ctx.strokeStyle = color
        for(const ray of this.rays){
            ctx.beginPath()
            ctx.moveTo(ray[0].x, ray[0].y)
            ctx.lineTo(ray[1].x, ray[1].y)
            ctx.stroke()
            ctx.closePath()
        }
    }

    testCollision(walls: Point[][]){
        for(let ray=0; ray<this.rays.length; ray++){
            for(let wall=0; wall<walls.length; wall++){
                const collision = rayWall(this.rays[ray], walls[wall])
                if( collision ){
                    this.rays[ray][1] = collision
                }
            }
        }
    }
}