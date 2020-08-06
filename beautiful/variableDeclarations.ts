/**
 * @author xieyanghao
 * @date 2020-2020/1/29-5:14 下午
 */
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        // Error: Property 'clor' does not exist on type 'SquareConfig'
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});


interface Point {
    readonly x:number;
    readonly y:number;
}

let p1: Point = {x:10, y:11};


let a: number[] = [1, 2, 3, 4, 5];
let ro: ReadonlyArray<number> = a;
// ro[0] = 12; // error
// ro.push(1);
// a.push('dasd');
// ro.length = 100;
// a = ro;

a = ro as number[];