/**
 * @author xieyanghao
 * @date 2020-2020/2/29-1:55 下午
 */
"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let btn = document.getElementById("btn");
let save = document.getElementById("save");
let stars = [];
let y = 0;
let globalID;

ctx.save();
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.restore();

class Star {
    constructor(r,v,x,y) {
        this.r = r;
        this.v = v;
        this.x = x;
        this.y = y;
    }

    fall(i) {
        if (this.y - this.r > canvas.height) {
            stars.splice(i, 1);
            return;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        this.y += this.v;
    }
}

function init(num) {
    for (let i = 0; i < num; i++) {
        let x= parseInt(Math.random() * 700),
            y= parseInt(Math.random() * 100),
            r= 5 + parseInt(Math.random() * 20),
            v = 2 + parseInt(Math.random() * 8);
        let star = new Star(r, v, x, y);
        stars.push(star);
    }
}

function fall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = stars.length-1; i >= 0; i--) {
        stars[i].fall(i);
    }
}

function animate(timestamp, elapsed) {
    // exit condition
    if (stars.length ===0) return;
    if (elapsed > 1000 / 60) {
        // do something
        fall(stars);
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
    if (stars.length === 0) {
        init(30);
    }
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
