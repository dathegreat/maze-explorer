import { Graph } from "../Types/Graph"
import { RayCaster } from "../Types/RayCaster"

const canvas: any = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth * 0.9
canvas.height = window.innerHeight * 0.9

const graph: Graph = new Graph({x: canvas.width / 50, y: canvas.height / 50}, {x: canvas.width, y: canvas.height})
ctx.clearRect(0,0,canvas.width,canvas.height)
graph.generateMaze()
graph.draw(ctx, "black")
graph.drawStartAndFinish(ctx, "blue")
const rayCaster = new RayCaster({x:10,y:10}, {x:1,y:1}, Math.PI / 4, 20)
rayCaster.drawRays(ctx, "green")
for(let i=0; i<graph.cells.length; i++){
    for(let j=0; j<graph.cells[i].length; j++){
        rayCaster.testCollision(graph.cells[i][j].sides)
    }
}
rayCaster.drawRays(ctx, "red")