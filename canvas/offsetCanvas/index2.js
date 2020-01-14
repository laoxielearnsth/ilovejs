/**
 * @author xieyanghao
 * @date 2020-2020/1/14-5:46 下午
 */
"use strict";
let canvas = document.getElementById('canvas');
let offcanvas = canvas.transferControlToOffscreen();

function init() {
    let worker = new Worker('./work2.js');
    worker.postMessage({
        message: 'start',
        canvas: offcanvas
    }, [offcanvas]);
    worker.onmessage = function (ev) {
        console.log(ev.data);
    }
}

init();