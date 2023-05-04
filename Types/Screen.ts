import { Color, colorToString } from "./Color"
import { Ray } from "./Ray"
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

    drawWalls(ctx: CanvasRenderingContext2D, rays: Ray[]){
        const wallWidth = 1
        for(let ray=0; ray<rays.length; ray++){
            const lineHeight = (this.height / rays[ray].length) * 10
            const lineColor = this.adjustColorForDistance(rays[ray].color, rays[ray].length)
            ctx.fillStyle = colorToString(lineColor)
            ctx.fillRect(wallWidth * ray, ((this.height - lineHeight) / 2), wallWidth, lineHeight)
        }
    }

    adjustColorForDistance(color: Color, distance: number){
        const inverseSquare = 1 / Math.sqrt(distance / this.diagonal)
        return {
            r: color.r * inverseSquare / this.gamma,
            g: color.g * inverseSquare / this.gamma,
            b: color.b * inverseSquare / this.gamma,
            a: color.a
        }
    }
}