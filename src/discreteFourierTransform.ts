interface Fourier {
    sum: Complex
    amplitude: number // radius of the circle
    frequency: number // how many rotation this circle does per unit of time
    phase: number // start angle
}

export interface Complex {
    re: number
    im: number
}

function timesComplex(a: Complex, b: Complex) {
    return {
        re: a.re * b.re - a.im * b.im,
        im: a.re * b.im + a.im * b.re
    }
}

export default function dft(x: Complex[]) {
    const X: Fourier[] = []
    const N = x.length

    for (let k = 0; k < N; k++) { // k -> frequency of particular way pattern in that slot
        let sum: Complex = { re: 0, im: 0 }

        for (let n = 0; n < N; n++) {
            const phi = 2 * Math.PI * k * n / N // angle
            const angleComplex: Complex = { re: Math.cos(phi), im: -Math.sin(phi) }
            const multiResult = timesComplex(x[n], angleComplex)
            sum.re += multiResult.re
            sum.im += multiResult.im
        }

        sum.re /= N // average sum contribution voer N
        sum.im /= N // they say it's sandard this for DFT

        const angle = Math.atan2(sum.im, sum.re)

        X[k] = {
            sum,
            amplitude: Math.hypot(sum.re, sum.im),
            // amplitude: im / Math.sin(angle),
            frequency: k,
            phase: angle,
        }
    }

    return X
}