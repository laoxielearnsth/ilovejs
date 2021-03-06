/**
 * @author xieyanghao
 * @date 2020-2020/2/4-2:38 下午
 */
"use strict";

let canvas = document.getElementById('canvas');
let offscreen = canvas.transferControlToOffscreen();
let worker = new Worker("./worker.js");
let modify = document.getElementById('modify');
worker.postMessage({msg:'init', canvas: offscreen}, [offscreen]);

function reset() {
    worker.postMessage({msg: "reset"})

}
function step() {
    worker.postMessage({msg: "step"})
}
function play() {
    worker.postMessage({msg: "play"})
}

function changeRate() {
    let box = document.getElementById('box');
    let rate = document.getElementById('rate').value;
    box.innerText = "传染率: " + rate;
    worker.postMessage({msg: 'rate', rate: rate});
}

function changeRate2() {
    let box2 = document.getElementById('box2');
    let rate2 = document.getElementById('rate2').value;
    box2.innerText = "自发率: " + rate2;
    worker.postMessage({msg: 'rate2', rate: rate2});
}

function changeImmunity() {
    let rate = document.getElementById('immunity').value;
    let box = document.getElementById("box3");
    box.innerText = "免疫率: " + rate;
    worker.postMessage({msg: 'immunity', rate: rate});
}

function changeDgree() {
    let degree = document.getElementById('degree').value;
    let box = document.getElementById('box4');
    box.innerText = "度: " + degree;
    worker.postMessage({msg: 'degree', degree: degree});
}

function resize(e) {
    e.preventDefault();
    let width = document.getElementById('width').value;
    let height = document.getElementById('height').value;
    let gwidth = document.getElementById('gwidth').value;
    let gheight = document.getElementById('gheight').value;
    let info = {
        width: parseInt(width),
        height: parseInt(height),
        gwidth: parseInt(gwidth),
        gheight: parseInt(gheight)
    };
    worker.postMessage({msg:'resize', info: info})
}

modify.addEventListener('click', resize);