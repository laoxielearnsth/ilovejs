/**
 * @author xieyanghao
 * @date 2020-2020/2/4-2:41 下午
 */
"use strict";

const GRAY = "#e1e1e1";
const D5 = "#c1c1c1";
const D6 = "#a1a1a1";
const D7 = "#818181";
const DEEPGRAY = "#616161";
let colorList = [GRAY, D5, D6, D7, DEEPGRAY];
const BLUE = "#21c9f3";
let allGrid, infected =[];
let gwidth = 20, gheight = 20;
let canvas, ctx;
let globalID;
let rate = 50;
let rate2 = 0;
let immunity = 0;
let c_num, r_num;
let degree = 4;

onmessage = function (e) {
    let data = e.data;
    canvas = canvas ? canvas : data.canvas;
    ctx = ctx ? ctx : canvas.getContext('2d');
    if (data.msg === "init") {
        init();
    } else if (data.msg === "step") {
        globalID ? exitPlay(globalID) : null;
        spread();
    } else if (data.msg === "reset") {
        globalID ? exitPlay(globalID) : null;
        init();
    } else if (data.msg === "play") {
        globalID ? exitPlay(globalID) : play();
    } else if (data.msg === "rate") {
        rate = parseInt(data.rate);
    } else if (data.msg === "rate2") {
        rate2 = parseInt(data.rate)
    } else if (data.msg === "resize") {
        globalID ? exitPlay(globalID) : null;
        resize(true, data.info);
    } else if (data.msg === "immunity") {
        immunity = data.rate;
    } else if (data.msg === "degree") {
        degree = data.degree;
    }
};

function init() {
    infected = [];
    resize({
        width: 1600,
        height: 1600,
        gwidth: 20,
        gheight: 20
    });
}

function resize(info) {
    let width = info.width,
        height = info.height;
    canvas.width = width;
    canvas.height = height;
    c_num = width / info.gwidth;
    r_num = height / info.gheight;
    ctx.translate(0.5, 0.5);
    allGrid = Array.from({length: r_num}, () => (Array.from({length: c_num}, (() => ({
        status: "susceptible",
        degree: 4
    })))));
    ctx.fillStyle = GRAY;
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    // 正方形的话。这里可以合并
    for (let i = 0; i < width; i += info.gwidth) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
    }
    for (let i = 0; i < height; i += info.gheight) {
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
    }
    ctx.stroke();
    for (let r = 0; r < r_num; r++) {
        for (let c = 0; c < c_num; c++) {
            if (random(immunity)) {
                changeStatus("removed", r, c);
                drawRect(c * gwidth, r * gheight, DEEPGRAY, ctx);
            }
        }
    }
    let coors = [
        [39, 39], [39, 40], [39, 41],
        [40, 39], [40, 40], [40, 41],
        [41, 39], [41, 40], [41, 41]];
    for (let coor of coors) {
        changeStatus("infected", coor[0], coor[1]);
        infected.push(coor);
        drawRect(coor[1] * gwidth, coor[0] * gheight, BLUE, ctx);
    }
    // 初始化city
    let centers = [[20, 20], [60, 60]];
    for (let center of centers) {
        let d = 1;
        for (let r = 8; r > 0; r -= 2) {
            initCity(center, r, d + 4, colorList[d]);
            d+=1;
        }
    }
}

function spread() {
    let nextRound = [];
    // 自发激活
    for (let r = 0; r < r_num; r++) {
        for (let c = 0; c < c_num; c++) {
            if (random(rate2) && allGrid[r][c].status === "susceptible") {
                changeStatus("infected", r, c);
                infected.push([r, c]);
                drawRect(c * gwidth, r * gheight, BLUE, ctx);
            }
        }
    }
    for (let i of infected) {
        let rc = 0;
        let up = [i[0] - 1, i[1]],
            down = [i[0] + 1, i[1]],
            left = [i[0], i[1] - 1],
            right = [i[0], i[1] + 1],
            lu = [i[0] - 1, i[1] - 1],
            ld = [i[0] - 1, i[1] + 1],
            ru = [i[0] + 1, i[1] - 1],
            rd = [i[0] + 1, i[1] + 1];
        let all = [up, down, left, right, lu, ld, ru, rd];
        let round = choice(all, allGrid[i[0]][i[1]].degree);
        for (let dir of round){
            if (dir[0] >= 0 && dir[1] >= 0 && dir[0] < r_num && dir[1] < c_num) {
                if (allGrid[dir[0]][dir[1]].status === "infected") {
                    rc += 1;
                } else if (allGrid[dir[0]][dir[1]].status === "susceptible" && random(rate)) {
                    rc += 1;
                    changeStatus("infected", dir[0], dir[1]);
                    nextRound.push(dir);
                    drawRect(dir[1] * gwidth, dir[0] * gheight, BLUE, ctx);
                }
            }
        }
        if (random(100 - rate, rc)) {
            changeStatus("susceptible", i[0], i[1]);
            switch (allGrid[i[0]][i[1]].degree) {
                case 4:
                    drawRect(i[1] * gwidth, i[0] * gheight, GRAY, ctx);
                    break;
                case 5:
                    drawRect(i[1] * gwidth, i[0] * gheight, D5, ctx);
                    break;
                case 6:
                    drawRect(i[1] * gwidth, i[0] * gheight, D6, ctx);
                    break;
                case 7:
                    drawRect(i[1] * gwidth, i[0] * gheight, D7, ctx);
                    break;
                case 8:
                    drawRect(i[1] * gwidth, i[0] * gheight, DEEPGRAY, ctx);
                    break;
            }
        } else {
            nextRound.push(i);
        }
    }
    infected = nextRound;
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

function random(rate, times = 1) {
    rate = (rate / 100) ** times;
    return Math.random() <= rate;
}

function exitPlay(id) {
    cancelAnimationFrame(id);
    globalID = undefined;
}

function choice(arr, nums, repeat=false) {
    let res = [];
    if (arr.length === 0) return [];
    if (repeat){
        let start = parseInt(Math.random() * arr.length);
        res.push(arr.slice(start));
    } else {
        if (arr.length <= nums) {
            return arr;
        } else {
            while (res.length < nums) {
                let start = parseInt(Math.random() * arr.length);
                res.push(arr.splice(start, 1)[0]);
            }
        }
    }
    return res;
}

function initCity(center, radius, degree, color) {
    let s = center[0] - radius,
        e = center[1] + radius;
    for (let r = s; r < e; r++) {
        for (let c = s; c < e; c++) {
            if (distance([r, c], center, radius)) {
                allGrid[r][c].degree = degree;
                drawRect(c * gwidth, r * gheight, color, ctx);
            }
        }
    }
}

function distance(position, center, radius) {
    let res;
    let x = Math.abs(position[0] - center[0]);
    let y = Math.abs(position[1] - center[1]);
    let ds = Math.sqrt(x * x + y * y);
    ds < radius ?
        res = true : res = false;
    return res;
}
