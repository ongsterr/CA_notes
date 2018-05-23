### **Comparisons**

**Summary**
- Comparison operators return a logical value.
- Strings are compared letter-by-letter in the “dictionary” order.
- When values of different types are compared, they get converted to numbers (with the exclusion of a strict equality check).
- Values `null` and `undefined` equal `==` each other and do not equal any other value.
- Be careful when using comparisons like > or < with variables that can occasionally be null/undefined. Making a separate check for null/undefined is a good idea.

**Learning Outcome**

- Boolean is the result of comparison - comparison returns a value in the form of a boolean
    ```js
    let result = 5 > 4; // assign the result of the comparison
    alert( result ); // true
    ```

- String Comparison
    ```js
    alert( 'Z' > 'A' ) // true
    alert( 'Glow' > 'Glee' ); // true
    alert( 'Bee' > 'Be' ); // true
    ```
    > **Note**:\
    Case matters, a capital letter "A" is not equal to the lowercase "a". Which one is greater? Actually, the lowercase "a" is. Why? Because the lowercase character has a greater index in the internal encoding table (Unicode)

- Comparison of different types
    ```js
    alert( true == 1 ); // true
    alert( false == 0 ); // true
    ```

- Strict equality
    - A regular equality check `==` has a problem. It cannot differ `0` from `false`. It does something called the `type coonversion`.
    ```js
    alert( 0 == false ); // true
    alert( '' == false ); // true
    ```
    - A strict equality operator `===` checks the equality without type conversion.
    - There also exists a “strict non-equality” operator `!==`, as an analogy for `!=`.

- Comparison with null and undefined
    ```js
    alert( null === undefined ); // false
    alert( null == undefined ); // true
    ```
    - Values null/undefined are converted to a number: `null` becomes `0`, while `undefined` becomes `NaN`
    ```js
    // Strange result when null vs 0
    alert( null > 0 );  // (1) false
    alert( null == 0 ); // (2) false
    alert( null >= 0 ); // (3) true
    ```
    - The reason is that an equality check `==` and comparisons > < >= <= work differently. Comparisons convert `null` to a number, hence treat it as `0`. That’s why (3) `null >= 0` is `true` and (1) `null > 0` is `false`.
    - The equality check `==` for `undefined` and `null` equal each other and don’t equal anything else. That’s why (2) `null == 0` is `false`.

- An incomparable undefined
    ```js
    alert( undefined > 0 ); // false (1)
    alert( undefined < 0 ); // false (2)
    alert( undefined == 0 ); // false (3)
    ```

### **Interaction: alert, prompt, confirm**

**Learning Outcome**

- Alert
    ```js
    alert(message);
    ```
    - This shows a message and pauses the script execution until the user presses “OK”.

- Prompt
    ```js
    result = prompt(title[, default])

    let age = prompt('How old are you?', 100)
    alert(`You are ${age} years old!`) // You are 100 years old!
    ```
    - It shows a modal window with a text message, an input field for the visitor and buttons OK/CANCEL.

- Confirm
    ```js
    result = confirm(question)

    let isBoss = confirm("Are you the boss?")
    alert( isBoss ) // true if OK is pressed
    ```
    - Function confirm shows a modal window with a question and two buttons: OK and CANCEL.

### **Conditional operators: if, '?'**

**Learning Outcome**

- The “if” statement
    ```js
    let year = prompt('In which year was ECMAScript-2015 specification published?', '')

    if (year == 2015) {
        alert( 'You are right!' )
    }

    if (year == 2015) {
        alert( "That's correct!" )
        alert( "You're so smart!" )
    }
    ```

- Boolean Conversion
    - The `if (…)` statement evaluates the expression in parentheses and converts it to the boolean type.

- The “else” clause
    ```js
    let year = prompt('In which year was ECMAScript-2015 specification published?', '');

    if (year == 2015) {
        alert( 'You guessed it right!' );
    } else {
        alert( 'How can you be so wrong?' ); // any value except 2015
    }
    ```

- Several conditions: “else if”
    ```js
    let year = prompt('In which year was ECMAScript-2015 specification published?', '')

    if (year < 2015) {
        alert( 'Too early...' )
    } else if (year > 2015) {
        alert( 'Too late' )
    } else {
        alert( 'Exactly!' )
    }
    ```

