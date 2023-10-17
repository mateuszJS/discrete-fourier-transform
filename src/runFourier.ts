import dft, { Complex } from "discreteFourierTransform"

export default function runFourier(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, signal: Complex[], origin: Point, beforeDrawCb: VoidFunction) {
    const fourierTransform = dft(signal)
    fourierTransform.sort((a,b) => b.amplitude - a.amplitude) // optional, just visual. But still I have no clue how sorting doesn't affect the effect!

    let fourierSeriesOutput: Point[] = []

    let time = 0
    const dt = 2 * Math.PI / fourierTransform.length // dlta time
    function renderFourier() {
        time += dt

        if (time > Math.PI * 2) {
            time = 0
            fourierSeriesOutput = []
        }

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fill();

        beforeDrawCb()

        ctx.strokeStyle = "white"
        
        /* draw and calculate each item of fourier series */
        const output = fourierTransform.reduce((acc, circle) => {
            const scaledRadius = circle.amplitude
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.arc(acc.x, acc.y, scaledRadius, 0, 2 * Math.PI)
            ctx.stroke()
            const newPos = {
                x: acc.x + Math.sin(circle.phase + time * circle.frequency + Math.PI / 2) * scaledRadius,
                y: acc.y - Math.cos(circle.phase + time * circle.frequency + Math.PI / 2) * scaledRadius,
            }

            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.moveTo(acc.x, acc.y)
            ctx.lineTo(newPos.x, newPos.y)
            ctx.stroke()

            return newPos
        }, origin)

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
            ctx.lineTo(point.x, point.y)
        })
        ctx.stroke()

        requestAnimationFrame(renderFourier)
    }

    requestAnimationFrame(renderFourier)
}