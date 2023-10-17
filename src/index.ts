const canvas = document.querySelector("canvas")!
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")!
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height)

const circles = Array.from({ length: 100 }, (_, index) => {
    const n = index * 2 + 1
    return {
        radius: 4 / (n * Math.PI), startAngle: 0, modAngle: n
    }
})

const fourierSeriesOutput: Point[] = []

let time = 0
function render(_time: number) {
    time -= 0.05

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fill();

    ctx.strokeStyle = "white"
    
    /* draw and calculate each item of fourier series */
    const output = circles.reduce((acc, circle) => {
        const scaledRadius = circle.radius * 100
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.arc(acc.x, acc.y, scaledRadius, 0, 2 * Math.PI)
        ctx.stroke()
        const newPos = {
            x: acc.x + Math.cos(circle.startAngle + time * circle.modAngle) * scaledRadius,
            y: acc.y - Math.sin(circle.startAngle + time * circle.modAngle) * scaledRadius,
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
    if (fourierSeriesOutput.length > 500) fourierSeriesOutput.pop()

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