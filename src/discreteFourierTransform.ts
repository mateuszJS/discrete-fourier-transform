interface Fourier {
    re: number
    im: number
    amplitude: number // radius of the circle
    frequency: number // how many rotation this circle does per unit of time
    phase: number // start angle
}

export default function dft(x: number[]) {
    const X: Fourier[] = []
    const N = x.length

    for (let k = 0; k < N; k++) { // k -> frequency of particular way pattern in that slot
        let re = 0
        let im = 0

        for (let n = 0; n < N; n++) {
            const phi = 2 * Math.PI * k * n / N // angle
            re += x[n] * Math.cos(phi)
            im -= x[n] * Math.sin(phi)
        }

        re /= N // average sum contribution voer N
        im /= N // they say it's sandard this for DFT

        const angle = Math.atan2(im, re)

        X[k] = {
            re,
            im,
            amplitude: Math.hypot(re, im),
            // amplitude: im / Math.sin(angle),
            frequency: k,
            phase: angle,
        }
    }

    return X
}