- Ternary operator ‘?’
    ```js
    let result = condition ? value1 : value2
    
    /* Example */
    let accessAllowed = (age > 18) ? true : false;
    ```
    > In the example above it’s possible to evade the question mark operator, because the comparison by itself returns `true/false`

- Multiple ‘?’
    ```js
    let age = prompt('age?', 18)

    let message = (age < 3) ? 'Hi, baby!' :
        (age < 18) ? 'Hello!' :
        (age < 100) ? 'Greetings!' :
        'What an unusual age!'

    alert( message )
    ```

- Non-traditional use of ‘?’
    ```js
    let company = prompt('Which company created JavaScript?', '');

    (company == 'Netscape') ?
        alert('Right!') : alert('Wrong.');
    ```
- Exercise
    ```js
    let number = prompt('Give me a number', 0)
    if(number > 0) {
        alert(1)
    } else if (number < 0) {
        alert(-1)
    } else if (number == 0) {
        alert(p)
    }
    ```

### **Logical Operators**

**Learning Outcome**

- || (OR)
    ```js
    result = a || b
    ```
    - There are 4 possible logical combinations:
    ```js
    alert( true || true );   // true
    alert( false || true );  // true
    alert( true || false );  // true
    alert( false || false ); // false
    ```
    - If an operand is not boolean, then it’s converted to boolean for the evaluation.
    - Most of the time, OR `||` is used in an `if` statement to test if *any* of the given conditions is correct.

- OR seeks the first truthy value
    ```js
    result = value1 || value2 || value3;
    ```
    - The OR `||` operator does the following:
        - Evaluate operands from left to right.
        - For each operand, convert it to boolean. If the result is true, then stop and return the original value of that operand.
        - If all other operands have been assessed (i.e. all were false), return the last operand.
    - That leads to some interesting usages compared to a “pure, classical, boolean-only OR”.
        - Getting the first truthy value from the list of variables or expressions.
        - Short-circuit evaluation.
            ```js
            let x;
            true || (x = 1);
            alert(x); // undefined, because (x = 1) not evaluated

            let x;
            false || (x = 1);
            alert(x); // 1
            ```
            As we can see, such a use case is a "shorter way to do if". The first operand is converted to boolean and if it’s false then the second one is evaluated.

- && (AND)
    ```js
    result = a && b;
    ```
    - In classical programming AND returns true if both operands are truthy and false otherwise:
    ```js
    alert( true && true );   // true
    alert( false && true );  // false
    alert( true && false );  // false
    alert( false && false ); // false
    ```

- AND seeks the first falsy value
    ```js
    result = value1 && value2 && value3;
    ```
    - The AND && operator does the following:
        - Evaluate operands from left to right.
        - For each operand, convert it to a boolean. If the result is `false`, stop and return the original value of that operand.
        - If all other operands have been assessed (i.e. all were truthy), return the last operand.
    ```js
    // if the first operand is truthy,
    // AND returns the second operand:
    alert( 1 && 0 ); // 0
    alert( 1 && 5 ); // 5

    // if the first operand is falsy,
    // AND returns it. The second operand is ignored
    alert( null && 5 ); // null
    alert( 0 && "no matter what" ); // 0
    ```
    > The precedence of the AND `&&` operator is higher than OR `||,` so it executes before OR.
    ```js
    alert( 5 || 1 && 0 ); // 5
    ```
    - Just like OR, the AND `&&` operator can sometimes replace `if`.
    ```js
    let x = 1
    (x > 0) && alert( 'Greater than zero!' )
    ```

- ! (NOT)
    - The operator accepts a single argument and does the following:
        - Converts the operand to boolean type: `true/false`.
        - Returns an inverse value.
    ```js
    alert( !true ); // false
    alert( !0 ); // true
    ```

### **Loops: while and for**

**Summary**
- We covered 3 types of loops:
    - `while` – The condition is checked before each iteration.
    - `do..while` – The condition is checked after each iteration.
    - `for (;;)` – The condition is checked before each iteration, additional settings available.
- To make an “infinite” loop, usually the `while(true)` construct is used. Such a loop, just like any other, can be stopped with the `break` directive.
- If we don’t want to do anything on the current iteration and would like to forward to the next one, the `continue` directive does it.
- `break/continue` support labels before the loop. A label is the only way for `break/continue` to escape the nesting and go to the outer loop.

