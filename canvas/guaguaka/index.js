"use strict";
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let flag = true;   // 是否可以开始刮奖标识
let mouseDown = false;
let lastX, lastY;
let width = canvas.width,
    height = canvas.height;
let alpha_c = 0;

function genBackground(text) {
    let bgcanvas = document.createElement('canvas');
    bgcanvas.height = height;
    bgcanvas.width = width;
    let bgctx = bgcanvas.getContext('2d');
    bgctx.fillStyle = "white";
    bgctx.font = "40px Arial";
    bgctx.fillRect(0, 0, width, height);
    bgctx.fillStyle = "red";
    bgctx.fillText(text, calPosition(text), 130);
    return `url(${bgcanvas.toDataURL('image/jpeg')})`;
}

function calPosition(text){
    let l = String(text).length;
    return (700 - l * 40) / 2 -20
}

function scrapeInit() {
    canvas.onmousedown = (e) => {
        if (flag) {
            mouseDown = true;
            draw(e.offsetX, e.offsetY, false);
        }
    };

    canvas.onmousemove = (e) => {
        if (flag) {
            if (mouseDown) {
                draw(e.offsetX, e.offsetY, true);
            }
        }
    };

    canvas.onmouseleave = () => {
        mouseDown = false;
        juge();
    };

    canvas.onmouseup = () => {
        mouseDown = false;
        // 判断划开面积有多少，超过百分之40则全部划开
        juge();
    };

    function juge() {
        let imgd = ctx.getImageData(0, 0, width, height).data;
        const area = width * height;
        const Threshold = Math.floor(area * 0.4);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width * 4; j+=4) {
                let a = imgd[i * width * 4 + j + 3];
                if (alpha_c >= Threshold) {
                    ctx.clearRect(0, 0, width, height);
                    return;
                } else if (a === 0) {
                    alpha_c++;
                }
            }
        }
    }

    function draw(x, y, isDown) {
        if (isDown) {
            ctx.beginPath();
            ctx.lineWidth = 40;
            ctx.lineJoin = "round";
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
        lastX = x;
        lastY = y;
    }
}

function init() {
    let b64 = genBackground('奖励香吻一个');
    canvas.style.background = b64;
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, width, height);
    canvas.style.display = "block";
    ctx.globalCompositeOperation = "destination-out";
    scrapeInit();
}

function reset(text) {
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, width, height);
    let b64 = genBackground(text);
    ctx.globalCompositeOperation = "destination-out";
    canvas.style.background = b64;
    scrapeInit();
}

init();