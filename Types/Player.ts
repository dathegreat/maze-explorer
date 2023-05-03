import { RayCaster } from "./RayCaster"
import { Point } from "./Point"
import { addVectors, rotateVector, scaleVector, getNormal, vectorLength } from "./VectorMath"

export class Player{
    rayCaster: RayCaster
    position: Point
    velocity: Point
    maxVelocity: number
    acceleration: Point
    maxAcceleration: number
    facing: Point
    rotationalVelocity: number
    maxRotationalVelocity: number
    size: number

    constructor(rayCaster: RayCaster, position: Point, facing: Point, size: number ){
        this.rayCaster = rayCaster
        this.position = position
        this.velocity = {x:0, y:0}
        this.maxVelocity = 0.1
        this.acceleration = {x:0, y:0}
        this.maxAcceleration = 0.05
        this.facing = facing
        this.rotationalVelocity = 0
        this.maxRotationalVelocity = Math.PI / 250
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

    applyMomentum(){
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y
        if(this.velocity.x > this.maxVelocity){this.velocity.x = this.maxVelocity}
        if(this.velocity.x < -this.maxVelocity){this.velocity.x = -this.maxVelocity}
        if(this.velocity.y > this.maxVelocity){this.velocity.y = this.maxVelocity}
        if(this.velocity.y < -this.maxVelocity){this.velocity.y = -this.maxVelocity}
        this.acceleration = scaleVector(this.acceleration, 0.5)
        const newPosition = addVectors(this.position, scaleVector(getNormal(this.facing), this.velocity.x))
        
        this.updatePosition(addVectors(newPosition, scaleVector(this.facing, this.velocity.y)))
        this.rotate(this.rotationalVelocity)
    }

    rotate(angle: number){
        this.facing = rotateVector(this.facing, angle)
        this.rayCaster.updateDirection(this.facing)
    }

}