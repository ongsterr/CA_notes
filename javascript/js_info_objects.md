## **Objects: The Basics**

- There are seven data types in JavaScript. Six of them are called “`primitive`”, because their values contain only a single thing (be it a string or a number or whatever).
- Objects are used to store keyed collections of various data and more complex entities.
- An empty object (“empty cabinet”) can be created using one of two syntaxes:
    ```js
    let user = new Object(); // "object constructor" syntax
    let user = {};  // "object literal" syntax
    ```

### **Literals and Properties**

- In the `user` object, there are two properties:
    - The first property has the name `"name"` and the value `"John"`.
    - The second one has the name `"age"` and the value `30`.
    ```js
        let user = {     // an object
        name: "John",  // by key "name" store value "John"
        age: 30        // by key "age" store value 30
    };
    ```
- Property values are accessible using the dot notation:
    ```js
    // get fields of the object:
    alert( user.name ); // John
    alert( user.age ); // 30
    ```
- The value can be of any type. For example, a boolean:
    ```js
    user.isAdmin = true;
    ```
- To remove a property, we can use `delete` operator:
    ```js
    delete user.age;
    ```
- We can also use multiword property names, but then they must be quoted:
    ```js
    let user = {
        name: "John",
        age: 30,
        "likes birds": true  // multiword property name must be quoted
    };
    ```
- The last property in the list may end with a comma:
    ```js
    let user = {
        name: "John",
        age: 30,
    }
    ```

### **Square Brackets**

- For multiword properties, the dot access doesn’t work:
    ```js
    // this would give a syntax error
    user.likes birds = true
    ```
- An alternative “square bracket notation” that works with any string:
    ```js
    let user = {};

    // set
    user["likes birds"] = true;

    // get
    alert(user["likes birds"]); // true

    // delete
    delete user["likes birds"];
    ```
- Square brackets also provide a way to obtain the property name as the result of any expression – as opposed to a literal string:
    ```js
    let key = "likes birds";

    // same as user["likes birds"] = true;
    user[key] = true;
    ```

### **Computed Properties**

- We can use square brackets in an object literal. That’s called *computed properties*.
    ```js
    let fruit = prompt("Which fruit to buy?", "apple");

    let bag = {
        [fruit]: 5, // the name of the property is taken from the variable fruit
    };

    alert( bag.apple ); // 5 if fruit="apple"
    ```
    - The meaning of a computed property is simple: `[fruit]` means that the property name should be taken from `fruit`.
    - Alternatively:
    ```js
    let fruit = prompt("Which fruit to buy?", "apple");
    let bag = {};

    // take property name from the fruit variable
    bag[fruit] = 5;
    ```
    - **Reserved words are allowed as property names**
        - Probably not a good idea to do that anyway

### **Property Value Shorthand**

- In real code we often use existing variables as values for property names.
    ```js
    function makeUser(name, age) {
        return {
            name: name,
            age: age
            // ...other properties
        };
    }

    let user = makeUser("John", 30);
    alert(user.name); // John
    ```
- The use-case of making a property from a variable is so common, that there’s a special property value shorthand to make it shorter.
    ```js
    function makeUser(name, age) {
        return {
            name, // same as name: name
            age   // same as age: age
            // ...
        };
    }
    ```

### **Existence Check**

- A notable objects feature is that it’s possible to access any property. There will be no error if the property doesn’t exist! Accessing a non-existing property just returns `undefined`. It provides a very common way to test whether the property exists – to get it and compare vs undefined:
    ```js
    let user = {};

    alert( user.noSuchProperty === undefined ); // true means "no such property"
    ```
- There also exists a special operator "`in`" to check for the existence of a property.
    ```js
    "key" in object
    ```
    - If we omit quotes, that would mean a variable containing the actual name to be tested. For instance:
        ```js
        let user = { age: 30 };

        let key = "age";
        alert( key in user ); // true, takes the name from key and checks for such property
        ```
- **Using “`in`” for properties that store `undefined`**
    - Usually, the strict comparison "`=== undefined`" check works fine. But there’s a special case when it fails, but "`in`" works correctly.
    - It’s when an object property exists, but stores `undefined`.

