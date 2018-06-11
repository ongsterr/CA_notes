## **Programming Paradigms for Dummies: What Every Programmer Should Know**

### **Table of Content**
1. Languages, paradigms and concepts
2. Designing a language and its programs
    - Dual-paradigm language - one for programming small and the other programming big
3. Programming concepts
4. Data abstraction
5. Deterministic concurrent programming
6. Constraint programming
7. Conclusions and suggestions for going further

### **Languages, paradigms and concepts**

**Taxonomy of programming paradigms**
1. Observable nondeterminism
    - What is a "race condition"?
        - The result of a program depends on precise differences in timing between different parts of a program (a “race”)
2. Named state
    - State is the ability to remember information, or more precisely, to store a sequence of value in time.

**Computer programming and system design**

**Creative extension principle**

### **Designing a language and its programs

1. Languages that support 2 paradigms
    - Many languages support two paradigms, typically one for programming in the small and another for programming in the large
    - The first paradigm is chosen for the kind of problem most frequently targeted by the language
    - The second paradigm is chosen to support abstraction and modularity and is used when writing large programs
    - Examples:
        - **Prolog** - "logic programming engine" and "imperative"
        - **Modelling languages** (i.e. Comet, Numerica) - "solver (constraint programming and local search)" and "object-oriented programming"
        - **Solving libraries** (i.e. geocode) - "solver library based on advanced search algorithm" and "object-oriented programming"
        - Language embedding (i.e. SQL) - "relational programming engine for logical queries of database" and "transactional interface for concurrent udpates of database" and "object-oriented programming"

2. A definitive programming language

    ![image](computing.jpg)
    - Erlang Programming
        - An Erlang program consists of isolated named lightweight processes that send each other messages.
        - Because of the isolation, Erlang programs can be run almost unchanged on distributed systems and multi-core processors.
        - The Erlang system has a replicated database, Mnesia, to keep global coherent states.
    - E Programming
        - An E program consists of isolated single-threaded vats (processes) hosting active objects that send each other messages.
        - Deterministic concurrency is important in E because nondeterminism can support a covert channel.
    - Distributed Oz
    - Didactic Oz
        - Teaching programming as a unified discipline covering all popular programming paradigms

3. Architecture of self-sufficient systems
    - What is a reasonable architecture for designing self-sufficient systems?
        - In terms of programming paradigms, what we need first is components as first-class entities (specified by closures) that can be manipulated through higher-order programming.
        - Above this level, the components behave as isolated concurrent agents that communicate through message passing.
        - Finally, we need named state and transactions for system reconfiguration and system maintenance. Named state allows us to manage the content of components and change their interconnections. This gives us a language that has a layered structure.

### **Programming Concepts**

1. Record
    - A record is a data structure: a group of references to data items with indexed access to each item.
    - The record is the foundation of symbolic programming. A symbolic programming language is able to calculate with records: create new records, decompose them, and examine them.

2. Lexically scoped closures

    ![image](closure.jpg)
    - From an implementation viewpoint, a closure combines a procedure with its external references (the references it uses at its definition).
    - From the programmer’s viewpoint, a closure is a “packet of work”: a program can transform any instructions into a closure at one point in the program, pass it to another point, and decide to execute it at that point. The result of its execution is the same as if the instructions were executed at the point the closure was created.
        - functions are closures;
        - procedures are closures;
        - objects are closures;
        - classes are closures;
        - software components are closures.
    - Many abilities normally associated with specific paradigms are based on closures:
        - Instantiation and genericity, normally associated with object-oriented programming
        - Separation of concerns, normally associated with aspect-oriented programming
        - Component-based programming is a style of programming in which programs are organized as components

3. Independence (concurrency)
    - The computing world is concurrent as well. It has three levels of concurrency:
        - Distributed system: a set of computers connected through a network.
        - Operating system: the software that manages a computer.
        - Activities inside one process.
