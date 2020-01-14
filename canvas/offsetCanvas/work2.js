/**
 * @author xieyanghao
 * @date 2020-2020/1/14-5:46 下午
 */
"use strict";

onmessage = function (ev) {
    if (ev.data.message === 'start') {
        let canvas = ev.data.canvas;
        let ctx = canvas.getContext('2d');
        let t = 0;
        draw();
        function draw() {
            let p0 = {x:100,y:100},
                p1 = {x:200,y:100},
                p2 = {x:200,y:200};
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.strokeStyle = 'red';
            arc(p0,p1,p2);
            ctx.restore();

            ctx.save();
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(p0.x,p0.y);
            ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
            ctx.stroke();
            ctx.restore();

            let pb = {};
            pb.x = computeCurvePoint(p0.x,p1.x,p2.x,t);
            pb.y = computeCurvePoint(p0.y,p1.y,p2.y,t);
            ctx.save();
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 4;
            arc(pb);
            ctx.restore();
            t += 0.01;

            if(t > 1){
                // postMessage({message: '结束了'});
                t = 0;
            }
            requestAnimationFrame(draw);
        }

        function  arc(...ps) {
            ps.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.stroke();
            });
        }

        function computeCurvePoint(a0,a1,a2,t){
            let b =  (1 -t)*(1-t) * a0 + 2 *(1-t) * t * a1 + t * t * a2;
            return b;
        }
    } else {

    }
};