/**
 * @author xieyanghao
 * @date 2020-2020/1/14-4:02 下午
 */
"use strict";
let worker2 = null,canvasBitmap, ctxBitmap, canvas, ctx;
function init() {
    canvasBitmap = document.getElementById('canvas-bitmap');
    ctxBitmap = canvasBitmap.getContext('2d');
    worker2 = new Worker('./worker.js');
    worker2.postMessage({msg:'init'});
    worker2.onmessage = function (e) {
        ctxBitmap.drawImage(e.data.imageBitmap,0,0);
    }
}

function redraw() {
    ctxBitmap.clearRect(0, 0, canvasBitmap.width, canvasBitmap.height);
    worker2.postMessage({msg:'draw'});
}

function init2() {
    console.time('主线程');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0;i < 10000;i ++) {
        for (let j = 0; j < 1000; j++) {
            ctx.fillRect(i * 3, j * 3, 2, 2);
        }
    }
    console.timeEnd('主线程')
}

init();