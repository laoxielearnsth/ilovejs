/**
 * @author xieyanghao
 * @date 2020-2020/2/4-2:38 下午
 */
"use strict";

let canvas = document.getElementById('canvas');
let offscreen = canvas.transferControlToOffscreen();

let worker = new Worker("./worker.js");

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
