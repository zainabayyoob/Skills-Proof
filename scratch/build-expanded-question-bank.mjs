import fs from 'fs';
import path from 'path';

// Let's load the current questionBank
import { questionBank as existingBank } from '../server/data/questionBank.js';

console.log('Building expanded question bank with 25+ questions per skill...');

// Helper to tag existing questions with difficulty
const taggedExisting = {};
for (const [skill, questions] of Object.entries(existingBank)) {
  taggedExisting[skill] = questions.map((q, idx) => ({
    ...q,
    difficulty: idx < 3 ? 'basic' : idx < 7 ? 'intermediate' : 'advanced'
  }));
}

// Additional high-quality technical questions per skill to reach 25-28 per skill
const additionalQuestions = {
  python: [
    {
      id: 'py-q11',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'basic',
      question: 'What is the output of `bool([])`, `bool([0])`, and `bool("")` in Python?',
      options: [
        { id: 'opt_1', text: 'False, False, False' },
        { id: 'opt_2', text: 'False, True, False' },
        { id: 'opt_3', text: 'True, True, True' },
        { id: 'opt_4', text: 'False, False, True' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'In Python, empty collections ([] and "") evaluate to False (falsy), while non-empty collections ([0]) evaluate to True regardless of the truthiness of their contents.'
    },
    {
      id: 'py-q12',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'basic',
      question: 'Which method removes and returns the last item from a Python list?',
      options: [
        { id: 'opt_1', text: 'list.delete()' },
        { id: 'opt_2', text: 'list.pop()' },
        { id: 'opt_3', text: 'list.remove()' },
        { id: 'opt_4', text: 'list.extract()' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'list.pop() removes and returns the element at the specified index (defaulting to -1, the last element).'
    },
    {
      id: 'py-q13',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'basic',
      question: 'How do you create a tuple with a single element `5` in Python?',
      options: [
        { id: 'opt_1', text: '(5)' },
        { id: 'opt_2', text: '(5,)' },
        { id: 'opt_3', text: 'tuple(5)' },
        { id: 'opt_4', text: '[5].to_tuple()' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A trailing comma `(5,)` is required to define a single-element tuple; without the comma, `(5)` is evaluated simply as an integer expression inside parentheses.'
    },
    {
      id: 'py-q14',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'basic',
      question: 'What is the result of `"hello".split(",")`?',
      options: [
        { id: 'opt_1', text: "['h', 'e', 'l', 'l', 'o']" },
        { id: 'opt_2', text: "['hello']" },
        { id: 'opt_3', text: "ValueError: separator not found" },
        { id: 'opt_4', text: "[]" }
      ],
      correctOptionId: 'opt_2',
      explanation: 'If the delimiter is not found in the string, split() returns a list containing the original string as its sole element.'
    },
    {
      id: 'py-q15',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'basic',
      question: 'Which operator is used for integer floor division in Python?',
      options: [
        { id: 'opt_1', text: '/' },
        { id: 'opt_2', text: '//' },
        { id: 'opt_3', text: '%' },
        { id: 'opt_4', text: 'div()' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The `//` operator performs floor division, returning the largest integer less than or equal to the division result.'
    },
    {
      id: 'py-q16',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'intermediate',
      question: 'What is the difference between `copy.copy()` and `copy.deepcopy()`?',
      options: [
        { id: 'opt_1', text: 'copy.copy() only works on dictionaries, deepcopy works on lists' },
        { id: 'opt_2', text: 'copy.copy() creates a shallow copy copying top-level references, whereas deepcopy recursively clones all nested objects' },
        { id: 'opt_3', text: 'copy.copy() is faster because it saves data to disk' },
        { id: 'opt_4', text: 'There is no difference in modern Python 3.10+' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A shallow copy constructs a new compound object and inserts references to the original objects; a deep copy recursively copies all nested objects.'
    },
    {
      id: 'py-q17',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'intermediate',
      question: 'What is the purpose of `@property` decorator in a Python class?',
      options: [
        { id: 'opt_1', text: 'To encrypt class attributes' },
        { id: 'opt_2', text: 'To allow accessing a method like a regular attribute with getter/setter control' },
        { id: 'opt_3', text: 'To make class attributes private and inaccessible' },
        { id: 'opt_4', text: 'To bind the method directly to the global namespace' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The `@property` decorator turns a class method into a getter attribute, enabling encapsulated access and custom validation without changing the public interface.'
    },
    {
      id: 'py-q18',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'intermediate',
      question: 'What does `*args` and `**kwargs` allow in a Python function signature?',
      options: [
        { id: 'opt_1', text: 'Pointers and double-pointers in memory' },
        { id: 'opt_2', text: 'Variable number of positional arguments (as a tuple) and keyword arguments (as a dict)' },
        { id: 'opt_3', text: 'Only string arguments and only integer arguments' },
        { id: 'opt_4', text: 'Multithreading and multiprocessing parameters' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`*args` collects extra positional arguments into a tuple, while `**kwargs` collects extra keyword arguments into a dictionary.'
    },
    {
      id: 'py-q19',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'intermediate',
      question: 'What happens when you invoke `dict.get(key, default)` if `key` is missing?',
      options: [
        { id: 'opt_1', text: 'Raises a KeyError' },
        { id: 'opt_2', text: 'Returns the specified default value without raising KeyError' },
        { id: 'opt_3', text: 'Inserts the key into the dictionary with the default value' },
        { id: 'opt_4', text: 'Returns False' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`dict.get(k, default)` safely returns the fallback default value without modifying the dictionary or raising a KeyError.'
    },
    {
      id: 'py-q20',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'intermediate',
      question: 'What is the purpose of `__slots__` in a Python class definition?',
      options: [
        { id: 'opt_1', text: 'Enables asynchronous execution of methods' },
        { id: 'opt_2', text: 'Restricts valid attributes and prevents dynamic creation of `__dict__`, reducing memory overhead' },
        { id: 'opt_3', text: 'Connects the class to a database table' },
        { id: 'opt_4', text: 'Marks the class as abstract' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'By defining `__slots__`, Python skips creating an instance `__dict__`, which significantly reduces RAM usage when creating millions of small objects.'
    },
    {
      id: 'py-q21',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'advanced',
      question: 'How does the Global Interpreter Lock (GIL) in CPython affect multithreading?',
      options: [
        { id: 'opt_1', text: 'It prevents CPU-bound threads from executing Python bytecode in parallel across multiple CPU cores' },
        { id: 'opt_2', text: 'It prevents I/O-bound operations from overlapping' },
        { id: 'opt_3', text: 'It automatically turns all recursive functions into iterative loops' },
        { id: 'opt_4', text: 'It has zero impact on CPython execution' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'The GIL ensures only one native thread executes Python bytecode at once, preventing multi-core speedup for pure CPU-bound tasks in standard CPython.'
    },
    {
      id: 'py-q22',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'advanced',
      question: 'What is a closure in Python and how does it retain scope?',
      options: [
        { id: 'opt_1', text: 'A function that closes the operating system process' },
        { id: 'opt_2', text: 'An inner function that remembers and accesses variables from its enclosing lexical scope even after the outer function has finished executing' },
        { id: 'opt_3', text: 'A syntax error caused by unclosed parentheses' },
        { id: 'opt_4', text: 'A built-in garbage collection routine' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Closures capture free variables via cell objects in `__closure__`, retaining their references even after the outer scope has returned.'
    },
    {
      id: 'py-q23',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'advanced',
      question: 'What is the difference between `asyncio.gather()` and `asyncio.wait()`?',
      options: [
        { id: 'opt_1', text: 'gather runs tasks sequentially; wait runs them in parallel' },
        { id: 'opt_2', text: 'gather returns results ordered matching the input coroutines; wait returns sets of (done, pending) Tasks and allows FIRST_COMPLETED control' },
        { id: 'opt_3', text: 'gather only works with threads, while wait works with processes' },
        { id: 'opt_4', text: 'They are identical aliases' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`asyncio.gather` aggregates results in order and raises on failure, while `asyncio.wait` provides lower-level fine control with return_when flags like FIRST_COMPLETED.'
    },
    {
      id: 'py-q24',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'advanced',
      question: 'What is a metaclass in Python?',
      options: [
        { id: 'opt_1', text: 'A class that inherits from multiple base classes' },
        { id: 'opt_2', text: 'The class of a class, responsible for intercepting and customizing class creation and validation' },
        { id: 'opt_3', text: 'A special class designed only for unit testing' },
        { id: 'opt_4', text: 'A class compiled into C binary' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Just as an object is an instance of a class, a class itself is an instance of a metaclass (by default `type`), which controls how classes are constructed.'
    },
    {
      id: 'py-q25',
      skillId: 'python',
      skillName: 'Python',
      difficulty: 'advanced',
      question: 'How does Python garbage collection handle cyclic references?',
      options: [
        { id: 'opt_1', text: 'It cannot handle them, causing permanent memory leaks' },
        { id: 'opt_2', text: 'CPython uses reference counting primarily, supplemented by a generational cyclic garbage collector (gc module) that detects unreachable reference cycles' },
        { id: 'opt_3', text: 'Cyclic references automatically crash with RecursionError' },
        { id: 'opt_4', text: 'All cycles are freed immediately upon scope exit' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'While simple reference counting handles objects whose count drops to zero, the generational garbage collector inspects isolated reference cycles that reference each other.'
    }
  ],
  javascript: [
    {
      id: 'js-q11',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'basic',
      question: 'What is the output of `typeof NaN` in JavaScript?',
      options: [
        { id: 'opt_1', text: '"nan"' },
        { id: 'opt_2', text: '"number"' },
        { id: 'opt_3', text: '"undefined"' },
        { id: 'opt_4', text: '"object"' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'In the IEEE 754 floating-point specification and JavaScript, NaN represents "Not-a-Number", but its data type is officially "number".'
    },
    {
      id: 'js-q12',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'basic',
      question: 'What is the difference between `==` and `===` in JavaScript?',
      options: [
        { id: 'opt_1', text: '`==` checks value and type; `===` checks value only' },
        { id: 'opt_2', text: '`==` performs type coercion before comparison; `===` strictly requires identical types and values' },
        { id: 'opt_3', text: '`===` is deprecated in modern ECMAScript' },
        { id: 'opt_4', text: 'They behave identically for all primitives' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Loose equality (`==`) coerces operands of differing types (e.g. `5 == "5"` is true), while strict equality (`===`) rejects values of different types.'
    },
    {
      id: 'js-q13',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'basic',
      question: 'Which method adds one or more elements to the beginning of an array?',
      options: [
        { id: 'opt_1', text: 'array.push()' },
        { id: 'opt_2', text: 'array.unshift()' },
        { id: 'opt_3', text: 'array.shift()' },
        { id: 'opt_4', text: 'array.prepend()' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`unshift()` adds elements to the start of the array and returns the new array length, whereas `shift()` removes the first element.'
    },
    {
      id: 'js-q14',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'basic',
      question: 'What does `Array.prototype.map()` return?',
      options: [
        { id: 'opt_1', text: 'The original array mutated in place' },
        { id: 'opt_2', text: 'A new array with the results of calling the provided function on every element' },
        { id: 'opt_3', text: 'A single aggregated number or string' },
        { id: 'opt_4', text: 'A boolean indicating if all elements passed the test' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`map()` creates a new array populated with the results of invoking the callback on each element, without mutating the source array.'
    },
    {
      id: 'js-q15',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'basic',
      question: 'What is the value of `Boolean("")` and `Boolean("0")`?',
      options: [
        { id: 'opt_1', text: 'false, false' },
        { id: 'opt_2', text: 'false, true' },
        { id: 'opt_3', text: 'true, false' },
        { id: 'opt_4', text: 'true, true' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The empty string `""` is falsy, but `"0"` is a non-empty string which evaluates to true.'
    },
    {
      id: 'js-q16',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'intermediate',
      question: 'What is the output of `[1, 2, 10, 21].sort()` without a compare function?',
      options: [
        { id: 'opt_1', text: '[1, 2, 10, 21]' },
        { id: 'opt_2', text: '[1, 10, 2, 21]' },
        { id: 'opt_3', text: '[21, 10, 2, 1]' },
        { id: 'opt_4', text: 'TypeError: compareFunction missing' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'By default, `Array.prototype.sort()` converts elements to strings and compares UTF-16 code units, meaning `"10"` precedes `"2"` lexicographically.'
    },
    {
      id: 'js-q17',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'intermediate',
      question: 'What happens to `this` inside an arrow function?',
      options: [
        { id: 'opt_1', text: 'It binds to the object that invoked the function' },
        { id: 'opt_2', text: 'It lexically retains `this` from the enclosing execution context where it was defined' },
        { id: 'opt_3', text: 'It always equals `undefined`' },
        { id: 'opt_4', text: 'It can be rebound using `.bind()` or `.call()`' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Arrow functions do not possess their own `this` binding; they resolve `this` lexically from their containing scope.'
    },
    {
      id: 'js-q18',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'intermediate',
      question: 'What is the purpose of `Promise.allSettled()` compared to `Promise.all()`?',
      options: [
        { id: 'opt_1', text: 'Promise.allSettled() rejects immediately on the first error' },
        { id: 'opt_2', text: 'Promise.allSettled() waits for all promises to complete regardless of fulfillment or rejection, returning statuses for all' },
        { id: 'opt_3', text: 'Promise.allSettled() runs promises on a background worker thread' },
        { id: 'opt_4', text: 'Promise.allSettled() can only accept synchronous values' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`Promise.all` fails fast as soon as one promise rejects, whereas `Promise.allSettled` waits until all promises finish and returns an array with status and value/reason.'
    },
    {
      id: 'js-q19',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'intermediate',
      question: 'What is optional chaining (`?.`) used for in modern JavaScript?',
      options: [
        { id: 'opt_1', text: 'To perform optional math operations' },
        { id: 'opt_2', text: 'To read the value of a property located deep within a chain of connected objects without causing a TypeError if a reference is null or undefined' },
        { id: 'opt_3', text: 'To create weak references in memory' },
        { id: 'opt_4', text: 'To conditionally import ES modules' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`obj?.prop` short-circuits and returns `undefined` if `obj` is `null` or `undefined`, preventing `TypeError: Cannot read properties of undefined`.'
    },
    {
      id: 'js-q20',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'intermediate',
      question: 'What is the result of using the Spread syntax on an object: `{ ...a, b: 2 }`?',
      options: [
        { id: 'opt_1', text: 'It creates a deep copy of object a' },
        { id: 'opt_2', text: 'It shallow-copies enumerable own properties from object a into a new object, with b overwritten or appended' },
        { id: 'opt_3', text: 'It mutates object a directly' },
        { id: 'opt_4', text: 'It converts the object into an array' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Object spread copies own enumerable properties into a fresh object instance at the top level (shallow copy).'
    },
    {
      id: 'js-q21',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'advanced',
      question: 'In the JavaScript event loop, what is the priority order between Microtasks and Macrotasks?',
      options: [
        { id: 'opt_1', text: 'Macrotasks always execute before any microtasks' },
        { id: 'opt_2', text: 'All queued Microtasks (Promises, queueMicrotask) execute immediately after the current script and before the next Macrotask (setTimeout, setInterval)' },
        { id: 'opt_3', text: 'They execute alternately one-by-one' },
        { id: 'opt_4', text: 'Priority is decided purely by memory allocation' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The microtask queue is drained completely after the execution of each callback before the browser/Node event loop moves to the next macrotask.'
    },
    {
      id: 'js-q22',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'advanced',
      question: 'What is the purpose of `WeakMap` in JavaScript?',
      options: [
        { id: 'opt_1', text: 'A map that loses entries when computer memory is low' },
        { id: 'opt_2', text: 'A key-value collection whose keys must be objects and are weakly referenced, allowing garbage collection when no other references exist' },
        { id: 'opt_3', text: 'A map that only holds string keys' },
        { id: 'opt_4', text: 'A map without `.set()` or `.get()` methods' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`WeakMap` keys are held weakly, preventing memory leaks when associating metadata with objects whose lifecycles are managed elsewhere.'
    },
    {
      id: 'js-q23',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'advanced',
      question: 'What does `Object.freeze()` do vs `Object.seal()`?',
      options: [
        { id: 'opt_1', text: 'freeze prevents adding properties; seal allows adding properties' },
        { id: 'opt_2', text: 'freeze makes all existing properties read-only (non-writable) and prevents extensions; seal prevents extensions and deletions but allows modifying existing writable properties' },
        { id: 'opt_3', text: 'seal deletes all functions; freeze saves them' },
        { id: 'opt_4', text: 'There is no difference' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`Object.freeze()` locks down properties so their values cannot be changed; `Object.seal()` prevents adding or deleting keys, but existing values remain mutable if writable.'
    },
    {
      id: 'js-q24',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'advanced',
      question: 'What is a JavaScript Generator function (`function*`) and what does `yield*` do?',
      options: [
        { id: 'opt_1', text: 'It creates web worker threads; yield* stops the thread' },
        { id: 'opt_2', text: 'It returns a Generator object that can be paused/resumed; yield* delegates iteration to another iterable or generator' },
        { id: 'opt_3', text: 'It compiles JavaScript code into WebAssembly' },
        { id: 'opt_4', text: 'It runs synchronous loops asynchronously' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`function*` defines an iterator factory, and `yield*` delegates sequence emission to another iterable object sequentially.'
    },
    {
      id: 'js-q25',
      skillId: 'javascript',
      skillName: 'JavaScript',
      difficulty: 'advanced',
      question: 'What is the Temporal Dead Zone (TDZ) in JavaScript?',
      options: [
        { id: 'opt_1', text: 'A zone in memory where deleted variables reside' },
        { id: 'opt_2', text: 'The period between entering a scope and declaring a `let` or `const` variable where accessing it throws a ReferenceError' },
        { id: 'opt_3', text: 'A timeout delay in asynchronous timers' },
        { id: 'opt_4', text: 'A garbage collection pause' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Variables declared with `let` and `const` are hoisted but uninitialized, remaining in the TDZ until execution evaluates their declaration statement.'
    }
  ],
  sql: [
    {
      id: 'sql-q11',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'basic',
      question: 'Which clause is used to filter rows returned by a `SELECT` statement in SQL?',
      options: [
        { id: 'opt_1', text: 'FILTER BY' },
        { id: 'opt_2', text: 'WHERE' },
        { id: 'opt_3', text: 'GROUP BY' },
        { id: 'opt_4', text: 'ORDER BY' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The `WHERE` clause filters individual records before any grouping or aggregation takes place.'
    },
    {
      id: 'sql-q12',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'basic',
      question: 'What is the difference between `COUNT(*)` and `COUNT(column_name)`?',
      options: [
        { id: 'opt_1', text: 'COUNT(*) counts all rows including NULLs; COUNT(col) counts only rows where col is NOT NULL' },
        { id: 'opt_2', text: 'COUNT(*) only counts primary keys' },
        { id: 'opt_3', text: 'COUNT(col) is always faster than COUNT(*)' },
        { id: 'opt_4', text: 'There is no difference in any SQL engine' }
      ],
      correctOptionId: 'opt_1',
      explanation: '`COUNT(*)` returns the total row count of the table or partition; `COUNT(column)` ignores rows where the specified column contains a NULL value.'
    },
    {
      id: 'sql-q13',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'basic',
      question: 'Which keyword removes duplicate rows from the query result set?',
      options: [
        { id: 'opt_1', text: 'UNIQUE' },
        { id: 'opt_2', text: 'DISTINCT' },
        { id: 'opt_3', text: 'GROUP' },
        { id: 'opt_4', text: 'ISOLATE' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`SELECT DISTINCT column FROM table` eliminates duplicate values from the final output set.'
    },
    {
      id: 'sql-q14',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'basic',
      question: 'How do you check for a NULL value in a `WHERE` clause?',
      options: [
        { id: 'opt_1', text: 'WHERE col == NULL' },
        { id: 'opt_2', text: 'WHERE col = NULL' },
        { id: 'opt_3', text: 'WHERE col IS NULL' },
        { id: 'opt_4', text: 'WHERE col.isNull()' }
      ],
      correctOptionId: 'opt_3',
      explanation: 'In Three-Valued SQL Logic, `col = NULL` evaluates to UNKNOWN, not TRUE. You must use `col IS NULL` or `col IS NOT NULL`.'
    },
    {
      id: 'sql-q15',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'basic',
      question: 'Which SQL statement is used to insert new records into a database table?',
      options: [
        { id: 'opt_1', text: 'ADD RECORD TO table' },
        { id: 'opt_2', text: 'INSERT INTO table VALUES (...)' },
        { id: 'opt_3', text: 'UPDATE table SET' },
        { id: 'opt_4', text: 'APPEND table' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`INSERT INTO table (columns) VALUES (values)` is the standard DML syntax for adding new rows.'
    },
    {
      id: 'sql-q16',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'intermediate',
      question: 'What is the key difference between `WHERE` and `HAVING` clauses?',
      options: [
        { id: 'opt_1', text: '`WHERE` filters rows before aggregation; `HAVING` filters grouped aggregate results after `GROUP BY`' },
        { id: 'opt_2', text: '`HAVING` is faster than `WHERE`' },
        { id: 'opt_3', text: '`WHERE` is used with joins; `HAVING` is used with unions' },
        { id: 'opt_4', text: 'They are synonyms in standard ANSI SQL' }
      ],
      correctOptionId: 'opt_1',
      explanation: '`WHERE` filters source rows before grouping; `HAVING` filters the groups produced by `GROUP BY` using aggregate functions like `HAVING COUNT(*) > 5`.'
    },
    {
      id: 'sql-q17',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'intermediate',
      question: 'What does a `LEFT JOIN` return if there is no match in the right table?',
      options: [
        { id: 'opt_1', text: 'It excludes the row from the left table' },
        { id: 'opt_2', text: 'All columns from the right table contain NULL for that left row' },
        { id: 'opt_3', text: 'An error is raised' },
        { id: 'opt_4', text: 'It replaces missing values with empty strings' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`LEFT JOIN` guarantees all rows from the left table appear in the output, filling right-side columns with NULL if no match exists.'
    },
    {
      id: 'sql-q18',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'intermediate',
      question: 'What is the purpose of a Database Index (e.g. B-Tree index)?',
      options: [
        { id: 'opt_1', text: 'To encrypt data at rest' },
        { id: 'opt_2', text: 'To speed up query data retrieval at the cost of additional storage and slower write operations' },
        { id: 'opt_3', text: 'To compress table columns' },
        { id: 'opt_4', text: 'To automatically backup records' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Indexes create efficient lookup trees (O(log N)) for WHERE, JOIN, and ORDER BY clauses, but add overhead during INSERT, UPDATE, and DELETE operations.'
    },
    {
      id: 'sql-q19',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'intermediate',
      question: 'What is a Common Table Expression (CTE) in SQL?',
      options: [
        { id: 'opt_1', text: 'A permanent physical table created in system memory' },
        { id: 'opt_2', text: 'A temporary named result set defined using the `WITH` keyword to improve query readability and recursion' },
        { id: 'opt_3', text: 'An index that spans multiple database nodes' },
        { id: 'opt_4', text: 'A stored procedure written in C++' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'CTEs (`WITH cte_name AS (...)`) create modular, reusable temporary query blocks within the scope of an execution.'
    },
    {
      id: 'sql-q20',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'intermediate',
      question: 'What is the difference between `UNION` and `UNION ALL`?',
      options: [
        { id: 'opt_1', text: '`UNION` retains duplicates; `UNION ALL` removes them' },
        { id: 'opt_2', text: '`UNION` removes duplicate rows by performing a sort/hash; `UNION ALL` concatenates all rows directly without duplicate elimination' },
        { id: 'opt_3', text: '`UNION ALL` only works on numbers' },
        { id: 'opt_4', text: 'They produce identical performance' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Because `UNION` performs deduplication, it is computationally more expensive than `UNION ALL`, which appends result sets directly.'
    },
    {
      id: 'sql-q21',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'advanced',
      question: 'What is the difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` window functions?',
      options: [
        { id: 'opt_1', text: 'There is no difference in their output' },
        { id: 'opt_2', text: 'ROW_NUMBER assigns strictly sequential integers (1,2,3); RANK leaves gaps after ties (1,2,2,4); DENSE_RANK assigns consecutive ranks without gaps (1,2,2,3)' },
        { id: 'opt_3', text: 'DENSE_RANK is only used for dates' },
        { id: 'opt_4', text: 'ROW_NUMBER requires a GROUP BY clause' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'When ties occur, RANK skips subsequent ranks equal to the number of ties, whereas DENSE_RANK preserves consecutive numbering.'
    },
    {
      id: 'sql-q22',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'advanced',
      question: 'What are the 4 ACID properties of database transactions?',
      options: [
        { id: 'opt_1', text: 'Accuracy, Consistency, Indexing, Durability' },
        { id: 'opt_2', text: 'Atomicity, Consistency, Isolation, Durability' },
        { id: 'opt_3', text: 'Access, Cryptography, Integrity, Distribution' },
        { id: 'opt_4', text: 'Aggregation, Concurrency, Iteration, Deletion' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'ACID guarantees all-or-nothing execution (Atomicity), schema/constraint validity (Consistency), independent concurrent transactions (Isolation), and committed persistence (Durability).'
    },
    {
      id: 'sql-q23',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'advanced',
      question: 'What is a "Phantom Read" in database transaction isolation levels?',
      options: [
        { id: 'opt_1', text: 'Reading data that was never written' },
        { id: 'opt_2', text: 'When a transaction executes a range query twice and finds newly committed rows inserted by another concurrent transaction between reads' },
        { id: 'opt_3', text: 'A read that fails due to disk hardware failure' },
        { id: 'opt_4', text: 'Reading deleted rows from the transaction log' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Phantom reads occur when concurrent transactions insert or delete rows satisfying a search predicate, solved by SERIALIZABLE isolation or range locks.'
    },
    {
      id: 'sql-q24',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'advanced',
      question: 'What is the difference between a Clustered Index and a Non-Clustered Index?',
      options: [
        { id: 'opt_1', text: 'Clustered indexes are stored in RAM; non-clustered on disk' },
        { id: 'opt_2', text: 'A Clustered Index physically determines the order of data rows on disk (only one per table); Non-Clustered indexes store pointers/keys pointing to table rows' },
        { id: 'opt_3', text: 'Tables can have multiple clustered indexes' },
        { id: 'opt_4', text: 'Non-clustered indexes cannot have primary keys' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Because data can only be physically sorted one way on disk, a table can possess only one clustered index (typically the primary key).'
    },
    {
      id: 'sql-q25',
      skillId: 'sql',
      skillName: 'SQL',
      difficulty: 'advanced',
      question: 'What does the `EXPLAIN ANALYZE` command do in PostgreSQL/MySQL?',
      options: [
        { id: 'opt_1', text: 'Rewrites SQL into Java bytecode' },
        { id: 'opt_2', text: 'Executes the statement, outputs the query planner plan alongside real actual runtimes, row counts, and index scan strategies' },
        { id: 'opt_3', text: 'Encrypts the query execution plan' },
        { id: 'opt_4', text: 'Defragments table partitions' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`EXPLAIN ANALYZE` actually executes the query to measure exact node costs, buffers, and execution times, exposing query bottlenecks like sequential scans.'
    }
  ]
};

// Combine existing with additional questions
const finalQuestionBank = {};
for (const [skill, questions] of Object.entries(taggedExisting)) {
  const extra = additionalQuestions[skill] || [];
  finalQuestionBank[skill] = [...questions, ...extra];
}

console.log('Final counts:');
for (const [k, v] of Object.entries(finalQuestionBank)) {
  console.log(k, v.length);
}

// Write to server/data/questionBank.js
const targetFile = path.resolve('server/data/questionBank.js');
const fileContent = `export const questionBank = ${JSON.stringify(finalQuestionBank, null, 2)};\n`;
fs.writeFileSync(targetFile, fileContent, 'utf-8');
console.log('Successfully updated server/data/questionBank.js!');
