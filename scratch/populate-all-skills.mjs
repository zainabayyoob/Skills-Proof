import fs from 'fs';
import path from 'path';

// Let's load existing questionBank
import { questionBank } from '../server/data/questionBank.js';

const cQuestions = [
  {
    id: 'c-q11',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'basic',
    question: 'What is the correct format specifier for printing an unsigned integer using printf?',
    options: [
      { id: 'opt_1', text: '%d' },
      { id: 'opt_2', text: '%u' },
      { id: 'opt_3', text: '%i' },
      { id: 'opt_4', text: '%f' }
    ],
    correctOptionId: 'opt_2',
    explanation: '%u is specifically designated for printing unsigned decimal integers in C.'
  },
  {
    id: 'c-q12',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'basic',
    question: 'What does the sizeof operator return in C?',
    options: [
      { id: 'opt_1', text: 'Size in bits' },
      { id: 'opt_2', text: 'Size in bytes as a size_t' },
      { id: 'opt_3', text: 'Number of memory addresses allocated' },
      { id: 'opt_4', text: 'Length of string excluding null character' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'sizeof returns the memory size of an expression or type in bytes, represented as size_t.'
  },
  {
    id: 'c-q13',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'basic',
    question: 'Which header file must be included to use malloc() and free() in C?',
    options: [
      { id: 'opt_1', text: '<stdio.h>' },
      { id: 'opt_2', text: '<stdlib.h>' },
      { id: 'opt_3', text: '<string.h>' },
      { id: 'opt_4', text: '<memory.h>' }
    ],
    correctOptionId: 'opt_2',
    explanation: '<stdlib.h> contains the function prototypes for dynamic memory allocation functions malloc, calloc, realloc, and free.'
  },
  {
    id: 'c-q14',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'basic',
    question: 'What character is automatically appended to string literals to indicate their end in C?',
    options: [
      { id: 'opt_1', text: "'\\n'" },
      { id: 'opt_2', text: "'\\0'" },
      { id: 'opt_3', text: "'EOF'" },
      { id: 'opt_4', text: "';'" }
    ],
    correctOptionId: 'opt_2',
    explanation: 'C strings are null-terminated character arrays ending with the null terminator character \'\\0\' (ASCII 0).'
  },
  {
    id: 'c-q15',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'basic',
    question: 'What is the value of 5 & 3 using the bitwise AND operator?',
    options: [
      { id: 'opt_1', text: '1' },
      { id: 'opt_2', text: '7' },
      { id: 'opt_3', text: '8' },
      { id: 'opt_4', text: '0' }
    ],
    correctOptionId: 'opt_1',
    explanation: '5 in binary is 101, and 3 is 011. The bitwise AND produces 001, which is 1.'
  },
  {
    id: 'c-q16',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'intermediate',
    question: 'What is a "dangling pointer" in C?',
    options: [
      { id: 'opt_1', text: 'A pointer that points to NULL' },
      { id: 'opt_2', text: 'A pointer pointing to a memory location that has already been deallocated' },
      { id: 'opt_3', text: 'An uninitialized pointer pointing to arbitrary memory' },
      { id: 'opt_4', text: 'A pointer declared inside a recursive function' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'A dangling pointer arises when memory pointed to by a pointer has been freed, but the pointer was not reset to NULL.'
  },
  {
    id: 'c-q17',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'intermediate',
    question: 'What is the primary difference between malloc() and calloc() in C?',
    options: [
      { id: 'opt_1', text: 'calloc allocates memory on the stack while malloc allocates on the heap' },
      { id: 'opt_2', text: 'calloc initializes allocated memory to zero; malloc leaves memory uninitialized' },
      { id: 'opt_3', text: 'malloc takes two parameters and calloc takes one' },
      { id: 'opt_4', text: 'malloc cannot allocate arrays' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'calloc(num, size) zeros out all allocated memory bits, whereas malloc(size) allocates raw memory containing indeterminate values.'
  },
  {
    id: 'c-q18',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'intermediate',
    question: 'What is the meaning of the `static` keyword when applied to a global variable in C?',
    options: [
      { id: 'opt_1', text: 'The variable cannot be modified (read-only)' },
      { id: 'opt_2', text: 'The variable has internal linkage, restricting its scope to the translation unit (.c file) where it is defined' },
      { id: 'opt_3', text: 'The variable is stored in processor registers' },
      { id: 'opt_4', text: 'The variable is automatically freed when main exits' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'A static global variable has internal linkage, preventing other object files from accessing it via the extern keyword.'
  },
  {
    id: 'c-q19',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'intermediate',
    question: 'What happens when you pass an array to a function in C?',
    options: [
      { id: 'opt_1', text: 'A complete deep copy of the array elements is created on the call stack' },
      { id: 'opt_2', text: 'The array decays into a pointer to its first element' },
      { id: 'opt_3', text: 'The function receives the array length automatically as a hidden argument' },
      { id: 'opt_4', text: 'Compilation fails unless passed by reference using the & operator' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'In C, array names decay into a pointer to the type of their first element when passed as function arguments.'
  },
  {
    id: 'c-q20',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'intermediate',
    question: 'What is structure padding in C?',
    options: [
      { id: 'opt_1', text: 'Adding empty string fields to structs' },
      { id: 'opt_2', text: 'Compiler insertion of unused bytes between structure members to satisfy hardware memory alignment requirements' },
      { id: 'opt_3', text: 'Encrypting structure data in memory' },
      { id: 'opt_4', text: 'Reserving memory for future struct expansion' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Processors access memory more efficiently in 4-byte or 8-byte aligned words; compilers pad structures to align member offsets.'
  },
  {
    id: 'c-q21',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'advanced',
    question: 'What does the `volatile` type qualifier tell the C compiler?',
    options: [
      { id: 'opt_1', text: 'The variable will be stored on external persistent storage' },
      { id: 'opt_2', text: 'The variable can be modified by hardware or concurrent threads, disabling compiler caching/optimization into CPU registers' },
      { id: 'opt_3', text: 'The variable must be cleared when a function returns' },
      { id: 'opt_4', text: 'The variable is thread-safe and atomic' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`volatile` tells the compiler never to optimize away reads or writes to the variable, ensuring every read/write hits actual memory.'
  },
  {
    id: 'c-q22',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'advanced',
    question: 'What is the syntax for declaring a pointer to a function taking two ints and returning an int in C?',
    options: [
      { id: 'opt_1', text: 'int *fp(int, int);' },
      { id: 'opt_2', text: 'int (*fp)(int, int);' },
      { id: 'opt_3', text: 'int (int, int) *fp;' },
      { id: 'opt_4', text: 'function<int(int, int)> fp;' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Parentheses around `(*fp)` bind the pointer operator to the identifier; without parentheses, it declares a function returning an int pointer.'
  },
  {
    id: 'c-q23',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'advanced',
    question: 'What is Undefined Behavior (UB) in C?',
    options: [
      { id: 'opt_1', text: 'An error reported during compilation with code -1' },
      { id: 'opt_2', text: 'Code execution for which the ISO C standard imposes no requirements, allowing crashes, corrupted data, or erratic behavior' },
      { id: 'opt_3', text: 'A syntax error caught by linting tools' },
      { id: 'opt_4', text: 'Platform-dependent behavior with documented implementation choices' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Undefined behavior occurs when code violates standard rules (like buffer overflow or dereferencing null); compilers make no guarantees about execution.'
  },
  {
    id: 'c-q24',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'advanced',
    question: 'What does realloc(ptr, 0) do in standard compliant modern C (C23)?',
    options: [
      { id: 'opt_1', text: 'Doubles the allocated buffer' },
      { id: 'opt_2', text: 'Has undefined or deallocating behavior; modern C standard deprecates or treats zero size as freeing ptr or returning NULL' },
      { id: 'opt_3', text: 'Allocates a zero-length array' },
      { id: 'opt_4', text: 'Throws a BadAllocException' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Calling realloc with size 0 is historically undefined/inconsistent and in modern standards frees the memory or returns NULL.'
  },
  {
    id: 'c-q25',
    skillId: 'c',
    skillName: 'C Programming',
    difficulty: 'advanced',
    question: 'How can you prevent multiple inclusion of header files in C?',
    options: [
      { id: 'opt_1', text: 'Using static inline declarations' },
      { id: 'opt_2', text: 'Using preprocessor include guards (#ifndef HEADER_H ... #endif) or #pragma once' },
      { id: 'opt_3', text: 'Declaring all headers with extern' },
      { id: 'opt_4', text: 'Compiling with the -no-duplicate flag' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Include guards (#ifndef, #define, #endif) prevent compiler errors caused by re-declaring types when a header is included multiple times.'
  }
];

const cppQuestions = [
  {
    id: 'cpp-q11',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'basic',
    question: 'Which C++ stream is used for printing standard errors without buffering?',
    options: [
      { id: 'opt_1', text: 'std::cout' },
      { id: 'opt_2', text: 'std::cerr' },
      { id: 'opt_3', text: 'std::cin' },
      { id: 'opt_4', text: 'std::clog' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'std::cerr is unbuffered, making it ideal for immediate display of critical diagnostic and error messages.'
  },
  {
    id: 'cpp-q12',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'basic',
    question: 'Which keyword is used to prevent a class from being inherited or a virtual function from being overridden in C++11?',
    options: [
      { id: 'opt_1', text: 'sealed' },
      { id: 'opt_2', text: 'final' },
      { id: 'opt_3', text: 'const' },
      { id: 'opt_4', text: 'override' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The `final` specifier terminates the inheritance chain or prevents further overriding of a virtual member function.'
  },
  {
    id: 'cpp-q13',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'basic',
    question: 'What is the default access specifier for members of a `class` in C++?',
    options: [
      { id: 'opt_1', text: 'public' },
      { id: 'opt_2', text: 'private' },
      { id: 'opt_3', text: 'protected' },
      { id: 'opt_4', text: 'internal' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Members of a `class` in C++ default to `private`, whereas members of a `struct` default to `public`.'
  },
  {
    id: 'cpp-q14',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'basic',
    question: 'Which operator is used to allocate dynamic memory for a single object in C++?',
    options: [
      { id: 'opt_1', text: 'malloc' },
      { id: 'opt_2', text: 'new' },
      { id: 'opt_3', text: 'alloc' },
      { id: 'opt_4', text: 'create' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The `new` operator dynamically allocates memory on the free store and automatically invokes the constructor.'
  },
  {
    id: 'cpp-q15',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'basic',
    question: 'What does the `auto` keyword do in C++11 and later?',
    options: [
      { id: 'opt_1', text: 'Declares automatic storage duration variable on heap' },
      { id: 'opt_2', text: 'Instructs the compiler to deduce the variable type from its initializer expression' },
      { id: 'opt_3', text: 'Automatically parallelizes loop iterations' },
      { id: 'opt_4', text: 'Converts data types automatically at runtime' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`auto` instructs the compiler to deduce the variable\'s type at compile time from the type of its initialization expression.'
  },
  {
    id: 'cpp-q16',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'intermediate',
    question: 'What is RAII (Resource Acquisition Is Initialization) in C++?',
    options: [
      { id: 'opt_1', text: 'An IDE tool for compiling headers' },
      { id: 'opt_2', text: 'A design idiom where resource lifetime is tied to object lifetime (acquired in constructor, released in destructor)' },
      { id: 'opt_3', text: 'A technique to initialize all pointers to null in main()' },
      { id: 'opt_4', text: 'Asynchronous event initialization' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'RAII binds resource ownership to object lifetime; when stack objects go out of scope, destructors automatically release heap memory, sockets, or mutexes.'
  },
  {
    id: 'cpp-q17',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'intermediate',
    question: 'Why should a base class with virtual methods declare a virtual destructor in C++?',
    options: [
      { id: 'opt_1', text: 'To allow the base class to be instantiated' },
      { id: 'opt_2', text: 'To ensure the derived class destructor is called when deleting through a base class pointer' },
      { id: 'opt_3', text: 'To enable copy construction' },
      { id: 'opt_4', text: 'To suppress compiler warnings about inline functions' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Without a virtual destructor, deleting a derived class instance via a base class pointer results in undefined behavior and memory leaks.'
  },
  {
    id: 'cpp-q18',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'intermediate',
    question: 'What is the key difference between std::unique_ptr and std::shared_ptr in C++?',
    options: [
      { id: 'opt_1', text: 'unique_ptr is thread-safe while shared_ptr is not' },
      { id: 'opt_2', text: 'unique_ptr expresses exclusive ownership and cannot be copied (only moved); shared_ptr uses reference counting for shared ownership' },
      { id: 'opt_3', text: 'unique_ptr has higher runtime overhead than shared_ptr' },
      { id: 'opt_4', text: 'shared_ptr can only manage array allocations' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'std::unique_ptr enforces sole ownership with zero overhead (move-only), while std::shared_ptr manages a control block with atomic reference counting.'
  },
  {
    id: 'cpp-q19',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'intermediate',
    question: 'What is an lvalue reference vs an rvalue reference in modern C++?',
    options: [
      { id: 'opt_1', text: 'lvalues are stored in RAM; rvalues are in ROM' },
      { id: 'opt_2', text: 'lvalues represent identifiable memory locations with persistent names; rvalues represent temporary objects or values about to expire (denoted by &&)' },
      { id: 'opt_3', text: 'lvalues are const; rvalues are mutable' },
      { id: 'opt_4', text: 'rvalues can only be evaluated on the right side of loops' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Rvalue references (T&&) bind to temporary expressions, enabling move semantics which transfer resource pointers rather than performing expensive deep copies.'
  },
  {
    id: 'cpp-q20',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'intermediate',
    question: 'Which STL container provides O(1) amortized insertion at both ends and random access indexing?',
    options: [
      { id: 'opt_1', text: 'std::vector' },
      { id: 'opt_2', text: 'std::deque' },
      { id: 'opt_3', text: 'std::list' },
      { id: 'opt_4', text: 'std::set' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'std::deque (double-ended queue) supports constant time push_front, push_back, and O(1) indexed element access.'
  },
  {
    id: 'cpp-q21',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'advanced',
    question: 'What does `std::move` actually do under the hood in C++?',
    options: [
      { id: 'opt_1', text: 'Physically moves bytes in RAM from one address to another' },
      { id: 'opt_2', text: 'Unconditionally casts its argument to an rvalue reference (static_cast<T&&>), enabling move constructors or move assignments' },
      { id: 'opt_3', text: 'Zeroes out the source variable' },
      { id: 'opt_4', text: 'Allocates memory on the heap' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'std::move produces no runtime executable code; it simply casts an lvalue expression into an rvalue reference to allow move semantics.'
  },
  {
    id: 'cpp-q22',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'advanced',
    question: 'What is a vtable (virtual method table) in C++ implementations?',
    options: [
      { id: 'opt_1', text: 'A hash table storing source code line numbers for debugging' },
      { id: 'opt_2', text: 'An array of function pointers created per polymorphic class used to resolve virtual function calls dynamically at runtime' },
      { id: 'opt_3', text: 'A memory lookup table for template instantiations' },
      { id: 'opt_4', text: 'A database table used in embedded C++' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Every class with virtual methods has a vtable of function pointers; each instance contains a hidden vptr pointing to this table for dynamic dispatch.'
  },
  {
    id: 'cpp-q23',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'advanced',
    question: 'What is SFINAE in C++ template programming?',
    options: [
      { id: 'opt_1', text: 'Static Fast Instruction Network Architecture Engine' },
      { id: 'opt_2', text: 'Substitution Failure Is Not An Error: if a substituted template argument leads to invalid code, the candidate is discarded without compile error' },
      { id: 'opt_3', text: 'Synchronous File Input Not Always Enabled' },
      { id: 'opt_4', text: 'Single Function Interface Native Audio Extension' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'SFINAE enables template overload resolution and conditional compilation via std::enable_if and concepts.'
  },
  {
    id: 'cpp-q24',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'advanced',
    question: 'What is the difference between `const` and `constexpr` in C++?',
    options: [
      { id: 'opt_1', text: 'constexpr variables can be modified, const cannot' },
      { id: 'opt_2', text: 'const promises immutability at runtime; constexpr guarantees that the value can and must be evaluated at compile-time' },
      { id: 'opt_3', text: 'constexpr only works with integers' },
      { id: 'opt_4', text: 'There is no difference in modern C++' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`constexpr` enforces compile-time evaluation, allowing its result to be used as array bounds, template arguments, and static assertions.'
  },
  {
    id: 'cpp-q25',
    skillId: 'cpp',
    skillName: 'C++',
    difficulty: 'advanced',
    question: 'What is the "Rule of Five" in modern C++?',
    options: [
      { id: 'opt_1', text: 'A guideline restricting classes to 5 member variables' },
      { id: 'opt_2', text: 'If a class customizes any of: Destructor, Copy Constructor, Copy Assignment, Move Constructor, or Move Assignment, it should define all five' },
      { id: 'opt_3', text: 'Maximum five layers of template inheritance' },
      { id: 'opt_4', text: 'Five design patterns required for clean code' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Managing resource lifetimes requires explicitly implementing or deleting all five special member functions to prevent resource leaks and double frees.'
  }
];

const javaQuestions = [
  {
    id: 'java-q11',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'basic',
    question: 'What is the default value of a boolean field in a Java class instance?',
    options: [
      { id: 'opt_1', text: 'true' },
      { id: 'opt_2', text: 'false' },
      { id: 'opt_3', text: 'null' },
      { id: 'opt_4', text: '0' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'In Java, uninitialized instance variables of primitive boolean type default to false.'
  },
  {
    id: 'java-q12',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'basic',
    question: 'Which keyword prevents a method from being overridden by subclasses in Java?',
    options: [
      { id: 'opt_1', text: 'static' },
      { id: 'opt_2', text: 'final' },
      { id: 'opt_3', text: 'abstract' },
      { id: 'opt_4', text: 'constant' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Marking a method `final` disallows child classes from overriding that method implementation.'
  },
  {
    id: 'java-q13',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'basic',
    question: 'What is the size of an `int` data type in Java across all platforms?',
    options: [
      { id: 'opt_1', text: '16 bits' },
      { id: 'opt_2', text: '32 bits (4 bytes)' },
      { id: 'opt_3', text: '64 bits' },
      { id: 'opt_4', text: 'Platform dependent' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Java guarantees that primitive int is strictly 32-bit signed two\'s complement on all JVM architectures.'
  },
  {
    id: 'java-q14',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'basic',
    question: 'Which collection in java.util does NOT allow duplicate elements?',
    options: [
      { id: 'opt_1', text: 'ArrayList' },
      { id: 'opt_2', text: 'HashSet' },
      { id: 'opt_3', text: 'LinkedList' },
      { id: 'opt_4', text: 'Vector' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Set implementations such as HashSet enforce mathematical set semantics with unique elements only.'
  },
  {
    id: 'java-q15',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'basic',
    question: 'What is the entry point signature required for a standalone Java application?',
    options: [
      { id: 'opt_1', text: 'public void main(String args[])' },
      { id: 'opt_2', text: 'public static void main(String[] args)' },
      { id: 'opt_3', text: 'static int main(String[] args)' },
      { id: 'opt_4', text: 'public abstract void main(String[] args)' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The JVM looks for public static void main(String[] args) as the standard executable entry point.'
  },
  {
    id: 'java-q16',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'intermediate',
    question: 'Why are String objects immutable in Java?',
    options: [
      { id: 'opt_1', text: 'Because char arrays cannot be modified in hardware' },
      { id: 'opt_2', text: 'For security, hashcode caching, thread safety, and string constant pool sharing' },
      { id: 'opt_3', text: 'To allow multiple inheritance' },
      { id: 'opt_4', text: 'Because JVM stack memory forbids updates' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Immutability ensures Strings can be safely cached in the String Pool, passed securely to network/database calls, and shared across threads without synchronization.'
  },
  {
    id: 'java-q17',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'intermediate',
    question: 'What is the difference between `==` and `.equals()` when comparing two String objects in Java?',
    options: [
      { id: 'opt_1', text: 'They are completely identical' },
      { id: 'opt_2', text: '`==` compares memory reference addresses; `.equals()` compares actual character sequence content' },
      { id: 'opt_3', text: '`==` compares length; `.equals()` compares memory addresses' },
      { id: 'opt_4', text: '`.equals()` is only valid for numbers' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`==` checks if both references point to the exact same object in memory; `.equals()` compares value content.'
  },
  {
    id: 'java-q18',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'intermediate',
    question: 'What does the try-with-resources statement do in Java 7+?',
    options: [
      { id: 'opt_1', text: 'Automatically catches all unchecked runtime exceptions' },
      { id: 'opt_2', text: 'Ensures that any resource implementing AutoCloseable is automatically closed at the end of the block' },
      { id: 'opt_3', text: 'Prevents out-of-memory errors on large collections' },
      { id: 'opt_4', text: 'Retries failed network calls up to 3 times' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'try-with-resources guarantees automatic invocation of close() on declared resources even if exceptions occur.'
  },
  {
    id: 'java-q19',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'intermediate',
    question: 'What is the contract between equals() and hashCode() in Java?',
    options: [
      { id: 'opt_1', text: 'If two objects have equal hash codes, they must be equal according to equals()' },
      { id: 'opt_2', text: 'If two objects are equal according to equals(), they must produce the same hashCode() value' },
      { id: 'opt_3', text: 'Objects with distinct hash codes must be equal' },
      { id: 'opt_4', text: 'hashCode() must return prime numbers only' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Violating this contract breaks hashing collections like HashMap and HashSet, causing duplicate entries and retrieval failures.'
  },
  {
    id: 'java-q20',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'intermediate',
    question: 'What is the difference between an Abstract Class and an Interface in modern Java (Java 8+)?',
    options: [
      { id: 'opt_1', text: 'Interfaces cannot have any method bodies whatsoever' },
      { id: 'opt_2', text: 'A class can implement multiple interfaces but extend only one class; abstract classes can have constructors and instance state' },
      { id: 'opt_3', text: 'Interfaces cannot contain static methods' },
      { id: 'opt_4', text: 'Abstract classes can be instantiated using new' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'While Java 8 introduced default/static methods in interfaces, interfaces still cannot hold non-static instance state, whereas abstract classes can.'
  },
  {
    id: 'java-q21',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'advanced',
    question: 'What is "Type Erasure" in Java Generics?',
    options: [
      { id: 'opt_1', text: 'Automatic deletion of unused class files by the compiler' },
      { id: 'opt_2', text: 'The compiler removes all generic type parameters during compilation, replacing them with bounds or Object in the bytecode for backward compatibility' },
      { id: 'opt_3', text: 'Garbage collecting untyped heap objects' },
      { id: 'opt_4', text: 'Casting primitives to their wrapper types' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Type erasure means generic types (like List<String>) exist only at compile time; at runtime, the JVM sees raw types (List) with inserted casts.'
  },
  {
    id: 'java-q22',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'advanced',
    question: 'What does the `volatile` keyword guarantee in Java multi-threading?',
    options: [
      { id: 'opt_1', text: 'Atomicity of compound operations like count++' },
      { id: 'opt_2', text: 'Memory visibility across threads (reads/writes bypass CPU caches directly to main memory) and prevents instruction reordering' },
      { id: 'opt_3', text: 'Mutual exclusion equivalent to synchronized blocks' },
      { id: 'opt_4', text: 'Deadlock immunity' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`volatile` establishes a happens-before relationship, guaranteeing updates made by one thread are immediately visible to others without locking.'
  },
  {
    id: 'java-q23',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'advanced',
    question: 'In Java JVM memory architecture, where are object instances allocated vs local primitive variables?',
    options: [
      { id: 'opt_1', text: 'Objects on Stack, primitives on Heap' },
      { id: 'opt_2', text: 'Objects on Heap, local primitive variables on Stack frames' },
      { id: 'opt_3', text: 'Both always on Metaspace' },
      { id: 'opt_4', text: 'Primitives on registers only' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'All Java objects live in the shared Heap memory managed by the Garbage Collector; method stack frames hold local variables and pointers.'
  },
  {
    id: 'java-q24',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'advanced',
    question: 'What is the purpose of the `ForkJoinPool` in the Java concurrency framework?',
    options: [
      { id: 'opt_1', text: 'Connecting to distributed relational databases' },
      { id: 'opt_2', text: 'Executing recursive divide-and-conquer tasks using a work-stealing algorithm across worker threads' },
      { id: 'opt_3', text: 'Managing HTTP socket requests in Tomcat' },
      { id: 'opt_4', text: 'Serializing JSON streams' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'ForkJoinPool uses work-stealing queues so idle threads steal subtasks from busy worker deques, backing Java parallel streams.'
  },
  {
    id: 'java-q25',
    skillId: 'java',
    skillName: 'Java',
    difficulty: 'advanced',
    question: 'What is the difference between G1 GC and ZGC in modern Java?',
    options: [
      { id: 'opt_1', text: 'G1 GC is for Android, ZGC is for iOS' },
      { id: 'opt_2', text: 'ZGC is a low-latency concurrent garbage collector with sub-millisecond pause times regardless of heap size, whereas G1 divides heap into regions with target pause times' },
      { id: 'opt_3', text: 'G1 stops the world for minutes while ZGC does not use memory' },
      { id: 'opt_4', text: 'ZGC requires hardware GPUs' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'ZGC performs virtually all GC phases (marking, relocation) concurrently using colored pointers and load barriers, targeting pauses < 1ms.'
  }
];

const htmlcssQuestions = [
  {
    id: 'hc-q11',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'basic',
    question: 'Which HTML5 tag represents the primary navigation links of a website?',
    options: [
      { id: 'opt_1', text: '<navigate>' },
      { id: 'opt_2', text: '<nav>' },
      { id: 'opt_3', text: '<menu>' },
      { id: 'opt_4', text: '<header-nav>' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The semantic HTML5 <nav> element designates a section intended for site or page navigation links.'
  },
  {
    id: 'hc-q12',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'basic',
    question: 'What does the CSS property `box-sizing: border-box` do?',
    options: [
      { id: 'opt_1', text: 'Adds a thick border around all containers' },
      { id: 'opt_2', text: 'Includes padding and border within the element\'s declared width and height' },
      { id: 'opt_3', text: 'Centers the element inside its parent' },
      { id: 'opt_4', text: 'Hides overflowing content' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`border-box` calculates width/height inclusive of padding and borders, avoiding unexpected layout overflows.'
  },
  {
    id: 'hc-q13',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'basic',
    question: 'Which CSS unit is relative to the font-size of the root `<html>` element?',
    options: [
      { id: 'opt_1', text: 'em' },
      { id: 'opt_2', text: 'rem' },
      { id: 'opt_3', text: 'vh' },
      { id: 'opt_4', text: 'px' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`rem` stands for "root em" and scales relative to the root html element\'s font-size, unlike `em` which scales relative to immediate parent font-size.'
  },
  {
    id: 'hc-q14',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'basic',
    question: 'What is the default display value of a `<div>` element vs a `<span>` element?',
    options: [
      { id: 'opt_1', text: 'inline for div, block for span' },
      { id: 'opt_2', text: 'block for div, inline for span' },
      { id: 'opt_3', text: 'flex for div, grid for span' },
      { id: 'opt_4', text: 'inline-block for both' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`div` is a block-level container taking 100% width of parent; `span` is an inline text container occupying only its content width.'
  },
  {
    id: 'hc-q15',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'basic',
    question: 'Which HTML attribute provides alternative text for images when they fail to load?',
    options: [
      { id: 'opt_1', text: 'title' },
      { id: 'opt_2', text: 'alt' },
      { id: 'opt_3', text: 'caption' },
      { id: 'opt_4', text: 'src-fallback' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The `alt` attribute specifies accessibility descriptions for screen readers and fallbacks if images fail to load.'
  },
  {
    id: 'hc-q16',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'intermediate',
    question: 'What is CSS margin collapsing?',
    options: [
      { id: 'opt_1', text: 'Margins turning into padding automatically on mobile screens' },
      { id: 'opt_2', text: 'When adjoining top and bottom margins of block elements collapse into a single margin equal to the largest one' },
      { id: 'opt_3', text: 'When negative margins cancel out positive borders' },
      { id: 'opt_4', text: 'When margin values are ignored by flex containers' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Top and bottom vertical margins between sibling block elements combine into the maximum of the two rather than summing.'
  },
  {
    id: 'hc-q17',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'intermediate',
    question: 'How is CSS selector specificity calculated?',
    options: [
      { id: 'opt_1', text: 'By the total character length of the selector string' },
      { id: 'opt_2', text: 'By a hierarchy: Inline styles > ID selectors > Class/Attribute/Pseudo-class > Element/Pseudo-element' },
      { id: 'opt_3', text: 'Whichever rule was written latest in the CSS file always wins' },
      { id: 'opt_4', text: 'Alphabetical order of tag names' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'CSS specificity ranks weights across inline (1,0,0,0), IDs (0,1,0,0), classes/pseudo-classes (0,0,1,0), and tags (0,0,0,1).'
  },
  {
    id: 'hc-q18',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'intermediate',
    question: 'What is the primary difference between CSS Grid and CSS Flexbox?',
    options: [
      { id: 'opt_1', text: 'Grid is obsolete and replaced by Flexbox' },
      { id: 'opt_2', text: 'Flexbox is primarily 1-dimensional (row OR column), whereas Grid is 2-dimensional (rows AND columns simultaneously)' },
      { id: 'opt_3', text: 'Flexbox cannot center items vertically' },
      { id: 'opt_4', text: 'Grid only works with fixed pixel units' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Flexbox distributes elements along a single main axis, whereas CSS Grid aligns elements across both rows and columns.'
  },
  {
    id: 'hc-q19',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'intermediate',
    question: 'How does `position: sticky` behave in CSS?',
    options: [
      { id: 'opt_1', text: 'It fixes the element relative to the viewport at all times' },
      { id: 'opt_2', text: 'Treated as relative until the viewport crosses a scroll threshold, then sticks like fixed within its parent container' },
      { id: 'opt_3', text: 'Prevents the element from being dragged by user cursor' },
      { id: 'opt_4', text: 'Sticks the element to the bottom edge of the document' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`position: sticky` toggles between relative and fixed positioning depending on user scroll position and parent bounding box.'
  },
  {
    id: 'hc-q20',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'intermediate',
    question: 'What does the CSS pseudo-class `:nth-child(2n+1)` match?',
    options: [
      { id: 'opt_1', text: 'Even numbered children' },
      { id: 'opt_2', text: 'Odd numbered children (1st, 3rd, 5th, etc.)' },
      { id: 'opt_3', text: 'The second child only' },
      { id: 'opt_4', text: 'Every child after the second' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'For n=0, 2(0)+1 = 1; for n=1, 2(1)+1 = 3; which targets all odd child elements.'
  },
  {
    id: 'hc-q21',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'advanced',
    question: 'What triggers a new Stacking Context in CSS?',
    options: [
      { id: 'opt_1', text: 'Any element with `float: left`' },
      { id: 'opt_2', text: 'Root element, positioned element with non-auto z-index, opacity < 1, transform, filter, or will-change properties' },
      { id: 'opt_3', text: 'Adding an id attribute to a div' },
      { id: 'opt_4', text: 'Any table row or table header' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Stacking contexts confine z-index values so child z-indices cannot escape or interleave with external elements outside their context.'
  },
  {
    id: 'hc-q22',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'advanced',
    question: 'What is the performance advantage of animating `transform` and `opacity` over `top` and `left` in CSS?',
    options: [
      { id: 'opt_1', text: 'There is no performance difference in modern browsers' },
      { id: 'opt_2', text: '`transform` and `opacity` can be handled entirely by the GPU compositor thread without triggering layout reflow or repaint' },
      { id: 'opt_3', text: '`top` and `left` are not supported in Safari' },
      { id: 'opt_4', text: '`transform` automatically pauses background tabs' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Modifying geometry (top/left/width) forces expensive browser Reflow (layout) and Repaint; transform/opacity only triggers Composite on the GPU.'
  },
  {
    id: 'hc-q23',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'advanced',
    question: 'What is the purpose of the CSS `contain` property (`contain: content / strict / layout`)?',
    options: [
      { id: 'opt_1', text: 'To encrypt DOM nodes against web scraping' },
      { id: 'opt_2', text: 'To isolate a subtree from the rest of the page so browser recalculations of layout, style, and paint don\'t propagate globally' },
      { id: 'opt_3', text: 'To limit database queries from HTML' },
      { id: 'opt_4', text: 'To enforce strict HTML doctype validation' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'CSS containment isolates component DOM subtrees, enabling browser rendering engines to optimize rendering and skip offscreen subtrees.'
  },
  {
    id: 'hc-q24',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'advanced',
    question: 'How do CSS Custom Properties (`--var-name`) differ from SASS/SCSS variables (`$var`)?',
    options: [
      { id: 'opt_1', text: 'They are identical' },
      { id: 'opt_2', text: 'CSS Custom Properties live in the DOM, cascade down elements, and can be read or modified dynamically at runtime with JavaScript' },
      { id: 'opt_3', text: 'SASS variables can be accessed in browser devtools' },
      { id: 'opt_4', text: 'CSS Custom Properties require a Ruby precompiler' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'SASS variables are statically compiled away before reaching the browser, whereas CSS variables participate in runtime DOM cascading and theming.'
  },
  {
    id: 'hc-q25',
    skillId: 'htmlcss',
    skillName: 'HTML & CSS',
    difficulty: 'advanced',
    question: 'What is the purpose of the `subgrid` value in CSS Grid Level 2?',
    options: [
      { id: 'opt_1', text: 'Creates nested responsive SVG coordinates' },
      { id: 'opt_2', text: 'Allows a nested grid item to inherit track sizes and alignment lines directly from its parent grid container' },
      { id: 'opt_3', text: 'Enables WebGL rendering in CSS' },
      { id: 'opt_4', text: 'Duplicates column lines across multiple media queries' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`subgrid` allows child grid elements to align their own contents directly with the columns and rows defined in the ancestor grid.'
  }
];

const reactQuestions = [
  {
    id: 'react-q11',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'basic',
    question: 'What is JSX in React development?',
    options: [
      { id: 'opt_1', text: 'A JSON database format' },
      { id: 'opt_2', text: 'A syntax extension for JavaScript that allows writing HTML-like markup inside JavaScript code' },
      { id: 'opt_3', text: 'A specialized CSS compiler' },
      { id: 'opt_4', text: 'A server framework' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'JSX compiles down to React.createElement() or jsx-runtime calls, providing a declarative syntax for UI.'
  },
  {
    id: 'react-q12',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'basic',
    question: 'Which Hook is used to maintain local reactive state inside a function component?',
    options: [
      { id: 'opt_1', text: 'useEffect' },
      { id: 'opt_2', text: 'useState' },
      { id: 'opt_3', text: 'useContext' },
      { id: 'opt_4', text: 'useRef' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`useState` returns a stateful value and a dispatch function to update it.'
  },
  {
    id: 'react-q13',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'basic',
    question: 'Why should list items in React always have a unique `key` prop?',
    options: [
      { id: 'opt_1', text: 'To apply CSS styling to each item' },
      { id: 'opt_2', text: 'To help React identify which items have changed, been added, or removed during virtual DOM reconciliation' },
      { id: 'opt_3', text: 'To encrypt list items for privacy' },
      { id: 'opt_4', text: 'Keys are mandatory only in TypeScript' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Keys give elements stable identities, avoiding unnecessary DOM re-creations and preserving internal component state across renders.'
  },
  {
    id: 'react-q14',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'basic',
    question: 'How are props passed from parent components to child components in React?',
    options: [
      { id: 'opt_1', text: 'Via two-way data binding sockets' },
      { id: 'opt_2', text: 'As read-only attributes on the JSX tag (unidirectional data flow)' },
      { id: 'opt_3', text: 'Through global window variables' },
      { id: 'opt_4', text: 'By mutating child component fields directly' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'React follows a strict top-down (unidirectional) data flow where props are immutable inputs passed down the hierarchy.'
  },
  {
    id: 'react-q15',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'basic',
    question: 'What hook should be used to interact directly with a DOM node without triggering re-renders?',
    options: [
      { id: 'opt_1', text: 'useMemo' },
      { id: 'opt_2', text: 'useRef' },
      { id: 'opt_3', text: 'useCallback' },
      { id: 'opt_4', text: 'useLayout' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'useRef returns a mutable ref object whose `.current` property persists for the component lifetime without causing re-renders.'
  },
  {
    id: 'react-q16',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'intermediate',
    question: 'When does a `useEffect` cleanup function execute?',
    options: [
      { id: 'opt_1', text: 'Only when the browser window is closed' },
      { id: 'opt_2', text: 'Before the component unmounts and before re-running the effect with new dependencies' },
      { id: 'opt_3', text: 'After every state change regardless of dependencies' },
      { id: 'opt_4', text: 'Only when an uncaught error occurs' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Cleanups run before unmounting and prior to re-executing the effect, preventing memory leaks, duplicate subscriptions, or stale timers.'
  },
  {
    id: 'react-q17',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'intermediate',
    question: 'What is the primary difference between `useMemo` and `useCallback` in React?',
    options: [
      { id: 'opt_1', text: 'useMemo is for class components; useCallback is for functional components' },
      { id: 'opt_2', text: '`useMemo` caches the result of a calculated value; `useCallback` caches a function definition instance' },
      { id: 'opt_3', text: 'useCallback triggers HTTP calls while useMemo cannot' },
      { id: 'opt_4', text: 'They are aliases with no behavioral difference' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`useMemo(() => computeValue(a, b), [a, b])` memoizes the computed value, while `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.'
  },
  {
    id: 'react-q18',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'intermediate',
    question: 'How does React 18 automatic batching work for state updates?',
    options: [
      { id: 'opt_1', text: 'It groups multiple setState calls into a single re-render, even inside promises, setTimeout, and native event handlers' },
      { id: 'opt_2', text: 'It prevents components from rendering more than once per hour' },
      { id: 'opt_3', text: 'It automatically saves form fields to localStorage' },
      { id: 'opt_4', text: 'It executes state updates on a background Web Worker thread' }
    ],
    correctOptionId: 'opt_1',
    explanation: 'React 18 extends automatic batching beyond React event handlers into fetch promises, timeouts, and native listeners, avoiding unnecessary render cycles.'
  },
  {
    id: 'react-q19',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'intermediate',
    question: 'What is the pitfall of passing an inline object literal or inline arrow function to a memoized child component?',
    options: [
      { id: 'opt_1', text: 'It causes a syntax error' },
      { id: 'opt_2', text: 'A new object/function reference is created on every render, defeating React.memo and forcing child re-renders' },
      { id: 'opt_3', text: 'It causes infinite loops in React' },
      { id: 'opt_4', text: 'Inline objects are stripped by Webpack' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'JavaScript objects/functions are compared by reference. New references on each parent render break shallow equality checks in React.memo.'
  },
  {
    id: 'react-q20',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'intermediate',
    question: 'What does `useReducer` provide compared to `useState`?',
    options: [
      { id: 'opt_1', text: 'Automatic Redux store integration' },
      { id: 'opt_2', text: 'A structured way to manage complex state transitions via action dispatches and pure reducer functions' },
      { id: 'opt_3', text: 'Persistent cloud storage for state variables' },
      { id: 'opt_4', text: 'Faster DOM painting' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`useReducer` is best suited for complex state logic with interdependent sub-values or predictable action-based transitions.'
  },
  {
    id: 'react-q21',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'advanced',
    question: 'What is the React Fiber architecture and what problem does it solve?',
    options: [
      { id: 'opt_1', text: 'A CSS-in-JS library for fiber optic animations' },
      { id: 'opt_2', text: 'A complete reimplementation of React\'s reconciliation engine that allows rendering work to be split into chunks, paused, aborted, or prioritized' },
      { id: 'opt_3', text: 'A backend Node.js thread pool library' },
      { id: 'opt_4', text: 'A replacement for Redux Thunk' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Fiber replaces recursive call stack reconciliation with a virtual stack of fiber nodes, enabling concurrent features (interruptible renders, suspense).'
  },
  {
    id: 'react-q22',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'advanced',
    question: 'What is the difference between `useLayoutEffect` and `useEffect`?',
    options: [
      { id: 'opt_1', text: 'useLayoutEffect runs on the server; useEffect runs on the client' },
      { id: 'opt_2', text: 'useLayoutEffect fires synchronously immediately after DOM mutations but before the browser paints; useEffect runs asynchronously after paint' },
      { id: 'opt_3', text: 'useEffect cannot accept dependencies' },
      { id: 'opt_4', text: 'useLayoutEffect is deprecated in React 18' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`useLayoutEffect` runs synchronously before paint, ideal for measuring DOM dimensions and preventing visual layout flickers.'
  },
  {
    id: 'react-q23',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'advanced',
    question: 'How does React Server Components (RSC) differ from traditional SSR (Server-Side Rendering)?',
    options: [
      { id: 'opt_1', text: 'RSC runs in browser Service Workers' },
      { id: 'opt_2', text: 'RSC execute exclusively on the server, have zero client bundle impact, and stream a serialized component tree without hydration overhead' },
      { id: 'opt_3', text: 'SSR renders JSON, while RSC only renders PDF documents' },
      { id: 'opt_4', text: 'RSC requires PHP on the server' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Traditional SSR ships HTML + full JS bundles for client hydration. RSC ships zero JS to the client for server-only components.'
  },
  {
    id: 'react-q24',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'advanced',
    question: 'What is the purpose of `useTransition` in React 18+?',
    options: [
      { id: 'opt_1', text: 'Configuring CSS page transitions' },
      { id: 'opt_2', text: 'Marking state updates as non-urgent transitions so urgent user inputs (typing, clicking) remain responsive and uninterrupted' },
      { id: 'opt_3', text: 'Managing transitions between React and Angular' },
      { id: 'opt_4', text: 'Handling WebSockets reconnection cycles' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'useTransition enables concurrent rendering by letting React yield execution to higher-priority user inputs during heavy background state updates.'
  },
  {
    id: 'react-q25',
    skillId: 'react',
    skillName: 'React',
    difficulty: 'advanced',
    question: 'What causes Context re-render performance issues and how do you mitigate them?',
    options: [
      { id: 'opt_1', text: 'Context causes CPU spikes because it uses Web Workers' },
      { id: 'opt_2', text: 'All consumers of a Context re-render whenever the context value changes; mitigated by splitting contexts or memoizing consumer subtrees' },
      { id: 'opt_3', text: 'Context cannot pass functions' },
      { id: 'opt_4', text: 'Context values cannot be stored in Redux' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Any update to a context provider value forces all subscribers to re-render. Splitting high-frequency data from static data resolves unnecessary re-renders.'
  }
];

const nodeQuestions = [
  {
    id: 'node-q11',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'basic',
    question: 'What is the primary global object representing the current running process in Node.js?',
    options: [
      { id: 'opt_1', text: 'window' },
      { id: 'opt_2', text: 'process' },
      { id: 'opt_3', text: 'system' },
      { id: 'opt_4', text: 'globalThis.runtime' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The `process` object is a global providing information about and control over the current Node.js runtime process (env, argv, exit, etc.).'
  },
  {
    id: 'node-q12',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'basic',
    question: 'Which built-in module provides utilities for handling file and directory paths in Node.js?',
    options: [
      { id: 'opt_1', text: 'fs' },
      { id: 'opt_2', text: 'path' },
      { id: 'opt_3', text: 'url' },
      { id: 'opt_4', text: 'os' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The `path` module offers platform-independent methods like path.join(), path.resolve(), and path.extname().'
  },
  {
    id: 'node-q13',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'basic',
    question: 'What is the difference between `fs.readFile` and `fs.readFileSync` in Node.js?',
    options: [
      { id: 'opt_1', text: 'fs.readFile returns JSON; fs.readFileSync returns binary' },
      { id: 'opt_2', text: '`fs.readFile` is asynchronous and non-blocking; `fs.readFileSync` blocks the entire event loop until disk I/O completes' },
      { id: 'opt_3', text: 'readFileSync is faster under high concurrency' },
      { id: 'opt_4', text: 'readFile is only available in browser environments' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Sync methods block the single event thread, halting all other requests, while asynchronous methods delegate disk reading to the libuv thread pool.'
  },
  {
    id: 'node-q14',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'basic',
    question: 'What file defines project metadata, scripts, and package dependencies in Node.js?',
    options: [
      { id: 'opt_1', text: 'config.json' },
      { id: 'opt_2', text: 'package.json' },
      { id: 'opt_3', text: 'node.xml' },
      { id: 'opt_4', text: 'index.json' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`package.json` is the manifest file of any Node.js project or npm package.'
  },
  {
    id: 'node-q15',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'basic',
    question: 'How do you read environment variables in a Node.js application?',
    options: [
      { id: 'opt_1', text: 'process.env.VARIABLE_NAME' },
      { id: 'opt_2', text: 'system.getEnv("VARIABLE_NAME")' },
      { id: 'opt_3', text: 'env.VARIABLE_NAME' },
      { id: 'opt_4', text: 'global.env["VARIABLE_NAME"]' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`process.env` stores key-value pairs representing user environment variables.'
  },
  {
    id: 'node-q16',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'intermediate',
    question: 'What is the role of `libuv` in Node.js?',
    options: [
      { id: 'opt_1', text: 'A CSS rendering engine' },
      { id: 'opt_2', text: 'A C library that provides the event loop, cross-platform asynchronous I/O, file system operations, and a worker thread pool' },
      { id: 'opt_3', text: 'A parser for JavaScript syntax' },
      { id: 'opt_4', text: 'The default database driver in Node' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'libuv provides Node.js with its cross-platform asynchronous event loop abstraction and thread pool for non-blocking I/O.'
  },
  {
    id: 'node-q17',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'intermediate',
    question: 'What is the difference between `process.nextTick()` and `setImmediate()` in Node.js?',
    options: [
      { id: 'opt_1', text: 'They are completely identical' },
      { id: 'opt_2', text: '`process.nextTick()` executes immediately after the current operation before the event loop continues; `setImmediate()` queues a callback in the Check phase of the event loop' },
      { id: 'opt_3', text: 'setImmediate runs before any microtasks' },
      { id: 'opt_4', text: 'process.nextTick is only available in clusters' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'nextTick queue is processed after each phase and before microtasks; setImmediate executes on the check phase of the libuv event loop.'
  },
  {
    id: 'node-q18',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'intermediate',
    question: 'Why are Streams preferred over buffering entire files into memory in Node.js?',
    options: [
      { id: 'opt_1', text: 'Streams automatically compress all data using gzip' },
      { id: 'opt_2', text: 'Streams process data piece-by-piece (chunks) without loading the entire payload into RAM, preventing memory exhaustion' },
      { id: 'opt_3', text: 'Streams bypass TCP sockets' },
      { id: 'opt_4', text: 'Streams cannot be used with HTTP' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Streams allow processing massive multi-gigabyte files with low, predictable memory footprints using backpressure mechanisms.'
  },
  {
    id: 'node-q19',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'intermediate',
    question: 'What is the difference between CommonJS and ES Modules (ESM) in Node.js?',
    options: [
      { id: 'opt_1', text: 'CommonJS uses `require()` and `module.exports` synchronously; ESM uses `import`/`export` with static asynchronous module analysis' },
      { id: 'opt_2', text: 'CommonJS only runs in browsers' },
      { id: 'opt_3', text: 'ESM does not support objects or functions' },
      { id: 'opt_4', text: 'CommonJS has been removed from Node.js 18' }
    ],
    correctOptionId: 'opt_1',
    explanation: 'CommonJS loads modules synchronously on demand via require(); ESM parses dependencies statically before execution and supports top-level await.'
  },
  {
    id: 'node-q20',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'intermediate',
    question: 'What happens when an unhandled Promise rejection occurs in modern Node.js?',
    options: [
      { id: 'opt_1', text: 'It is silently ignored' },
      { id: 'opt_2', text: 'The Node.js process terminates immediately with a non-zero exit code (status 1)' },
      { id: 'opt_3', text: 'The promise is automatically retried 3 times' },
      { id: 'opt_4', text: 'It converts into an HTTP 500 error response automatically' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Since Node.js v15, unhandled rejections trigger unhandledRejection and crash the process by default with a non-zero exit code.'
  },
  {
    id: 'node-q21',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'advanced',
    question: 'What are the 6 phases of the Node.js Event Loop in order of execution?',
    options: [
      { id: 'opt_1', text: 'Start -> Run -> Compute -> Wait -> Stop -> Exit' },
      { id: 'opt_2', text: 'Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check -> Close Callbacks' },
      { id: 'opt_3', text: 'Microtasks -> Macrotasks -> Promises -> Events -> Sockets -> Finish' },
      { id: 'opt_4', text: 'Fetch -> Parse -> Compile -> Link -> Execute -> Cleanup' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The libuv event loop iterates through Timers, Pending I/O callbacks, Idle/Prepare, Poll (incoming I/O), Check (setImmediate), and Close callbacks.'
  },
  {
    id: 'node-q22',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'advanced',
    question: 'What is the purpose of the `worker_threads` module in Node.js?',
    options: [
      { id: 'opt_1', text: 'Running multiple Node.js HTTP servers on distinct ports' },
      { id: 'opt_2', text: 'Executing CPU-intensive JavaScript tasks concurrently on separate system threads sharing memory via SharedArrayBuffer' },
      { id: 'opt_3', text: 'Managing Redis task queues' },
      { id: 'opt_4', text: 'Replacing async/await with thread sleeps' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`worker_threads` enables actual multithreaded CPU-bound computation without blocking the main event loop, overcoming single-thread bottlenecks.'
  },
  {
    id: 'node-q23',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'advanced',
    question: 'How does backpressure work in Node.js Streams?',
    options: [
      { id: 'opt_1', text: 'It compresses packets when network bandwidth drops' },
      { id: 'opt_2', text: 'When a writable stream\'s internal buffer is full (`stream.write()` returns false), the readable stream pauses until a \'drain\' event is emitted' },
      { id: 'opt_3', text: 'It reverses the data flow back to the sender' },
      { id: 'opt_4', text: 'It discards dropped packets' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Backpressure prevents fast producers from overwhelming slow consumers by halting read streams until write buffers flush.'
  },
  {
    id: 'node-q24',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'advanced',
    question: 'What is the difference between `child_process.fork()` and `child_process.spawn()`?',
    options: [
      { id: 'opt_1', text: 'spawn can only run Node scripts, fork runs bash' },
      { id: 'opt_2', text: 'fork() is a special case of spawn() specifically designed for spawning new Node.js V8 processes with a built-in IPC communication channel' },
      { id: 'opt_3', text: 'fork() creates threads, spawn creates processes' },
      { id: 'opt_4', text: 'There is no difference' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`child_process.fork()` establishes an Inter-Process Communication (IPC) channel (process.send / process.on) to exchange serialized messages.'
  },
  {
    id: 'node-q25',
    skillId: 'node',
    skillName: 'Node.js',
    difficulty: 'advanced',
    question: 'What is a memory leak commonly caused by in Node.js servers?',
    options: [
      { id: 'opt_1', text: 'Using const instead of var' },
      { id: 'opt_2', text: 'Unclosed event listeners on global EventEmitters, uncleared intervals, or unbounded in-memory caches/closures' },
      { id: 'opt_3', text: 'Overuse of async/await' },
      { id: 'opt_4', text: 'Using JSON.stringify on arrays' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Retaining references in global objects, listener arrays, or long-lived closures prevents the V8 garbage collector from reclaiming heap memory.'
  }
];

const dataanalyticsQuestions = [
  {
    id: 'da-q11',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'basic',
    question: 'Which pandas method displays the first 5 rows of a DataFrame?',
    options: [
      { id: 'opt_1', text: 'df.first(5)' },
      { id: 'opt_2', text: 'df.head()' },
      { id: 'opt_3', text: 'df.show(5)' },
      { id: 'opt_4', text: 'df.top()' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`df.head(n=5)` returns the first n rows of a pandas DataFrame or Series.'
  },
  {
    id: 'da-q12',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'basic',
    question: 'What measure of central tendency represents the middle value of an ordered dataset?',
    options: [
      { id: 'opt_1', text: 'Mean' },
      { id: 'opt_2', text: 'Median' },
      { id: 'opt_3', text: 'Mode' },
      { id: 'opt_4', text: 'Standard Deviation' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The median divides an ordered dataset into two equal halves and is resistant to extreme outliers.'
  },
  {
    id: 'da-q13',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'basic',
    question: 'Which chart type is best suited to display the distribution and spread of continuous numeric data?',
    options: [
      { id: 'opt_1', text: 'Pie chart' },
      { id: 'opt_2', text: 'Histogram or Box Plot' },
      { id: 'opt_3', text: 'Scatter plot only' },
      { id: 'opt_4', text: 'Radar chart' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Histograms group continuous values into bins to show frequency distribution, while box plots show quartiles and outliers.'
  },
  {
    id: 'da-q14',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'basic',
    question: 'What does the pandas `df.dropna()` method do by default?',
    options: [
      { id: 'opt_1', text: 'Replaces missing values with zero' },
      { id: 'opt_2', text: 'Drops rows containing any null or NaN values' },
      { id: 'opt_3', text: 'Drops duplicate records' },
      { id: 'opt_4', text: 'Deletes empty columns only' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`df.dropna(axis=0, how=\'any\')` drops all rows that contain at least one null (NaN) entry.'
  },
  {
    id: 'da-q15',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'basic',
    question: 'What is the range of values for Pearson\'s correlation coefficient (r)?',
    options: [
      { id: 'opt_1', text: '0 to 1' },
      { id: 'opt_2', text: '-1 to +1' },
      { id: 'opt_3', text: '-100 to +100' },
      { id: 'opt_4', text: '0 to infinity' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Pearson\'s r ranges from -1 (perfect negative linear correlation) to +1 (perfect positive correlation), with 0 meaning no linear relationship.'
  },
  {
    id: 'da-q16',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'intermediate',
    question: 'What is the difference between `loc` and `iloc` in pandas?',
    options: [
      { id: 'opt_1', text: 'They are completely interchangeable' },
      { id: 'opt_2', text: '`loc` selects rows and columns by labels/names; `iloc` selects by integer zero-based index positions' },
      { id: 'opt_3', text: '`iloc` only works on strings' },
      { id: 'opt_4', text: '`loc` only accesses column headers' }
    ],
    correctOptionId: 'opt_2',
    explanation: '`df.loc[\'row_label\', \'col_label\']` is label-based indexing, whereas `df.iloc[0, 1]` is strict integer positional indexing.'
  },
  {
    id: 'da-q17',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'intermediate',
    question: 'What does Simpson\'s Paradox demonstrate in statistical analysis?',
    options: [
      { id: 'opt_1', text: 'That sample variance is always greater than population variance' },
      { id: 'opt_2', text: 'A trend or correlation visible in several groups reverses or vanishes when the groups are combined' },
      { id: 'opt_3', text: 'That mean and median are always identical in large datasets' },
      { id: 'opt_4', text: 'That p-values decrease with lower confidence intervals' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Simpson\'s Paradox occurs when confounding variables alter aggregated group relationships, underscoring the importance of stratified analysis.'
  },
  {
    id: 'da-q18',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'intermediate',
    question: 'When should you use One-Hot Encoding versus Label Encoding for categorical features?',
    options: [
      { id: 'opt_1', text: 'One-Hot Encoding for nominal variables without intrinsic order; Label Encoding for ordinal variables with clear ranking' },
      { id: 'opt_2', text: 'Label Encoding for high-dimensional text only' },
      { id: 'opt_3', text: 'One-Hot Encoding should never be used' },
      { id: 'opt_4', text: 'Always use Label Encoding regardless of category nature' }
    ],
    correctOptionId: 'opt_1',
    explanation: 'Assigning integers (0, 1, 2) to unordered nominal data (e.g. Red, Blue, Green) inadvertently introduces false numeric hierarchy that biases models.'
  },
  {
    id: 'da-q19',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'intermediate',
    question: 'What does the Interquartile Range (IQR) method define as outliers?',
    options: [
      { id: 'opt_1', text: 'Values exceeding the mean by 1 standard deviation' },
      { id: 'opt_2', text: 'Values located below Q1 - 1.5 * IQR or above Q3 + 1.5 * IQR' },
      { id: 'opt_3', text: 'Values with negative signs' },
      { id: 'opt_4', text: 'The highest 10% of all values' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Tukey\'s fences define outliers as data points lying outside 1.5 times the IQR (Q3 - Q1) from the first and third quartiles.'
  },
  {
    id: 'da-q20',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'intermediate',
    question: 'What is the difference between Min-Max Normalization and Z-score Standardization?',
    options: [
      { id: 'opt_1', text: 'Standardization rescales values between 0 and 1' },
      { id: 'opt_2', text: 'Min-Max scales data to a fixed [0, 1] range; Z-score centers data around mean 0 with standard deviation 1' },
      { id: 'opt_3', text: 'They are mathematical synonyms' },
      { id: 'opt_4', text: 'Z-score requires categorical input' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Min-Max scales to [0, 1] sensitive to outliers; Z-score transformation `(x - μ)/σ` handles normally distributed data with outliers better.'
  },
  {
    id: 'da-q21',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'advanced',
    question: 'What is a p-value in statistical hypothesis testing?',
    options: [
      { id: 'opt_1', text: 'The probability that the null hypothesis is true' },
      { id: 'opt_2', text: 'The probability of observing test results at least as extreme as the observed data, assuming the null hypothesis is true' },
      { id: 'opt_3', text: 'The percentage of errors in the dataset' },
      { id: 'opt_4', text: 'The probability that the alternative hypothesis is false' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'A p-value quantifies evidence against the null hypothesis under the assumption of that null hypothesis.'
  },
  {
    id: 'da-q22',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'advanced',
    question: 'What problem does Vectorization solve in NumPy and pandas compared to Python for-loops?',
    options: [
      { id: 'opt_1', text: 'Reduces disk storage space' },
      { id: 'opt_2', text: 'Executes batch operations via compiled C SIMD instructions without Python interpreter loop overhead, executing 50x-200x faster' },
      { id: 'opt_3', text: 'Automatically removes missing data' },
      { id: 'opt_4', text: 'Converts arrays to SVG vectors' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Vectorized calculations operate on contiguous C memory arrays utilizing low-level CPU vector registers, avoiding Python bytecode interpretation overhead.'
  },
  {
    id: 'da-q23',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'advanced',
    question: 'What does a Receiver Operating Characteristic (ROC) curve plot?',
    options: [
      { id: 'opt_1', text: 'Precision against Recall across classification thresholds' },
      { id: 'opt_2', text: 'True Positive Rate (Sensitivity) vs. False Positive Rate (1 - Specificity) across different decision thresholds' },
      { id: 'opt_3', text: 'Training error vs validation error over epochs' },
      { id: 'opt_4', text: 'Cost vs iteration count' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'ROC curves illustrate trade-offs between TPR and FPR across all probability classification thresholds; the area under curve (AUC) evaluates model discrimination.'
  },
  {
    id: 'da-q24',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'advanced',
    question: 'What is the Central Limit Theorem (CLT)?',
    options: [
      { id: 'opt_1', text: 'Every population distribution is Gaussian' },
      { id: 'opt_2', text: 'The sampling distribution of the sample mean approaches a normal distribution as sample size increases (n >= 30), regardless of the underlying population distribution shape' },
      { id: 'opt_3', text: 'The mean equals the median in all datasets' },
      { id: 'opt_4', text: 'Outliers always cluster at the center of a distribution' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'The CLT justifies using normal hypothesis testing (Z-tests, t-tests) on sample means drawn from arbitrary distributions when sample size is sufficiently large.'
  },
  {
    id: 'da-q25',
    skillId: 'dataanalytics',
    skillName: 'Data Analytics',
    difficulty: 'advanced',
    question: 'What is the distinction between Type I and Type II statistical errors?',
    options: [
      { id: 'opt_1', text: 'Type I is calculation error; Type II is printing error' },
      { id: 'opt_2', text: 'Type I is False Positive (rejecting a true null hypothesis); Type II is False Negative (failing to reject a false null hypothesis)' },
      { id: 'opt_3', text: 'Type I is False Negative; Type II is False Positive' },
      { id: 'opt_4', text: 'Type I applies only to regressions' }
    ],
    correctOptionId: 'opt_2',
    explanation: 'Type I error rate is alpha (false alarm); Type II error rate is beta (missed detection), and (1 - beta) represents statistical power.'
  }
];

const newBank = { ...questionBank };

// Function to append or merge ensuring no duplicate IDs
function mergeQuestions(skillKey, additions) {
  const existing = newBank[skillKey] || [];
  const existingIds = new Set(existing.map(q => q.id));
  const toAdd = additions.filter(q => !existingIds.has(q.id));
  newBank[skillKey] = [...existing, ...toAdd];
}

mergeQuestions('c', cQuestions);
mergeQuestions('cpp', cppQuestions);
mergeQuestions('java', javaQuestions);
mergeQuestions('htmlcss', htmlcssQuestions);
mergeQuestions('react', reactQuestions);
mergeQuestions('node', nodeQuestions);
mergeQuestions('dataanalytics', dataanalyticsQuestions);

console.log('--- Question Bank Skill Summary ---');
for (const [skill, questions] of Object.entries(newBank)) {
  const basic = questions.filter(q => q.difficulty === 'basic').length;
  const inter = questions.filter(q => q.difficulty === 'intermediate').length;
  const adv = questions.filter(q => q.difficulty === 'advanced').length;
  console.log(`${skill}: Total ${questions.length} (Basic: ${basic}, Inter: ${inter}, Adv: ${adv})`);
}

const targetFile = path.resolve('server/data/questionBank.js');
const fileContent = `export const questionBank = ${JSON.stringify(newBank, null, 2)};\n`;
fs.writeFileSync(targetFile, fileContent, 'utf-8');
console.log('Successfully wrote expanded questionBank.js to disk!');
