// Iterables

/* Full implementation of range
let range = {
    from: 1,
    to: 5
}

// Call to for..of initially calls this
range[Symbol.iterator] = function () {
    return {
        current: this.from,
        last: this.to,

        next() {
            if (this.current <= this.last) {
                return {
                    done: false,
                    value: this.current++
                }
            } else {
                return { done: true }
            }
        }
    }
}

for (let num of range) {
    console.log(num)
}
*/

// range[Symbol.iterator]() returns the range object itself: it has the necessary next() method and remembers the current iteration progress in this.current.
let range = {
    from: 1,
    to: 10,

    [Symbol.iterator]() {
        this.current = this.from
        return this
    },

    next() {
        if (this.current <= this.to) {
            return {done: false, value: this.current++}
        } else {
            return {done: true}
        }
    }
}

for (let num of range) {
    console.log(num)
}

// for..of loops over its characters
for (let char of 'chris') {
    console.log(char)
}

// Calling an iterator explicitly
const str = 'chris'

let iterator = str[Symbol.iterator]()

while (true) {
    let result = iterator.next()
    if (result.done) break;
    console.log(result.value); // outputs characters one by one
}

// Array.from takes an iterable or array-like value and makes a “real” Array from it
let arrayLike