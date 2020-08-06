/**
 * @author xieyanghao
 * @date 2020-2020/2/29-12:07 下午
 * 物体在canvas下面下落，如何避免全局重绘，背景复杂的处理情况
 */
"use strict";

const url = "https://91happy.oss-cn-shenzhen.aliyuncs.com/imgs/avatar.jpg";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let save = document.getElementById("save");
let y = 0;
let globalID;
let pre;

let img = new Image();
img.src = url;
img.crossOrigin = "*";
img.onload = function () {
    ctx.drawImage(img, 0, 0);
    pre = ctx.getImageData(240, y, 20, 20);

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
};

/**
 * @description 将图像复原为之前的状态，储存接下来的背景，画上物体。
 */
function fall(){
    if (y >canvas.height) y = -20;
    ctx.putImageData(pre, 240, y);
    pre = ctx.getImageData(240, y+1, 20, 20);
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
