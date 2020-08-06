/**
 * @author xieyanghao
 * @date 2020-2020/1/29-12:31 上午
 */
"use strict";

class UnionSet {
    constructor(size) {
        this.set = new Array(size).fill(-1);
    }

    union(root1, root2){
        this.set[root1] = root2;
    }
    findSet(x){
        while(this.set[x] >= 0){
            x = this.set[x];
        }
        return x;
    }
    sameSet(x, y){
        return this.findSet(x) === this.findSet(y);
    }
    unionElement(x, y){
        this.union(this.findSet(x), this.findSet(y));
    }
}

class Maze {
    constructor(columns, rows, canvas) {
        this.columns = columns;
        this.rows = rows;
        this.cells = columns * rows;
        //存放是连通的格子，{1: [2, 11]}表示第1个格子和第2、11个格子是相通的
        this.linkedMap = {};
        this.unionSets = new UnionSet(this.cells);
        this.canvas = canvas;
    }

    //生成迷宫
    generate() {
        //每次任意取两个相邻的格子，如果它们不在同一个连通集，
        //则拆掉中间的墙，让它们连在一起成为一个连通集
        while (!this.firstLastLinked() || !this.linkedToFirstCell()) {
            let cellPairs = this.pickRandomCellPairs();
            if (!this.unionSets.sameSet(cellPairs[0], cellPairs[1])) {
                this.unionSets.unionElement(cellPairs[0], cellPairs[1]);
                this.addLinkedMap(cellPairs[0], cellPairs[1]);
            }
        }
    }

    firstLastLinked() {
        return this.unionSets.sameSet(0, this.cells - 1);
    }

    linkedToFirstCell() {
        for (let i = 1; i < this.cells; i++) {
            if (!this.unionSets.sameSet(0, i)) return false;
        }
        return true;
    }

    //取出随机的两个挨着的格子
    pickRandomCellPairs() {
        let cell = (Math.random() * this.cells) >> 0;
        //再取一个相邻格子，0 = 上，1 = 右，2 = 下，3 = 左
        let neiborCells = [];
        let row = (cell / this.columns) >> 0,
            column = cell % this.rows;
        //不是第一排的有上方的相邻元素
        if (row !== 0) {
            neiborCells.push(cell - this.columns);
        }
        //不是最后一排的有下面的相邻元素
        if (row !== this.rows - 1) {
            neiborCells.push(cell + this.columns);
        }
        if (column !== 0) {
            neiborCells.push(cell - 1);
        }
        if (column !== this.columns - 1) {
            neiborCells.push(cell + 1);
        }
        let index = (Math.random() * neiborCells.length) >> 0;
        return [cell, neiborCells[index]];
    }

    addLinkedMap(x, y) {
        if (!this.linkedMap[x]) this.linkedMap[x] = [];
        if (!this.linkedMap[y]) this.linkedMap[y] = [];
        if (this.linkedMap[x].indexOf(y) < 0) {
            this.linkedMap[x].push(y);
        }
        if (this.linkedMap[y].indexOf(x) < 0) {
            this.linkedMap[y].push(x);
        }
    }

    draw() {
        let linkedMap = this.linkedMap;
        let cellWidth = this.canvas.width / this.columns,
            cellHeight = this.canvas.height / this.rows;
        let canvasBuffer = document.createElement('canvas');
        canvasBuffer.width = this.canvas.width;
        canvasBuffer.height = this.canvas.height;
        let ctx = canvasBuffer.getContext('2d');
        ctx.translate(0.5, 0.5);
        for (let i = 0; i < this.cells; i++) {
            let row = (i / this.columns) >> 0,
                column = i % this.columns;
            //画右边的竖线
            if (
                column !== this.columns - 1 &&
                (!linkedMap[i] || linkedMap[i].indexOf(i + 1) < 0)
            ) {
                ctx.moveTo(((column + 1) * cellWidth) >> 0, (row * cellHeight) >> 0);
                ctx.lineTo(
                    ((column + 1) * cellWidth) >> 0,
                    ((row + 1) * cellHeight) >> 0
                );
            }
            //画下面的横线
            if (
                row !== this.rows - 1 &&
                (!linkedMap[i] || linkedMap[i].indexOf(i + this.columns) < 0)
            ) {
                ctx.moveTo((column * cellWidth) >> 0, ((row + 1) * cellHeight) >> 0);
                ctx.lineTo(
                    ((column + 1) * cellWidth) >> 0,
                    ((row + 1) * cellHeight) >> 0
                );
            }
        }
        ctx.stroke();
        this.drawBorder(ctx, cellWidth, cellHeight);
        this.canvas.getContext('2d').drawImage(canvasBuffer, 0, 0);
    }

