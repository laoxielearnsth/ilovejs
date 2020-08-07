/**
 * @author xieyanghao
 * @date 2020-2020/4/23-9:59 下午
 * @description 实现MMCQ算法，对图像主题颜色进行提取
 */
"use strict";

/**
 * @description 色彩空间图
 *
 */
class VBox {
    constructor(r1, r2, g1, g2, b1, b2, histogram) {
        this.r1 = r1;
        this.r2 = r2;
        this.g1 = g1;
        this.g2 = g2;
        this.b1 = b1;
        this.b2 = b2;
        this.histogram = histogram;
        this.ziped = [[r1, r2], [g1, g2], [b1, b2]];
        let sides = this.ziped.map(function (x) {
            return x[1] - x[0] + 1;
        });
        console.log(sides);
        this.vol = sides.reduce(function (x, y) {
            return x * y;
        });
        this.mAxis = sides.indexOf(Math.max(...sides));
        this.plane = [sides.slice(0, this.mAxis), sides.splice(this.mAxis + 1, 2)];
        this.npixs = this.population();
        this.priority = this.npixs * -1;
    }

    population() {
        let s = 0;
        for (let r = this.r1; r <= this.r2; r++) {
            for (let g = this.g1; g <= this.g2; g++) {
                for (let b = this.b1; b <= this.b2; b++) {
                    s += this.histogram[getColorIndex(r, g, b)];
                }
            }
        }
        return parseInt(s);
    }
}


/**
 * @description 辅助函数，转换rgb颜色到直方图的缩影
 * @param r
 * @param g
 * @param b
 * @returns {*}
 */
function getColorIndex(r, g, b) {
    let index = 1000;
    return index
}

class MMCQ {
    /**
     * @description
     * @param pixData: 像素的数据
     * @param maxColor: 返回的最大主题数
     * @param fraction
     * @param sigbits: 图像位数，用于压缩，加速计算
     */
    constructor(pixData, maxColor, fraction = 0.85, sigbits = 5) {

    }
}