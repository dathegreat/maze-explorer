import { RayCaster } from "./RayCaster"
import { Point } from "./Point"
import { addVectors, rotateVector, scaleVector, getNormal, vectorLength } from "./VectorMath"
import { collisionPlayerWalls } from "./CollisionTester"
import { Wall } from "./Wall"

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

    drawTopDown(ctx: CanvasRenderingContext2D, color: string){
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }

    drawFirstPerson(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.fillStyle = "grey"
        ctx.moveTo(ctx.canvas.width * 0.2, ctx.canvas.height)
        ctx.lineTo(ctx.canvas.width * 0.3, ctx.canvas.height * 0.8)
        ctx.lineTo(ctx.canvas.width * 0.35, ctx.canvas.height * 0.85)
        ctx.lineTo(ctx.canvas.width * 0.3, ctx.canvas.height)
        ctx.moveTo(ctx.canvas.width * 0.75, ctx.canvas.height)
        ctx.lineTo(ctx.canvas.width * 0.7, ctx.canvas.height * 0.85)
        ctx.lineTo(ctx.canvas.width * 0.75, ctx.canvas.height * 0.8)
        ctx.lineTo(ctx.canvas.width * 0.85, ctx.canvas.height)
        ctx.fill()
    }

    updatePosition(position: Point){
        this.position = position
        this.rayCaster.updatePosition(position)
    }

    applyMomentum(timeDelta: number, walls: Wall[][]){
        const timeDeltaInSeconds = timeDelta / 1000
        this.velocity = addVectors(this.velocity, scaleVector(this.acceleration, timeDeltaInSeconds))
        this.velocity = scaleVector(this.velocity, Math.pow(this.frictionCoefficient, timeDeltaInSeconds))
        const moveLateral = addVectors(this.position, scaleVector(getNormal(this.facing), this.velocity.x * timeDeltaInSeconds))
        const moveVertical = addVectors(moveLateral, scaleVector(this.facing, this.velocity.y * timeDeltaInSeconds))
        if(!collisionPlayerWalls(this.position, moveVertical, walls)){
            this.updatePosition(moveVertical)
        }
    }

    rotate(angle: number){
        this.facing = rotateVector(this.facing, angle)
        this.rayCaster.updateDirection(this.facing)
    }

}