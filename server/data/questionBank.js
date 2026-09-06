export const questionBank = {
  python: [
    {
      id: 'py-q1',
      skillId: 'python',
      skillName: 'Python',
      question: 'What is the output of this Python code regarding mutable default arguments?',
      codeSnippet: `def append_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))`,
      options: [
        { id: 'opt_1', text: '[1] followed by [2]' },
        { id: 'opt_2', text: '[1] followed by [1, 2]' },
        { id: 'opt_3', text: '[1, 2] followed by [1, 2]' },
        { id: 'opt_4', text: 'TypeError: mutable default argument not permitted' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'In Python, default arguments are evaluated once when the function definition is executed, meaning the same list instance is reused across invocations unless explicitly re-instantiated.'
    },
    {
      id: 'py-q2',
      skillId: 'python',
      skillName: 'Python',
      question: 'What is the primary difference between a Python generator and a regular function returning a list?',
      options: [
        { id: 'opt_1', text: 'Generators execute in a separate operating system thread' },
        { id: 'opt_2', text: 'Generators yield items lazily on demand, saving memory compared to eagerly constructing an entire list in RAM' },
        { id: 'opt_3', text: 'Generators cannot accept arguments or maintain local state' },
        { id: 'opt_4', text: 'Generators automatically convert all returned values to JSON strings' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Generators use the yield keyword to produce values lazily one at a time via the iterator protocol, resulting in O(1) space complexity instead of O(N) memory allocation.'
    },
    {
      id: 'py-q3',
      skillId: 'python',
      skillName: 'Python',
      question: 'What happens in the following try-except-finally block?',
      codeSnippet: `def calculate():\n    try:\n        return 10\n    finally:\n        return 20\n\nprint(calculate())`,
      options: [
        { id: 'opt_1', text: '10 is printed' },
        { id: 'opt_2', text: '20 is printed' },
        { id: 'opt_3', text: '30 is printed' },
        { id: 'opt_4', text: 'SyntaxError: multiple return statements in same scope' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The finally block is guaranteed to execute before the function exits. When a return statement is encountered inside finally, it overwrites any previous return value from try or except.'
    },
    {
      id: 'py-q4',
      skillId: 'python',
      skillName: 'Python',
      question: 'What is the average time complexity of checking membership `x in s` for a Python set vs a Python list of length N?',
      options: [
        { id: 'opt_1', text: 'Set: O(N), List: O(N)' },
        { id: 'opt_2', text: 'Set: O(1), List: O(N)' },
        { id: 'opt_3', text: 'Set: O(log N), List: O(1)' },
        { id: 'opt_4', text: 'Set: O(N log N), List: O(N)' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Python sets are implemented as hash tables offering average O(1) key lookup, whereas lists require linear search scanning elements sequentially with O(N) complexity.'
    },
    {
      id: 'py-q5',
      skillId: 'python',
      skillName: 'Python',
      question: 'In Python, what is the purpose of the `copy.deepcopy()` function compared to `copy.copy()`?',
      options: [
        { id: 'opt_1', text: 'deepcopy encrypts the object into byte memory' },
        { id: 'opt_2', text: 'copy.copy clones nested compound objects recursively, while deepcopy only copies references' },
        { id: 'opt_3', text: 'deepcopy recursively copies all objects found inside compound objects, preventing mutations in the clone from affecting the original' },
        { id: 'opt_4', text: 'deepcopy creates a C-level pointer to the original memory block' }
      ],
      correctOptionId: 'opt_3',
      explanation: 'A shallow copy constructs a new compound object but inserts references to the original nested objects. deepcopy recursively duplicates all child objects.'
    },
    {
      id: 'py-q6',
      skillId: 'python',
      skillName: 'Python',
      question: 'What role does the Global Interpreter Lock (GIL) play in CPython?',
      options: [
        { id: 'opt_1', text: 'It prevents all multi-threaded programming in Python completely' },
        { id: 'opt_2', text: 'It is a mutex ensuring only one native thread executes Python bytecode at a time, protecting CPython memory management' },
        { id: 'opt_3', text: 'It automatically optimizes I/O bound operations by bypassing the operating system' },
        { id: 'opt_4', text: 'It compiles Python code directly into machine code before execution' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'CPython uses reference counting which is not thread-safe. The GIL ensures only one thread executes Python bytecode at once, meaning CPU-bound multi-threading requires multiprocessing instead.'
    },
    {
      id: 'py-q7',
      skillId: 'python',
      skillName: 'Python',
      question: 'Which method must a Python class implement to be usable with the `with` statement as a Context Manager?',
      options: [
        { id: 'opt_1', text: '__open__ and __close__' },
        { id: 'opt_2', text: '__init__ and __del__' },
        { id: 'opt_3', text: '__enter__ and __exit__' },
        { id: 'opt_4', text: '__start__ and __stop__' }
      ],
      correctOptionId: 'opt_3',
      explanation: 'The context management protocol requires __enter__() for acquiring resources and __exit__() for guaranteed cleanup, handling exceptions even if errors occur.'
    },
    {
      id: 'py-q8',
      skillId: 'python',
      skillName: 'Python',
      question: 'What does the `@classmethod` decorator do in Python?',
      options: [
        { id: 'opt_1', text: 'Converts a method to a static method that takes no arguments' },
        { id: 'opt_2', text: 'Passes the class itself (cls) as the first argument instead of the instance (self)' },
        { id: 'opt_3', text: 'Makes the method private and accessible only within the defining module' },
        { id: 'opt_4', text: 'Automatically instantiates a new class object upon invocation' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A @classmethod receives the class object as its first argument (conventionally named cls), allowing factory constructors and class-level state modifications.'
    },
    {
      id: 'py-q9',
      skillId: 'python',
      skillName: 'Python',
      question: 'What will be the output of `bool([])`, `bool([0])`, and `bool("")` in Python?',
      options: [
        { id: 'opt_1', text: 'False, False, False' },
        { id: 'opt_2', text: 'False, True, False' },
        { id: 'opt_3', text: 'True, True, True' },
        { id: 'opt_4', text: 'False, True, True' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Empty containers like [] and "" are falsy in Python. However, [0] is a non-empty list with one element (0), making it truthy.'
    },
    {
      id: 'py-q10',
      skillId: 'python',
      skillName: 'Python',
      question: 'What is the Method Resolution Order (MRO) algorithm used in modern Python 3 multiple inheritance?',
      options: [
        { id: 'opt_1', text: 'Depth-First Search (DFS)' },
        { id: 'opt_2', text: 'C3 Linearization' },
        { id: 'opt_3', text: 'Breadth-First Search (BFS)' },
        { id: 'opt_4', text: 'Dijkstra Priority Queue' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Python uses the C3 Linearization algorithm to determine a deterministic order for resolving method calls in complex multiple inheritance hierarchies.'
    }
  ],

  sql: [
    {
      id: 'sql-q1',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'What is the difference between `WHERE` and `HAVING` in a SQL query?',
      options: [
        { id: 'opt_1', text: 'WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY' },
        { id: 'opt_2', text: 'WHERE works only on numeric columns; HAVING works on text columns' },
        { id: 'opt_3', text: 'HAVING can only be used with subqueries in the FROM clause' },
        { id: 'opt_4', text: 'WHERE and HAVING are completely identical and interchangeable' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'The WHERE clause applies condition predicates to individual rows before grouping, while HAVING applies conditions to the aggregated metrics produced by GROUP BY.'
    },
    {
      id: 'sql-q2',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'What is the result of evaluating `SELECT NULL = NULL;` in standard SQL?',
      options: [
        { id: 'opt_1', text: 'TRUE (1)' },
        { id: 'opt_2', text: 'FALSE (0)' },
        { id: 'opt_3', text: 'NULL (Unknown)' },
        { id: 'opt_4', text: 'Syntax error' }
      ],
      correctOptionId: 'opt_3',
      explanation: 'In three-valued SQL logic, NULL represents an unknown value. Comparing an unknown with an unknown yields UNKNOWN/NULL. To test for nullness, use `IS NULL`.'
    },
    {
      id: 'sql-q3',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'Which window function assigns unique consecutive integers to rows within a partition, without skipping numbers on ties?',
      options: [
        { id: 'opt_1', text: 'RANK()' },
        { id: 'opt_2', text: 'ROW_NUMBER()' },
        { id: 'opt_3', text: 'DENSE_RANK()' },
        { id: 'opt_4', text: 'NTILE()' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'ROW_NUMBER() always assigns strictly sequential integers (1, 2, 3...) regardless of ties. RANK() leaves gaps after ties, and DENSE_RANK() does not leave gaps but repeats numbers on ties.'
    },
    {
      id: 'sql-q4',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'What is the key functional difference between `TRUNCATE TABLE` and `DELETE FROM table`?',
      options: [
        { id: 'opt_1', text: 'DELETE removes the table schema from the database, while TRUNCATE preserves it' },
        { id: 'opt_2', text: 'TRUNCATE is a DDL operation that deallocates data pages rapidly and typically resets auto-increment IDs; DELETE logs individual row removals' },
        { id: 'opt_3', text: 'TRUNCATE allows WHERE clauses for selective deletion, whereas DELETE does not' },
        { id: 'opt_4', text: 'DELETE is always faster than TRUNCATE on large datasets' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'TRUNCATE is a DDL command that deallocates data pages, generating minimal transaction log overhead and resetting identities. DELETE is DML and logs every deleted row individually.'
    },
    {
      id: 'sql-q5',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'What does the `COALESCE(col1, col2, 0)` function return?',
      options: [
        { id: 'opt_1', text: 'The sum of all non-null arguments' },
        { id: 'opt_2', text: 'The first non-NULL expression from left to right' },
        { id: 'opt_3', text: 'NULL if any argument is NULL' },
        { id: 'opt_4', text: 'The maximum value among the arguments' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'COALESCE evaluates its arguments from left to right and returns the first non-NULL value found. If all arguments are NULL, it returns NULL.'
    },
    {
      id: 'sql-q6',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'Which ACID property guarantees that multiple concurrent transactions execute without data corruption or race conditions?',
      options: [
        { id: 'opt_1', text: 'Atomicity' },
        { id: 'opt_2', text: 'Consistency' },
        { id: 'opt_3', text: 'Isolation' },
        { id: 'opt_4', text: 'Durability' }
      ],
      correctOptionId: 'opt_3',
      explanation: 'Isolation ensures that concurrent transactions occur independently without interference or dirty reads, using transaction isolation levels (e.g. Read Committed, Serializable).'
    },
    {
      id: 'sql-q7',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'What index structure is most widely used by default in relational databases like PostgreSQL and MySQL for B-Tree indexing?',
      options: [
        { id: 'opt_1', text: 'Balanced Search Tree (B+ Tree) with sequential leaf node pointers' },
        { id: 'opt_2', text: 'Hash Map table with linked lists' },
        { id: 'opt_3', text: 'Unsorted Binary Heap' },
        { id: 'opt_4', text: 'Skip List' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'B+ Trees store records or pointers at leaf nodes linked sequentially, supporting both fast O(log N) point lookups and efficient contiguous range queries.'
    },
    {
      id: 'sql-q8',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'What is the output of `COUNT(*)` vs `COUNT(column_name)` when rows contain NULL in `column_name`?',
      options: [
        { id: 'opt_1', text: 'Both return identical counts including all rows' },
        { id: 'opt_2', text: 'COUNT(*) counts all rows regardless of NULLs; COUNT(col) excludes rows where col IS NULL' },
        { id: 'opt_3', text: 'COUNT(*) raises an error if any row contains NULL' },
        { id: 'opt_4', text: 'COUNT(col) returns 0 whenever any row contains NULL' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'COUNT(*) counts the total number of rows matching the query. COUNT(expression) counts only non-null evaluations of the specified column.'
    },
    {
      id: 'sql-q9',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'What type of JOIN returns all records from the left table, and matching records from the right table, populating NULLs when no match exists?',
      options: [
        { id: 'opt_1', text: 'INNER JOIN' },
        { id: 'opt_2', text: 'LEFT OUTER JOIN' },
        { id: 'opt_3', text: 'CROSS JOIN' },
        { id: 'opt_4', text: 'FULL OUTER JOIN' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A LEFT OUTER JOIN preserves all rows from the left table and supplements them with matching columns from the right table, substituting NULL when no right record matches.'
    },
    {
      id: 'sql-q10',
      skillId: 'sql',
      skillName: 'SQL',
      question: 'In SQL, what construct is denoted by `WITH cte_name AS (...)`?',
      options: [
        { id: 'opt_1', text: 'Stored Procedure definition' },
        { id: 'opt_2', text: 'Common Table Expression (CTE)' },
        { id: 'opt_3', text: 'Materialized Database View' },
        { id: 'opt_4', text: 'Foreign Key Constraint' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A Common Table Expression (CTE) provides a temporary named result set defined within the scope of a single SELECT, INSERT, UPDATE, or DELETE query.'
    }
  ],

  c: [
    {
      id: 'c-q1',
      skillId: 'c',
      skillName: 'C',
      question: 'What is the output of pointer arithmetic when incrementing `ptr++` where `int *ptr = 1000;` on a 64-bit system where `sizeof(int) == 4`?',
      options: [
        { id: 'opt_1', text: '1001' },
        { id: 'opt_2', text: '1004' },
        { id: 'opt_3', text: '1008' },
        { id: 'opt_4', text: 'Undefined behavior' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'In C, incrementing a typed pointer increases its address by sizeof(T) bytes. Since sizeof(int) is 4, 1000 + 4 = 1004.'
    },
    {
      id: 'c-q2',
      skillId: 'c',
      skillName: 'C',
      question: 'What happens if you allocate dynamic memory with `malloc()` but never call `free()` before program exit?',
      options: [
        { id: 'opt_1', text: 'A segmentation fault occurs immediately' },
        { id: 'opt_2', text: 'A memory leak occurs during execution; operating systems reclaim the virtual address space upon process termination' },
        { id: 'opt_3', text: 'The compiler issues a fatal syntax error' },
        { id: 'opt_4', text: 'The memory is automatically freed by the C runtime garbage collector' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Failing to free heap memory causes a memory leak that consumes RAM during program runtime. While modern OSes clean up process memory on exit, long-running services will exhaust system memory.'
    },
    {
      id: 'c-q3',
      skillId: 'c',
      skillName: 'C',
      question: 'What is a "dangling pointer" in C programming?',
      options: [
        { id: 'opt_1', text: 'A pointer initialized to NULL' },
        { id: 'opt_2', text: 'A pointer that points to a memory location that has already been deallocated' },
        { id: 'opt_3', text: 'A pointer stored in read-only code segment' },
        { id: 'opt_4', text: 'A pointer that has not yet been declared' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A dangling pointer references memory that has been freed. Dereferencing it leads to undefined behavior or security vulnerabilities.'
    },
    {
      id: 'c-q4',
      skillId: 'c',
      skillName: 'C',
      question: 'What character marks the end of a valid C-string in memory?',
      options: [
        { id: 'opt_1', text: 'Character \'/n\'' },
        { id: 'opt_2', text: 'Null character \'\\0\' (ASCII 0)' },
        { id: 'opt_3', text: 'EOF marker' },
        { id: 'opt_4', text: 'Character \'$\'' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'C strings are null-terminated byte sequences where the character \'\\0\' denotes the end of the string. Functions like strlen() scan until reaching this byte.'
    },
    {
      id: 'c-q5',
      skillId: 'c',
      skillName: 'C',
      question: 'Why do C compilers add padding bytes between struct members?',
      options: [
        { id: 'opt_1', text: 'To encrypt struct data in memory' },
        { id: 'opt_2', text: 'To satisfy hardware memory alignment requirements for efficient CPU bus access' },
        { id: 'opt_3', text: 'To leave space for object-oriented virtual method tables' },
        { id: 'opt_4', text: 'To prevent buffer overflow exploits' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Modern CPU architectures access memory faster when multi-byte data types are aligned to addresses that are multiples of their size. Compilers insert padding to ensure proper data alignment.'
    },
    {
      id: 'c-q6',
      skillId: 'c',
      skillName: 'C',
      question: 'What does the `static` keyword mean when applied to a global variable in a C source file (.c)?',
      options: [
        { id: 'opt_1', text: 'The variable cannot be modified (constant)' },
        { id: 'opt_2', text: 'The variable has internal linkage, meaning it is only visible within that compilation unit' },
        { id: 'opt_3', text: 'The variable is stored on the stack frame' },
        { id: 'opt_4', text: 'The variable is dynamically allocated at runtime' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'When used at file scope, static gives the symbol internal linkage, preventing other translation units from linking or referencing it directly.'
    },
    {
      id: 'c-q7',
      skillId: 'c',
      skillName: 'C',
      question: 'What is the difference between `malloc()` and `calloc()`?',
      options: [
        { id: 'opt_1', text: 'calloc() allocates stack memory; malloc() allocates heap memory' },
        { id: 'opt_2', text: 'calloc() initializes the allocated memory to all zero bits; malloc() leaves memory uninitialized' },
        { id: 'opt_3', text: 'malloc() automatically frees memory when out of scope' },
        { id: 'opt_4', text: 'calloc() can only allocate memory for char pointers' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'calloc(num, size) zeroes out all allocated memory bytes and checks for integer overflow in the size calculation. malloc(size) leaves the memory contents indeterminate.'
    },
    {
      id: 'c-q8',
      skillId: 'c',
      skillName: 'C',
      question: 'What is the bitwise result of `5 & 3` in C?',
      options: [
        { id: 'opt_1', text: '7' },
        { id: 'opt_2', text: '1' },
        { id: 'opt_3', text: '0' },
        { id: 'opt_4', text: '8' }
      ],
      correctOptionId: 'opt_2',
      explanation: '5 in binary is 0101; 3 in binary is 0011. Performing bitwise AND (0101 & 0011) results in 0001, which is 1.'
    },
    {
      id: 'c-q9',
      skillId: 'c',
      skillName: 'C',
      question: 'What is the danger of using `gets()` in C, which led to its complete removal in C11?',
      options: [
        { id: 'opt_1', text: 'It fails to convert uppercase to lowercase' },
        { id: 'opt_2', text: 'It does not perform boundary checks on the destination buffer, allowing catastrophic buffer overflow vulnerabilities' },
        { id: 'opt_3', text: 'It cannot read strings containing spaces' },
        { id: 'opt_4', text: 'It is too slow compared to scanf' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'gets() has no mechanism to limit the number of characters read, meaning user input exceeding the destination buffer will overwrite adjacent stack memory, enabling arbitrary code execution.'
    },
    {
      id: 'c-q10',
      skillId: 'c',
      skillName: 'C',
      question: 'What does the `sizeof` operator in C return?',
      options: [
        { id: 'opt_1', text: 'Size in bits as an int' },
        { id: 'opt_2', text: 'Size in bytes as an unsigned integer type `size_t`' },
        { id: 'opt_3', text: 'Memory address pointer' },
        { id: 'opt_4', text: 'Number of CPU clock cycles required' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'sizeof yields the memory size in bytes of its operand as a compile-time constant of type size_t.'
    }
  ],

  cpp: [
    {
      id: 'cpp-q1',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What is the RAII (Resource Acquisition Is Initialization) idiom in C++?',
      options: [
        { id: 'opt_1', text: 'A design pattern where resources are bound to object lifetime: acquired in constructor and automatically released in destructor' },
        { id: 'opt_2', text: 'A compiler optimization that converts C++ to raw assembly' },
        { id: 'opt_3', text: 'A manual memory management library requiring explicit delete statements' },
        { id: 'opt_4', text: 'A technique for serializing objects to JSON' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'RAII guarantees that resources (heap memory, file handles, mutex locks) are tied to stack object lifetime and properly cleaned up when unwinding the stack, even during exceptions.'
    },
    {
      id: 'cpp-q2',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'Which smart pointer in modern C++ represents exclusive ownership of a dynamic resource?',
      options: [
        { id: 'opt_1', text: 'std::shared_ptr' },
        { id: 'opt_2', text: 'std::unique_ptr' },
        { id: 'opt_3', text: 'std::weak_ptr' },
        { id: 'opt_4', text: 'std::auto_ptr' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'std::unique_ptr owns and manages another object through a pointer and disposes of that object when the unique_ptr goes out of scope. It cannot be copied, only moved.'
    },
    {
      id: 'cpp-q3',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What purpose does a virtual destructor serve in a base class with virtual methods?',
      options: [
        { id: 'opt_1', text: 'It makes the base class abstract' },
        { id: 'opt_2', text: 'It ensures that deleting a derived object via a base class pointer correctly calls the derived class destructor' },
        { id: 'opt_3', text: 'It prevents the class from being inherited' },
        { id: 'opt_4', text: 'It allocates the object in read-only memory' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Without a virtual destructor, deleting a derived object through a base pointer causes undefined behavior because only the base destructor executes, leaking derived resources.'
    },
    {
      id: 'cpp-q4',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What does `std::move` actually do in C++11 and beyond?',
      options: [
        { id: 'opt_1', text: 'Physically moves bytes in RAM from one address to another' },
        { id: 'opt_2', text: 'Unconditionally casts an expression to an rvalue reference (T&&), enabling move constructors' },
        { id: 'opt_3', text: 'Spawns an asynchronous thread to copy data' },
        { id: 'opt_4', text: 'Zeros out the source variable immediately' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'std::move is purely a compile-time cast that converts its argument into an rvalue reference, signaling that the resource can be stolen rather than deep-copied.'
    },
    {
      id: 'cpp-q5',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What is the internal memory layout of `std::vector` in C++?',
      options: [
        { id: 'opt_1', text: 'Doubly linked list of heap nodes' },
        { id: 'opt_2', text: 'Contiguous array of elements in heap memory' },
        { id: 'opt_3', text: 'Balanced Red-Black Tree' },
        { id: 'opt_4', text: 'Separate hash buckets' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'std::vector guarantees contiguous memory storage, offering cache-friendly sequential access and O(1) random access via indexing.'
    },
    {
      id: 'cpp-q6',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What problem does `std::weak_ptr` resolve when using `std::shared_ptr`?',
      options: [
        { id: 'opt_1', text: 'Prevents segmentation faults on null dereference' },
        { id: 'opt_2', text: 'Breaks circular reference cycles that would otherwise prevent reference count from reaching 0 and cause memory leaks' },
        { id: 'opt_3', text: 'Speeds up pointer allocation by bypassing heap' },
        { id: 'opt_4', text: 'Allows multi-threaded memory allocation without locks' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'If two shared_ptrs reference each other, their reference counts never hit 0, causing a memory leak. std::weak_ptr references an object without incrementing its strong reference count.'
    },
    {
      id: 'cpp-q7',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What does the `const` keyword on a member function declaration mean, such as `int getValue() const;`?',
      options: [
        { id: 'opt_1', text: 'The return value cannot be changed' },
        { id: 'opt_2', text: 'The function promises not to modify any non-mutable member variables of the calling instance' },
        { id: 'opt_3', text: 'The function can only be called once' },
        { id: 'opt_4', text: 'The function is executed during compilation' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A const member function treats `this` as a pointer to const (const Class*), guaranteeing it will not mutate class state unless a member is declared mutable.'
    },
    {
      id: 'cpp-q8',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What is the difference between `delete` and `delete[]` in C++?',
      options: [
        { id: 'opt_1', text: 'delete is for pointers; delete[] is for references' },
        { id: 'opt_2', text: 'delete is for single objects allocated with new; delete[] is for arrays allocated with new[] to invoke destructors for every element' },
        { id: 'opt_3', text: 'delete[] automatically zeroes memory' },
        { id: 'opt_4', text: 'They are completely identical in modern C++' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Calling delete on an array allocated with new[] invokes the destructor for only the first element, causing undefined behavior and resource leaks. delete[] calls destructors for all elements.'
    },
    {
      id: 'cpp-q9',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What is a "pure virtual function" in C++?',
      options: [
        { id: 'opt_1', text: 'A function that takes no parameters and returns void' },
        { id: 'opt_2', text: 'A virtual function assigned `= 0`, making the class abstract and requiring derived classes to implement it' },
        { id: 'opt_3', text: 'A function that cannot throw exceptions' },
        { id: 'opt_4', text: 'A static method that operates on global variables' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A virtual function declared with `= 0` has no default implementation in the base class, making the base class abstract so it cannot be directly instantiated.'
    },
    {
      id: 'cpp-q10',
      skillId: 'cpp',
      skillName: 'C++',
      question: 'What is the "diamond problem" in C++ multiple inheritance, and how is it solved?',
      options: [
        { id: 'opt_1', text: 'Solved using template metaprogramming' },
        { id: 'opt_2', text: 'Ambiguity when two derived classes inherit from a common base and a fourth class inherits from both; solved using `virtual` base inheritance' },
        { id: 'opt_3', text: 'Memory fragmentation in heap allocations solved by memory pools' },
        { id: 'opt_4', text: 'Deadlocks in multi-threaded code solved by mutex hierarchies' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Virtual inheritance (`class B : virtual public A`) ensures that only one shared instance of the common base class A exists in the most-derived object.'
    }
  ],

  java: [
    {
      id: 'java-q1',
      skillId: 'java',
      skillName: 'Java',
      question: 'Why are `String` objects immutable in Java?',
      options: [
        { id: 'opt_1', text: 'Java memory is strictly read-only' },
        { id: 'opt_2', text: 'For security, String Pool caching, thread safety, and reliable use as HashMap keys' },
        { id: 'opt_3', text: 'To allow strings to be converted to primitive integers automatically' },
        { id: 'opt_4', text: 'Because the JVM cannot reallocate heap memory' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Immutability ensures strings can be safely shared across threads, cached in the String Constant Pool, and maintain deterministic hashCode values for hash-based collections.'
    },
    {
      id: 'java-q2',
      skillId: 'java',
      skillName: 'Java',
      question: 'What is the difference between `==` and `.equals()` when comparing two objects in Java?',
      options: [
        { id: 'opt_1', text: '== compares value equality; .equals() compares memory references' },
        { id: 'opt_2', text: '== compares memory reference equality (identity); .equals() compares logical content equality' },
        { id: 'opt_3', text: '== is used for Strings; .equals() is used for primitive numbers' },
        { id: 'opt_4', text: 'There is no difference in Java' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`==` checks if both variables refer to the exact same memory address. `.equals()` evaluates logical equality as implemented by the class.'
    },
    {
      id: 'java-q3',
      skillId: 'java',
      skillName: 'Java',
      question: 'What is the contract between `equals()` and `hashCode()` in Java?',
      options: [
        { id: 'opt_1', text: 'If two objects have the same hashCode, they must be equal according to equals()' },
        { id: 'opt_2', text: 'If two objects are equal according to equals(), they must produce the same hashCode()' },
        { id: 'opt_3', text: 'hashCode() must return a negative number for equal objects' },
        { id: 'opt_4', text: 'equals() and hashCode() have no relationship in Java' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'If obj1.equals(obj2) is true, then obj1.hashCode() MUST equal obj2.hashCode(). Violating this contract breaks HashMaps and HashSets.'
    },
    {
      id: 'java-q4',
      skillId: 'java',
      skillName: 'Java',
      question: 'What does the `volatile` keyword ensure when applied to a variable in Java?',
      options: [
        { id: 'opt_1', text: 'It makes the variable immutable' },
        { id: 'opt_2', text: 'It guarantees visibility of changes across threads by ensuring reads and writes happen directly from main memory' },
        { id: 'opt_3', text: 'It guarantees atomic execution of compound operations like count++' },
        { id: 'opt_4', text: 'It serializes the variable to disk' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'volatile ensures that any thread reading the field sees the most recent write by another thread, preventing threads from caching stale values in CPU registers.'
    },
    {
      id: 'java-q5',
      skillId: 'java',
      skillName: 'Java',
      question: 'What is the key difference between `ArrayList` and `LinkedList` in Java?',
      options: [
        { id: 'opt_1', text: 'ArrayList provides O(1) random access by index; LinkedList provides O(1) insertion/deletion at endpoints but O(N) indexing' },
        { id: 'opt_2', text: 'LinkedList is thread-safe; ArrayList is not' },
        { id: 'opt_3', text: 'ArrayList cannot hold null values' },
        { id: 'opt_4', text: 'LinkedList stores primitives; ArrayList stores objects' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'ArrayList is backed by a contiguous resizable array offering O(1) index lookups. LinkedList is a doubly-linked list requiring traversal for arbitrary index lookups.'
    },
    {
      id: 'java-q6',
      skillId: 'java',
      skillName: 'Java',
      question: 'In Java exception handling, what is a "checked exception"?',
      options: [
        { id: 'opt_1', text: 'An exception that inherits from RuntimeException and is optional to catch' },
        { id: 'opt_2', text: 'An exception checked at compile-time that must be declared in a `throws` clause or handled in a `try-catch`' },
        { id: 'opt_3', text: 'An error produced exclusively by hardware faults' },
        { id: 'opt_4', text: 'A syntax error caught by the compiler' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Checked exceptions (subclasses of Exception excluding RuntimeException) represent recoverable conditions that the compiler forces developers to handle explicitly.'
    },
    {
      id: 'java-q7',
      skillId: 'java',
      skillName: 'Java',
      question: 'What is the purpose of the Java Streams API introduced in Java 8?',
      options: [
        { id: 'opt_1', text: 'To perform socket network streaming' },
        { id: 'opt_2', text: 'To provide functional, declarative pipelines for processing collections of data (map, filter, reduce)' },
        { id: 'opt_3', text: 'To replace the garbage collector' },
        { id: 'opt_4', text: 'To compile Java directly into WebAssembly' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Java Streams provide a functional approach to data transformation, supporting lazy evaluation, parallel execution, and composable pipelines.'
    },
    {
      id: 'java-q8',
      skillId: 'java',
      skillName: 'Java',
      question: 'Where are Java local variables declared inside a method stored in memory?',
      options: [
        { id: 'opt_1', text: 'The Heap' },
        { id: 'opt_2', text: 'The Thread Stack' },
        { id: 'opt_3', text: 'Metaspace' },
        { id: 'opt_4', text: 'Disk cache' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Each thread has its own call stack where stack frames for method invocations are pushed, holding primitive local variables and references to heap objects.'
    },
    {
      id: 'java-q9',
      skillId: 'java',
      skillName: 'Java',
      question: 'Can an interface in Java 8+ contain implemented methods?',
      options: [
        { id: 'opt_1', text: 'No, interfaces can never contain method bodies' },
        { id: 'opt_2', text: 'Yes, using `default` or `static` keywords' },
        { id: 'opt_3', text: 'Only if the interface extends an abstract class' },
        { id: 'opt_4', text: 'Only in the java.lang package' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Java 8 introduced default and static methods in interfaces, allowing API designers to add new capabilities to interfaces without breaking existing implementations.'
    },
    {
      id: 'java-q10',
      skillId: 'java',
      skillName: 'Java',
      question: 'What happens when `System.gc()` is called in a Java application?',
      options: [
        { id: 'opt_1', text: 'The JVM is forced to perform an immediate full garbage collection cycle' },
        { id: 'opt_2', text: 'It sends a hint/suggestion to the JVM that garbage collection may be run, but execution is not guaranteed' },
        { id: 'opt_3', text: 'It terminates all running daemon threads' },
        { id: 'opt_4', text: 'It clears the String Constant Pool' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'System.gc() only suggests that the JVM exert effort toward recycling unused objects; the JVM implementation chooses whether and when to run.'
    }
  ],

  javascript: [
    {
      id: 'js-q1',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What is the order of execution in the JavaScript Event Loop for Promises vs setTimeout?',
      codeSnippet: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
      options: [
        { id: 'opt_1', text: '1, 2, 3, 4' },
        { id: 'opt_2', text: '1, 4, 3, 2' },
        { id: 'opt_3', text: '1, 4, 2, 3' },
        { id: 'opt_4', text: '1, 3, 4, 2' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Synchronous code runs first (1, 4). Microtasks (Promises) are processed immediately after synchronous execution completes (3). Macrotasks (setTimeout) execute in the next tick (2).'
    },
    {
      id: 'js-q2',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What is a JavaScript "Closure"?',
      options: [
        { id: 'opt_1', text: 'A syntax construct for closing HTML tags' },
        { id: 'opt_2', text: 'A function bundled together with references to its lexical environment, allowing access to outer scope variables even after outer function returns' },
        { id: 'opt_3', text: 'A method to terminate an event listener' },
        { id: 'opt_4', text: 'A built-in garbage collector command' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A closure gives an inner function access to its outer enclosing function scope even after the outer function has finished executing.'
    },
    {
      id: 'js-q3',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What is the difference between `==` and `===` in JavaScript?',
      options: [
        { id: 'opt_1', text: '== checks both value and type; === checks only value' },
        { id: 'opt_2', text: '== performs implicit type coercion before comparison; === is strict equality requiring identical types and values' },
        { id: 'opt_3', text: '=== is only valid in TypeScript' },
        { id: 'opt_4', text: 'There is no functional difference' }
      ],
      correctOptionId: 'opt_2',
      explanation: '`==` coerces operand types if they differ (e.g. `0 == ""` is true). `===` strictly requires matching types and values (e.g. `0 === ""` is false).'
    },
    {
      id: 'js-q4',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'How does the `this` keyword behave inside an ES6 arrow function compared to a standard function?',
      options: [
        { id: 'opt_1', text: 'Arrow functions have their own dynamic this bound at call time' },
        { id: 'opt_2', text: 'Arrow functions do not have their own this; they inherit this lexically from the enclosing scope' },
        { id: 'opt_3', text: 'Arrow functions always bind this to the window/global object' },
        { id: 'opt_4', text: 'Arrow functions throw an error if this is referenced' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Arrow functions retain the `this` value of the enclosing lexical context when they are defined, making them ideal for callbacks without `.bind(this)`.'
    },
    {
      id: 'js-q5',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What is the difference between `null` and `undefined` in JavaScript?',
      options: [
        { id: 'opt_1', text: 'null is assigned by the engine when a variable is declared without value; undefined is an intentional absence of value' },
        { id: 'opt_2', text: 'undefined means a variable has been declared but not assigned a value; null represents an intentional assignment of "no value"' },
        { id: 'opt_3', text: 'typeof null is "null"; typeof undefined is "undefined"' },
        { id: 'opt_4', text: 'null and undefined are strictly equal (null === undefined)' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'undefined indicates that a variable has not been initialized. null is an assigned primitive indicating an intentional absence of object value. (Note: typeof null is historically "object").'
    },
    {
      id: 'js-q6',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What is the purpose of the `Promise.allSettled()` method compared to `Promise.all()`?',
      options: [
        { id: 'opt_1', text: 'allSettled rejects immediately as soon as any single promise fails' },
        { id: 'opt_2', text: 'allSettled waits for all input promises to either fulfill or reject, returning an array of outcomes without short-circuiting on errors' },
        { id: 'opt_3', text: 'allSettled runs promises in synchronous sequential order' },
        { id: 'opt_4', text: 'allSettled can only be used with DOM events' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Promise.all fails fast if any promise rejects. Promise.allSettled waits for all promises to settle and returns their individual statuses and values/reasons.'
    },
    {
      id: 'js-q7',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What technique delays function execution until a specified delay has passed since the last invocation (commonly used for search inputs)?',
      options: [
        { id: 'opt_1', text: 'Throttling' },
        { id: 'opt_2', text: 'Debouncing' },
        { id: 'opt_3', text: 'Currying' },
        { id: 'opt_4', text: 'Memoization' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Debouncing bunches multiple calls together and waits until user activity pauses for a threshold time. Throttling limits calls to once per fixed time interval.'
    },
    {
      id: 'js-q8',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What does `Array.prototype.reduce()` do?',
      options: [
        { id: 'opt_1', text: 'Removes duplicate items from an array' },
        { id: 'opt_2', text: 'Executes a reducer function on each element, accumulating them into a single resultant value' },
        { id: 'opt_3', text: 'Shortens the array length by half' },
        { id: 'opt_4', text: 'Sorts the array in descending order' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'reduce() iterates through an array, passing an accumulator and current value to build a single output (e.g. sum, object dictionary, grouped map).'
    },
    {
      id: 'js-q9',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What is the "Temporal Dead Zone" (TDZ) in JavaScript?',
      options: [
        { id: 'opt_1', text: 'The time during garbage collection when scripts pause' },
        { id: 'opt_2', text: 'The region of code from the start of a block until a `let` or `const` variable is initialized, where accessing it throws a ReferenceError' },
        { id: 'opt_3', text: 'The timeout delay before setTimeout fires' },
        { id: 'opt_4', text: 'The period before DOMContentLoaded fires' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'While `let` and `const` variables are hoisted, they are not initialized until their declaration line is evaluated. Accessing them in the TDZ throws ReferenceError.'
    },
    {
      id: 'js-q10',
      skillId: 'javascript',
      skillName: 'JavaScript',
      question: 'What is the output of `typeof NaN` in JavaScript?',
      options: [
        { id: 'opt_1', text: '"undefined"' },
        { id: 'opt_2', text: '"number"' },
        { id: 'opt_3', text: '"NaN"' },
        { id: 'opt_4', text: '"boolean"' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'In the IEEE 754 floating-point specification and JavaScript standard, NaN (Not-a-Number) is a numeric data type representing an undefined or unrepresentable numeric result.'
    }
  ],

  htmlcss: [
    {
      id: 'hc-q1',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'What is the difference between `box-sizing: content-box` and `box-sizing: border-box` in CSS?',
      options: [
        { id: 'opt_1', text: 'border-box excludes borders from the element calculation' },
        { id: 'opt_2', text: 'border-box includes padding and border within the specified width and height, whereas content-box adds them on top of the dimensions' },
        { id: 'opt_3', text: 'content-box renders elements without margins' },
        { id: 'opt_4', text: 'border-box only works on table elements' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'With border-box, an element with width: 200px and 20px padding remains 200px wide. With content-box, the total rendered width becomes 240px.'
    },
    {
      id: 'hc-q2',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'Which CSS property creates a two-dimensional grid layout capable of handling both rows and columns simultaneously?',
      options: [
        { id: 'opt_1', text: 'display: flex' },
        { id: 'opt_2', text: 'display: grid' },
        { id: 'opt_3', text: 'display: inline-block' },
        { id: 'opt_4', text: 'display: table' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'CSS Grid is designed for 2D layouts (rows and columns simultaneously), whereas Flexbox is primarily designed for 1D layouts (a single row or column at a time).'
    },
    {
      id: 'hc-q3',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'What is the CSS specificity hierarchy from highest to lowest priority?',
      options: [
        { id: 'opt_1', text: 'Element -> Class -> ID -> Inline style' },
        { id: 'opt_2', text: 'Inline style -> ID selector -> Class/Attribute/Pseudo-class -> Element selector' },
        { id: 'opt_3', text: 'Class -> ID -> Element -> Inline style' },
        { id: 'opt_4', text: 'All selectors have identical specificity weight' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Inline styles (1,0,0,0) override ID selectors (0,1,0,0), which override class/pseudo-classes (0,0,1,0), which override element selectors (0,0,0,1).'
    },
    {
      id: 'hc-q4',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'How does `position: sticky` behave in CSS?',
      options: [
        { id: 'opt_1', text: 'It positions an element relative to the entire screen viewport at all times' },
        { id: 'opt_2', text: 'It acts as `relative` until a specified scroll threshold is reached, then sticks like `fixed` within its parent container' },
        { id: 'opt_3', text: 'It prevents the element from being clicked' },
        { id: 'opt_4', text: 'It animates smoothly to the center of the screen' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'sticky toggles between relative and fixed positioning based on the user scroll position, constrained within the bounds of its parent container.'
    },
    {
      id: 'hc-q5',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'Why should semantic HTML tags (like `<nav>`, `<article>`, `<main>`) be used instead of generic `<div>` tags?',
      options: [
        { id: 'opt_1', text: 'They automatically style elements with dark backgrounds' },
        { id: 'opt_2', text: 'They provide accessible landmark navigation for screen readers and improve search engine (SEO) indexing' },
        { id: 'opt_3', text: 'They speed up JavaScript execution' },
        { id: 'opt_4', text: 'They prevent CSS styling errors' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Semantic HTML conveys meaning to assistive technologies (screen readers) and search engines, ensuring an accessible and structured document tree.'
    },
    {
      id: 'hc-q6',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'What is the purpose of the `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag in HTML?',
      options: [
        { id: 'opt_1', text: 'Enables 3D hardware acceleration in mobile browsers' },
        { id: 'opt_2', text: 'Instructs mobile browsers to match screen width and sets initial zoom level for responsive rendering' },
        { id: 'opt_3', text: 'Preloads all CSS stylesheets' },
        { id: 'opt_4', text: 'Enables dark mode automatically' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Without the viewport meta tag, mobile browsers assume a desktop viewport (~980px) and scale down content, breaking responsive media queries.'
    },
    {
      id: 'hc-q7',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'What CSS unit is relative to the font-size of the root `<html>` element?',
      options: [
        { id: 'opt_1', text: 'em' },
        { id: 'opt_2', text: 'rem' },
        { id: 'opt_3', text: 'vh' },
        { id: 'opt_4', text: 'ch' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'rem stands for "root em" and scales relative to the root html font-size (typically 16px by default), unlike em which scales relative to the immediate parent font-size.'
    },
    {
      id: 'hc-q8',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'What does the CSS property `flex-wrap: wrap` do in a Flexbox container?',
      options: [
        { id: 'opt_1', text: 'Shrinks all items to zero width' },
        { id: 'opt_2', text: 'Allows flex items to break onto multiple lines if they exceed container width instead of overflowing or squishing' },
        { id: 'opt_3', text: 'Reverses the order of flex items' },
        { id: 'opt_4', text: 'Aligns items vertically in the center' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'By default, flex-wrap is nowrap which forces all items onto a single line. Setting wrap allows elements to wrap gracefully onto subsequent lines.'
    },
    {
      id: 'hc-q9',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'What creates a new Stacking Context in CSS affecting `z-index` layering?',
      options: [
        { id: 'opt_1', text: 'Adding a class attribute to an element' },
        { id: 'opt_2', text: 'Positioned elements with z-index, opacity less than 1, transform properties, or filter effects' },
        { id: 'opt_3', text: 'Any paragraph element' },
        { id: 'opt_4', text: 'Setting font-size to 14px' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A stacking context is a 3D conceptualization of HTML elements. Once formed, child z-index values are contained and cannot break out relative to parent siblings.'
    },
    {
      id: 'hc-q10',
      skillId: 'htmlcss',
      skillName: 'HTML & CSS',
      question: 'What is the purpose of the `alt` attribute on `<img>` tags?',
      options: [
        { id: 'opt_1', text: 'Defines the image width in pixels' },
        { id: 'opt_2', text: 'Provides descriptive alternative text for visually impaired users using screen readers and when images fail to load' },
        { id: 'opt_3', text: 'Applies visual filters to the image' },
        { id: 'opt_4', text: 'Specifies the URL for image caching' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The alt attribute is critical for web accessibility (WCAG) and provides fallback text if the image asset is unavailable.'
    }
  ],

  react: [
    {
      id: 'rc-q1',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'What is the Virtual DOM in React and why does React use it?',
      options: [
        { id: 'opt_1', text: 'A direct replacement for the browser DOM written in WebAssembly' },
        { id: 'opt_2', text: 'A lightweight in-memory representation of the real DOM that React diffs to minimize slow physical DOM updates' },
        { id: 'opt_3', text: 'A browser plugin required to run JSX' },
        { id: 'opt_4', text: 'A database that stores React components on the server' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Direct DOM manipulation is computationally expensive. React maintains an in-memory Virtual DOM, computes changes using a reconciliation algorithm, and batches optimal DOM updates.'
    },
    {
      id: 'rc-q2',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'Why should you NOT use array indexes as `key` props in dynamic React lists?',
      options: [
        { id: 'opt_1', text: 'React throws a compilation error if an index is used' },
        { id: 'opt_2', text: 'If items are reordered, inserted, or removed, index keys cause incorrect component state retention and rendering bugs' },
        { id: 'opt_3', text: 'Array indexes are not supported in JavaScript objects' },
        { id: 'opt_4', text: 'Indexes double the memory consumed by the Virtual DOM' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Keys give items stable identity across renders. When items are reordered or deleted, index keys shift, causing React to misidentify matching elements and corrupt local component state.'
    },
    {
      id: 'rc-q3',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'When does the cleanup function in a `useEffect` hook execute?',
      options: [
        { id: 'opt_1', text: 'Only when the entire browser tab is closed' },
        { id: 'opt_2', text: 'Before the component unmounts and before re-running the effect on subsequent dependency updates' },
        { id: 'opt_3', text: 'Immediately after the component mounts' },
        { id: 'opt_4', text: 'Every time the user clicks on the page' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The function returned from useEffect runs prior to component unmounting or before re-executing the effect when dependencies change, preventing memory leaks and dangling subscriptions.'
    },
    {
      id: 'rc-q4',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'What is the difference between `useMemo` and `useCallback` in React?',
      options: [
        { id: 'opt_1', text: 'useMemo memoizes a computed value; useCallback memoizes a function definition' },
        { id: 'opt_2', text: 'useCallback is for server components; useMemo is for client components' },
        { id: 'opt_3', text: 'useMemo triggers re-renders; useCallback prevents re-renders' },
        { id: 'opt_4', text: 'There is no difference in React 18' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'useMemo(fn, deps) caches the calculated result of a function. useCallback(fn, deps) caches the function instance itself across re-renders to prevent unnecessary child component re-renders.'
    },
    {
      id: 'rc-q5',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'What will happen if you update state in React by directly mutating it, e.g. `user.name = "Alex";`?',
      options: [
        { id: 'opt_1', text: 'React re-renders the component immediately' },
        { id: 'opt_2', text: 'React will not detect the state change because the object reference remained identical, failing to trigger a re-render' },
        { id: 'opt_3', text: 'A fatal JavaScript TypeError is thrown' },
        { id: 'opt_4', text: 'The browser crashes' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'React compares state by shallow reference (Object.is). If you mutate an object directly without returning a new object reference (`setUser({...user, name})`), React skips re-rendering.'
    },
    {
      id: 'rc-q6',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'What is a "Controlled Component" in React?',
      options: [
        { id: 'opt_1', text: 'A component rendered exclusively on the server' },
        { id: 'opt_2', text: 'An input element whose value is driven by React state, with updates handled via event handlers' },
        { id: 'opt_3', text: 'A component wrapped in an Error Boundary' },
        { id: 'opt_4', text: 'A component with strict TypeScript types' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'In a controlled component, form data is handled by a React component state rather than the DOM, providing a single source of truth for input values.'
    },
    {
      id: 'rc-q7',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'What is the primary purpose of React Context?',
      options: [
        { id: 'opt_1', text: 'To replace CSS stylesheets' },
        { id: 'opt_2', text: 'To share data globally across the component tree without manually passing props down through intermediate components ("prop drilling")' },
        { id: 'opt_3', text: 'To connect directly to SQL databases' },
        { id: 'opt_4', text: 'To optimize image loading' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Context provides a way to pass data (theme, authenticated user, locale) through the component tree without needing to pass props manually at every level.'
    },
    {
      id: 'rc-q8',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'What is the purpose of React Error Boundaries?',
      options: [
        { id: 'opt_1', text: 'To catch 404 HTTP errors from API endpoints' },
        { id: 'opt_2', text: 'To catch JavaScript errors anywhere in child component trees, log errors, and display fallback UI instead of crashing the whole app' },
        { id: 'opt_3', text: 'To prevent users from navigating back in history' },
        { id: 'opt_4', text: 'To validate HTML form inputs' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Error Boundaries are React components that catch JavaScript errors during rendering, lifecycle methods, and constructors in the tree below them, preventing white-screen crashes.'
    },
    {
      id: 'rc-q9',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'What is the `useRef` hook commonly used for in React?',
      options: [
        { id: 'opt_1', text: 'To hold a mutable value that persists across renders without triggering a re-render when changed, or to reference a direct DOM node' },
        { id: 'opt_2', text: 'To perform database migrations' },
        { id: 'opt_3', text: 'To animate CSS transitions' },
        { id: 'opt_4', text: 'To replace useState in all scenarios' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'useRef returns a mutable object whose .current property persists for the full lifetime of the component. Changing it does not trigger a re-render.'
    },
    {
      id: 'rc-q10',
      skillId: 'react',
      skillName: 'Frontend (React)',
      question: 'What is the rule regarding the placement of React Hook invocations?',
      options: [
        { id: 'opt_1', text: 'Hooks must only be called inside loops and conditional if statements' },
        { id: 'opt_2', text: 'Hooks must only be called at the top level of React function components or custom hooks, never inside loops, conditions, or nested functions' },
        { id: 'opt_3', text: 'Hooks can be called anywhere in any JavaScript file' },
        { id: 'opt_4', text: 'Hooks must always be called inside setTimeout' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'React relies on the order in which Hooks are called to associate state with each hook call across renders. Calling hooks inside conditions or loops disrupts that sequence.'
    }
  ],

  node: [
    {
      id: 'node-q1',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'How does Node.js handle high-concurrency I/O operations despite being single-threaded in JavaScript execution?',
      options: [
        { id: 'opt_1', text: 'It creates a new OS process for every incoming HTTP request' },
        { id: 'opt_2', text: 'Using the libuv event loop and an underlying thread pool to offload asynchronous I/O operations non-blockingly' },
        { id: 'opt_3', text: 'It uses GPU hardware acceleration' },
        { id: 'opt_4', text: 'It pauses incoming requests until the previous request completes' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Node.js delegates asynchronous I/O (filesystem, network, crypto) to libuv and operating system kernel non-blocking mechanisms, processing completion callbacks on the event loop.'
    },
    {
      id: 'node-q2',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'In an Express.js middleware function, what happens if you forget to call `next()` and do not send a response?',
      options: [
        { id: 'opt_1', text: 'The server crashes with a segmentation fault' },
        { id: 'opt_2', text: 'The client request will hang indefinitely until it times out' },
        { id: 'opt_3', text: 'Express automatically returns a 200 OK empty response' },
        { id: 'opt_4', text: 'The next middleware executes automatically' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Express middleware chains must either pass control to the next handler by invoking next() or terminate the request-response cycle by sending a response (e.g. res.send()).'
    },
    {
      id: 'node-q3',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'What is the purpose of Node.js Streams and the concept of "Backpressure"?',
      options: [
        { id: 'opt_1', text: 'To encrypt network packets in real-time' },
        { id: 'opt_2', text: 'To process large data in chunks without consuming massive RAM, pausing the data source when the consumer buffer is full' },
        { id: 'opt_3', text: 'To throttle CPU speed during heavy computation' },
        { id: 'opt_4', text: 'To manage database connection pool timeouts' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Streams enable reading and writing data chunk-by-chunk. Backpressure ensures that if writing is slower than reading, the readable stream is paused to avoid buffer memory exhaustion.'
    },
    {
      id: 'node-q4',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'How should passwords be securely stored in a Node.js database?',
      options: [
        { id: 'opt_1', text: 'As base64 encoded strings' },
        { id: 'opt_2', text: 'Hashed using a slow cryptographic key-derivation function (like bcrypt or argon2) with a unique salt' },
        { id: 'opt_3', text: 'Hashed using MD5 for fast verification' },
        { id: 'opt_4', text: 'In plain text so administrators can recover forgotten passwords' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Fast hashes like MD5/SHA1 are vulnerable to rainbow table attacks and brute force. bcrypt uses adaptive work factors and automatic salting to protect against offline cracking.'
    },
    {
      id: 'node-q5',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'What is the difference between CommonJS and ES Modules in Node.js?',
      options: [
        { id: 'opt_1', text: 'CommonJS uses `require()` and is synchronous; ES Modules use `import/export` and support static analysis and top-level await' },
        { id: 'opt_2', text: 'CommonJS is for frontend only; ES Modules are for backend only' },
        { id: 'opt_3', text: 'CommonJS was removed in Node.js 14' },
        { id: 'opt_4', text: 'There is no difference in Node.js' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'CommonJS (require/module.exports) evaluates modules synchronously at runtime. ESM (import/export) is the standard modern specification with static dependency graphs.'
    },
    {
      id: 'node-q6',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'What is CORS (Cross-Origin Resource Sharing) and why is it needed in Express APIs?',
      options: [
        { id: 'opt_1', text: 'A database query language for Node.js' },
        { id: 'opt_2', text: 'A browser security mechanism that restricts cross-origin HTTP requests unless the server explicitly grants permission via response headers' },
        { id: 'opt_3', text: 'A tool for compressing API payloads' },
        { id: 'opt_4', text: 'A protocol for WebSockets' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Browsers enforce the Same-Origin Policy. When frontend on port 5173 requests backend on port 3001, CORS headers (Access-Control-Allow-Origin) must allow the interaction.'
    },
    {
      id: 'node-q7',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'What does a JSON Web Token (JWT) consist of?',
      options: [
        { id: 'opt_1', text: 'A single encrypted string containing database credentials' },
        { id: 'opt_2', text: 'Three base64url-encoded parts separated by dots: Header, Payload, and Signature' },
        { id: 'opt_3', text: 'A plain JSON object sent over HTTP cookies' },
        { id: 'opt_4', text: 'An SSL certificate' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A JWT comprises Header.Payload.Signature. The signature is created by hashing the header and payload with a secret key, verifying authenticity without database lookups.'
    },
    {
      id: 'node-q8',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'How should unhandled asynchronous errors in Express route handlers be handled in Node.js?',
      options: [
        { id: 'opt_1', text: 'They are automatically silenced by the operating system' },
        { id: 'opt_2', text: 'Wrap async route logic in try-catch and forward errors to `next(err)` to trigger the Express error-handling middleware' },
        { id: 'opt_3', text: 'Restart the computer whenever an error occurs' },
        { id: 'opt_4', text: 'Async routes cannot throw errors' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'In Express, unhandled rejected promises in route handlers cause unhandledRejection events. Passing errors to next(err) invokes custom error middlewares (`(err, req, res, next)`).'
    },
    {
      id: 'node-q9',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'What is the Node.js `EventEmitter`?',
      options: [
        { id: 'opt_1', text: 'A library that simulates mouse clicks on the server' },
        { id: 'opt_2', text: 'A core class implementing the Observer pattern, allowing objects to emit named events that trigger registered listener functions' },
        { id: 'opt_3', text: 'A timer that fires every 10 seconds' },
        { id: 'opt_4', text: 'An external package for handling WebSockets' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'EventEmitter powers much of Node.js core (like streams and HTTP servers). Objects inherit from EventEmitter to emit events and allow subscribers to listen with `.on()`.'
    },
    {
      id: 'node-q10',
      skillId: 'node',
      skillName: 'Backend (Node.js)',
      question: 'Why should environment variables (`process.env`) be used for configuration in Node.js?',
      options: [
        { id: 'opt_1', text: 'They compile JavaScript faster' },
        { id: 'opt_2', text: 'To keep sensitive secrets (database passwords, API keys) out of source control and allow different configs across environments' },
        { id: 'opt_3', text: 'Because Node.js does not allow hardcoded numbers' },
        { id: 'opt_4', text: 'To automatically format code' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Following the 12-Factor App methodology, configuration and secrets are injected via the environment (e.g. .env or cloud provider vars) rather than committed to Git.'
    }
  ],

  dataanalytics: [
    {
      id: 'da-q1',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'What is the Interquartile Range (IQR) method used for in exploratory data analysis?',
      options: [
        { id: 'opt_1', text: 'Calculating the mean of a normal distribution' },
        { id: 'opt_2', text: 'Detecting statistical outliers by measuring the spread of the middle 50% of data (Q3 - Q1)' },
        { id: 'opt_3', text: 'Converting categorical data to numerical embeddings' },
        { id: 'opt_4', text: 'Compressing large datasets for storage' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'IQR = Q3 - Q1. Values falling below Q1 - 1.5*IQR or above Q3 + 1.5*IQR are typically flagged as outliers that could distort statistical models.'
    },
    {
      id: 'da-q2',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'What is the difference between `.loc[]` and `.iloc[]` in Python Pandas?',
      options: [
        { id: 'opt_1', text: 'loc is label-based indexing; iloc is integer position-based indexing' },
        { id: 'opt_2', text: 'loc works only on columns; iloc works only on rows' },
        { id: 'opt_3', text: 'iloc sorts data alphabetically; loc sorts numerically' },
        { id: 'opt_4', text: 'They are identical aliases in Pandas' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'df.loc[] selects rows and columns using their labels or boolean arrays. df.iloc[] strictly selects using 0-based integer index positions.'
    },
    {
      id: 'da-q3',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'What does a Pearson correlation coefficient of -0.92 between two business metrics indicate?',
      options: [
        { id: 'opt_1', text: 'No relationship exists between the metrics' },
        { id: 'opt_2', text: 'A very strong inverse linear relationship: as one metric increases, the other metric consistently decreases' },
        { id: 'opt_3', text: 'A data collection error in 92% of records' },
        { id: 'opt_4', text: 'That metric A caused metric B directly' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Pearson correlation ranges from -1 to +1. A value of -0.92 indicates a very strong negative linear relationship (though correlation does not imply causation).'
    },
    {
      id: 'da-q4',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'What is "Cohort Retention Analysis" in SaaS and Product Analytics?',
      options: [
        { id: 'opt_1', text: 'Tracking the CPU usage of server clusters' },
        { id: 'opt_2', text: 'Grouping users by a common sign-up timeframe and measuring what percentage continue active engagement over subsequent weeks or months' },
        { id: 'opt_3', text: 'Calculating the average salary of employees' },
        { id: 'opt_4', text: 'A method for compressing SQL tables' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'Cohort analysis groups users by their acquisition date to observe how retention and churn evolve over time, pinpointing product improvements or drop-off points.'
    },
    {
      id: 'da-q5',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'When should Median be preferred over Mean as a measure of central tendency?',
      options: [
        { id: 'opt_1', text: 'When the dataset has a strictly symmetric normal distribution' },
        { id: 'opt_2', text: 'When the data is heavily skewed or contains extreme outliers (such as income or housing prices)' },
        { id: 'opt_3', text: 'When working with text labels' },
        { id: 'opt_4', text: 'Never; Mean is always more accurate' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'The mean is sensitive to extreme outlier values. The median reflects the middle value of sorted observations and is robust against skewness.'
    },
    {
      id: 'da-q6',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'What is the purpose of a 7-day Rolling Moving Average in time-series sales data?',
      options: [
        { id: 'opt_1', text: 'To delete weekends from the dataset' },
        { id: 'opt_2', text: 'To smooth out high-frequency daily noise and cyclical day-of-week seasonality to reveal underlying trends' },
        { id: 'opt_3', text: 'To predict sales 10 years into the future' },
        { id: 'opt_4', text: 'To normalize currency rates' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'A rolling moving average calculates the average of overlapping subsets, reducing transient noise (like weekend dips) to clarify real growth or decline trends.'
    },
    {
      id: 'da-q7',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'What is the Customer Churn Rate formula for a given monthly period?',
      options: [
        { id: 'opt_1', text: '(Customers Lost during Month / Total Customers at Start of Month) * 100' },
        { id: 'opt_2', text: '(New Customers Gained / Total Revenue) * 100' },
        { id: 'opt_3', text: '(Customers Lost * Customer Acquisition Cost) / 12' },
        { id: 'opt_4', text: '(Total Revenue / Total Customers)' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'Churn rate is the percentage of existing customers that cancel or do not renew during a specified time interval, calculated as Lost Customers / Starting Customers.'
    },
    {
      id: 'da-q8',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'What does "Data Normalization" (Min-Max Scaling) do to a numeric feature?',
      options: [
        { id: 'opt_1', text: 'Transforms the feature values into a fixed range between 0 and 1' },
        { id: 'opt_2', text: 'Converts numeric values into category strings' },
        { id: 'opt_3', text: 'Sets the mean to 0 and standard deviation to 1' },
        { id: 'opt_4', text: 'Rounds floating point numbers to integers' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'Min-Max normalization scales values to a [0, 1] range: `(x - min) / (max - min)`. Standardization (Z-score) scales data to mean 0 and variance 1.'
    },
    {
      id: 'da-q9',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'In statistical distributions, what does "Positive Skewness" (Right-Skewed) indicate?',
      options: [
        { id: 'opt_1', text: 'The left tail is longer than the right tail' },
        { id: 'opt_2', text: 'The right tail is longer; the mass of distribution is concentrated on the left, and Mean > Median' },
        { id: 'opt_3', text: 'The distribution is a perfect bell curve' },
        { id: 'opt_4', text: 'All data points are greater than zero' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'In a right-skewed distribution, a long tail stretches out to high values on the right, pulling the mean higher than the median.'
    },
    {
      id: 'da-q10',
      skillId: 'dataanalytics',
      skillName: 'Data Analytics',
      question: 'What does Customer Lifetime Value (LTV) measure?',
      options: [
        { id: 'opt_1', text: 'The marketing cost to acquire one new customer' },
        { id: 'opt_2', text: 'The total net revenue a business can reasonably expect to earn from a customer throughout their entire relationship' },
        { id: 'opt_3', text: 'The age of the oldest customer' },
        { id: 'opt_4', text: 'The number of days a user visits a website' }
      ],
      correctOptionId: 'opt_2',
      explanation: 'LTV estimates the total monetary value a customer brings to the company over their entire lifespan as a paying account, essential for comparing against Customer Acquisition Cost (CAC).'
    }
  ]
};
