import dft from "discreteFourierTransform";

const canvas = document.querySelector("canvas")!
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")!
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height)


// const signal = [-100,-100,-100,100,100,100,-100,-100,-100,100,100,100,-100,-100,-100,100,100,100]
const signal = Array.from({ length: 100 }, (_, index) => index)
// const signal = Array.from({ length: 100 }, () => Math.random() * 100 - 50)
const fourierTransform = dft(signal)
fourierTransform.sort((a,b) => b.amplitude - a.amplitude) // optional, just visual. But still I have no clue how sorting doesn't affect the effect!
console.log(fourierTransform)

// const circles = Array.from({ length: 100 }, (_, index) => {
//     const n = index * 2 + 1
//     return {
//         radius: 4 / (n * Math.PI), startAngle: 0, modAngle: n
//     }
// })

let fourierSeriesOutput: Point[] = []

let time = 0
const dt = 2 * Math.PI / fourierTransform.length // dlta time
function render(_time: number) {
    time += dt

    if (time > Math.PI * 2) {
        time = 0
        fourierSeriesOutput = []
    }

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fill();

    ctx.strokeStyle = "white"
    
    /* draw and calculate each item of fourier series */
    const output = fourierTransform.reduce((acc, circle) => {
        const scaledRadius = circle.amplitude
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.arc(acc.x, acc.y, scaledRadius, 0, 2 * Math.PI)
        ctx.stroke()
        const newPos = {
            x: acc.x + Math.sin(circle.phase + time * circle.frequency) * scaledRadius,
            y: acc.y - Math.cos(circle.phase + time * circle.frequency) * scaledRadius,
        }

        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.moveTo(acc.x, acc.y)
        ctx.lineTo(newPos.x, newPos.y)
        ctx.stroke()

        return newPos
    }, { x: 150, y: 300 })

    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(output.x, output.y, 8, 0, 2 * Math.PI)
    ctx.fill()

    /* draw the output of so far computed fourier series */

    fourierSeriesOutput.unshift(output)

    ctx.strokeStyle = "red"
    ctx.beginPath()
    ctx.moveTo(output.x, output.y)
    fourierSeriesOutput.forEach((point, index) => {
        ctx.lineTo(400 + index * 2, point.y)
    })
    ctx.stroke()

    requestAnimationFrame(render)
}

requestAnimationFrame(render)