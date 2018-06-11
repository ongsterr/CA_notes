## **Methods of Primitives**

### **A primitive as an object**

- Here’s the paradox faced by the creator of JavaScript:
    - There are many things one would want to do with a primitive like a string or a number. It would be great to access them as methods.
    - Primitives must be as fast and lightweight as possible.
- The solution looks a little bit awkward, but here it is:
    - Primitives are still primitive. A single value, as desired.
    - The language allows access to methods and properties of strings, numbers, booleans and symbols.
    - When this happens, a special “object wrapper” is created that provides the extra functionality, and then is destroyed.
- The “object wrappers” are different for each primitive type and are called: `String`, `Number`, `Boolean` and `Symbol`. Thus, they provide different sets of methods.
    ```js
    let str = "Hello";

    alert( str.toUpperCase() ); // HELLO
    ```
    - Here’s what actually happens in `str.toUpperCase()`:
        - The string `str` is a primitive. So in the moment of accessing its property, a special object is created that knows the value of the string, and has useful methods, like `toUpperCase()`.
        - That method runs and returns a new string (shown by `alert`).
        - The special object is destroyed, leaving the primitive `str` alone.
- So primitives can provide methods, but they still remain lightweight.
- The JavaScript engine highly optimizes this process. It may even skip the creation of the extra object at all. But it must still adhere to the specification and behave as if it creates one
- **Constructors String/Number/Boolean are for internal use only**
    - Some languages like Java allow us to create “wrapper objects” for primitives explicitly using a syntax like `new Number(1)` or `new Boolean(false)`.
    - In JavaScript, that’s also possible for historical reasons, but highly **unrecommended**. Things will go crazy in several places.
        ```js
        let zero = new Number(0);

        if (zero) { // zero is true, because it's an object
            alert( "zero is truthy?!?" );
        }
        ```
- **null/undefined have no methods**

## **Numbers**

- All numbers in JavaScript are stored in 64-bit format IEEE-754, also known as “double precision”.

### **Hex, binary and octal numbers**

- [Hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) numbers are widely used in JavaScript to represent colors, encode characters, and for many other things.
- There exists a shorter way to write them: `0x` and then the number.
    ```js
    alert( 0xff ); // 255
    alert( 0xFF ); // 255 (the same, case doesn't matter)
    ```
- Binary and octal numeral systems are rarely used, but also supported using the `0b` and `0o` prefixes:
    ```js
    let a = 0b11111111; // binary form of 255
    let b = 0o377; // octal form of 255

    alert( a == b ); // true, the same number 255 at both sides
    ```
- There are only 3 numeral systems with such support. For other numeral systems, we should use the function `parseInt`.

### **toString(base)**

- The method `num.toString(base)` returns a string representation of `num` in the numeral system with the given `base`.
    ```js
    let num = 255;

    alert( num.toString(16) );  // ff
    alert( num.toString(2) );   // 11111111
    ```
    - The base can vary from `2` to `36`. By default it’s `10`.
    - Common use cases for this are:
        - **base=16** is used for hex colors, character encodings etc, digits can be `0..9` or `A..F`.
        - **base=2** is mostly for debugging bitwise operations, digits can be `0` or `1`.
        - **base=36** is the maximum, digits can be `0..9` or `A..Z`. The whole latin alphabet is used to represent a number. A funny, but useful case for `36` is when we need to turn a long numeric identifier into something shorter, for example to make a short url. Can simply represent it in the numeral system with base `36`:
        ```js
        alert( 123456..toString(36) ); // 2n9c
        ```
- **Two dots to call a method**
    - If we want to call a method directly on a number, like toString in the example above, then we need to place two dots `..` after it i.e. `123456..toString(36)`

### **Rounding**

- `Math.floor`
    - Rounds down: 3.1 becomes 3, and -1.1 becomes -2.
- `Math.ceil`
    - Rounds up: 3.1 becomes 4, and -1.1 becomes -1.
- `Math.round`
    - Rounds to the nearest integer: 3.1 becomes 3, 3.6 becomes 4 and -1.1 becomes -1.