**Learning Outcome**

- The “while” loop
    ```js
    while (condition) {
        // code
        // so-called "loop body"
    }

    let i = 0;
    while (i < 3) { // shows 0, then 1, then 2
        alert( i )
        i++
    }
    ```
    - A single execution of the loop body is called an iteration. The loop in the example above makes three iterations.
    - Any expression or a variable can be a loop condition, not just a comparison. They are evaluated and converted to a boolean by while.
    ```js
    let i = 3
    while (i) { // when i becomes 0, the condition becomes falsy, and the loop stops
        alert( i )
        i--
    }
    ```

- The “do…while” loop
    ```js
    do {
        // loop body
    } while (condition)
    ```
    - The loop will first execute the body, then check the condition and, while it’s truthy, execute it again and again.
    ```js
    let i = 0
    do {
        alert( i )
        i++
    } while (i < 3)
    ```

- The “for” loop
    ```js
    for (begin; condition; step) {
        // ... loop body ...
    }
    ```
    - For example:
    ```js
    for (let i = 0; i < 3; i++) { // shows 0, then 1, then 2
        alert(i);
    }
    ```
    - Inline variable declaration vs variable declared outside the loop
    ```js
    for (let i = 0; i < 3; i++) {
        alert(i); // 0, 1, 2
    }
    alert(i); // error, no such variable

    let i = 0;
    for (i = 0; i < 3; i++) { // use an existing variable
        alert(i); // 0, 1, 2
    }
    alert(i); // 3, visible, because declared outside of the loop
    ```

- Breaking the loop
    ```js
    let sum = 0

    while (true) {
        let value = +prompt("Enter a number", '')
        if (!value) break // (*)

        sum += value
    }
    alert( 'Sum: ' + sum )
    ```
    - The combination “`infinite loop + break as needed`” is great for situations when the condition must be checked not in the beginning/end of the loop, but in the middle, or even in several places of the body.

- Continue to the next iteration
    - The `continue` directive is a “lighter version” of `break`. It doesn’t stop the whole loop. Instead it stops the current iteration and forces the loop to start a new one (if the condition allows).
    ```js
    for (let i = 0; i < 10; i++) {
        // if true, skip the remaining part of the body
        if (i % 2 == 0) continue
        alert(i) // 1, then 3, 5, 7, 9
    }
    ```
    > The directive `continue` helps to decrease nesting level

    > No `break/continue` to the right side of the ternary operator ‘?’

- Labels for break/continue
    ```js
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let input = prompt(`Value at coords (${i},${j})`, '')
            // what if I want to exit from here to Done (below)?
        }
    }

    alert('Done!')
    ```
    - We need a way to stop the process if the user cancels the input.
    - The ordinary `break` after `input` would only break the inner loop. That’s not sufficient. Labels come to the rescue.
    - A `label` is an identifier with a colon before a loop:
        ```js
        outer:
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let input = prompt(`Value at coords (${i},${j})`, '')
                // if an empty string or canceled, then break out of both loops
                if (!input) break outer // (*)

                // do something with the value...
            }
        }
        alert('Done!')
        ```
        - In the code above `break outer` looks upwards for the label named `outer` and breaks out of that loop.

### **The "switch" statement**

**Learning Outcome**

- The syntax
    ```js
    switch(x) {
        case 'value1':  // if (x === 'value1')
            ...
            [break]

        case 'value2':  // if (x === 'value2')
            ...
            [break]

        default:
            ...
            [break]
    }
    ```
    - The value of x is checked for a strict equality to the value from the first `case` (that is, value1) then to the second (value2) and so on.
    - If the equality is found, `switch` starts to execute the code starting from the corresponding case, until the nearest `break` (or until the end of switch).
    - If no case is matched then the default code is executed (if it exists).
    - Any expression can be a `switch/case` argument:
    ```js
    let a = "1"
    let b = 0

    switch (+a) {
        case b + 1:
            alert("this runs, because +a is 1, exactly equals b+1")
            break
        default:
            alert("this doesn't run")
    }
    ```

