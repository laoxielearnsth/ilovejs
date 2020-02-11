/**
 * @author xieyanghao
 * @date 2020-2020/2/4-2:41 下午
 */
"use strict";

// 将方格设置为25*25
// 假设自愈率为50%
const GRAY = "#e1e1e1";
const BLUE = "#21c9f3";
let allGrid, infected;
const grid_W = 20;
let canvas, ctx;
let globalID;
let rate = 50;
let rate2 = 1;

onmessage = function (e) {
    let data = e.data;
    canvas = canvas ? canvas : data.canvas;
    ctx = ctx ? ctx : canvas.getContext('2d');
    globalID ? cancelAnimationFrame(globalID) : null;
    if (data.msg === "init"){
        init(true);
    } else if (data.msg === "step") {
        spread();
    } else if (data.msg === "reset") {
        init(false);
    } else if (data.msg === "play") {
        play();
    } else if (data.msg === "rate") {
        rate = parseInt(data.rate);
    } else if (data.msg === "rate2") {
        rate2 = parseInt(data.rate);
    }
};

function init(bol) {
    let width = canvas.width,
        height = canvas.height;
    if (bol) ctx.translate(0.5, 0.5);
    allGrid = Array.from({length: 25}, () => (Array.from({length: 25}, (() => ({status: "susceptible"})))));
    changeStatus("infected", 12, 12);
    infected = [[12, 12]];
    ctx.fillStyle = GRAY;
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    for (let i = 0; i < width; i += grid_W) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, width);
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
    }
    ctx.stroke();
}

function spread() {
    console.time('com');
    let nextRound = [];
    // 自发
    for (let r = 0; r < 25; r++) {
        for (let c = 0; c < 25; c++) {
            if (allGrid[r][c].status === "susceptible") {
                if (random(rate2)) {
                    allGrid[r][c]['status'] = "infected";
                    infected.push([r, c]);
                    drawRect(c * grid_W, r * grid_W, BLUE, ctx);
                }
            }
        }
    }
    for (let i of infected) {
        let up = [i[0] - 1, i[1]],
            down = [i[0] + 1, i[1]],
            left = [i[0], i[1] - 1],
            right = [i[0], i[1] + 1];
        let round = [up,down,left,right];
        for (let dir of round){
            if (dir[0] >= 0 && dir[1] >= 0 && dir[0] < 25 && dir[1] < 25 && allGrid[dir[0]][dir[1]].status === "susceptible" && random(rate)) {
                allGrid[dir[0]][dir[1]].status = "infected";
                nextRound.push(dir);
                drawRect(dir[1] * grid_W, dir[0] * grid_W, BLUE, ctx);
            }
        }
        // todo 传播完后自愈是否恰当？
        if (random(90)){
            allGrid[i[0]][i[1]].status = "susceptible";
            drawRect(i[1] * grid_W, i[0] * grid_W, GRAY, ctx)
        } else {
            nextRound.push(i);
        }
    };
    infected = nextRound;
    console.timeEnd('com');
}

function play() {
    globalID = requestAnimationFrame(timestamp => animate(timestamp, 0));
}

function animate(timestamp, elapsed) {
    if (infected.length === 0) return;
    if (elapsed > 1000 / 8) {
        spread();
        elapsed = 0;
    }
    globalID = requestAnimationFrame(_timestamp => animate(_timestamp, elapsed + _timestamp - timestamp));
}

function drawRect(x,y,color,ctx) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x + 0.5, y + 0.5, 19, 19);
    ctx.restore();
}

function changeStatus(status,row,col) {
    allGrid[row][col].status = status;
}

function random(rate) {
    return Math.random() * 100 <= rate;
}