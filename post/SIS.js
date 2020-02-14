let canvas;
let ctx;
const DEEPGRAY = "#a1a1a1";
const GRAY = "#e1e1e1";
const BLUE = "#21c9f3";
let colors = {
    susceptible: GRAY,
    infected: BLUE,
}
const width = 500, height = 500;
const gwidth = 20, gheight = 20;
const rows = height / gheight, cols = width / gwidth;
let globalID;
let grids;
let infected = [];
let playBtn = document.getElementById("play");
let rate = 50;

function init() {
    infected = [];
    canvas.width = width;
    canvas.height = height;
    ctx.translate(0.5, 0.5);
    grids = new Array(rows * cols).fill("susceptible");
    ctx.fillStyle = GRAY;
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    for (let i = 0; i < width; i += gwidth) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
    }
    for (let j = 0; j < height; j += gheight) {
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
    }
    ctx.stroke();
    changestatus(312, "infected", infected);
}

function spread() {
    let nextround = [];
    for (let i of infected) {
        let up = i - cols,
            down = i + cols,
            left = i - 1,
            right = i + 1;
        let round;
        if (i % cols === 0) {
            round = [up, down, right];
        } else if (i % cols === cols - 1) {
            round = [up, down, left];
        } else {
            round = [up, down, left, right];
        }
        let times = 0;
        for (let dir of round) {
            if (grids[dir] === "susceptible" && random(rate)) {
                times += 1;
                changestatus(dir, "infected", nextround);
            }
        }
        // 自愈
        if (random(100 - rate, times)) {
            changestatus(i, "susceptible");
        } else {
            nextround.push(i);
        }
    }
    infected = [...new Set(nextround)];
}

function changestatus(position, status, next = []) {
    grids[position] = status;
    let [r, c] = positiontrans(position);
    drawRect(r, c, colors[status], ctx);
    next.push(position);
    return next;
}

function positiontrans(position) {
    let r = Math.floor(position / cols);
    let c = position % cols;
    return [r, c];
}

function drawRect(r, c, color, ctx) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(c * gwidth + 0.5, r * gheight + 0.5, gwidth - 1, gheight - 1);
    ctx.restore();
}

function play(target) {
    target.innerText === "PLAY"? target.innerText = "||": target.innerText = "PLAY"
    globalID ? pause() : requestAnimationFrame(timestamp => animate(timestamp, 0));
}

function animate(timestamp, elapsed) {
    if (infected.length === 0) return;
    if (elapsed > 1000 / 8) {
        spread();
        elapsed = 0;
    }
    globalID = requestAnimationFrame(_timestamp => animate(_timestamp, elapsed + _timestamp - timestamp));
}

function reset() {
    playBtn.innerText = "PLAY";
    globalID ? pause() : null;
    ctx.translate(-0.5, -0.5);
    init();
}

function step() {
    globalID ? pause() : null;
    spread();
}

function pause() {
    cancelAnimationFrame(globalID);
    globalID = undefined;
}

function random(rate, times = 1) {
    rate = (rate / 100) ** times;
    return Math.random() <= rate;
}

function changerate(target) {
    rate = target.value;
    target.nextElementSibling.innerText = `感染率：${rate}`
}

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    init();
}