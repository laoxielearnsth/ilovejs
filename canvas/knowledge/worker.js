/**
 * @author xieyanghao
 * @date 2020-2020/2/4-2:41 下午
 */
"use strict";

// 将方格设置为25*25
// 假设自愈率为50%
const GRAY = "#e1e1e1";
const BLUE = "#21c9f3";
const DEEPGRAY = "#818181";
const C1 = "#a5d144";
const C2 = "#03d132";
const C3 = "#21c9f3";
const C4 = "#ce53d1";
let colorList = [C1, C2, C3, C4];

let allGrid, infected = [[], [], [], []];
let gwidth = 20, gheight = 20;
let canvas, ctx;
let globalID;
let rate = 50;
let rate2 = 0;
let immunity = 5;
let c_num, r_num;
let raws = [[10, 10], [10, 30], [30, 30], [30, 10]];
let grids;
let s = 4;
let highestlv = 1;


onmessage = function (e) {
    let data = e.data;
    canvas = canvas ? canvas : data.canvas;
    ctx = ctx ? ctx : canvas.getContext('2d');
    if (data.msg === "init") {
        init();
    } else if (data.msg === "step") {
        globalID ? exitPlay(globalID) : null;
        test(s);
        s === 1 ? s = 4 : s--;
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
    }
};

function init() {
    infected = [[], [], [], []];
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
    allGrid = Array.from({length: r_num}, () => (Array.from({length: c_num}, (() => ({status: "susceptible", lv: 0})))));
    grids = Array.from({length: c_num * r_num}, () => ({status: "susceptible", lv: 0}));

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
                changeLV(-1, r, c);
                drawRect(c * gwidth, r * gheight, DEEPGRAY, ctx);
                grids[r * width / gwidth + c] = {status: "removed", lv: -1};
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        let [r, c] = raws[i];
        drawRect(c * gwidth, r * gheight, colorList[i], ctx);
        changeLV(i + 1, r, c);
        changeStatus("always", r, c);
        infected[i].push([r, c]);
        grids[r * width / gwidth + c] = {status: "always", lv: i + 1};
    }
    // initCity([10, 10], 3, 4, C1);
}

// todo 修改传播逻辑
function spread(index) {
    let tem = infected[index];
    let nextRound = [raws[index]];
    // 自发激活 为0 忽略
    for (let r = 0; r < r_num; r++) {
        for (let c = 0; c < c_num; c++) {
            if (random(rate2) && allGrid[r][c].status === "susceptible") {
                changeStatus("infected", r, c);
                infected.push([r, c]);
                drawRect(c * gwidth, r * gheight, BLUE, ctx);
            }
        }
    }
    for (let i of tem) {
        let rc = 0;
        let up = [i[0] - 1, i[1]],
            down = [i[0] + 1, i[1]],
            left = [i[0], i[1] - 1],
            right = [i[0], i[1] + 1];
        let round = [up,down,left,right];
        for (let dir of round) {
            if (dir[0] >= 0 && dir[1] >= 0 && dir[0] < r_num && dir[1] < c_num) {
                if (allGrid[dir[0]][dir[1]].lv === index && random(rate)) {
                    rc += 1;
                    changeStatus("infected", dir[0], dir[1]);
                    changeLV(index + 1, dir[0], dir[1]);
                    drawRect(dir[1] * gwidth, dir[0] * gheight, colorList[index], ctx);
                    nextRound.push(dir);
                    // todo 如何删除被转变的低等级节点

                }
            }
        }
        if (random(100 - rate, rc) && allGrid[i[0]][i[1]].status === "infected") {
            drawRect(i[1] * gwidth, i[0] * gheight, GRAY, ctx);
            changeStatus("susceptible", i[0], i[1]);
            changeLV(0, i[0], i[1]);
        } else {
            nextRound.push(i);
        }
    }
    infected[index] = nextRound;
}

// 四轮的话太傻了
// todo 优化
function test(lv) {
    let nextround = JSON.parse(JSON.stringify(grids));
    for (let i = 0; i < grids.length; i++) {
        let times = 0;
        if (0 < grids[i].lv <= lv + 1) {
            let up = i - r_num,
                left = i - 1,
                right = i + 1,
                down = i + r_num;
            let round;
            if (i % c_num === 0) {
                round = [up, down, right];
            } else if (i % c_num === c_num - 1) {
                round = [up, down, left];
            } else {
                round = [up, down, left, right];
            }

            for (let dir of round) {
                if (dir >= 0 && dir < grids.length && grids[dir].lv !== -1) {
                    if (grids[dir].lv < highestlv && random(rate)) {
                        highestlv = Math.max(highestlv, lv);
                        times += 1;
                        nextround[dir] = {status: "infected", lv: lv};
                        drawRect((dir % c_num) * gwidth, Math.floor(dir / c_num) * gheight, colorList[lv - 1], ctx);
                    }
                }
            }
            // 自愈
            if (random(100 - rate, times) && grids[i].status !== "always" && grids[i].lv > 0) {
                drawRect((i % c_num) * gwidth, Math.floor(i / c_num) * gheight, GRAY, ctx);
                nextround[i] = {status: "susceptible", lv: 0};
            }
        }
    }
    grids = nextround;
}

function play() {
    globalID = requestAnimationFrame(timestamp => animate(timestamp, 0));
}

function animate(timestamp, elapsed) {
    if (infected.length === 0) return;
    if (elapsed > 1000 / 8) {
        for (let i = 4; i > 0; i--) {
            test(i);
        }
        elapsed = 0;
    }
    globalID = requestAnimationFrame(_timestamp => animate(_timestamp, elapsed + _timestamp - timestamp));
}

function spread2() {
    for (let i = 3; i >= 0; i--) {
        spread(i);
    }
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

function changeLV(lv, row, col) {
    allGrid[row][col].lv = lv;
}

function random(rate, times = 1) {
    rate = (rate / 100) ** times;
    return Math.random() <= rate;
}

function exitPlay(id) {
    cancelAnimationFrame(id);
    globalID = undefined;
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