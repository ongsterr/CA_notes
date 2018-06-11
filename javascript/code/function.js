
// Arguments object
function func1(a,b,c) {
    const args = [...arguments]
    console.log(arguments[0]);
    arguments[1] = 'Hello. I am not what you think I am.'
    console.log(arguments[1]);
    console.log(arguments[2]);
    console.log(arguments.length);
    console.log(arguments)
    console.log(args);
}

func1(1,2,3)

// Defining a function that creates HTML lists
function list(type) {
    let result = '<' + type + 'l><li>';
    let args = [].slice.call(arguments, 1);
    result += args.join('</li><li>');
    result += '</li></' + type + 'l>';

    return result;
}

const htmlList = list('o', 'a', 'b', 'c')
console.log(htmlList)

// Arrow Functions -> Okay

// Default function parameters -> Okay

// Method Definitions

// Generator Methods
let obj2 = {
    * g() {
      let index = 0;
      while (true)
        yield index++;
    }
}

const arr1 = []
for (let i = 0; i <= 20; i++) {
    arr1.push(obj2.g().next().value)
}
console.log(arr1) // Generator method is not working

// Async Methods
let obj3 = {
    async f() {
        await some_promise
    }
}

// Async Generator Methods
let obj4 = {
    async* f() {
        yield 1;
        yield 2;
        yield 3;
    }
}

// Computed property names
let bar = {
    foo0: function () {
        return 0;
    },
    foo1() {
        return 1;
    },
    ['foo'+2]() {
        return 2;
    }
}

console.log(bar.foo0())
console.log(bar.foo1())
console.log(bar.foo2())

// Rest parameters - allows us to represent an indefinite number of arguments as an array.
function sum(...args) {
    return args.reduce( (previous, current) => {
        return previous + current;
    });
};

const test1 = sum(1,2,3);
console.log(test1);

function f(a, b, c) {
    let args = [].slice.call(arguments, 0);
    return args.reduce((previous, current) => {
        return previous + current;
    });
};

const test2 = f(1,2,3);
console.log(test2);

// More example
function multiply(multiplier, ...args) {
    return args.map( (element) => {
        return multiplier * element;
    });
};

const test3 = multiply(3, 1, 2, 3);
console.log(test3);

// Getter - binds an object property to a function that will be called when that property is looked up
let obj5 = {
    log: ['a', 'b', 'c'],
    get latest() {
        if (this.log.length == 0) {
            return undefined;
        }
        return this.log[this.log.length-1];
    }
}

console.log(obj5.latest); // function become more like a property