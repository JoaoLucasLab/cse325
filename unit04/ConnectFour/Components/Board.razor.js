// Sound effects for the Connect Four board, synthesized with the Web Audio API
// so the project doesn't need any audio files.

let ctx;

function audio() {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
}

// Plays a single tone that can slide from one pitch to another and fades out
function tone({ freq, endFreq = freq, start = 0, duration = 0.2, type = "sine", volume = 0.2 }) {
    const ac = audio();
    const t = ac.currentTime + start;
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + duration);
}

// Seconds until the piece first hits the bottom, matching the drop1..drop6
// animations in Board.razor.css (they land at 75% of their duration)
const landingTime = { 1: 0.75, 2: 1.125, 3: 1.2, 4: 1.275, 5: 1.35, 6: 1.425 };

function thud(start, volume) {
    tone({ freq: 160, endFreq: 50, start, duration: 0.18, volume });
    tone({ freq: 900, endFreq: 300, start, duration: 0.04, type: "triangle", volume: volume / 3 });
}

export function playDrop(row) {
    const land = landingTime[row] ?? 1;
    const duration = land / 0.75;

    // Pop when the piece is released, a falling whistle, then a thud and two bounces
    tone({ freq: 600, endFreq: 900, duration: 0.06, type: "triangle", volume: 0.15 });
    tone({ freq: 700, endFreq: 250, duration: land, volume: 0.03 });
    thud(land, 0.35);
    thud(duration * 0.9, 0.15);
    thud(duration * 0.97, 0.06);
}

export function playWin(row) {
    const start = (landingTime[row] ?? 1) / 0.75;
    [523, 659, 784, 1047].forEach((freq, i) =>
        tone({ freq, start: start + i * 0.12, duration: i === 3 ? 0.6 : 0.15, type: "triangle", volume: 0.25 }));
}

export function playTie(row) {
    const start = (landingTime[row] ?? 1) / 0.75;
    tone({ freq: 440, start, duration: 0.25, type: "triangle" });
    tone({ freq: 392, start: start + 0.3, duration: 0.5, type: "triangle" });
}

export function playError() {
    tone({ freq: 140, duration: 0.15, type: "square", volume: 0.08 });
    tone({ freq: 110, start: 0.17, duration: 0.25, type: "square", volume: 0.08 });
}

export function playReset() {
    tone({ freq: 300, endFreq: 1200, duration: 0.25, type: "triangle", volume: 0.15 });
}