    drawBorder(ctx, cellWidth, cellHeight) {
        ctx.moveTo(0, cellHeight);
        ctx.lineTo(0, this.rows * cellHeight - 1);
        ctx.lineTo(this.columns * cellWidth - 1, this.rows * cellHeight - 1);
        ctx.moveTo(
            this.columns * cellWidth - 1,
            this.rows * cellHeight - 1 - cellHeight
        );
        ctx.lineTo(this.columns * cellWidth - 1, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
    }

    calPath() {
        let pathTable = new Array(this.cells);
        for (let i = 0; i < pathTable.length; i++) {
            pathTable[i] = { known: false, prevCell: -1 };
        }
        pathTable[0].known = true;
        let map = this.linkedMap;
        //用一个队列存储当前层的节点，先进队列的结点优先处理
        let unSearchCells = [0];
        let j = 0;
        while (!pathTable[pathTable.length - 1].known) {
            while (unSearchCells.length) {
                let cell = unSearchCells.pop();
                for (let i = 0; i < map[cell].length; i++) {
                    if (pathTable[map[cell][i]].known) continue;
                    pathTable[map[cell][i]].known = true;
                    pathTable[map[cell][i]].prevCell = cell;
                    unSearchCells.unshift(map[cell][i]);
                    if (pathTable[pathTable.length - 1].known) break;
                }
            }
        }
        let cell = this.cells - 1;
        let path = [cell];
        while (cell !== 0) {
            let cell = pathTable[cell].prevCell;
            path.push(cell);
        }
        return path;
    }

    drawPath(path) {
        let cellWidth = this.canvas.width / this.columns,
            cellHeight = this.canvas.height / this.rows;
        let canvasBuffer = document.createElement('canvas');
        canvasBuffer.width = this.canvas.width;
        canvasBuffer.height = this.canvas.height;
        let ctx = canvasBuffer.getContext('2d');
        ctx.moveTo(this.canvas.width - 1, this.canvas.height - cellHeight / 2);
        for (let i = 0; i < path.length; i++) {
            let row = Math.floor(path[i] / this.columns);
            let column = path[i] % this.columns;
            let row_prev = this.rows - 1;
            let column_prev = this.columns;
            let row_next = 0;
            let column_next = 0;
            if (i > 0) {
                row_prev = Math.floor(path[i - 1] / this.columns);
                column_prev = path[i - 1] % this.columns;
            }
            if (i < path.length - 1) {
                row_next = Math.floor(path[i + 1] / this.columns);
                column_next = path[i + 1] % this.columns;
            } else {
                row_next = 0;
                column_next = -1;
            }
            if (row_next === row_prev) {
                // 同一行，画横线
                if (column > column_next) {
                    ctx.lineTo(column * cellWidth, (row_prev + 0.5) * cellHeight);
                } else {
                    ctx.lineTo((column + 1) * cellWidth, (row_prev + 0.5) * cellHeight);
                }
            }
            if (column_next === column_prev) {
                // 同一列，画纵线
                if (row > row_next) {
                    ctx.lineTo((column + 0.5) * cellWidth, row * cellHeight);
                } else {
                    ctx.lineTo((column + 0.5) * cellWidth, (row + 1) * cellHeight);
                }
            }
            if (
                row === row_next &&
                column < column_next &&
                row < row_prev &&
                column === column_prev
            ) {
                ctx.moveTo((column + 0.5) * cellWidth, (row + 1) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 1) * cellWidth, (row + 0.5) * cellHeight);
            }
            if (
                row === row_prev &&
                column < column_prev &&
                row < row_next &&
                column === column_next
            ) {
                ctx.moveTo((column + 1) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 1) * cellHeight);
            }
            if (
                row === row_next &&
                column > column_next &&
                row < row_prev &&
                column === column_prev
            ) {
                ctx.moveTo((column + 0.5) * cellWidth, (row + 1) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo(column * cellWidth, (row + 0.5) * cellHeight);
            }
            if (
                row === row_prev &&
                column > column_prev &&
                row < row_next &&
                column === column_next
            ) {
                ctx.moveTo(column * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 1) * cellHeight);
            }
            if (
                row === row_next &&
                column < column_next &&
                row > row_prev &&
                column === column_prev
            ) {
                ctx.moveTo((column + 0.5) * cellWidth, row * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 1) * cellWidth, (row + 0.5) * cellHeight);
            }
            if (
                row === row_prev &&
                column < column_prev &&
                row > row_next &&
                column === column_next
            ) {
                ctx.moveTo((column + 1) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, row * cellHeight);
            }
            if (
                row === row_next &&
                column > column_next &&
                row > row_prev &&
                column === column_prev
            ) {
                ctx.moveTo((column + 0.5) * cellWidth, row * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo(column * cellWidth, (row + 0.5) * cellHeight);
            }
            if (
                row === row_prev &&
                column > column_prev &&
                row > row_next &&
                column === column_next
            ) {
                ctx.moveTo(column * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.lineTo((column + 0.5) * cellWidth, row * cellHeight);
            }
        }
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
        this.canvas.getContext('2d').drawImage(canvasBuffer, 0, 0);
    }
}

const column = 50,
    row = 50;
let canvas = document.getElementById('maze');
let maze = new Maze(column, row, canvas);

console.time('generate maze');
maze.generate();
console.timeEnd('generate maze');
console.time('draw maze');
maze.draw();
console.timeEnd('draw maze');
console.time('calculate path');
let path = maze.calPath();
console.timeEnd('calculate path');
console.time('draw path');
maze.drawPath(path);
console.timeEnd('draw path');