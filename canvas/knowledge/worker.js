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
let gwidth = 20, gheight = 20;
let canvas, ctx;
let globalID;
let rate = 50;
let rate2 = 0;
let immunity = 5;
let c_num, r_num;
let raws = [[10, 10], [10, 30], [30, 30], [30, 10]];
let grids;
let infected = [[], [], [], []];
let highestlv = 1;

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
    }
};

function init() {
    infected = [[], [], [], []];
    highestlv = 1;
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
                drawRect(c * gwidth, r * gheight, DEEPGRAY, ctx);
                grids[r * width / gwidth + c] = {status: "removed", lv: -1};
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        let [r, c] = raws[i];
        drawRect(c * gwidth, r * gheight, colorList[i], ctx);
        grids[r * width / gwidth + c] = {status: "always", lv: i + 1};
        infected[i].push(r * c_num + c);
    }
}

// function test(lv) {
//     let nextround = JSON.parse(JSON.stringify(grids));
//     for (let i = 0; i < grids.length; i++) {
//         let times = 0;
//         if (0 < grids[i].lv <= lv + 1) {
//             let up = i - r_num,
//                 left = i - 1,
//                 right = i + 1,
//                 down = i + r_num;
//             let round;
//             if (i % c_num === 0) {
//                 round = [up, down, right];
//             } else if (i % c_num === c_num - 1) {
//                 round = [up, down, left];
//             } else {
//                 round = [up, down, left, right];
//             }
//
//             for (let dir of round) {
//                 if (dir >= 0 && dir < grids.length && grids[dir].lv !== -1) {
//                     if (grids[dir].lv < highestlv && random(rate)) {
//                         highestlv = Math.max(highestlv, lv);
//                         times += 1;
//                         nextround[dir] = {status: "infected", lv: lv};
//                         drawRect((dir % c_num) * gwidth, Math.floor(dir / c_num) * gheight, colorList[lv - 1], ctx);
//                     }
//                 }
//             }
//             // 自愈
//             if (random(100 - rate, times) && grids[i].status !== "always" && grids[i].lv > 0) {
//                 drawRect((i % c_num) * gwidth, Math.floor(i / c_num) * gheight, GRAY, ctx);
//                 nextround[i] = {status: "susceptible", lv: 0};
//             }
//         }
//     }
//     grids = nextround;
// }

function spread() {
    for (let j = 3; j >= 0; j--) {
        let nextround = JSON.parse(JSON.stringify(grids));
        for (let i of infected[j]) {
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
            let rc = 0;
            for (let dir of round) {
                if (dir >= 0 && dir < grids.length && grids[dir].lv !== -1) {
                    // 非免疫节点 且 不超出边界
                    if (grids[i].lv <= highestlv && grids[dir].lv < grids[i].lv && random(rate) && grids[dir].status !== "always") {
                        // 如果该节点 小于等于 最高等级， 则可任意感染比之小的节点
                        // todo 感染比之小的节点
                        rc += 1;
                        nextround[dir] = {status: "infected", lv: grids[i].lv};
                        drawRect((dir % c_num) * gwidth, Math.floor(dir / c_num) * gheight, colorList[grids[i].lv - 1], ctx);
                        infected[j].push(dir);

                        // 如果是infected改变而来的， 删除原先所在
                        if (grids[dir].lv > 0) {
                            let arr = infected[grids[dir].lv - 1];
                            arr.splice(arr.indexOf(dir), 1);
                        }
                    }
                    // 当等级为最高节点等级+1时
                    else if (grids[i].lv === highestlv + 1 && grids[dir].lv === highestlv && random(rate)) {
                        // todo 感染这个小一级的单位
                        nextround[dir].lv += 1;
                        drawRect((dir % c_num) * gwidth, Math.floor(dir / c_num) * gheight, colorList[grids[i].lv - 1], ctx);
                        infected[j].push(dir);
                        // 在下一级移出
                        if (grids[dir].lv > 0) {
                            let arr = infected[grids[dir].lv - 1];
                            arr.splice(arr.indexOf(dir), 1);
                        }
                        // 改变grid中的状态
                        grids[dir].lv += 1;
                        highestlv += 1;
                    }
                }
            }
            infected[j] = [...new Set(infected[j])];
        }
        grids = nextround;
    }
}



function play() {
    globalID = requestAnimationFrame(timestamp => animate(timestamp, 0));
}

function animate(timestamp, elapsed) {
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

function random(rate, times = 1) {
    rate = (rate / 100) ** times;
    return Math.random() <= rate;
}

function exitPlay(id) {
    cancelAnimationFrame(id);
    globalID = undefined;
}