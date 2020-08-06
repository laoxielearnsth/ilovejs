/**
 * @author xieyanghao
 * @date 2020-2020/1/14-4:06 下午
 */
"use strict";
let offscreen,ctx;
onmessage = function (e) {
    if(e.data.msg == 'init'){
        init();
        draw();
    }else if(e.data.msg == 'draw'){
        draw();
    }
    self.close();
};

function init() {
    offscreen = new OffscreenCanvas(512, 512);
    ctx = offscreen.getContext("2d");
}

function draw() {
    console.time('副线程');
    ctx.clearRect(0,0,offscreen.width,offscreen.height);
    for(let i = 0;i < 10000;i ++){
        for(let j = 0;j < 1000;j ++){
            ctx.fillRect(i*3,j*3,2,2);
        }
    }
    console.timeEnd('副线程');
    let imageBitmap = offscreen.transferToImageBitmap();
    postMessage({imageBitmap:imageBitmap},[imageBitmap]);
}