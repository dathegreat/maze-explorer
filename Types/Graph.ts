import { Point } from "../Types/Point"
import { Cell } from "../Types/Cell"


const generateCells = (size: Point, resolution: Point): Cell[][] =>{
    //initialize 2d array the wack TS way
    const cells: Cell[][] = new Array(size.y);
    for(let row=0; row < size.y; row++){
        cells[row] = ([new Array(size.x)]) as any[]
    }
    const sideLength: Point = { x: Math.floor(resolution.x / size.x), y: Math.floor(resolution.y / size.y) }
    for(let row = 0; row < size.y; row++){
        for(let column = 0; column < size.x; column++){
            cells[row][column] = {
                sides: [
                    [{x: (column * sideLength.x) - (sideLength.x / 2) + (sideLength.x / 2), y: (row * sideLength.y) - (sideLength.y / 2) + (sideLength.y / 2)}, {x: (column * sideLength.x) + (sideLength.x / 2) + (sideLength.x / 2), y: (row * sideLength.y) - (sideLength.y / 2) + (sideLength.y / 2)}],
                    [{x: (column * sideLength.x) - (sideLength.x / 2) + (sideLength.x / 2), y: (row * sideLength.y) + (sideLength.y / 2) + (sideLength.y / 2)}, {x: (column * sideLength.x) + (sideLength.x / 2) + (sideLength.x / 2), y: (row * sideLength.y) + (sideLength.y / 2) + (sideLength.y / 2)}],
                    [{x: (column * sideLength.x) + (sideLength.x / 2) + (sideLength.x / 2), y: (row * sideLength.y) - (sideLength.y / 2) + (sideLength.y / 2)}, {x: (column * sideLength.x) + (sideLength.x / 2) + (sideLength.x / 2), y: (row * sideLength.y) + (sideLength.y / 2) + (sideLength.y / 2)}],
                    [{x: (column * sideLength.x) - (sideLength.x / 2) + (sideLength.x / 2), y: (row * sideLength.y) - (sideLength.y / 2) + (sideLength.y / 2)}, {x: (column * sideLength.x) - (sideLength.x / 2) + (sideLength.x / 2), y: (row * sideLength.y) + (sideLength.y / 2) + (sideLength.y / 2)}],
                    
                ],
                visited: false,
                index: {x: column, y: row},
                center: {x: column * sideLength.x + (sideLength.x / 2), y: row * sideLength.y + (sideLength.y / 2)}
            }
        }
    }
    return cells
}

const randInt = (min: number, max: number): number =>{
    return Math.floor(Math.random() * max) + min
}

const pointEqualsPoint = (a: Point, b: Point) =>{
    return a.x == b.x && a.y == b.y
}

export class Graph{
    size: Point
    resolution: Point
    cells: Cell[][]
    sideLength: Point

    constructor(size: Point, resolution: Point){
        this.size = {x: Math.floor(size.x), y: Math.floor(size.y)}
        this.resolution = resolution
        this.cells = generateCells(this.size, this.resolution)
        this.sideLength = { x: Math.floor(resolution.x / size.x), y: Math.floor(resolution.y / size.y) }
    }

    drawLineFromSide(ctx: CanvasRenderingContext2D, side: Point[]){
        ctx.beginPath()
        ctx.moveTo(side[0].x, side[0].y)
        ctx.lineTo(side[1].x, side[1].y)
        ctx.stroke()
        ctx.closePath()
    }

    draw(ctx: CanvasRenderingContext2D, color: string){
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        for(let i=0; i < this.cells.length; i++){
            for(let j=0; j < this.cells[i].length; j++){
                for(const side of this.cells[i][j].sides){
                    this.drawLineFromSide(ctx, side)
                }
            }
        }
    }

    clearWallBetween(a: Cell, b: Cell){
        for(let i=0; i<a.sides.length; i++){
            for(let j=0; j<b.sides.length; j++){
                if( pointEqualsPoint(a.sides[i][0], b.sides[j][0]) && pointEqualsPoint(a.sides[i][1], b.sides[j][1]) ){
                    const sharedSide = a.sides[i]
                    a.sides = a.sides.filter((side) => !(pointEqualsPoint(side[0], sharedSide[0]) && pointEqualsPoint(side[1], sharedSide[1])) )
                    b.sides = b.sides.filter((side) => !(pointEqualsPoint(side[0], sharedSide[0]) && pointEqualsPoint(side[1], sharedSide[1])) )
                    return;
                }
            }
        }
    }

    getNeighbors(cell: Cell): Cell[]{
        const neighbors: Cell[] = []
        //north neighbor
        if(cell.index.y - 1 >= 0){ neighbors.push(this.cells[cell.index.y - 1][cell.index.x]) }
        //south neighbor
        if(cell.index.y + 1 <= this.size.y - 1){ neighbors.push(this.cells[cell.index.y + 1][cell.index.x]) }
        //east neighbor
        if(cell.index.x + 1 <= this.size.x - 1){ neighbors.push(this.cells[cell.index.y][cell.index.x + 1]) }
        //west neighbor
        if(cell.index.x - 1 >= 0){ neighbors.push(this.cells[cell.index.y][cell.index.x - 1]) }
        
        return neighbors
    }
    //https://weblog.jamisbuck.org/2011/1/27/maze-generation-growing-tree-algorithm
    generateMaze(){
        const cellStack: Cell[] = []
        const startingCell = this.cells[ randInt(0, this.size.y) ][ randInt(0, this.size.x) ]
        startingCell.visited = true
        cellStack.push(startingCell)
        while(cellStack.length > 0){
            const currentCell = cellStack[cellStack.length - 1]
            const unvisitedNeighbors = this.getNeighbors(currentCell).filter( (cell)=> !cell.visited )
            if(unvisitedNeighbors.length > 0){
                const randomUnvisitedNeighbor = unvisitedNeighbors[randInt(0, unvisitedNeighbors.length)]
                this.clearWallBetween(currentCell, randomUnvisitedNeighbor)
                randomUnvisitedNeighbor.visited = true
                cellStack.push(randomUnvisitedNeighbor)
            }
            else{
                cellStack.pop()
            }
        }

    }

    drawStartAndFinish(ctx: CanvasRenderingContext2D, color: string){
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.cells[0][0].center.x, this.cells[0][0].center.y, this.sideLength.x / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(this.cells[this.size.y-1][this.size.x-1].center.x, this.cells[this.size.y-1][this.size.x-1].center.y, this.sideLength.x / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }

    getWalls(){
        const walls = []
        for(let i=0; i < this.cells.length; i++){
            for(let j=0; j < this.cells[i].length; j++){
                for(const side of this.cells[i][j].sides){
                    walls.push(side)
                }
            }
        }
        return walls
    }

}