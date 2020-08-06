/**
 * @author xieyanghao
 * @date 2020-2020/1/29-3:36 下午
 */
let isDone = false;
// As in JavaScript all numbers in Typescript are floating point value. There floating point numbers get the type number. In addition to hexadecimal and decimal literals, TypeScript also supports binary and octal literals introduced in ECMAScript 2015.
let decimal = 6;
let hex = 0xf00d;
let binary = 9;
let octal = 484;
// String
let color = 'red';
color = 'blue';
let fullName = "Bob Bobbington";
let age = 37;
let sentence = "Hello, my name is " + fullName + ".\n\nI'll be " + (age + 1) + " years old next month.";
// Array
// First way
let list = [1, 2, 3];
// Second way
let l2 = [1, 2, 3];
// Tuple
// Tuple types allow you to express an array with fixed number of elements whose types are known, but need not be the same.  For example, you may want to represent a value as a pair of a String and a number:
let x;
x = ["Hello", 10]; // OK
// Enum
// A helpful addition to standard set of datatypes from JavaScript is the enum
let Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
let colorName = Color[2];
// Any
let notSure = 4;
notSure = "maybe a string instead";
notSure = false;
// diff between Object
let prettySure = 4;
// prettySure.tofixed();  throw a Error when Compile
let l3 = [1, '32', true];
l3[1] = 'fasf';
// Void opposite of any: absence of having any type at all.
function warnUser() {
    console.log("This is my warning message");
}
let unusable = undefined;
unusable = null; // OK 非严格nullcheck模式下
function infiniteLoop() {
    while (true) { }
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
let someValue = "This is a string";
let strLength = someValue.length;
console.log(strLength);
