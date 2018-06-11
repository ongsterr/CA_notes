
// Recursion - Recursion is a programming term that means a “self-calling” function. Such functions can be used to solve certain tasks in elegant ways.
// A function that calls itself
function pow(x, n) {
    if (n == 1) {
        return x;
    } else {
        return x * pow(x, n-1);
    }
}

console.log(pow(2,3));

// Notes: A recursive solution is usually shorter than an iterative one.
function poww(x, n) {
    return n == 1 ? x : x * poww(x, n-1);
}

// What is the "execution context stack"?
// What is meant by "recursion depth"? Recursion depth = max num of context in stack
// Any recursion can be rewritten as a loop. The loop variant usually can be made more effective.

// Recursive traversal
let company = {
    sales: [{ name: 'John', salary: 1000 }, { name: 'Alice', salary: 600 }],
    development: {
        sites: [{ name: 'Peter', salary: 2000 }, { name: 'Alex', salary: 1800 }],
        internals: [{ name: 'Jack', salary: 1300 }]
    }
};

function sumSalaries(entity) {
    if (Array.isArray(entity)) {
        return entity.reduce( (prev, current) => {
            return prev + current.salary;
        }, 0)
    } else {
        let sum = 0;
        for (let sub of Object.values(entity)) {
            sum += sumSalaries(sub);
        }
        return sum;
    }
};

const test1 = sumSalaries(company)
const test2 = sumSalaries(company.sales)
const test3 = sumSalaries(company.development)
console.log(test1, test2, test3)

// Linked List
let list = {
    value: 1,
    next: {
        value: 2,
        next: {
            value: 3,
            next: {
                value: 4,
                next: null
            }
        }
    }
};

// The list can be easily split into multiple parts and later joined back:
let secondList = list.next.next;
list.next.next = null;
console.log(list);
console.log(secondList);

// To join:
list.next.next = secondList;
console.log(list);
console.log(list.next.next.next);

// To prepend new value to the list
list = { value: "new item", next: list };
console.log(list);

// To remove a value in the middle
list.next = list.next.next;
console.log(list);

// Exercise: Calculate factorial
function factorial(n) {
    return n == 1 ? n : n * factorial(n-1);
}

const test4 = factorial(3);
const test5 = factorial(4);
const test6 = factorial(5);
console.log(test4, test5, test6)

// Exercise: Calculate fibonacci
function fib(n) {
    return n <= 1 ? n : fib(n-1) + fib(n-2);
}

const test7 = fib(3);
const test8 = fib(7);
const test9 = fib(12);
console.log(test7, test8, test9);

/* Lexical Environment
- Environment Record - an object that has all local variables as its properties
- A reference to the outer lexical environment
- When code wants to access a variable – it is first searched for in the inner Lexical Environment, then in the outer one, then the more outer one and so on until the end of the chain.
- A function gets outer variables as they are now; it uses the most recent values.
- One function call – one Lexical Environment
- A closure is a function that remembers its outer variables and can access them.
*/

// Nested Function
function makeCounter() {
    let count = 0;
    return function() {
        return count++;
    }
};

let counter1 = makeCounter();
let counter2 = makeCounter();

console.log(counter1());
console.log(counter1());
console.log(counter2());

// IIFE
(function () {
    console.log("Brackets around the function");
})();
(function () {
    console.log("Brackets around the whole thing");
}());
!function () {
    console.log("Bitwise NOT operator starts the expression");
}();
+function () {
    console.log("Unary plus starts the expression");
}();

// Garbage Collection
function f() {
    let value = 123;

    function g() { console.log(value); }

    return g;
}

let g = f(); // while g is alive
// there corresponding Lexical Environment lives

g = null; // ...and now the memory is cleaned up

/* old "var" 
“var” has no block scope
var are “hoisted” (raised) to the top of the function.
*/

// Example #1
if (true) {
    var test = true; // use "var" instead of "let"
}

console.log(test); // true, the variable lives after if

// Example #2
function sayHi() {
    if (true) {
        var phrase = "Hello";
    }

    console.log(phrase); // works
}

sayHi();
// console.log(phrase); // Error: phrase is not defined

// Declarations are hoisted, but assignments are not.
function sayHello() {
    console.log(hello);

    var hello = 'hello';
};

sayHello();

// Global Object
var phrase = "Hello";

function sayHi() {
    console.log(phrase);
}

// can read from window
console.log(window.phrase); // Hello (global var)
console.log(window.sayHi); // function (global function declaration)

// can write to window (creates a new global variable)
window.test = 5;

console.log(test); // 5

// Uses of "window"
// “this” and global object

// Function Object
// Understanding "polymorphism"

function ask(question, ...handlers) {
    let isYes = confirm(question);

    for (let handler of handlers) {
        if (handler.length == 0) {
            if (isYes) handler();
        } else {
            handler(isYes);
        }
    }

}

// for positive answer, both handlers are called
// for negative answer, only the second one
ask("Question?", () => console.log('You said yes'), result => console.log(result));

// Function properties can replace closures sometimes
function makeCounter() {

    function counter() {
        return counter.count++;
    };

    counter.count = 0;

    return counter;
}

let counter = makeCounter();

counter.count = 10;
console.log(counter()); // 10

// Named Function Expression
let sayHi = function func(who) {
    console.log(`Hello, ${who}`);
};

sayHi("John"); // Hello, John

let sayHi = function func(who) {
    if (who) {
        alert(`Hello, ${who}`);
    } else {
        func("Guest"); // use func to re-call itself
    }
};

sayHi(); // Hello, Guest

// But this won't work:
func(); // Error, func is not defined (not visible outside of the function)