- `Math.trunc`
    - Removes anything after the decimal point without rounding: 3.1 becomes 3, -1.1 becomes -1.
- **What if we’d like to round the number to n-th digit after the decimal?**
    1. Multiply-and-divide
        ```js
        let num = 1.23456;

        alert( Math.floor(num * 100) / 100 ); // 1.23456 -> 123.456 -> 123 -> 1.23
        ```
    2. The method `toFixed(n)` rounds the number to `n` digits after the point and returns a string representation of the result.
        ```js
        let num = 12.34;
        alert( num.toFixed(1) ); // "12.3"
        ```
    3. Please note that result of `toFixed` is a string. If the decimal part is shorter than required, zeroes are appended to the end:
        ```js
        let num = 12.34;
        alert( num.toFixed(5) ); // "12.34000", added zeroes to make exactly 5 digits
        ```
        - We can convert it to a number using the unary plus or a `Number()` call: `+num.toFixed(5)`.

### **Imprecise Calculations**

- Consider this (falsy!) test:
    ```js
    alert( 0.1 + 0.2 == 0.3 ); // false
    alert( 0.1 + 0.2 ); // 0.30000000000000004

    alert( 0.1.toFixed(20) ); // 0.10000000000000000555
    ```
    - But why does this happen?
        - A number is stored in memory in its binary form, a sequence of ones and zeroes. But fractions like `0.1`, `0.2` that look simple in the decimal numeric system are actually unending fractions in their binary form.
        - In other words, what is `0.1`? It is one divided by ten `1/10`, one-tenth. In decimal numeral system such numbers are easily representable. Compare it to one-third: `1/3`. It becomes an endless fraction `0.33333(3)`.
        - So, division by powers `10` is guaranteed to work well in the decimal system, but division by `3` is not. For the same reason, in the binary numeral system, the division by powers of `2` is guaranteed to work, but `1/10` becomes an endless binary fraction.
    - Can we work around the problem?
        - We can round the result with the help of a method `toFixed(n)`:
            ```js
            let sum = 0.1 + 0.2;
            alert( sum.toFixed(2) ); // 0.30

            let sum = 0.1 + 0.2;
            alert( +sum.toFixed(2) ); // 0.3
            ```
        - We can temporarily turn numbers into integers for the maths and then revert it back.
            ```js
            alert( (0.1 * 10 + 0.2 * 10) / 10 ); // 0.3
            ```
    - **The funny thing**
        ```js
        // Hello! I'm a self-increasing number!
        alert( 9999999999999999 ); // shows 10000000000000000
        ```

### **Tests: isFinite and isNaN**

- `Infinite` (and `-Infinite`) is a special numeric value that is greater (less) than anything.
- `NaN` represents an error.
- They belong to the type `number`, but are not “normal” numbers, so there are special functions to check for them:
    - `isNaN(value)` converts its argument to a number and then tests it for being `NaN`
        - Can’t we just use the comparison `=== NaN`? Sorry, but the answer is no. The value `NaN` is unique in that it does not equal anything, including itself i.e. `alert( NaN === NaN ); // false`
    - `isFinite(value)` converts its argument to a number and returns `true` if it’s a regular number, not `NaN/Infinity/-Infinity`
        ```js
        alert( isFinite("15") ); // true
        alert( isFinite("str") ); // false, because a special value: NaN
        alert( isFinite(Infinity) ); // false, because a special value: Infinity
        ```
    - **Compare with Object.is**
        - It works with NaN: `Object.is(NaN, NaN) === true`, that’s a good thing.
        - Values `0` and `-0` are different: `Object.is(0, -0) === false`, it rarely matters, but these values technically are different.

### **parseInt and parseFloat**

- Numeric conversion using a plus `+` or `Number()` is strict
    ```js
    alert( +"100px" ); // NaN
    ```
