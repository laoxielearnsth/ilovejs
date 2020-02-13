/**
 * @author xieyanghao
 * @date 2020-2020/2/4-2:41 下午
 */
"use strict";

const GRAY = "#e1e1e1";
const BLUE = "#21c9f3";
const DEEPGRAY = "#818181";
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
        width: 800,
        height: 800,
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
    allGrid = Array.from({length: r_num}, () => (Array.from({length: c_num}, (() => ({status: "susceptible"})))));
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
    // todo 初始感染者 和 免疫者
    for (let r = 0; r < r_num; r++) {
        for (let c = 0; c < c_num; c++) {
            if (random(immunity)) {
                changeStatus("removed", r, c);
                drawRect(c * gwidth, r * gheight, DEEPGRAY, ctx);
            }
        }
    }
    let coors = [[19, 19], [19, 20], [19, 21],
        [20, 19], [20, 20], [20, 21],
        [21, 19], [21, 20], [21, 21]];
    for (let coor of coors) {
        changeStatus("infected", coor[0], coor[1]);
        infected.push(coor);
        drawRect(coor[1] * gwidth, coor[0] * gheight, BLUE, ctx);
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
        let round = choice(all, degree);
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
            drawRect(i[1] * gwidth, i[0] * gheight, GRAY, ctx);
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