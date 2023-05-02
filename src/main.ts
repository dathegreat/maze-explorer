import { Graph } from "../Types/Graph"
import { RayCaster } from "../Types/RayCaster"
import { Screen } from "../Types/Screen"
import { Player } from "../Types/Player"
import { addVectors, scaleVector } from "../Types/VectorMath"

const topDownCanvas: any = document.getElementById("top-down")
const topDownCtx = topDownCanvas.getContext('2d')

topDownCanvas.width = window.innerWidth * 0.4
topDownCanvas.height = window.innerHeight * 0.4

const firstPersonCanvas: any = document.getElementById("first-person")
const firstPersonCtx = firstPersonCanvas.getContext('2d')

firstPersonCanvas.width = window.innerWidth * 0.4
firstPersonCanvas.height = window.innerHeight * 0.4
firstPersonCanvas.style.border = "1px solid black"


const graph: Graph = new Graph({x: topDownCanvas.width / 50, y: topDownCanvas.height / 50}, {x: topDownCanvas.width, y: topDownCanvas.height})
topDownCtx.clearRect(0,0,topDownCanvas.width,topDownCanvas.height)
graph.generateMaze()
graph.draw(topDownCtx, "black")
const walls = graph.getWalls()
//graph.drawStartAndFinish(topDownCtx, "blue")

const rayCaster = new RayCaster({x:10,y:10}, {x:1,y:1}, Math.PI / 4, firstPersonCanvas.width, topDownCanvas.height)
rayCaster.drawRays(topDownCtx, "green")
rayCaster.castRays(walls)
rayCaster.drawRays(topDownCtx, "red")

const player = new Player(rayCaster, {x:10,y:10}, rayCaster.direction, 5)
player.draw(topDownCtx, "blue")

const screen = new Screen(firstPersonCanvas.width, firstPersonCanvas.height)
screen.drawWalls(firstPersonCtx, rayCaster.getRayLengths(), "black")

const animationLoop = () =>{
    firstPersonCtx.clearRect(0,0,firstPersonCanvas.width,firstPersonCanvas.height)
    topDownCtx.clearRect(0,0,topDownCanvas.width,topDownCanvas.height)
    player.rayCaster.drawRays(topDownCtx, "green")
    player.draw(topDownCtx, "blue")
    graph.draw(topDownCtx, "black")
    screen.drawWalls(firstPersonCtx, player.rayCaster.getRayLengths(), "black")
    
    requestAnimationFrame(animationLoop)
}

const physicsLoop = () =>{
    rayCaster.castRays(walls)

    setTimeout(physicsLoop, 0)
}


document.addEventListener("keydown", (e)=>{
    if(e.key == "ArrowDown"){
        player.updatePosition( addVectors(player.position, scaleVector(player.facing, -1)) )
    }
    if(e.key == "ArrowUp"){
        player.updatePosition( addVectors(player.position, scaleVector(player.facing, 1)) )
    }
    if(e.key == "ArrowLeft"){
        player.rotate(-Math.PI / 50)
    }
    if(e.key == "ArrowRight"){
        player.rotate(Math.PI / 50)
    }
})

animationLoop()
physicsLoop()