- `parseInt` and `parseFloat`
    - They “read” a number from a string until they can. In case of an error, the gathered number is returned. The function `parseInt` returns an integer, whilst `parseFloat` will return a floating-point number:
        ```js
        alert( parseInt('100px') ); // 100
        alert( parseFloat('12.5em') ); // 12.5

        alert( parseInt('12.3') ); // 12, only the integer part is returned
        alert( parseFloat('12.3.4') ); // 12.3, the second point stops the reading
        ```
    - There are situations when `parseInt/parseFloat` will return `NaN`. It happens when no digits could be read:
        ```js
        alert( parseInt('a123') ); // NaN, the first symbol stops the process
        ```
    - **The second argument of parseInt(str, radix)**
        - The `parseInt()` function has an optional second parameter. It specifies the base of the numeral system, so `parseInt` can also parse strings of hex numbers, binary numbers and so on:
            ```js
            alert( parseInt('0xff', 16) ); // 255
            alert( parseInt('ff', 16) ); // 255, without 0x also works

            alert( parseInt('2n9c', 36) ); // 123456
            ```

### **Other math functions**

- `Math.random()` - Returns a random number from 0 to 1 (not including 1)
- `Math.max(a, b, c...)` / `Math.min(a, b, c...)` - Returns the greatest/smallest from the arbitrary number of arguments.
- `Math.pow(n, power)` - Returns n raised the given power

## ** Strings**

### **Quotes**

- Strings can be enclosed within either `single quotes`, `double quotes` or `backticks`
    - Single and double quotes are essentially the same
    - Backticks, however, allow us to embed any expression into the string, including function calls
- Backticks also allow us to specify a “template function” before the first backtick. The syntax is: `func string`. The function `func` is called automatically, receives the string and embedded expressions and can process them. 
    - This feature makes it easier to wrap strings into custom templating or other functionality, but it is *rarely used*.

### **Special Characters**

- It is still possible to create multiline strings with single quotes by using a so-called “newline character”, written as `\n`, which denotes a line break
- Less common “special” characters
    - `\b` - 	Backspace
    - `\f` - Form feed
    - `\n` - New line
    - `\r` - Carriage return
    - `\t` - Tab
    - `\uNNNN` - A unicode symbol with the hex code `NNNN`, for instance `\u00A9` – is a unicode for the copyright symbol `©`. It must be exactly 4 hex digits.
    - `\u{NNNNNNNN}` - Some rare characters are encoded with two unicode symbols, taking up to 4 bytes. This long unicode requires braces around it.
