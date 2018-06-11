// Iterators
function makeIterator(array) {
    var nextIndex = 0;

    return {
        next: function () {
            return nextIndex < array.length ?
            { value: array[nextIndex++], done: false } :
            { done: true }
        }
    }
}

let arr = ['a', 'b', 'c']
let it = makeIterator(arr)

console.log(it.next().value)
console.log(it.next().value)
console.log(it.next().value)
console.log(it.next().done)

// Generators
function* idMaker() {
    var index = 0;
    while(true) {
        yield index++;
    }
}

var gen = idMaker();
console.log(gen.next().value)
console.log(gen.next().value)
console.log(gen.next().value)

// Using generator function to build fibonacci sequence
function* getFibonacci() {
    var val1 = 0, val2 = 1, swap;

    yield val1;
    yield val2;

    while(true) {
        swap = val1 + val2;
        val2 = swap;
        val1 = val2;
        yield swap;
    }
}

let gen1 = getFibonacci();
let arr1 = [];

for (let i=0; i<=20; i++) {
    arr1.push(gen1.next().value);
}

console.log(arr1)

// Iterables
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};

for (let value of myIterable) {
    console.log(value);
}