### **The “for…in” Loop**

- To walk over all keys of an object, there exists a special form of the loop: `for..in`. This is a completely different thing from the `for(;;)` construct that we studied before.
    ```js
    let user = {
        name: "John",
        age: 30,
        isAdmin: true
    };

    for(let key in user) {
        // keys
        alert( key );  // name, age, isAdmin
        // values for the keys
        alert( user[key] ); // John, 30, true
    }
    ```

### **Ordered like an Object**

- Are objects ordered? In other words, if we loop over an object, do we get all properties in the same order they were added? Can we rely on this?
    - The short answer is: “**ordered in a special fashion**”: integer properties are sorted, others appear in creation order.
        ```js
        let codes = {
            "49": "Germany",
            "41": "Switzerland",
            "44": "Great Britain",
            // ..,
            "1": "USA"
        };

        for(let code in codes) {
            alert(code); // 1, 41, 44, 49
        }
        ```
- **Integer properties? What’s that?**
    - The “integer property” term here means a string that can be converted to-and-from an integer without a change.
    - So, “`49`” is an integer property name, because when it’s transformed to an integer number and back, it’s still the same.

### **Copying by Reference**

- One of the fundamental differences of objects vs primitives is that they are stored and copied “**by reference**”.
    ```js
    let message = "Hello!";
    let phrase = message;
    ```
    - As a result we have **two independent variables**, each one is storing the string `"Hello!"`

    ![image](https://javascript.info/article/object/variable-copy-value@2x.png)
- **A variable object stores not the object itself, but its “address in memory”, in other words “a reference” to it.**

    ![image](https://javascript.info/article/object/variable-contains-reference@2x.png)
- **When an object variable is copied – the reference is copied, the object is not duplicated.**
    ```js
    let user = { name: "John" };

    let admin = user; // copy the reference
    ```
    ![image](https://javascript.info/article/object/variable-copy-reference@2x.png)
    - We can use any variable to access the cabinet and modify its contents

### **Comparison by Reference**

- The equality `==` and strict equality `===` operators for objects work exactly the same.
- **Two objects are equal only if they are the same object.**
- Two independent objects are not equal, even though both are empty:
    ```js
    let a = {};
    let b = {}; // two independent objects

    alert( a == b ); // false
    ```

### **Const Object**

- An object declared as `const` can be changed.
    ```js
    const user = {
        name: "John"
    };

    user.age = 25; // (*)

    alert(user.age); // 25
    ```
- The `const` would give an error if we try to set `user` to something else:
    ```js
    const user = {
        name: "John"
    };

    // Error (can't reassign user)
    user = {
        name: "Pete"
    };
    ```

### **Cloning and Merging, Object.assign**

- We can use the method `Object.assign`:
    ```js
    let user = { name: "John" };

    let permissions1 = { canView: true };
    let permissions2 = { canEdit: true };

    // copies all properties from permissions1 and permissions2 into user
    Object.assign(user, permissions1, permissions2);

    // now user = { name: "John", canView: true, canEdit: true }
    ```
- If the receiving object (`user`) already has the same named property, it will be overwritten.
- We also can use `Object.assign` to replace the loop for simple cloning:
    ```js
    let user = {
        name: "John",
        age: 30
    };

    let clone = Object.assign({}, user);
    ```
- Until now we assumed that all properties of user are primitive. But properties can be references to other objects. **What to do with them?**
    - Now it’s not enough to copy `clone.sizes = user.sizes`, because the `user.sizes` is an object, it will be copied by reference. So clone and user will share the same sizes:
        ```js
        let user = {
            name: "John",
            sizes: {
                height: 182,
                width: 50
            }
        };

        let clone = Object.assign({}, user);

        alert( user.sizes === clone.sizes ); // true, same object

        // user and clone share sizes
        user.sizes.width++;       // change a property from one place
        alert(clone.sizes.width); // 51, see the result from the other one
        ```
        - To fix that, we should use the cloning loop that examines each value of user[key] and, if it’s an object, then replicate its structure as well. That is called a “`deep cloning`”.

## **Garbage Collection**

- Memory management in JavaScript is performed automatically and invisibly to us. We create primitives, objects, functions… All that takes memory.
- What happens when something is not needed any more? How does the JavaScript engine discover it and clean it up?

### **Reachability**

- “*reachable*” values are those that are accessible or usable somehow. They are guaranteed to be stored in memory.
- There’s a base set of inherently reachable values, that cannot be deleted for obvious reasons.
    - Local variables and parameters of the current function.
    - Variables and parameters for other functions on the current chain of nested calls.
    - Global variables.
    - (there are some other, internal ones as well)\
    These values are called *roots*
- Any other value is considered *reachable* if it’s reachable from a root by a reference or by a chain of references.
- There’s a background process in the JavaScript engine that is called [garbage collector](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)). It monitors all objects and removes those that have become unreachable.

### **A Simple Example**

- Example:
    ```js
    // user has a reference to the object
    let user = {
    name: "John"
    };
    ```
    ![image](https://javascript.info/article/garbage-collection/memory-user-john@2x.png)

    - If the value of user is overwritten, the reference is lost:
        ```js
        user = null
        ```
    ![image](https://javascript.info/article/garbage-collection/memory-user-john-lost@2x.png)

    - Now John becomes unreachable. There’s no way to access it, no references to it. Garbage collector will junk the data and free the memory.

### **Two References**

- Let’s imagine we copied the reference from `user` to `admin`
- Now if we do the same:
    ```js
    user = null
    ```
    - The object is still reachable via `admin` global variable, so it’s in memory. If we overwrite `admin` too, then it can be removed.

### **Interlinked Objects**

- Example the `family`:
    ```js
    function marry(man, woman) {
        woman.husband = man;
        man.wife = woman;

        return {
            father: man,
            mother: woman
        }
    }

    let family = marry({
        name: "John"
    }, {
        name: "Ann"
    });
    ```
    - The resulting memory structure:

        ![image](https://javascript.info/article/garbage-collection/family@2x.png)
    - Let’s remove two references:
        ```js
        delete family.father;
        delete family.mother.husband;
        ```

        ![image](https://javascript.info/article/garbage-collection/family-delete-refs@2x.png)
        - It’s not enough to delete only one of these two references, because all objects would still be reachable.
        - But if we delete both, then we can see that John has no incoming reference any more:

        ![image](https://javascript.info/article/garbage-collection/family-no-father@2x.png)
        - Outgoing references do not matter. Only incoming ones can make an object reachable. So, John is now unreachable and will be removed from the memory with all its data that also became unaccessible.

### **Internal Algorithms**

- The basic garbage collection algorithm is called “**mark-and-sweep**”.
- The following “garbage collection” steps are regularly performed:
    - The garbage collector takes roots and “marks” (remembers) them.
    - Then it visits and “marks” all references from them.
    - Then it visits marked objects and marks their references. All visited objects are remembered, so as not to visit the same object twice in the future.
    - …And so on until there are unvisited references (reachable from the roots).
    - All objects except marked ones are removed.
- JavaScript engines apply many optimizations to make it run faster and not affect the execution.
    - **Generational collection** – objects are split into two sets: “new ones” and “old ones”. Many objects appear, do their job and die fast, they can be cleaned up aggressively. Those that survive for long enough, become “old” and are examined less often.
    - **Incremental collection** – if there are many objects, and we try to walk and mark the whole object set at once, it may take some time and introduce visible delays in the execution. So the engine tries to split the garbage collection into pieces. Then the pieces are executed one by one, separately. That requires some extra bookkeeping between them to track changes, but we have many tiny delays instead of a big one.
    - **Idle-time collection** – the garbage collector tries to run only while the CPU is idle, to reduce the possible effect on the execution.

## **Symbol Type**

- By specification, object property keys may be either of string type, or of symbol type. Not numbers, not booleans, only strings or symbols, these two types.
- `Symbol` is a primitive type for unique identifiers.
- Symbols are created with `Symbol()` call with an optional description.
- Symbols are always different values, even if they have the same name.
- If we want same-named symbols to be equal, then we should use the *global registry*: `Symbol.for(key)` returns (creates if needed) a global symbol with `key` as the name. Multiple calls of `Symbol.for` return exactly the same symbol.
- Symbols have two main use cases:
    - **“Hidden” object properties**. If we want to add a property into an object that “belongs” to another script or a library, we can create a symbol and use it as a property key.
    - There are many system symbols used by JavaScript which are accessible as `Symbol.*`. We can use them to alter some built-in behaviors.
- Technically, symbols are not 100% hidden. There is a built-in method `Object.getOwnPropertySymbols(obj)` that allows us to get all symbols.

### **Symbols**

- “Symbol” value represents a unique identifier.
    ```js
    // id is a new symbol
    let id = Symbol();

    // id is a symbol with the description "id"
    let id = Symbol("id");
    ```
- Symbols are guaranteed to be unique. Even if we create many symbols with the same description, they are different values. The description is just a label that doesn’t affect anything.
    ```js
    let id1 = Symbol("id");
    let id2 = Symbol("id");

    alert(id1 == id2); // false
    ```

### **“Hidden” Properties**

- Symbols allow us to create “hidden” properties of an object, that no other part of code can occasionally access or overwrite.
    ```js
    let user = { name: "John" };
    let id = Symbol("id");

    user[id] = "ID Value";
    alert( user[id] ); // we can access the data using the symbol as the key
    ```
- What’s the benefit over using `Symbol("id")` over a string "`id`"?
    - Imagine that another script wants to have its own “`id`” property inside `user`, for its own purposes. That may be another JavaScript library, so the scripts are completely unaware of each other.
    - Now note that if we used a string "`id`" instead of a symbol for the same purpose, then there *would* be a conflict:
    ```js
    let user = { name: "John" };

    // our script uses "id" property
    user.id = "ID Value";

    // ...if later another script the uses "id" for its purposes...

    user.id = "Their id value"
    // boom! overwritten! it did not mean to harm the colleague, but did it!
    ```

### **Symbols in a Literal**

- If we want to use a symbol in an object literal, we need square brackets.
    ```js
    let id = Symbol("id");

    let user = {
        name: "John",
        [id]: 123 // not just "id: 123"
    };
    ```

### **Symbols are Skipped by `for…in`**

- Symbolic properties do not participate in `for..in` loop.
- **Property keys of other types are coerced to strings**
    - We can only use strings or symbols as keys in objects. Other types are converted to strings.
    - We can only use strings or symbols as keys in objects. Other types are converted to strings.

### **Global Symbols**

- Sometimes we want same-named symbols to be same entities.
- Different parts of our application want to access symbol `"id"` meaning exactly the same property.
- To achieve that, there exists a *global symbol registry*. We can create symbols in it and access them later, and it guarantees that repeated accesses by the same name return exactly the same symbol.
- In order to create or read a symbol in the registry, use `Symbol.for(key)`.
    - That call checks the global registry, and if there’s a symbol described as `key`, then returns it, otherwise creates a new symbol `Symbol(key)` and stores it in the registry by the given `key`.
    ```js
    // read from the global registry
    let id = Symbol.for("id"); // if the symbol did not exist, it is created

    // read it again
    let idAgain = Symbol.for("id");

    // the same symbol
    alert( id === idAgain ); // true
    ```
    - Symbols inside the registry are called **global symbols**.

### **Symbol.keyFor**

- For global symbols, not only `Symbol.for(key)` returns a symbol by name, but there’s a reverse call: `Symbol.keyFor(sym)`, that does the reverse: returns a name by a global symbol.
- The `Symbol.keyFor` internally uses the global symbol registry to look up the key for the symbol. So it doesn’t work for non-global symbols. If the symbol is not global, it won’t be able to find it and return `undefined`.

### **System Symbols**

- There exist many “system” symbols that JavaScript uses internally, and we can use them to fine-tune various aspects of our objects.
- They are listed in the specification in the [Well-known symbols](https://tc39.github.io/ecma262/#sec-well-known-symbols) table:
    - `Symbol.hasInstance`
    - `Symbol.isConcatSpreadable`
    - `Symbol.iterator`
    - `Symbol.toPrimitive`

## **Object Methods, "this"**
