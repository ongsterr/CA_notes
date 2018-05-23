### **Debugging in Chrome**

**Summary**
- There are three main ways to pause a script:
    - A breakpoint
    - The `debugger` statements
    - An error (if dev tools are open and the button || is “on”)
- The full manual is at https://developers.google.com/web/tools/chrome-devtools

**Learning Outcome**

- The “sources” Pane
- Console
- Breakpoints
    - A `breakpoint` is a point of code where the debugger will automatically pause the JavaScript execution.
    - While the code is paused, we can examine current variables, execute commands in the console etc. In other words, we can debug it.
    - That’s useful when we have many breakpoints in various files. It allows to:
        - Quickly jump to the breakpoint in the code (by clicking on it in the right pane).
        - Temporarily disable the breakpoint by unchecking it.
        - Remove the breakpoint by right-clicking and selecting Remove.
    - Conditional breakpoints
        - *Right click* on the line number allows to create a *conditional* breakpoint. It only triggers when the given expression is truthy.
- Debugger Command
    ```js
    function hello(name) {
        let phrase = `Hello, ${name}!`;

        debugger;  // <-- the debugger stops here

        say(phrase);
    }
    ```
- Pause and Look Around

    ![dev tool](https://javascript.info/article/debugging-chrome/chrome-sources-debugger-pause@2x.png)
    - Please open the informational dropdowns to the right (labeled with arrows). They allow you to examine the current code state:
        - `Watch` – shows current values for any expressions.
        - `Call Stack` – shows the nested calls chain.
        - `Scope` – current variables.
            - `Local` shows local function variables.
            - `Global` has global variables (out of any functions).

- Tracing the Execution

    ![image](https://javascript.info/article/debugging-chrome/chrome-sources-debugger-trace-1@2x.png)
    - Continue the execution, hotkey `F8`
    - Make a step (run the next command), but don’t go into the function, hotkey `F10`
    - Make a step into, hotkey `F11`
    - Continue the execution till the end of the current function, hotkey `Shift+F11`
    - Enable/disable all breakpoints
    - Enable/disable automatic pause in case of an error
        - When enabled, and the developer tools is open, a script error automatically pauses the execution. Then we can analyze variables to see what went wrong

- Logging
    - To output something to console, there’s `console.log` function

### **Coding style**

- Syntax

    ![image](https://javascript.info/article/coding-style/code-style@2x.png)

- Curly Braces

    ![image](https://javascript.info/article/coding-style/figure-bracket-style@2x.png)

- Line Length
    - The maximal line length should be limited. No one likes to eye-follow a long horizontal line. It’s better to split it.

- Indents
    - There are two types of indents:
        - **A horizontal indent: 2(4) spaces**
            - A horizontal indentation is made using either 2 or 4 spaces or the “Tab” symbol. Which one to choose is an old holy war. Spaces are more common nowadays.
            - One advantage of spaces over tabs is that spaces allow more flexible configurations of indents than the “Tab” symbol.
        - **A vertical indent: empty lines for splitting code into logical blocks**
            - Even a single function can often be divided in logical blocks.

- Semicolon
    - A semicolon should be present after each statement. Even if it could possibly be skipped.

- Nesting Levels
    - There should not be too many nesting levels.
    - Instead of:
        ```js
        for (let i = 0; i < 10; i++) {
            if (cond) {
                ... // <- one more nesting level
            }
        }
        ```
    - We can write:
        ```js
        for (let i = 0; i < 10; i++) {
            if (!cond) continue;
            ...  // <- no extra nesting level
        }
        ```

- Functions Below the Code
    - If you are writing several “helper” functions and the code to use them, then there are three ways to place them.
        1. Functions above the code that uses them
        2. Code first, then functions
        3. Mixed: a function is described where it’s first used.

- Style Guides
    - A style guide contains general rules about “how to write”: which quotes to use, how many spaces to indent, where to put line breaks, etc. A lot of minor things.
    - Examples:
        - [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml)
        - [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
        - [Idiomatic.JS](https://github.com/rwaldron/idiomatic.js)
        - [StandardJS](https://standardjs.com/)

- Automated Linters
    - There are tools that can check the code style automatically. They are called “linters”.
    - [ESLint](https://eslint.org) – probably the newest one.

### **Comments**

- Comments can be single-line: starting with `//` and multiline: `/* ... */`.
- **Bad Comments**
    - Novices tend to use comments to explain “what is going on in the code”.
    ```js
    // This code will do this thing (...) and that thing (...)
    // ...and who knows what else...
    very;
    complex;
    code;
    ```

    - Recipe: Factor out Functions
    - Recipe: Create Functions
        - Functions themselves tell what’s going on. There’s nothing to comment. And also the code structure is better when split. It’s clear what every function does, what it takes and what it returns.

- **Good Comments**
    - Describe the architecture
    - Document a function usage
        - Such comments allow us to understand the purpose of the function and use it the right way without looking in its code.
    - Why is the task solved this way?
        - If there are many ways to solve the task, why this one? Especially when it’s not the most obvious one.
        - Comments that explain the solution are very important. They help to continue development the right way.

### **Ninja Code**

**Summary**
- All “pieces of advice” below are from the real code… Sometimes, written by experienced developers. Maybe even more experienced than you are ;)

    - Follow some of them, and your code will become full of surprises.
    - Follow many of them, and your code will become truly yours, no one would want to change it.
    - Follow all, and your code will become a valuable lesson for young developers looking for enlightenment.

**Learning Outcome**

> Learning without thought is labor lost;\
> Thought without learning is perilous.\
> -- Confucius

- **Brevity is the soul of wit**
    - Make the code as short as possible. Show how smart you are.
    - Let subtle language features guide you.
    - Tell him that shorter is always better. Initiate him into the paths of ninja.

- **One-letter variables**
    > The Dao hides in wordlessness.\
    > Only the Dao is well begun and well completed.\
    > -- Laozi (Tao Te Ching)

    - Another way to code faster is to use single-letter variable names everywhere. Like `a`, `b` or `c`. 
    - A short variable disappears in the code like a real ninja in the forest. No one will be able to find it using “search” of the editor. And even if someone does, he won’t be able to “decipher” what the name `a` or `b` means.

- **Use abbreviations**
    - If the team rules forbid the use of one-letter and vague names – shorten them, make abbreviations.

- **Soar high. Be abstract.**
- **Attention test**
- **Smart synonyms**
- **Reuse names**
- **Underscores for fun**
- **Show your love**
- **Overlap outer variables**
- **Side-effects everywhere!**
- **Powerful functions!**

### **Automated testing with mocha**

**Summary**
- In BDD, the spec goes first, followed by implementation. At the end we have both the spec and the code.
- The spec can be used in three ways:
    - **Tests** guarantee that the code works correctly.
    - **Docs** – the titles of `describe` and `it` tell what the function does.
    - **Examples** – the tests are actually working examples showing how a function can be used.
- With the spec, we can safely improve, change, even rewrite the function from scratch and make sure it still works right.
- Without tests, people have two ways:
    - To perform the change, no matter what. And then our users meet bugs and report them. If we can afford that.
    - Or people become afraid to modify such functions, if the punishment for errors is harsh. Then it becomes old, overgrown with cobwebs, no one wants to get into it, and that’s not good.
- **Automatically tested code is contrary to that!**
- **Besides, a well-tested code has better architecture.**

**Learning Outcome**

- **Why we need tests?**
    - During development, we can check the function by running it and comparing the outcome with the expected one. For instance, we can do it in the console.
    - When testing a code by manual re-runs, it’s easy to miss something.
    - **Automated testing means that tests are written separately, in addition to the code. They can be executed easily and check all the main use cases.**

- Behavior Driven Development (BDD)
    - **BDD is three things in one: tests AND documentation AND examples.**

- Development of “pow”: the spec
    - Before creating the code of pow, we can imagine what the function should do and describe it.
    - Such description is called a specification or, in short, a spec, and looks like this:
        ```js
        describe("pow", function() {
            it("raises to n-th power", function() {
                assert.equal(pow(2, 3), 8)
            })
        })
        ```
    - A spec has three main building blocks that you can see above:
        - `describe("title", function() { ... })`
            - What functionality we’re describing. Uses to group “workers” – the `it` blocks. In our case we’re describing the function `pow`.
        - `it("title", function() { ... })`
            - In the title of `it` we in a human-readable way describe the particular use case, and the second argument is a function that tests it.
        - `assert.equal(value1, value2)`
            - Functions `assert.*` are used to check whether pow works as expected.

- The Development Flow
    1. An initial spec is written, with tests for the most basic functionality.
    2. An initial implementation is created.
    3. To check whether it works, we run the testing framework Mocha (more details soon) that runs the spec. Errors are displayed. We make corrections until everything works.
    4. Now we have a working initial implementation with tests.
    5. We add more use cases to the spec, probably not yet supported by the implementations. Tests start to fail.
    6. Go to 3, update the implementation till tests give no errors.
    7. Repeat steps 3-6 till the functionality is ready.

- The Spec in Action
    - The following JavaScript libraries for tests:
        - [Mocha](https://mochajs.org/) – the core framework: it provides common testing functions including `describe` and `it` and the main function that runs tests.
        - [Chai](http://www.chaijs.com/) – the library with many assertions. It allows to use a lot of different assertions, for now we need only `assert.equal`.
        - [Sinon](http://sinonjs.org/) – a library to spy over functions, emulate built-in functions and more, we’ll need it much later.
    - The full HTML page with these frameworks and pow spec:
    ```html
    <!DOCTYPE html>
    <html>
    <head>
        <!-- add mocha css, to show results -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mocha/3.2.0/mocha.css">
        <!-- add mocha framework code -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mocha/3.2.0/mocha.js"></script>
        <script>
            mocha.setup('bdd'); // minimal setup
        </script>
        <!-- add chai -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/chai/3.5.0/chai.js"></script>
        <script>
            // chai has a lot of stuff, let's make assert global
            let assert = chai.assert;
        </script>
    </head>

    <body>

    <script>
        function pow(x, n) {
        /* function code is to be written, empty now */
        }
    </script>

    <!-- the script with tests (describe, it...) -->
    <script src="test.js"></script>

    <!-- the element with id="mocha" will contain test results -->
    <div id="mocha"></div>

    <!-- run tests! -->
    <script>
        mocha.run();
    </script>
    </body>

    </html>
    ```

- Initial Implementation
- Improving the Spec
    - What we’ve done is definitely a cheat. The function does not work: an attempt to calculate pow(3,4) would give an incorrect result, but tests pass.
    - We can select one of two ways to organize the test here:
        - The first variant – add one more `assert` into the same `it`:
            ```js
            describe("pow", function() {
                it("raises to n-th power", function() {
                    assert.equal(pow(2, 3), 8)
                    assert.equal(pow(3, 4), 81)
                })
            })
            ```
            
        - The second – make two tests:
            ```js
            describe("pow", function() {
                it("2 raised to power 3 is 8", function() {
                    assert.equal(pow(2, 3), 8)
                })
                it("3 raised to power 3 is 27", function() {
                    assert.equal(pow(3, 3), 27)
                })
            })
            ```
        - The principal difference is that when `assert` triggers an error, the `it` block immediately terminates. So, in the first variant if the first `assert` fails, then we’ll never see the result of the second `assert`.
        - **One test checks one thing.**

- Improving the Implementation
    - Function:
        ```js
        function pow(x, n) {
            let result = 1;

            for (let i = 0; i < n; i++) {
                result *= x;
            }

            return result;
        }
        ```
    - To be sure that the function works well, let’s test it for more values.
        ```js
        describe("pow", function() {

            function makeTest(x) {
                let expected = x * x * x
                it(`${x} in the power 3 is ${expected}`, function() {
                assert.equal(pow(x, 3), expected)
                })
            }

            for (let x = 1; x <= 5; x++) {
                makeTest(x)
            }

        })
        ```

- Nested `describe`
    - Grouping is done with a nested `describe`:
    ```js
    describe("pow", function() {

        describe("raises x to power n", function() {

            function makeTest(x) {
            let expected = x * x * x;
            it(`${x} in the power 3 is ${expected}`, function() {
                assert.equal(pow(x, 3), expected);
            });
            }

            for (let x = 1; x <= 5; x++) {
            makeTest(x);
            }

        });

    // ... more tests to follow here, both describe and it can be added
    });
    ```
    - `before/after` and `beforeEach/afterEach`:
        - We can setup `before/after` functions that execute *before/after* running tests, and also `beforeEach/afterEach` functions that execute *before/after* every `it`.
        ```js
        describe("test", function() {
            before(() => alert("Testing started – before all tests"))
            after(() => alert("Testing finished – after all tests"))

            beforeEach(() => alert("Before a test – enter a test"))
            afterEach(() => alert("After a test – exit a test"))

            it('test 1', () => alert(1))
            it('test 2', () => alert(2))
        })
        ```

- Extending the Spec
    - The newly added tests fail, because our implementation does not support them. That’s how BDD is done: first we write failing tests, and then make an implementation for them.
    - **Other assertions**
        - `assert.isNaN` checks for `NaN`
        - `assert.equal(value1, value2)` – checks the equality `value1 == value2`.
        - `assert.notEqual`, `assert.notStrictEqual` – inverse checks to the ones above.
        - `assert.isTrue(value)` – checks that `value === true`
        - `assert.isFalse(value)` – checks that `value === false`

### **Polyfills**

- Babel
    - When we use modern features of the language, some engines may fail to support such code. Just as said, not all features are implemented everywhere.
    - [Babel](https://babeljs.io/) is a [transpiler](https://en.wikipedia.org/wiki/Source-to-source_compiler). It rewrites modern JavaScript code into the previous standard.
    - There are two parts in Babel:
        - First, the `transpiler program`, which rewrites the code. The developer runs it on his own computer. It rewrites the code into the older standard. And then the code is delivered to the website for users. Modern project build system like webpack or brunch provide means to run transpiler automatically on every code change, so that doesn’t involve any time loss from our side.
        - Second, the `polyfill`.
            - The transpiler rewrites the code, so syntax features are covered. But for new functions we need to write a special script that implements them. JavaScript is a highly dynamic language, scripts may not just add new functions, but also modify built-in ones, so that they behave according to the modern standard.
            - There’s a term “polyfill” for scripts that “fill in” the gap and add missing implementations.
        - We need to setup the `transpiler` and add the `polyfill` for old engines to support modern features.