- Grouping of “case”
    ```js
    let a = 2 + 2;

    switch (a) {
        case 4:
            alert('Right!')
            break

        case 3:                    // (*) grouped two cases
        case 5:
            alert('Wrong!')
            alert("Why don't you take a math class?")
            break

        default:
            alert('The result is strange. Really.')
    }
    ```

- Type Matters
    - Let’s emphasize that the equality check is always strict. The values must be of the same type to match.
    ```js
    let arg = prompt("Enter a value?")
    switch (arg) {
        case '0':
        case '1':
            alert( 'One or zero' )
            break

        case '2':
            alert( 'Two' )
            break

        case 3:
            alert( 'Never executes!' )
            break
        default:
            alert( 'An unknown value' )
    }
    ```

### **Functions**

**Learning Outcome**

- Function Declaration
    ```js
    function showMessage() {
        alert( 'Hello everyone!' );
    }

    showMessage()
    showMessage()
    ```
    ![function](https://javascript.info/article/function-basics/function_basics@2x.png)

    - The call `showMessage()` executes the code of the function. Here we will see the message two times.

- Local variables
    - A variable declared inside a function is only visible inside that function.

- Outer variables
    - The function has full access to the outer variable. It can modify it as well.
    - The outer variable is only used if there’s no local one. So an occasional modification may happen if we forget `let`.
    - If a same-named variable is declared inside the function then it *shadows* the outer one. For instance, in the code below the function uses the local userName. The outer one is ignored.
    - Variables declared outside of any function, such as the outer userName in the code above, are called *global*.

- Parameters
    - We can pass arbitrary data to functions using parameters (also called *function arguments*).

- Default values
    - If a parameter is not provided, then its value becomes `undefined`.
    - If we want to use a “default” `text` in this case, then we can specify it after `=`:
    ```js
    function showMessage(from, text = "no text given") {
        alert( from + ": " + text );
    }

    showMessage("Ann"); // Ann: no text given
    ```
    - Now if the text parameter is not passed, it will get the value "`no text given`" instead of `undefined`
    - Here "`no text given`" is a string, but it can be a more complex expression, which is only evaluated and assigned if the parameter is missing. So, this is also possible:
    ```js
    function showMessage(from, text = anotherFunction()) {
        // anotherFunction() only executed if no text given
        // its result becomes the value of text
    }
    ```

- Returning a value
    - A function can return a value back into the calling code as the result.
    ```js
    function sum(a, b) {
        return a + b;
    }

    let result = sum(1, 2);
    alert( result ); // 3
    ```
    - The directive `return` can be in any place of the function. When the execution reaches it, the function stops, and the value is returned to the calling code (assigned to `result` above).
    - A function with an empty `return` or without it returns `undefined`
    - Never add a newline between `return` and the value. For example:
        ```js
        return
            (some + long + expression + or + whatever * f(a) + f(b))
        ```

- Naming a function
    - Functions are actions. So their name is usually a verb. It should briefly, but as accurately as possible describe what the function does. So that a person who reads the code gets the right clue.
    - There exist many well-known function prefixes like `create…`, `show…`, `get…`, `check…` and so on. Use them to hint what a function does.

- Functions == Comments
    - Functions should be short and do exactly one thing. If that thing is big, maybe it’s worth it to split the function into a few smaller functions. Sometimes following this rule may not be that easy, but it’s definitely a good thing.
    - A separate function is not only easier to test and debug – its very existence is a great comment!

### **Function Expressions and Arrows**

**Learning Outcome**

- Function Declaration
    ```js
    function sayHi() {
        alert( "Hello" );
    }
    ```
- Function Expression
    ```js
    let sayHi = function() {
        alert( "Hello" )
    }
    ```
- Callback Functions
    ```js
    function ask(question, yes, no) {
        if (confirm(question)) yes()
        else no();
    }

    function showOk() {
        alert( "You agreed." );
    }

    function showCancel() {
        alert( "You canceled the execution." );
    }

    // usage: functions showOk, showCancel are passed as arguments to ask
    ask("Do you agree?", showOk, showCancel);
    ```
    - The arguments of `ask` are called *callback functions* or just *callbacks*.
    - **A function is a value representing an “action”**
        - Regular values like strings or numbers represent the data.
        - A function can be perceived as an *action*.
        - We can pass it between variables and run when we want.

- Function Expression vs Function Declaration
    - A `Function Expression` is created when the execution reaches it and is usable from then on.
    - A `Function Declaration` is usable in the whole script/code block.
        - When JavaScript prepares to run the script or a code block, it first looks for Function Declarations in it and creates the functions. We can think of it as an “initialization stage”.
    - Example:
        ```js
        /* Function Declaration */
        sayHi("John"); // Hello, John

        function sayHi(name) {
            alert( `Hello, ${name}` );
        }

        /* Function Expression */
        sayHi("John"); // error!

        let sayHi = function(name) {  // (*) no magic any more
            alert( `Hello, ${name}` );
        };
        ```
    - When a `Function Declaration` is made within a code block, it is visible everywhere inside that block. But not outside of it.
    - When to choose Function Declaration versus Function Expression?
        - As a rule of thumb, when we need to declare a function, the first to consider is `Function Declaration` syntax, the one we used before. It gives more freedom in how to organize our code, because we can call such functions before they are declared.

- Arrow Functions
    ```js
    let func = (arg1, arg2, ...argN) => expression
    ```
    - …This creates a function `func` that has arguments `arg1..argN`, evaluates the `expression` on the right side with their use and returns its result.
    - **Multiline Arrow Functions**
        ```js
        let sum = (a, b) => {  // the curly brace opens a multiline function
            let result = a + b;
            return result; // if we use curly braces, use return to get results
        }

        alert( sum(1, 2) ) // 3
        ```
    - Arrow functions are handy for one-liners. They come in two flavors:
        - Without curly braces: `(...args) => expression` – the right side is an expression: the function evaluates it and returns the result.
        - With curly braces: `(...args) => { body }` – brackets allow us to write multiple statements inside the function, but we need an explicit `return` to return something.

### **JavaScript Specials**

- Code Structure
    - Statements are delimited with a semicolon:
        ```js
        alert('Hello'); alert('World');
        ```
    - a line-break is also treated as a delimiter, so that would also work:
        ```js
        alert('Hello')
        alert('World')
        ```

- Strict Mode
    - To fully enable all features of modern JavaScript, we should start scripts with `"use strict"`
    - The directive must be at the top of a script or at the beginning of a function.

- Variables
    - `let`
    - `const` (constant, can’t be changed)
    - `var` (old-style, will see later)
    - A variable name can include:
        - Letters and digits, but the first character may not be a digit.
        - Characters `$` and `_` are normal, on par with letters.
        - Non-Latin alphabets and hieroglyphs are also allowed, but commonly not used.
    - There are 7 data types:
        - `number` for both floating-point and integer numbers,
        - `string` for strings
        - `boolean` for logical values: true/false
        - `null` – a type with a single value null, meaning “empty” or “does not exist”
        - `undefined` – a type with a single value undefined, meaning “not assigned”
        - `object` and `symbol` – for complex data structures and unique identifiers
    - The `typeof` operator returns the type for a value, with two exceptions:
        ```js
        typeof null == "object" // error in the language
        typeof function(){} == "function" // functions are treated specially
        ```

- Interaction
    - `prompt(question[, default])`
    - `confirm(question)`
    - `alert(message)`
    - All these functions are modal, they pause the code execution and prevent the visitor from interacting with the page until he answers

- Operators
    - Arithmetical
    - Assignments
    - Bitwise
    - Ternary
    - Logical operators
    - Comparisons

- Loops
    - 3 types of loops:
        ```js
        // 1
        while (condition) {
            ...
        }

        // 2
        do {
            ...
        } while (condition);

        // 3
        for(let i = 0; i < 10; i++) {
            ...
        }
        ```
    - The variable declared in `for(let...)` loop is visible only inside the loop. But we can also omit let and reuse an existing variable.

- The “switch” Construct
    - The “switch” construct can replace multiple `if` checks. It uses `===` (strict equality) for comparisons.

- Functions
    - `Function Declaration`: the function in the main code flow
    - `Function Expression`: the function in the context of an expression
    - Arrow functions
        - Functions may have local variables: those declared inside its body. Such variables are only visible inside the function.
        - Parameters can have default values: `function sum(a = 1, b = 2) {...}`.
        - Functions always return something. If there’s no `return` statement, then the result is `undefined`.