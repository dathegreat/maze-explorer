import { RayCaster } from "./RayCaster"
import { Point } from "./Point"
import { rotateVector } from "./VectorMath"

export class Player{
    rayCaster: RayCaster
    position: Point
    facing: Point
    size: number

    constructor(rayCaster: RayCaster, position: Point, facing: Point, size: number ){
        this.rayCaster = rayCaster
        this.position = position
        this.facing = facing
        this.size = size
    }

    draw(ctx: CanvasRenderingContext2D, color: string){
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }

    updatePosition(position: Point){
        this.position = position
        this.rayCaster.updatePosition(position)
    }

    rotate(angle: number){
        this.facing = rotateVector(this.facing, angle)
        this.rayCaster.updateDirection(this.facing)
    }

}