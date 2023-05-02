import { Point } from "../Types/Point"
import { rayWall } from "../Types/CollisionTester"
import { rotateVector, scaleVector, vectorLength, subtractVectors, addVectors } from "../Types/VectorMath"

export class RayCaster{
    center: Point
    direction: Point
    FOV: number
    resolution: number
    rays: Point[][]
    renderDistance: number

    constructor(center: Point, direction: Point, FOV: number, resolution: number, renderDistance: number){
        this.center = center
        this.direction = direction
        this.FOV = FOV
        this.resolution = resolution
        this.renderDistance = renderDistance
        this.rays = []
    }

    castRays(walls: Point[][]){
        const rays: Point[][] = []
        for(let theta = -this.FOV; theta < this.FOV; theta += (this.FOV / this.resolution)){
            const newRay = [   
                this.center,
                addVectors(
                    scaleVector( 
                        rotateVector(this.direction, theta), (this.renderDistance / Math.cos(theta)) 
                    ),
                    this.center
                )
            ]
            this.testCollision(newRay, walls)
            rays.push(newRay)
        }
        this.rays = rays
    }
    //returns length of cast rays left to right 
    getRayLengths(){
        const rayLengths: number[] = new Array(this.rays.length)
        for(let i=0; i < this.rays.length; i++){
            rayLengths[i] = (vectorLength(subtractVectors(this.rays[i][1], this.rays[i][0])))
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

    testCollision(ray: Point[], walls: Point[][]){
        for(let wall=0; wall<walls.length; wall++){
            const collision = rayWall(ray, walls[wall])
            if( collision ){
                ray[1] = collision
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