export class Screen{
    width: number
    height: number
    diagonal: number

    constructor(width: number, height: number){
        this.width = width
        this.height = height
        this.diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
    }

    drawWalls(ctx: CanvasRenderingContext2D, wallHeights: number[], color: string){
        const wallWidth = 1
        ctx.fillStyle = color
        for(let wall=0; wall<wallHeights.length; wall++){
            const lineHeight = (this.height / wallHeights[wall]) * 10
            const lineColor = 255 - (wallHeights[wall] * 255 / this.diagonal)
            ctx.fillStyle = `rgba(${lineColor},${lineColor},${lineColor},1)`
            ctx.fillRect(wallWidth * wall, ((this.height - lineHeight) / 2), wallWidth, lineHeight)
        }
    }
}