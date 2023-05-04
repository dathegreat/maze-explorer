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
    frictionCoefficient: number
    size: number

    constructor(rayCaster: RayCaster, position: Point, facing: Point, size: number ){
        this.rayCaster = rayCaster
        this.position = position
        this.velocity = {x:0, y:0}
        this.maxVelocity = 100
        this.acceleration = {x:0, y:0}
        this.maxAcceleration = 2000
        this.facing = scaleVector(facing, 1/vectorLength(facing))
        this.rotationalVelocity = 0
        this.maxRotationalVelocity = Math.PI / 250
        this.frictionCoefficient = 0.00001 / 1000
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

    applyMomentum(timeDelta: number){
        const timeDeltaInSeconds = timeDelta / 1000
        this.velocity = addVectors(this.velocity, scaleVector(this.acceleration, timeDeltaInSeconds))
        this.velocity = scaleVector(this.velocity, Math.pow(this.frictionCoefficient, timeDeltaInSeconds))
        const newPosition = addVectors(this.position, scaleVector(getNormal(this.facing), this.velocity.x * timeDeltaInSeconds))
        this.updatePosition(addVectors(newPosition, scaleVector(this.facing, this.velocity.y * timeDeltaInSeconds)))
    }

    rotate(angle: number){
        this.facing = rotateVector(this.facing, angle)
        this.rayCaster.updateDirection(this.facing)
    }

}