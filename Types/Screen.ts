export class Screen{
    width: number
    height: number

    constructor(width: number, height: number){
        this.width = width
        this.height = height
    }

    drawWalls(ctx: CanvasRenderingContext2D, wallHeights: number[], color: string){
        let wallWidth = this.width / wallHeights.length
        ctx.fillStyle = color
        for(let wall=0; wall<wallHeights.length; wall++){
            const lineHeight = (this.height / wallHeights[wall]) * 10
            ctx.fillRect(wallWidth * wall, ((this.height - lineHeight) / 2), wallWidth, lineHeight)
        }
    }
}