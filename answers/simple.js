/**
 * @author xieyanghao
 * @date 2020-2020/2/29-11:58 上午
 * @description 物体在canvas下面下落，如何避免全局重绘的简单情况，如果形状已知
 */
"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let save = document.getElementById("save");
let y = 0;
let globalID;

ctx.save();
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.restore();

function fall(){
    if (y >500) y = -20;
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(240, y, 20, 20);
    ctx.restore();
    ctx.fillRect(240, y+1, 20, 20);
    y ++;
}

function animate(timestamp, elapsed) {
    // exit condition
    if (elapsed > 1000 / 60) {
        // do something
        fall();
        elapsed = 0;
    }
    globalID = requestAnimationFrame(_timestamp => {
        animate(_timestamp, elapsed + _timestamp - timestamp);
    });
}

function play() {
    globalID = requestAnimationFrame(timestamp =>{
        animate(timestamp, 0);
    });
}

btn.addEventListener("click", function (ev) {
    if (globalID) {
        cancelAnimationFrame(globalID);
        globalID = undefined;
        ev.target.innerText = "开始播放";
    } else {
        play();
        ev.target.innerText = "暂停";
    }
});

save.addEventListener("click", function (ev) {
    console.log(canvas.toDataURL("image/jpeg"));
});