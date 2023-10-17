const canvas = document.querySelector("canvas")!
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")!

const circles = [
    { radius: 150, startAngle: -0.2, modAngle: 0.1 },
    { radius: 70, startAngle: 0.2, modAngle: -0.2 },
    { radius: 30, startAngle: 0.2, modAngle: 0.4 },
]

const totalOutput: Point[] = []

function render(_time: number) {
    const time = _time * 0.01
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    
    /* draw and calculate each item of fourier series */
    const output = circles.reduce((acc, circle) => {
        ctx.beginPath()
        ctx.arc(acc.x, acc.y, circle.radius, 0, 2 * Math.PI)
        ctx.stroke()
        const newPos = {
            x: acc.x + Math.sin(circle.startAngle + time * circle.modAngle) * circle.radius,
            y: acc.y - Math.cos(circle.startAngle + time * circle.modAngle) * circle.radius,
        }

        ctx.beginPath()
        ctx.moveTo(acc.x, acc.y)
        ctx.lineTo(newPos.x, newPos.y)
        ctx.stroke()

        return newPos
    }, { x: 300, y: 300 })

    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(output.x, output.y, 8, 0, 2 * Math.PI)
    ctx.fill()

    /* draw the output of so far computed fourier series */

    totalOutput.push(output)

    ctx.strokeStyle = "red"
    ctx.beginPath()
    totalOutput.forEach((point, index) => {
        ctx[index === 0 ? "moveTo" : "lineTo"](point.x, point.y)
    })
    ctx.stroke()

    requestAnimationFrame(render)
}

requestAnimationFrame(render)