- All special characters start with a backslash character `\`. It is also called an “escape character”.

### **String Length**

- The `length` property has the string length:
    ```js
    alert( `My\n`.length ); // 3
    ```
    - Note that `\n` is a single “special” character, so the length is indeed `3`
- **`length` is a property**
    - Note that `str.length` is a numeric property, not a function. There is no need to add brackets after it.

### **Accessing Characters**

- To get a character at position pos, use square brackets `[pos]` or call the method `str.charAt(pos)`. The first character starts from the zero position
    ```js
    let str = `Hello`;

    // the first character
    alert( str[0] ); // H
    alert( str.charAt(0) ); // H

    // the last character
    alert( str[str.length - 1] ); // o
    ```
    - The only difference between them is that if no character is found, `[]` returns `undefined`, and `charAt` returns an empty string.
- We can also iterate over characters using `for..of`:
    ```js
    for (let char of "Hello") {
        alert(char); // H,e,l,l,o (char becomes "H", then "e", then "l" etc)
    }
    ```

### **Strings are immutable**

- Strings can’t be changed in JavaScript. It is impossible to change a character.

### **Changing the case**

- Methods `toLowerCase()` and `toUpperCase()` change the case
    ```js
    alert( 'Interface'.toUpperCase() ); // INTERFACE
    alert( 'Interface'.toLowerCase() ); // interface
    ```

### **Searching for a substring**

- `str.indexOf(sybstr, pos)`
    - It looks for the `substr` in `str`, starting from the given position `pos`, and returns the position where the match was found or `-1` if nothing can be found.
        ```js
        let str = 'Widget with id';

        alert( str.indexOf('Widget') ); // 0, because 'Widget' is found at the beginning
        alert( str.indexOf('widget') ); // -1, not found, the search is case-sensitive

        alert( str.indexOf("id") ); // 1, "id" is found at the position 1 (..idget with id)
        ```
    - **str.lastIndexOf(pos)**
    - Searches from the end of a string to its beginning. It would list the occurrences in the reverse order.
    - There is a slight inconvenience with `indexOf` in the `if` test.
        ```js
        let str = "Widget with id";

        if (str.indexOf("Widget") != -1) {
            alert("We found it"); // works now!
        }
        ```
    - **The bitwise NOT trick**
        - One of the old tricks used here is the bitwise `NOT ~` operator. It converts the number to a 32-bit integer (removes the decimal part if exists) and then reverses all bits in its binary representation.
        - For 32-bit integers the call `~n` means exactly the same as `-(n+1)`
            ```js
            let str = "Widget";

            if (~str.indexOf("Widget")) {
                alert( 'Found it!' ); // works
            }
            ```
- **includes, startsWith, endsWith**
    - The more modern method `str.includes(substr, pos)` returns `true/false` depending on whether `str` contains `substr` within.

### **Getting a substring**

- 3 methods in JavaScript to get a substring: `substring`, `substr` and `slice`.
    - `str.slice(start [, end])` - Returns the part of the string from start to (but not including) end.
    - `str.substring(start [, end])` - Returns the part of the string between `start` and `end`.
        - This is almost the same as slice, but it allows start to be `greater` than `end`.
    - `str.substr(start [, length])` - Returns the part of the string from `start`, with the given `length`.
- **Which one to choose?**
    - All of them can do the job. Formally, `substr` has a minor drawback: it is described not in the core JavaScript specification, but in Annex B, which covers browser-only features that exist mainly for historical reasons. So, non-browser environments may fail to support it. But in practice it works everywhere.

### **Comparing strings**

- All strings are encoded using [UTF-16](https://en.wikipedia.org/wiki/UTF-16). That is: each character has a corresponding numeric code. There are special methods that allow to get the character for the code and back.
    - `str.codePointAt(pos)` - Returns the code for the character at position `pos`
    - `String.fromCodePoint(code)` - Creates a character by its numeric `code`
    - Add unicode characters by their codes using `\u` followed by the hex code
        ```js
        // 90 is 5a in hexadecimal system
        alert( '\u005a' ); // Z
        ```
- Let’s see the characters with codes `65..220`
    ```js
    let str = '';

    for (let i = 65; i <= 220; i++) {
        str += String.fromCodePoint(i);
    }
    alert( str );
    // ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
    // ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜ
    ```
    - The characters are compared by their numeric code. The greater code means that the character is greater. The code for `a` (97) is greater than the code for `Z` (90).

### **Correct comparisons**

- The call `str.localeCompare(str2)`:
    - Returns `1` if `str` is greater than `str2` according to the language rules.
    - Returns `-1` if `str` is less than `str2`.
    - Returns `0` if they are equal.

### **Internals, Unicode**

- **Surrogate pairs**
    - Most symbols have a 2-byte code. Letters in most european languages, numbers, and even most hieroglyphs, have a 2-byte representation.
    - But 2 bytes only allow 65536 combinations and that’s not enough for every possible symbol. So rare symbols are encoded with a pair of 2-byte characters called “*a surrogate pair*”.
        ```js
        alert( '𝒳'.length ); // 2, MATHEMATICAL SCRIPT CAPITAL X
        alert( '😂'.length ); // 2, FACE WITH TEARS OF JOY
        alert( '𩷶'.length ); // 2, a rare chinese hieroglyph
        ```
    - Getting a symbol can be tricky, because surrogate pairs are treated as two characters:
        ```js
        alert( '𝒳'[0] ); // strange symbols...
        alert( '𝒳'[1] ); // ...pieces of the surrogate pair
        ```
- **Diacritical marks and normalization**

**Summary**
- `str.trim()` – removes (“trims”) spaces from the beginning and end of the string.
- `str.repeat(n)` – repeats the string `n` times.

## **Arrays**

### **Declaration**

### **Methods pop/push, shift/unshift**

- A [queue](https://en.wikipedia.org/wiki/Queue_(abstract_data_type)) is one of most common uses of an array. In computer science, this means an ordered collection of elements which supports two operations:
    - `push` appends an element to the end.
    - `shift` get an element from the beginning, advancing the queue, so that the 2nd element becomes the 1st.
- There’s another use case for arrays – the data structure named [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)) which supports two operations:
    - `push` adds an element to the end.
    - `pop` takes an element from the end.
- For stacks, the latest pushed item is received first, that’s also called *LIFO (Last-In-First-Out)* principle. For queues, we have *FIFO (First-In-First-Out)*.
- Arrays in JavaScript can work both as a queue and as a stack. They allow to add/remove elements both to/from the beginning or the end. In computer science the data structure that allows it is called [deque](https://en.wikipedia.org/wiki/Double-ended_queue).
- `shift`, `unshift`
- `push`, `pop`

### **Internals**

- An array is a special kind of object. The square brackets used to access a property `arr[0]` actually come from the object syntax. Numbers are used as keys.
- They extend objects providing special methods to work with ordered collections of data and also the `length` property. But at the core it’s still an object.
- The ways to misuse an array:
    - Add a non-numeric property like `arr.test = 5`.
    - Make holes, like: add `arr[0]` and then `arr[1000]` (and nothing between them).
    - Fill the array in the reverse order, like `arr[1000]`, `arr[999]` and so on.
    - Arrays are carefully tuned inside JavaScript engines to work with contiguous ordered data, please use them this way.

### **Performance**

- Methods `push/pop` run fast, while `shift/unshift` are slow.
    
    ![image](https://javascript.info/article/array/array-speed@2x.png)
- Why is it faster to work with the end of an array than with its beginning?
    ```js
    fruits.shift(); // take 1 element from the start
    ```
    - It’s not enough to take and remove the element with the number `0`. Other elements need to be renumbered as well.
    - The `shift` operation must do 3 things:
        - Remove the element with the index `0`.
        - Move all elements to the left, renumber them from the index `1` to `0`, from `2` to `1` and so on.
        - Update the `length` property.

    ![image](https://javascript.info/article/array/array-shift@2x.png)
    - **The more elements in the array, the more time to move them, more in-memory operations.**
- **And what’s with `push/pop`?** They do not need to move anything. To extract an element from the end, the `pop` method cleans the index and shortens `length`.

    ![image](https://javascript.info/article/array/array-pop@2x.png)
    - **The pop method does not need to move anything, because other elements keep their indexes. That’s why it’s blazingly fast.**

### **Loops**

- One of the oldest ways to cycle array items is the for loop over indexes
    ```js
    let arr = ["Apple", "Orange", "Pear"];

    for (let i = 0; i < arr.length; i++) {
        alert( arr[i] );
    }
    ```
- But for arrays there is another form of loop, `for..of`:
    ```js
    let fruits = ["Apple", "Orange", "Plum"];

    // iterates over array elements
    for (let fruit of fruits) {
        alert( fruit );
    }
    ```
- Technically, because arrays are objects, it is also possible to use `for..in`:
    ```js
    let arr = ["Apple", "Orange", "Pear"];

    for (let key in arr) {
        alert( arr[key] ); // Apple, Orange, Pear
    }
    ```
    - But that’s actually a bad idea. There are potential problems with it:
        - The loop `for..in` iterates over all properties, not only the numeric ones.
        - The `for..in` loop is optimized for generic objects, not arrays, and thus is 10-100 times slower. Of course, it’s still very fast. The speedup may matter only in bottlenecks or just irrelevant. But still we should be aware of the difference.

### **A word about “length”**

- The `length` property automatically updates when we modify the array. To be precise, it is actually not the count of values in the array, but the greatest numeric index plus one.
    ```js
    let fruits = [];
    fruits[123] = "Apple";

    alert( fruits.length ); // 124
    ```
- Another interesting thing about the `length` property is that it’s writable.
    ```js
    let arr = [1, 2, 3, 4, 5];

    arr.length = 2; // truncate to 2 elements
    alert( arr ); // [1, 2]

    arr.length = 5; // return length back
    alert( arr[3] ); // undefined: the values do not return
    ```

### **new Array()**

- If `new Array` is called with a single argument which is a number, then it creates an array without items, but with the given `length`.
    ```js
    let arr = new Array(2); // will it create an array of [2] ?

    alert( arr[0] ); // undefined! no elements.

    alert( arr.length ); // length 2
    ```

### **Multidimensional arrays**

- Arrays can have items that are also arrays. We can use it for multidimensional arrays, to store matrices:
    ```js
    let matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    alert( matrix[1][1] ); // the central element
    ```

### **toString**

- Arrays have their own implementation of `toString` method that returns a comma-separated list of elements.
    ```js
    let arr = [1, 2, 3];

    alert( arr ); // 1,2,3
    alert( String(arr) === '1,2,3' ); // true
    ```
- Arrays do not have `Symbol.toPrimitive`, neither a viable `valueOf`, they implement only `toString` conversion, so here `[]` becomes an empty string, `[1]` becomes `"1"` and `[1,2]` becomes `"1,2"`.

### **Array Methods**

- `arr.splice(index[, deleteCount, elem1, ..., elemN])`
    - It starts from the position `index`: removes `deleteCount` elements and then inserts `elem1, ..., elemN` at their place. Returns the array of removed elements.
    - `splice` returns the array of removed elements
    - **Negative indexes allowed**
        - They specify the position from the end of the array, like here
            ```js
            let arr = [1, 2, 5];

            // from index -1 (one step from the end)
            // delete 0 elements,
            // then insert 3 and 4
            arr.splice(-1, 0, 3, 4);

            alert( arr ); // 1,2,3,4,5
            ```

- `arr.slice(start, end)`
    - It returns a new array where it copies all items start index "`start`" to "`end`" (not including "`end`"). Both `start` and `end` can be negative, in that case position from array end is assumed.
    - It works like `str.slice`, but makes subarrays instead of substrings

- `arr.concat(arg1, arg2...)`
    - The method arr.concat joins the array with other arrays and/or items.
    - The result is a new array containing items from `arr`, then `arg1`, `s` etc.

- `arr.filter(fn)`
    ```js
    let users = [
        {id: 1, name: "John"},
        {id: 2, name: "Pete"},
        {id: 3, name: "Mary"}
    ];

    // returns array of the first two users
    let someUsers = users.filter(item => item.id < 3);

    alert(someUsers.length); // 2
    ```

- `arr.map(function(item, index, array) {}`
- `arr.sort()`
    - **The items are sorted as strings by default.**
    ```js
    function compareNumeric(a, b) {
        if (a > b) return 1;
        if (a == b) return 0;
        if (a < b) return -1;
    }

    let arr = [ 1, 2, 15 ];

    arr.sort(compareNumeric);

    alert(arr);  // 1, 2, 15
    ```
    - **A comparison function may return any number**
    - **Arrow functions for the best**

- `arr.reduce(function(previousValue, item, index, arr) {}, initial)`
    - Here we get a sum of array in one line:
        ```js
        let arr = [1, 2, 3, 4, 5];

        let result = arr.reduce((sum, current) => sum + current, 0);

        alert(result); // 15
        ```
    - Let’s see the details of what’s going on.
        - On the first run, `sum` is the initial value (the last argument of reduce), equals `0`, and `current` is the first array element, equals `s`. So the result is `1`.
        - On the second run, `sum = 1`, we add the second array element (`2`) to it and return.
        - On the 3rd run, `sum = 3` and we add one more element to it, and so on…

    ![image](https://javascript.info/article/array-methods/reduce@2x.png)

- **Most methods support “thisArg”**