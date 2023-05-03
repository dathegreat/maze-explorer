import { Graph } from "../Types/Graph"
import { RayCaster } from "../Types/RayCaster"
import { Screen } from "../Types/Screen"
import { Player } from "../Types/Player"
import { addVectors, angleBetweenVectors, scaleVector, subtractVectors } from "../Types/VectorMath"
import { Point } from "../Types/Point"

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

const rayCaster = new RayCaster({x:10,y:10}, {x:1,y:1}, Math.PI / 4, firstPersonCanvas.width/2, topDownCanvas.height)
rayCaster.drawRays(topDownCtx, "green")
rayCaster.castRays(walls)
rayCaster.drawRays(topDownCtx, "red")

const player = new Player(rayCaster, {x:10,y:10}, rayCaster.direction, 5)
player.draw(topDownCtx, "blue")

const screen = new Screen(firstPersonCanvas.width, firstPersonCanvas.height)
screen.drawWalls(firstPersonCtx, rayCaster.getRayLengths(), "black")

const drawBackground = (ctx: CanvasRenderingContext2D, skyColor: string, groundColor: string) =>{
    ctx.fillStyle = skyColor
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2)
    ctx.fillStyle = groundColor
    ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height / 2)
}

const animationLoop = () =>{
    firstPersonCtx.clearRect(0,0,firstPersonCanvas.width,firstPersonCanvas.height)
    topDownCtx.clearRect(0,0,topDownCanvas.width,topDownCanvas.height)
    drawBackground(firstPersonCtx, "lightblue", "rgb(71, 42, 42)")
    player.rayCaster.drawRays(topDownCtx, "green")
    player.draw(topDownCtx, "blue")
    graph.draw(topDownCtx, "black")
    screen.drawWalls(firstPersonCtx, player.rayCaster.getRayLengths(), "rgba(0,0,0,1)")
    
    requestAnimationFrame(animationLoop)
}

const physicsLoop = () =>{
    rayCaster.castRays(walls)
    player.applyMomentum()
    if(lastMouseXPosition > firstPersonCanvas.width * 0.99){
        player.rotate(pixelDifferenceToRadians(Math.log(lastMouseXPosition - (firstPersonCanvas.width * 0.99))))
    }
    if(lastMouseXPosition < firstPersonCanvas.width * 0.01){
        player.rotate(-pixelDifferenceToRadians(Math.log((firstPersonCanvas.width * 0.01) - lastMouseXPosition)))
    }


    setTimeout(physicsLoop, 0)
}

const mouseLocationToRadians = (location: Point) =>{
    const centerScreen = {x: firstPersonCanvas.width / 2, y: firstPersonCanvas.height / 2}
    return ((location.x - centerScreen.x) / centerScreen.x) * (Math.PI / 4)
}

const pixelDifferenceToRadians = (difference: number) => {
    return difference * (Math.PI / firstPersonCanvas.width)
}


document.addEventListener("keydown", (e)=>{
    if(e.key == "ArrowDown"){
        player.acceleration.y = -player.maxAcceleration
    }
    if(e.key == "ArrowUp"){
        player.acceleration.y = player.maxAcceleration
    }
    if(e.key == "ArrowLeft"){
        player.acceleration.x = -player.maxAcceleration
    }
    if(e.key == "ArrowRight"){
        player.acceleration.x = player.maxAcceleration
    }
})

document.addEventListener("keyup", (e)=>{
    if(e.key == "ArrowDown"){
        player.acceleration.y = player.maxAcceleration
    }
    if(e.key == "ArrowUp"){
        player.acceleration.y = -player.maxAcceleration
    }
    if(e.key == "ArrowLeft"){
        player.acceleration.x = player.maxAcceleration
    }
    if(e.key == "ArrowRight"){
        player.acceleration.x = -player.maxAcceleration
    }
})

let lastMouseXPosition = firstPersonCanvas.width / 2
firstPersonCanvas.addEventListener("mousemove", (e: { offsetX: any; offsetY: any })=>{
    const difference = e.offsetX -lastMouseXPosition
    player.rotate(pixelDifferenceToRadians(difference))
    lastMouseXPosition = e.offsetX
})

animationLoop()
physicsLoop()