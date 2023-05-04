import { Graph } from "../Types/Graph"
import { RayCaster } from "../Types/RayCaster"
import { Screen } from "../Types/Screen"
import { Player } from "../Types/Player"

const topDownCanvas: any = document.getElementById("top-down")
const topDownCtx = topDownCanvas.getContext('2d')
const topCanvasScale = 0.2
topDownCanvas.width = window.innerWidth * topCanvasScale
topDownCanvas.height = window.innerHeight * topCanvasScale
topDownCtx.scale(topCanvasScale * 1.5, topCanvasScale * 1.5)

const firstPersonCanvas: any = document.getElementById("first-person")
const firstPersonCtx = firstPersonCanvas.getContext('2d')
firstPersonCanvas.width = window.innerWidth * 0.9
firstPersonCanvas.height = window.innerHeight * 0.9
firstPersonCanvas.style.border = "1px solid black"

const graph: Graph = new Graph({x: 10, y: 10}, {x: 500, y: 500})
topDownCtx.clearRect(0,0,topDownCanvas.width,topDownCanvas.height)
graph.generateMaze()
graph.draw(topDownCtx, "black")
const walls = graph.getWalls()

const screen = new Screen(firstPersonCanvas.width, firstPersonCanvas.height, 5)

const rayCaster = new RayCaster({x:10,y:10}, {x:1,y:1}, Math.PI / 4, firstPersonCanvas.width / 2, screen.diagonal)
rayCaster.drawRays(topDownCtx, "green")
rayCaster.castRays(walls)
rayCaster.drawRays(topDownCtx, "red")

const player = new Player(rayCaster, {x:10,y:10}, rayCaster.direction, 5)
player.drawTopDown(topDownCtx, "blue")

const drawBackground = (ctx: CanvasRenderingContext2D, skyColor: string, groundColor: string) =>{
    ctx.fillStyle = skyColor
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2)
    ctx.fillStyle = groundColor
    ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height / 2)
}

const animationLoop = () =>{
    firstPersonCtx.clearRect(0,0,firstPersonCanvas.width,firstPersonCanvas.height)
    topDownCtx.clearRect(0,0,topDownCanvas.width*5,topDownCanvas.height*5)
    drawBackground(firstPersonCtx, "lightblue", "rgb(71, 42, 42)")
    player.rayCaster.drawRays(topDownCtx, "green")
    player.drawTopDown(topDownCtx, "blue")
    player.drawFirstPerson(firstPersonCtx)
    graph.draw(topDownCtx, "black")
    screen.drawWalls(firstPersonCtx, player.rayCaster.rays)
    
    requestAnimationFrame(animationLoop)
}

const physicsLoop = (lastCalled: number) =>{
    rayCaster.castRays(walls)
    const timeDelta = performance.now() - lastCalled
    player.applyMomentum(timeDelta, graph.getWalls())
    setTimeout(()=>{physicsLoop(performance.now())}, 0)
}

const pixelDifferenceToRadians = (difference: number) => {
    return difference * (Math.PI / firstPersonCanvas.width)
}

firstPersonCanvas.addEventListener("click", ()=>[
    firstPersonCanvas.requestPointerLock()
])

document.addEventListener("keydown", (e)=>{
    if (e.repeat) { return }
    if(e.key == "ArrowDown" || e.key == "s"){
        player.acceleration.y = -player.maxAcceleration
    }
    if(e.key == "ArrowUp" || e.key == "w"){
        player.acceleration.y = player.maxAcceleration
    }
    if(e.key == "ArrowLeft" || e.key == "a"){
        player.acceleration.x = -player.maxAcceleration
    }
    if(e.key == "ArrowRight" || e.key == "d"){
        player.acceleration.x = player.maxAcceleration
    }
})

document.addEventListener("keyup", (e)=>{
    if(e.key == "ArrowDown" || e.key == "s"){
        player.acceleration.y = 0
    }
    if(e.key == "ArrowUp" || e.key == "w"){
        player.acceleration.y = 0
    }
    if(e.key == "ArrowLeft" || e.key == "a"){
        player.acceleration.x = 0
    }
    if(e.key == "ArrowRight" || e.key == "d"){
        player.acceleration.x = 0
    }
})

firstPersonCanvas.addEventListener("mousemove", (e: any)=>{
    player.rotate(pixelDifferenceToRadians(e.movementX))
})

animationLoop()
physicsLoop(performance.now())