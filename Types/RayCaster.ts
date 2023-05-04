import { Point } from "../Types/Point"
import { rayWall } from "../Types/CollisionTester"
import { Ray } from "../Types/Ray"
import { rotateVector, scaleVector, vectorLength, subtractVectors, addVectors } from "../Types/VectorMath"
import { Wall } from "./Wall"

export class RayCaster{
    center: Point
    direction: Point
    FOV: number
    resolution: number
    rays: Ray[]
    renderDistance: number

    constructor(center: Point, direction: Point, FOV: number, resolution: number, renderDistance: number){
        this.center = center
        this.direction = direction
        this.FOV = FOV
        this.resolution = resolution
        this.renderDistance = renderDistance
        this.rays = []
    }
    //generate rays by rotating about center point of raycaster from -FOV to +FOV angles
    castRays(walls: Wall[][]){
        const rays: Ray[] = []
        for(let theta = -this.FOV; theta < this.FOV; theta += (this.FOV / this.resolution)){
            const terminus = addVectors(
                scaleVector( rotateVector(this.direction, theta), (this.renderDistance / Math.cos(theta)) ),
                this.center
            )
            const newRay: Ray = {   
                origin: this.center,
                terminus: terminus,
                length: vectorLength(subtractVectors(terminus, this.center)),
                color: {r:0,g:0,b:0,a:1}
            }
            this.testCollision(newRay, walls)
            rays.push(newRay)
        }
        this.rays = rays
    }
    //returns length of cast rays left to right 
    getRayLengths(){
        const rayLengths: number[] = new Array(this.rays.length)
        for(let i=0; i < this.rays.length; i++){
            rayLengths[i] = (vectorLength(subtractVectors(this.rays[i].terminus, this.rays[i].origin))) * Math.cos(-this.FOV + (this.FOV / this.resolution) * i)
        }
        return rayLengths
    }

    drawRays(ctx: CanvasRenderingContext2D, color: string){
        ctx.strokeStyle = color
        for(const ray of this.rays){
            ctx.beginPath()
            ctx.moveTo(ray.origin.x, ray.origin.y)
            ctx.lineTo(ray.terminus.x, ray.terminus.y)
            ctx.stroke()
            ctx.closePath()
        }
    }

    testCollision(ray: Ray, walls: Wall[][]){
        for(let wall=0; wall<walls.length; wall++){
            const collision = rayWall(ray, walls[wall])
            if( collision ){
                ray.terminus = collision
                ray.length = vectorLength(subtractVectors(ray.terminus, ray.origin))
                ray.color = walls[wall][0].color
            }
        }
    }

    updatePosition(position: Point){
        this.center = position
    }

    updateDirection(direction: Point){
        this.direction = direction
    }
}