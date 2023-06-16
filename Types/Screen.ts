import { Color, colorToString } from "./Color"
import { Ray } from "./Ray"
import { subtractVectors } from "./VectorMath"
export class Screen{
    width: number
    height: number
    diagonal: number
    gamma: number

    constructor(width: number, height: number, gamma: number){
        this.width = width
        this.height = height
        this.diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
        this.gamma = gamma
    }
drawBackground(ctx: CanvasRenderingContext2D){
        const skyGradient = ctx.createLinearGradient(ctx.canvas.width / 2, 0, ctx.canvas.width / 2, ctx.canvas.height / 2)
        skyGradient.addColorStop(0, 'rgba(145, 228, 255, 1)');
        skyGradient.addColorStop(0.63, 'rgba(63, 141, 255, 1)');
        skyGradient.addColorStop(0.74, 'rgba(37, 125, 170, 1)');
        skyGradient.addColorStop(0.83, 'rgba(173, 153, 77, 1)');
        skyGradient.addColorStop(0.92, 'rgba(193, 111, 111, 1)');
        skyGradient.addColorStop(1, 'rgba(180, 85, 13, 1)');
        ctx.fillStyle = skyGradient
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2)
        const groundGradient = ctx.createRadialGradient(ctx.canvas.width / 3, ctx.canvas.height, 0, ctx.canvas.width / 3, ctx.canvas.height, ctx.canvas.height * 0.9);
        groundGradient.addColorStop(0, 'rgba(163, 151, 151, 1)');
        groundGradient.addColorStop(0.38, 'rgba(107, 68, 29, 1)');
        groundGradient.addColorStop(1, 'rgba(43, 40, 33, 1)');
        ctx.fillStyle = groundGradient
        ctx.setTransform(1.5,0,0,1,0,0)
        ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height / 2)
        ctx.resetTransform()
    }

    drawWalls(ctx: CanvasRenderingContext2D, rays: Ray[], playerHeight: number){
        const wallWidth = 1
        for(let ray=0; ray<rays.length; ray++){
            const lineHeight = (this.height / rays[ray].length) * 10
            const lineStart = (this.height - lineHeight) / 2
            const verticalOffset = Math.sqrt(Math.pow(rays[ray].length, 2) + Math.pow(playerHeight, 2))
            const lineColor = this.adjustColorForDistance(rays[ray].color, rays[ray].length, ray)
            ctx.fillStyle = colorToString(lineColor)
            ctx.fillRect(wallWidth * ray, verticalOffset + lineStart, wallWidth, lineHeight)
        }
    }
    //adjusts light falloff as if the player was holding a flashlight
    adjustColorForDistance(color: Color, distance: number, index: number){
        const inverseSquare = 1 / Math.sqrt(distance / this.diagonal)
        const horizontalFalloff = -Math.pow(2*(index - (this.width / 2)) / this.width, 2) + 1
        return {
            r: color.r * inverseSquare * horizontalFalloff / this.gamma,
            g: color.g * inverseSquare * horizontalFalloff / this.gamma,
            b: color.b * inverseSquare * horizontalFalloff / this.gamma,
            a: color.a
        }
    }
}