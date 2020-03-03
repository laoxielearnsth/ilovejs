/**
 * @author xieyanghao
 * @date 2020-2020/1/29-3:36 下午
 */

let isDone: boolean = false;

// As in JavaScript all numbers in Typescript are floating point value. There floating point numbers get the type number. In addition to hexadecimal and decimal literals, TypeScript also supports binary and octal literals introduced in ECMAScript 2015.

let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1001;
let octal: number = 0o744;

// String
let color: string = 'red';
color = 'blue';

let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age+1} years old next month.`;

// Array
// First way
let list: number[] = [1, 2, 3];
// Second way
let l2: Array<number> = [1, 2, 3];

// Tuple
// Tuple types allow you to express an array with fixed number of elements whose types are known, but need not be the same.  For example, you may want to represent a value as a pair of a String and a number:

let x: [string, number];
x = ["Hello", 10]; // OK


// Enum
// A helpful addition to standard set of datatypes from JavaScript is the enum

enum Color {Red, Green, Blue}

let colorName: string = Color[2];

// Any
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;

// diff between Object
let prettySure: Object = 4;
// prettySure.tofixed();  throw a Error when Compile

let l3: any[] = [1, '32', true];
l3[1] = 'fasf';


// Void opposite of any: absence of having any type at all.
function warnUser(): void {
    console.log("This is my warning message");
}

let unusable: void = undefined;
unusable = null; // OK 非严格nullcheck模式下

function infiniteLoop(): never {
    while (true) {}
}

// Object
// declare function create(o: object | null): void;
// OK
// create({prop: 0});
// create(null);
// Error
// create(42);
// create("string");
// create(false);
// create(undefined);


// Type assertions
let someValue: any = 1231241;
let strLength: number = (<string>someValue).length;

console.log(strLength);
