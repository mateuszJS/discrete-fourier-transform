import { Complex } from "discreteFourierTransform";
import runFourier from "runFourier";
import molaPng from "../assets/mola.png"

const canvas = document.querySelector("canvas")!
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")!
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height)

const img = new Image()
img.src = molaPng

function drawImg() {
    ctx.drawImage(img, 0, 0)
}

img.onload = drawImg



let origin: Point | null = null
const signal: Complex[] = []
function onMouseDown(e: MouseEvent) {
    origin = {
        x: e.clientX,
        y: e.clientY
    }
}
canvas.addEventListener("mousedown", onMouseDown)

function onmouseMove(e: MouseEvent) {
    if (!origin) return
    
    signal.push({
        re: e.clientX - origin.x,
        im: e.clientY - origin.y,
    })

    renderDrawing()
}

canvas.addEventListener("mousemove", onmouseMove)

canvas.addEventListener("mouseup", (e) => {
    if (!origin) return

    canvas.removeEventListener("mousedown", onMouseDown)
    canvas.removeEventListener("mousemove", onmouseMove)

    const shrinkedSignal = signal.filter((_, index) => index % 3 === 0)

    runFourier(canvas, ctx, shrinkedSignal, origin, drawImg)
})


function renderDrawing() {
    ctx.beginPath()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 3
    signal.forEach((point, index) => {
        ctx[index === 0 ? "moveTo" : "lineTo"](point.re + origin!.x, point.im + origin!.y)
    })
    ctx.stroke()
}
