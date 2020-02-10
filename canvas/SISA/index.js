/**
 * @author xieyanghao
 * @date 2020-2020/2/4-2:38 下午
 */
"use strict";

let canvas = document.getElementById('canvas');
let offscreen = canvas.transferControlToOffscreen();

let worker = new Worker("./worker.js");

let rate = document.getElementById('rate');
let box = document.getElementById('box');

let rate2 = document.getElementById('selfrate');
let box2 = document.getElementById("box2");

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
    let ratev = rate.value;
    box.innerText = "rate:" + ratev;
    worker.postMessage({msg: 'rate', rate: ratev});
}

function changeRate2() {
    let ratev2 = rate2.value;
    box2.innerText = "rate:" + ratev2;
    worker.postMessage({msg:'rate2', rate: ratev2})
}