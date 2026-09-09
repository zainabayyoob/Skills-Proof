export const questionBank = {
  "python": [
    {
      "id": "py-q1",
      "skillId": "python",
      "skillName": "Python",
      "question": "What is the output of this Python code regarding mutable default arguments?",
      "codeSnippet": "def append_item(val, items=[]):\n    items.append(val)\n    return items\n\nprint(append_item(1))\nprint(append_item(2))",
      "options": [
        {
          "id": "opt_1",
          "text": "[1] followed by [2]"
        },
        {
          "id": "opt_2",
          "text": "[1] followed by [1, 2]"
        },
        {
          "id": "opt_3",
          "text": "[1, 2] followed by [1, 2]"
        },
        {
          "id": "opt_4",
          "text": "TypeError: mutable default argument not permitted"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In Python, default arguments are evaluated once when the function definition is executed, meaning the same list instance is reused across invocations unless explicitly re-instantiated.",
      "difficulty": "basic"
    },
    {
      "id": "py-q2",
      "skillId": "python",
      "skillName": "Python",
      "question": "What is the primary difference between a Python generator and a regular function returning a list?",
      "options": [
        {
          "id": "opt_1",
          "text": "Generators execute in a separate operating system thread"
        },
        {
          "id": "opt_2",
          "text": "Generators yield items lazily on demand, saving memory compared to eagerly constructing an entire list in RAM"
        },
        {
          "id": "opt_3",
          "text": "Generators cannot accept arguments or maintain local state"
        },
        {
          "id": "opt_4",
          "text": "Generators automatically convert all returned values to JSON strings"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Generators use the yield keyword to produce values lazily one at a time via the iterator protocol, resulting in O(1) space complexity instead of O(N) memory allocation.",
      "difficulty": "basic"
    },
    {
      "id": "py-q3",
      "skillId": "python",
      "skillName": "Python",
      "question": "What happens in the following try-except-finally block?",
      "codeSnippet": "def calculate():\n    try:\n        return 10\n    finally:\n        return 20\n\nprint(calculate())",
      "options": [
        {
          "id": "opt_1",
          "text": "10 is printed"
        },
        {
          "id": "opt_2",
          "text": "20 is printed"
        },
        {
          "id": "opt_3",
          "text": "30 is printed"
        },
        {
          "id": "opt_4",
          "text": "SyntaxError: multiple return statements in same scope"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The finally block is guaranteed to execute before the function exits. When a return statement is encountered inside finally, it overwrites any previous return value from try or except.",
      "difficulty": "basic"
    },
    {
      "id": "py-q4",
      "skillId": "python",
      "skillName": "Python",
      "question": "What is the average time complexity of checking membership `x in s` for a Python set vs a Python list of length N?",
      "options": [
        {
          "id": "opt_1",
          "text": "Set: O(N), List: O(N)"
        },
        {
          "id": "opt_2",
          "text": "Set: O(1), List: O(N)"
        },
        {
          "id": "opt_3",
          "text": "Set: O(log N), List: O(1)"
        },
        {
          "id": "opt_4",
          "text": "Set: O(N log N), List: O(N)"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Python sets are implemented as hash tables offering average O(1) key lookup, whereas lists require linear search scanning elements sequentially with O(N) complexity.",
      "difficulty": "intermediate"
    },
    {
      "id": "py-q5",
      "skillId": "python",
      "skillName": "Python",
      "question": "In Python, what is the purpose of the `copy.deepcopy()` function compared to `copy.copy()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "deepcopy encrypts the object into byte memory"
        },
        {
          "id": "opt_2",
          "text": "copy.copy clones nested compound objects recursively, while deepcopy only copies references"
        },
        {
          "id": "opt_3",
          "text": "deepcopy recursively copies all objects found inside compound objects, preventing mutations in the clone from affecting the original"
        },
        {
          "id": "opt_4",
          "text": "deepcopy creates a C-level pointer to the original memory block"
        }
      ],
      "correctOptionId": "opt_3",
      "explanation": "A shallow copy constructs a new compound object but inserts references to the original nested objects. deepcopy recursively duplicates all child objects.",
      "difficulty": "intermediate"
    },
    {
      "id": "py-q6",
      "skillId": "python",
      "skillName": "Python",
      "question": "What role does the Global Interpreter Lock (GIL) play in CPython?",
      "options": [
        {
          "id": "opt_1",
          "text": "It prevents all multi-threaded programming in Python completely"
        },
        {
          "id": "opt_2",
          "text": "It is a mutex ensuring only one native thread executes Python bytecode at a time, protecting CPython memory management"
        },
        {
          "id": "opt_3",
          "text": "It automatically optimizes I/O bound operations by bypassing the operating system"
        },
        {
          "id": "opt_4",
          "text": "It compiles Python code directly into machine code before execution"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "CPython uses reference counting which is not thread-safe. The GIL ensures only one thread executes Python bytecode at once, meaning CPU-bound multi-threading requires multiprocessing instead.",
      "difficulty": "intermediate"
    },
    {
      "id": "py-q7",
      "skillId": "python",
      "skillName": "Python",
      "question": "Which method must a Python class implement to be usable with the `with` statement as a Context Manager?",
      "options": [
        {
          "id": "opt_1",
          "text": "__open__ and __close__"
        },
        {
          "id": "opt_2",
          "text": "__init__ and __del__"
        },
        {
          "id": "opt_3",
          "text": "__enter__ and __exit__"
        },
        {
          "id": "opt_4",
          "text": "__start__ and __stop__"
        }
      ],
      "correctOptionId": "opt_3",
      "explanation": "The context management protocol requires __enter__() for acquiring resources and __exit__() for guaranteed cleanup, handling exceptions even if errors occur.",
      "difficulty": "intermediate"
    },
    {
      "id": "py-q8",
      "skillId": "python",
      "skillName": "Python",
      "question": "What does the `@classmethod` decorator do in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "Converts a method to a static method that takes no arguments"
        },
        {
          "id": "opt_2",
          "text": "Passes the class itself (cls) as the first argument instead of the instance (self)"
        },
        {
          "id": "opt_3",
          "text": "Makes the method private and accessible only within the defining module"
        },
        {
          "id": "opt_4",
          "text": "Automatically instantiates a new class object upon invocation"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A @classmethod receives the class object as its first argument (conventionally named cls), allowing factory constructors and class-level state modifications.",
      "difficulty": "advanced"
    },
    {
      "id": "py-q9",
      "skillId": "python",
      "skillName": "Python",
      "question": "What will be the output of `bool([])`, `bool([0])`, and `bool(\"\")` in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "False, False, False"
        },
        {
          "id": "opt_2",
          "text": "False, True, False"
        },
        {
          "id": "opt_3",
          "text": "True, True, True"
        },
        {
          "id": "opt_4",
          "text": "False, True, True"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Empty containers like [] and \"\" are falsy in Python. However, [0] is a non-empty list with one element (0), making it truthy.",
      "difficulty": "advanced"
    },
    {
      "id": "py-q10",
      "skillId": "python",
      "skillName": "Python",
      "question": "What is the Method Resolution Order (MRO) algorithm used in modern Python 3 multiple inheritance?",
      "options": [
        {
          "id": "opt_1",
          "text": "Depth-First Search (DFS)"
        },
        {
          "id": "opt_2",
          "text": "C3 Linearization"
        },
        {
          "id": "opt_3",
          "text": "Breadth-First Search (BFS)"
        },
        {
          "id": "opt_4",
          "text": "Dijkstra Priority Queue"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Python uses the C3 Linearization algorithm to determine a deterministic order for resolving method calls in complex multiple inheritance hierarchies.",
      "difficulty": "advanced"
    },
    {
      "id": "py-q11",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is the output of `bool([])`, `bool([0])`, and `bool(\"\")` in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "False, False, False"
        },
        {
          "id": "opt_2",
          "text": "False, True, False"
        },
        {
          "id": "opt_3",
          "text": "True, True, True"
        },
        {
          "id": "opt_4",
          "text": "False, False, True"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In Python, empty collections ([] and \"\") evaluate to False (falsy), while non-empty collections ([0]) evaluate to True regardless of the truthiness of their contents."
    },
    {
      "id": "py-q12",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "Which method removes and returns the last item from a Python list?",
      "options": [
        {
          "id": "opt_1",
          "text": "list.delete()"
        },
        {
          "id": "opt_2",
          "text": "list.pop()"
        },
        {
          "id": "opt_3",
          "text": "list.remove()"
        },
        {
          "id": "opt_4",
          "text": "list.extract()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "list.pop() removes and returns the element at the specified index (defaulting to -1, the last element)."
    },
    {
      "id": "py-q13",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "How do you create a tuple with a single element `5` in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "(5)"
        },
        {
          "id": "opt_2",
          "text": "(5,)"
        },
        {
          "id": "opt_3",
          "text": "tuple(5)"
        },
        {
          "id": "opt_4",
          "text": "[5].to_tuple()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A trailing comma `(5,)` is required to define a single-element tuple; without the comma, `(5)` is evaluated simply as an integer expression inside parentheses."
    },
    {
      "id": "py-q14",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is the result of `\"hello\".split(\",\")`?",
      "options": [
        {
          "id": "opt_1",
          "text": "['h', 'e', 'l', 'l', 'o']"
        },
        {
          "id": "opt_2",
          "text": "['hello']"
        },
        {
          "id": "opt_3",
          "text": "ValueError: separator not found"
        },
        {
          "id": "opt_4",
          "text": "[]"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "If the delimiter is not found in the string, split() returns a list containing the original string as its sole element."
    },
    {
      "id": "py-q15",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "Which operator is used for integer floor division in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "/"
        },
        {
          "id": "opt_2",
          "text": "//"
        },
        {
          "id": "opt_3",
          "text": "%"
        },
        {
          "id": "opt_4",
          "text": "div()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `//` operator performs floor division, returning the largest integer less than or equal to the division result."
    },
    {
      "id": "py-q16",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is the difference between `copy.copy()` and `copy.deepcopy()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "copy.copy() only works on dictionaries, deepcopy works on lists"
        },
        {
          "id": "opt_2",
          "text": "copy.copy() creates a shallow copy copying top-level references, whereas deepcopy recursively clones all nested objects"
        },
        {
          "id": "opt_3",
          "text": "copy.copy() is faster because it saves data to disk"
        },
        {
          "id": "opt_4",
          "text": "There is no difference in modern Python 3.10+"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A shallow copy constructs a new compound object and inserts references to the original objects; a deep copy recursively copies all nested objects."
    },
    {
      "id": "py-q17",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is the purpose of `@property` decorator in a Python class?",
      "options": [
        {
          "id": "opt_1",
          "text": "To encrypt class attributes"
        },
        {
          "id": "opt_2",
          "text": "To allow accessing a method like a regular attribute with getter/setter control"
        },
        {
          "id": "opt_3",
          "text": "To make class attributes private and inaccessible"
        },
        {
          "id": "opt_4",
          "text": "To bind the method directly to the global namespace"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `@property` decorator turns a class method into a getter attribute, enabling encapsulated access and custom validation without changing the public interface."
    },
    {
      "id": "py-q18",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What does `*args` and `**kwargs` allow in a Python function signature?",
      "options": [
        {
          "id": "opt_1",
          "text": "Pointers and double-pointers in memory"
        },
        {
          "id": "opt_2",
          "text": "Variable number of positional arguments (as a tuple) and keyword arguments (as a dict)"
        },
        {
          "id": "opt_3",
          "text": "Only string arguments and only integer arguments"
        },
        {
          "id": "opt_4",
          "text": "Multithreading and multiprocessing parameters"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`*args` collects extra positional arguments into a tuple, while `**kwargs` collects extra keyword arguments into a dictionary."
    },
    {
      "id": "py-q19",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What happens when you invoke `dict.get(key, default)` if `key` is missing?",
      "options": [
        {
          "id": "opt_1",
          "text": "Raises a KeyError"
        },
        {
          "id": "opt_2",
          "text": "Returns the specified default value without raising KeyError"
        },
        {
          "id": "opt_3",
          "text": "Inserts the key into the dictionary with the default value"
        },
        {
          "id": "opt_4",
          "text": "Returns False"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`dict.get(k, default)` safely returns the fallback default value without modifying the dictionary or raising a KeyError."
    },
    {
      "id": "py-q20",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is the purpose of `__slots__` in a Python class definition?",
      "options": [
        {
          "id": "opt_1",
          "text": "Enables asynchronous execution of methods"
        },
        {
          "id": "opt_2",
          "text": "Restricts valid attributes and prevents dynamic creation of `__dict__`, reducing memory overhead"
        },
        {
          "id": "opt_3",
          "text": "Connects the class to a database table"
        },
        {
          "id": "opt_4",
          "text": "Marks the class as abstract"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "By defining `__slots__`, Python skips creating an instance `__dict__`, which significantly reduces RAM usage when creating millions of small objects."
    },
    {
      "id": "py-q21",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "How does the Global Interpreter Lock (GIL) in CPython affect multithreading?",
      "options": [
        {
          "id": "opt_1",
          "text": "It prevents CPU-bound threads from executing Python bytecode in parallel across multiple CPU cores"
        },
        {
          "id": "opt_2",
          "text": "It prevents I/O-bound operations from overlapping"
        },
        {
          "id": "opt_3",
          "text": "It automatically turns all recursive functions into iterative loops"
        },
        {
          "id": "opt_4",
          "text": "It has zero impact on CPython execution"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "The GIL ensures only one native thread executes Python bytecode at once, preventing multi-core speedup for pure CPU-bound tasks in standard CPython."
    },
    {
      "id": "py-q22",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is a closure in Python and how does it retain scope?",
      "options": [
        {
          "id": "opt_1",
          "text": "A function that closes the operating system process"
        },
        {
          "id": "opt_2",
          "text": "An inner function that remembers and accesses variables from its enclosing lexical scope even after the outer function has finished executing"
        },
        {
          "id": "opt_3",
          "text": "A syntax error caused by unclosed parentheses"
        },
        {
          "id": "opt_4",
          "text": "A built-in garbage collection routine"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Closures capture free variables via cell objects in `__closure__`, retaining their references even after the outer scope has returned."
    },
    {
      "id": "py-q23",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is the difference between `asyncio.gather()` and `asyncio.wait()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "gather runs tasks sequentially; wait runs them in parallel"
        },
        {
          "id": "opt_2",
          "text": "gather returns results ordered matching the input coroutines; wait returns sets of (done, pending) Tasks and allows FIRST_COMPLETED control"
        },
        {
          "id": "opt_3",
          "text": "gather only works with threads, while wait works with processes"
        },
        {
          "id": "opt_4",
          "text": "They are identical aliases"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`asyncio.gather` aggregates results in order and raises on failure, while `asyncio.wait` provides lower-level fine control with return_when flags like FIRST_COMPLETED."
    },
    {
      "id": "py-q24",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is a metaclass in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "A class that inherits from multiple base classes"
        },
        {
          "id": "opt_2",
          "text": "The class of a class, responsible for intercepting and customizing class creation and validation"
        },
        {
          "id": "opt_3",
          "text": "A special class designed only for unit testing"
        },
        {
          "id": "opt_4",
          "text": "A class compiled into C binary"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Just as an object is an instance of a class, a class itself is an instance of a metaclass (by default `type`), which controls how classes are constructed."
    },
    {
      "id": "py-q25",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "How does Python garbage collection handle cyclic references?",
      "options": [
        {
          "id": "opt_1",
          "text": "It cannot handle them, causing permanent memory leaks"
        },
        {
          "id": "opt_2",
          "text": "CPython uses reference counting primarily, supplemented by a generational cyclic garbage collector (gc module) that detects unreachable reference cycles"
        },
        {
          "id": "opt_3",
          "text": "Cyclic references automatically crash with RecursionError"
        },
        {
          "id": "opt_4",
          "text": "All cycles are freed immediately upon scope exit"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "While simple reference counting handles objects whose count drops to zero, the generational garbage collector inspects isolated reference cycles that reference each other."
    },
    {
      "id": "py-q11",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "basic",
      "question": "What is the output of `bool([])`, `bool([0])`, and `bool(\"\")` in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "False, False, False"
        },
        {
          "id": "opt_2",
          "text": "False, True, False"
        },
        {
          "id": "opt_3",
          "text": "True, True, True"
        },
        {
          "id": "opt_4",
          "text": "False, False, True"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In Python, empty collections ([] and \"\") evaluate to False (falsy), while non-empty collections ([0]) evaluate to True regardless of the truthiness of their contents."
    },
    {
      "id": "py-q12",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "basic",
      "question": "Which method removes and returns the last item from a Python list?",
      "options": [
        {
          "id": "opt_1",
          "text": "list.delete()"
        },
        {
          "id": "opt_2",
          "text": "list.pop()"
        },
        {
          "id": "opt_3",
          "text": "list.remove()"
        },
        {
          "id": "opt_4",
          "text": "list.extract()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "list.pop() removes and returns the element at the specified index (defaulting to -1, the last element)."
    },
    {
      "id": "py-q13",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "basic",
      "question": "How do you create a tuple with a single element `5` in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "(5)"
        },
        {
          "id": "opt_2",
          "text": "(5,)"
        },
        {
          "id": "opt_3",
          "text": "tuple(5)"
        },
        {
          "id": "opt_4",
          "text": "[5].to_tuple()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A trailing comma `(5,)` is required to define a single-element tuple; without the comma, `(5)` is evaluated simply as an integer expression inside parentheses."
    },
    {
      "id": "py-q14",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "basic",
      "question": "What is the result of `\"hello\".split(\",\")`?",
      "options": [
        {
          "id": "opt_1",
          "text": "['h', 'e', 'l', 'l', 'o']"
        },
        {
          "id": "opt_2",
          "text": "['hello']"
        },
        {
          "id": "opt_3",
          "text": "ValueError: separator not found"
        },
        {
          "id": "opt_4",
          "text": "[]"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "If the delimiter is not found in the string, split() returns a list containing the original string as its sole element."
    },
    {
      "id": "py-q15",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "basic",
      "question": "Which operator is used for integer floor division in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "/"
        },
        {
          "id": "opt_2",
          "text": "//"
        },
        {
          "id": "opt_3",
          "text": "%"
        },
        {
          "id": "opt_4",
          "text": "div()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `//` operator performs floor division, returning the largest integer less than or equal to the division result."
    },
    {
      "id": "py-q16",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "intermediate",
      "question": "What is the difference between `copy.copy()` and `copy.deepcopy()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "copy.copy() only works on dictionaries, deepcopy works on lists"
        },
        {
          "id": "opt_2",
          "text": "copy.copy() creates a shallow copy copying top-level references, whereas deepcopy recursively clones all nested objects"
        },
        {
          "id": "opt_3",
          "text": "copy.copy() is faster because it saves data to disk"
        },
        {
          "id": "opt_4",
          "text": "There is no difference in modern Python 3.10+"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A shallow copy constructs a new compound object and inserts references to the original objects; a deep copy recursively copies all nested objects."
    },
    {
      "id": "py-q17",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "intermediate",
      "question": "What is the purpose of `@property` decorator in a Python class?",
      "options": [
        {
          "id": "opt_1",
          "text": "To encrypt class attributes"
        },
        {
          "id": "opt_2",
          "text": "To allow accessing a method like a regular attribute with getter/setter control"
        },
        {
          "id": "opt_3",
          "text": "To make class attributes private and inaccessible"
        },
        {
          "id": "opt_4",
          "text": "To bind the method directly to the global namespace"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `@property` decorator turns a class method into a getter attribute, enabling encapsulated access and custom validation without changing the public interface."
    },
    {
      "id": "py-q18",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "intermediate",
      "question": "What does `*args` and `**kwargs` allow in a Python function signature?",
      "options": [
        {
          "id": "opt_1",
          "text": "Pointers and double-pointers in memory"
        },
        {
          "id": "opt_2",
          "text": "Variable number of positional arguments (as a tuple) and keyword arguments (as a dict)"
        },
        {
          "id": "opt_3",
          "text": "Only string arguments and only integer arguments"
        },
        {
          "id": "opt_4",
          "text": "Multithreading and multiprocessing parameters"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`*args` collects extra positional arguments into a tuple, while `**kwargs` collects extra keyword arguments into a dictionary."
    },
    {
      "id": "py-q19",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "intermediate",
      "question": "What happens when you invoke `dict.get(key, default)` if `key` is missing?",
      "options": [
        {
          "id": "opt_1",
          "text": "Raises a KeyError"
        },
        {
          "id": "opt_2",
          "text": "Returns the specified default value without raising KeyError"
        },
        {
          "id": "opt_3",
          "text": "Inserts the key into the dictionary with the default value"
        },
        {
          "id": "opt_4",
          "text": "Returns False"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`dict.get(k, default)` safely returns the fallback default value without modifying the dictionary or raising a KeyError."
    },
    {
      "id": "py-q20",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "intermediate",
      "question": "What is the purpose of `__slots__` in a Python class definition?",
      "options": [
        {
          "id": "opt_1",
          "text": "Enables asynchronous execution of methods"
        },
        {
          "id": "opt_2",
          "text": "Restricts valid attributes and prevents dynamic creation of `__dict__`, reducing memory overhead"
        },
        {
          "id": "opt_3",
          "text": "Connects the class to a database table"
        },
        {
          "id": "opt_4",
          "text": "Marks the class as abstract"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "By defining `__slots__`, Python skips creating an instance `__dict__`, which significantly reduces RAM usage when creating millions of small objects."
    },
    {
      "id": "py-q21",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "How does the Global Interpreter Lock (GIL) in CPython affect multithreading?",
      "options": [
        {
          "id": "opt_1",
          "text": "It prevents CPU-bound threads from executing Python bytecode in parallel across multiple CPU cores"
        },
        {
          "id": "opt_2",
          "text": "It prevents I/O-bound operations from overlapping"
        },
        {
          "id": "opt_3",
          "text": "It automatically turns all recursive functions into iterative loops"
        },
        {
          "id": "opt_4",
          "text": "It has zero impact on CPython execution"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "The GIL ensures only one native thread executes Python bytecode at once, preventing multi-core speedup for pure CPU-bound tasks in standard CPython."
    },
    {
      "id": "py-q22",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is a closure in Python and how does it retain scope?",
      "options": [
        {
          "id": "opt_1",
          "text": "A function that closes the operating system process"
        },
        {
          "id": "opt_2",
          "text": "An inner function that remembers and accesses variables from its enclosing lexical scope even after the outer function has finished executing"
        },
        {
          "id": "opt_3",
          "text": "A syntax error caused by unclosed parentheses"
        },
        {
          "id": "opt_4",
          "text": "A built-in garbage collection routine"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Closures capture free variables via cell objects in `__closure__`, retaining their references even after the outer scope has returned."
    },
    {
      "id": "py-q23",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is the difference between `asyncio.gather()` and `asyncio.wait()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "gather runs tasks sequentially; wait runs them in parallel"
        },
        {
          "id": "opt_2",
          "text": "gather returns results ordered matching the input coroutines; wait returns sets of (done, pending) Tasks and allows FIRST_COMPLETED control"
        },
        {
          "id": "opt_3",
          "text": "gather only works with threads, while wait works with processes"
        },
        {
          "id": "opt_4",
          "text": "They are identical aliases"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`asyncio.gather` aggregates results in order and raises on failure, while `asyncio.wait` provides lower-level fine control with return_when flags like FIRST_COMPLETED."
    },
    {
      "id": "py-q24",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "What is a metaclass in Python?",
      "options": [
        {
          "id": "opt_1",
          "text": "A class that inherits from multiple base classes"
        },
        {
          "id": "opt_2",
          "text": "The class of a class, responsible for intercepting and customizing class creation and validation"
        },
        {
          "id": "opt_3",
          "text": "A special class designed only for unit testing"
        },
        {
          "id": "opt_4",
          "text": "A class compiled into C binary"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Just as an object is an instance of a class, a class itself is an instance of a metaclass (by default `type`), which controls how classes are constructed."
    },
    {
      "id": "py-q25",
      "skillId": "python",
      "skillName": "Python",
      "difficulty": "advanced",
      "question": "How does Python garbage collection handle cyclic references?",
      "options": [
        {
          "id": "opt_1",
          "text": "It cannot handle them, causing permanent memory leaks"
        },
        {
          "id": "opt_2",
          "text": "CPython uses reference counting primarily, supplemented by a generational cyclic garbage collector (gc module) that detects unreachable reference cycles"
        },
        {
          "id": "opt_3",
          "text": "Cyclic references automatically crash with RecursionError"
        },
        {
          "id": "opt_4",
          "text": "All cycles are freed immediately upon scope exit"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "While simple reference counting handles objects whose count drops to zero, the generational garbage collector inspects isolated reference cycles that reference each other."
    }
  ],
  "sql": [
    {
      "id": "sql-q1",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "What is the difference between `WHERE` and `HAVING` in a SQL query?",
      "options": [
        {
          "id": "opt_1",
          "text": "WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY"
        },
        {
          "id": "opt_2",
          "text": "WHERE works only on numeric columns; HAVING works on text columns"
        },
        {
          "id": "opt_3",
          "text": "HAVING can only be used with subqueries in the FROM clause"
        },
        {
          "id": "opt_4",
          "text": "WHERE and HAVING are completely identical and interchangeable"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "The WHERE clause applies condition predicates to individual rows before grouping, while HAVING applies conditions to the aggregated metrics produced by GROUP BY.",
      "difficulty": "basic"
    },
    {
      "id": "sql-q2",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "What is the result of evaluating `SELECT NULL = NULL;` in standard SQL?",
      "options": [
        {
          "id": "opt_1",
          "text": "TRUE (1)"
        },
        {
          "id": "opt_2",
          "text": "FALSE (0)"
        },
        {
          "id": "opt_3",
          "text": "NULL (Unknown)"
        },
        {
          "id": "opt_4",
          "text": "Syntax error"
        }
      ],
      "correctOptionId": "opt_3",
      "explanation": "In three-valued SQL logic, NULL represents an unknown value. Comparing an unknown with an unknown yields UNKNOWN/NULL. To test for nullness, use `IS NULL`.",
      "difficulty": "basic"
    },
    {
      "id": "sql-q3",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "Which window function assigns unique consecutive integers to rows within a partition, without skipping numbers on ties?",
      "options": [
        {
          "id": "opt_1",
          "text": "RANK()"
        },
        {
          "id": "opt_2",
          "text": "ROW_NUMBER()"
        },
        {
          "id": "opt_3",
          "text": "DENSE_RANK()"
        },
        {
          "id": "opt_4",
          "text": "NTILE()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "ROW_NUMBER() always assigns strictly sequential integers (1, 2, 3...) regardless of ties. RANK() leaves gaps after ties, and DENSE_RANK() does not leave gaps but repeats numbers on ties.",
      "difficulty": "basic"
    },
    {
      "id": "sql-q4",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "What is the key functional difference between `TRUNCATE TABLE` and `DELETE FROM table`?",
      "options": [
        {
          "id": "opt_1",
          "text": "DELETE removes the table schema from the database, while TRUNCATE preserves it"
        },
        {
          "id": "opt_2",
          "text": "TRUNCATE is a DDL operation that deallocates data pages rapidly and typically resets auto-increment IDs; DELETE logs individual row removals"
        },
        {
          "id": "opt_3",
          "text": "TRUNCATE allows WHERE clauses for selective deletion, whereas DELETE does not"
        },
        {
          "id": "opt_4",
          "text": "DELETE is always faster than TRUNCATE on large datasets"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "TRUNCATE is a DDL command that deallocates data pages, generating minimal transaction log overhead and resetting identities. DELETE is DML and logs every deleted row individually.",
      "difficulty": "intermediate"
    },
    {
      "id": "sql-q5",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "What does the `COALESCE(col1, col2, 0)` function return?",
      "options": [
        {
          "id": "opt_1",
          "text": "The sum of all non-null arguments"
        },
        {
          "id": "opt_2",
          "text": "The first non-NULL expression from left to right"
        },
        {
          "id": "opt_3",
          "text": "NULL if any argument is NULL"
        },
        {
          "id": "opt_4",
          "text": "The maximum value among the arguments"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "COALESCE evaluates its arguments from left to right and returns the first non-NULL value found. If all arguments are NULL, it returns NULL.",
      "difficulty": "intermediate"
    },
    {
      "id": "sql-q6",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "Which ACID property guarantees that multiple concurrent transactions execute without data corruption or race conditions?",
      "options": [
        {
          "id": "opt_1",
          "text": "Atomicity"
        },
        {
          "id": "opt_2",
          "text": "Consistency"
        },
        {
          "id": "opt_3",
          "text": "Isolation"
        },
        {
          "id": "opt_4",
          "text": "Durability"
        }
      ],
      "correctOptionId": "opt_3",
      "explanation": "Isolation ensures that concurrent transactions occur independently without interference or dirty reads, using transaction isolation levels (e.g. Read Committed, Serializable).",
      "difficulty": "intermediate"
    },
    {
      "id": "sql-q7",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "What index structure is most widely used by default in relational databases like PostgreSQL and MySQL for B-Tree indexing?",
      "options": [
        {
          "id": "opt_1",
          "text": "Balanced Search Tree (B+ Tree) with sequential leaf node pointers"
        },
        {
          "id": "opt_2",
          "text": "Hash Map table with linked lists"
        },
        {
          "id": "opt_3",
          "text": "Unsorted Binary Heap"
        },
        {
          "id": "opt_4",
          "text": "Skip List"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "B+ Trees store records or pointers at leaf nodes linked sequentially, supporting both fast O(log N) point lookups and efficient contiguous range queries.",
      "difficulty": "intermediate"
    },
    {
      "id": "sql-q8",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "What is the output of `COUNT(*)` vs `COUNT(column_name)` when rows contain NULL in `column_name`?",
      "options": [
        {
          "id": "opt_1",
          "text": "Both return identical counts including all rows"
        },
        {
          "id": "opt_2",
          "text": "COUNT(*) counts all rows regardless of NULLs; COUNT(col) excludes rows where col IS NULL"
        },
        {
          "id": "opt_3",
          "text": "COUNT(*) raises an error if any row contains NULL"
        },
        {
          "id": "opt_4",
          "text": "COUNT(col) returns 0 whenever any row contains NULL"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "COUNT(*) counts the total number of rows matching the query. COUNT(expression) counts only non-null evaluations of the specified column.",
      "difficulty": "advanced"
    },
    {
      "id": "sql-q9",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "What type of JOIN returns all records from the left table, and matching records from the right table, populating NULLs when no match exists?",
      "options": [
        {
          "id": "opt_1",
          "text": "INNER JOIN"
        },
        {
          "id": "opt_2",
          "text": "LEFT OUTER JOIN"
        },
        {
          "id": "opt_3",
          "text": "CROSS JOIN"
        },
        {
          "id": "opt_4",
          "text": "FULL OUTER JOIN"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A LEFT OUTER JOIN preserves all rows from the left table and supplements them with matching columns from the right table, substituting NULL when no right record matches.",
      "difficulty": "advanced"
    },
    {
      "id": "sql-q10",
      "skillId": "sql",
      "skillName": "SQL",
      "question": "In SQL, what construct is denoted by `WITH cte_name AS (...)`?",
      "options": [
        {
          "id": "opt_1",
          "text": "Stored Procedure definition"
        },
        {
          "id": "opt_2",
          "text": "Common Table Expression (CTE)"
        },
        {
          "id": "opt_3",
          "text": "Materialized Database View"
        },
        {
          "id": "opt_4",
          "text": "Foreign Key Constraint"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A Common Table Expression (CTE) provides a temporary named result set defined within the scope of a single SELECT, INSERT, UPDATE, or DELETE query.",
      "difficulty": "advanced"
    },
    {
      "id": "sql-q11",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "Which clause is used to filter rows returned by a `SELECT` statement in SQL?",
      "options": [
        {
          "id": "opt_1",
          "text": "FILTER BY"
        },
        {
          "id": "opt_2",
          "text": "WHERE"
        },
        {
          "id": "opt_3",
          "text": "GROUP BY"
        },
        {
          "id": "opt_4",
          "text": "ORDER BY"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `WHERE` clause filters individual records before any grouping or aggregation takes place."
    },
    {
      "id": "sql-q12",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is the difference between `COUNT(*)` and `COUNT(column_name)`?",
      "options": [
        {
          "id": "opt_1",
          "text": "COUNT(*) counts all rows including NULLs; COUNT(col) counts only rows where col is NOT NULL"
        },
        {
          "id": "opt_2",
          "text": "COUNT(*) only counts primary keys"
        },
        {
          "id": "opt_3",
          "text": "COUNT(col) is always faster than COUNT(*)"
        },
        {
          "id": "opt_4",
          "text": "There is no difference in any SQL engine"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "`COUNT(*)` returns the total row count of the table or partition; `COUNT(column)` ignores rows where the specified column contains a NULL value."
    },
    {
      "id": "sql-q13",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "Which keyword removes duplicate rows from the query result set?",
      "options": [
        {
          "id": "opt_1",
          "text": "UNIQUE"
        },
        {
          "id": "opt_2",
          "text": "DISTINCT"
        },
        {
          "id": "opt_3",
          "text": "GROUP"
        },
        {
          "id": "opt_4",
          "text": "ISOLATE"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`SELECT DISTINCT column FROM table` eliminates duplicate values from the final output set."
    },
    {
      "id": "sql-q14",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "How do you check for a NULL value in a `WHERE` clause?",
      "options": [
        {
          "id": "opt_1",
          "text": "WHERE col == NULL"
        },
        {
          "id": "opt_2",
          "text": "WHERE col = NULL"
        },
        {
          "id": "opt_3",
          "text": "WHERE col IS NULL"
        },
        {
          "id": "opt_4",
          "text": "WHERE col.isNull()"
        }
      ],
      "correctOptionId": "opt_3",
      "explanation": "In Three-Valued SQL Logic, `col = NULL` evaluates to UNKNOWN, not TRUE. You must use `col IS NULL` or `col IS NOT NULL`."
    },
    {
      "id": "sql-q15",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "Which SQL statement is used to insert new records into a database table?",
      "options": [
        {
          "id": "opt_1",
          "text": "ADD RECORD TO table"
        },
        {
          "id": "opt_2",
          "text": "INSERT INTO table VALUES (...)"
        },
        {
          "id": "opt_3",
          "text": "UPDATE table SET"
        },
        {
          "id": "opt_4",
          "text": "APPEND table"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`INSERT INTO table (columns) VALUES (values)` is the standard DML syntax for adding new rows."
    },
    {
      "id": "sql-q16",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is the key difference between `WHERE` and `HAVING` clauses?",
      "options": [
        {
          "id": "opt_1",
          "text": "`WHERE` filters rows before aggregation; `HAVING` filters grouped aggregate results after `GROUP BY`"
        },
        {
          "id": "opt_2",
          "text": "`HAVING` is faster than `WHERE`"
        },
        {
          "id": "opt_3",
          "text": "`WHERE` is used with joins; `HAVING` is used with unions"
        },
        {
          "id": "opt_4",
          "text": "They are synonyms in standard ANSI SQL"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "`WHERE` filters source rows before grouping; `HAVING` filters the groups produced by `GROUP BY` using aggregate functions like `HAVING COUNT(*) > 5`."
    },
    {
      "id": "sql-q17",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What does a `LEFT JOIN` return if there is no match in the right table?",
      "options": [
        {
          "id": "opt_1",
          "text": "It excludes the row from the left table"
        },
        {
          "id": "opt_2",
          "text": "All columns from the right table contain NULL for that left row"
        },
        {
          "id": "opt_3",
          "text": "An error is raised"
        },
        {
          "id": "opt_4",
          "text": "It replaces missing values with empty strings"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`LEFT JOIN` guarantees all rows from the left table appear in the output, filling right-side columns with NULL if no match exists."
    },
    {
      "id": "sql-q18",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is the purpose of a Database Index (e.g. B-Tree index)?",
      "options": [
        {
          "id": "opt_1",
          "text": "To encrypt data at rest"
        },
        {
          "id": "opt_2",
          "text": "To speed up query data retrieval at the cost of additional storage and slower write operations"
        },
        {
          "id": "opt_3",
          "text": "To compress table columns"
        },
        {
          "id": "opt_4",
          "text": "To automatically backup records"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Indexes create efficient lookup trees (O(log N)) for WHERE, JOIN, and ORDER BY clauses, but add overhead during INSERT, UPDATE, and DELETE operations."
    },
    {
      "id": "sql-q19",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is a Common Table Expression (CTE) in SQL?",
      "options": [
        {
          "id": "opt_1",
          "text": "A permanent physical table created in system memory"
        },
        {
          "id": "opt_2",
          "text": "A temporary named result set defined using the `WITH` keyword to improve query readability and recursion"
        },
        {
          "id": "opt_3",
          "text": "An index that spans multiple database nodes"
        },
        {
          "id": "opt_4",
          "text": "A stored procedure written in C++"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "CTEs (`WITH cte_name AS (...)`) create modular, reusable temporary query blocks within the scope of an execution."
    },
    {
      "id": "sql-q20",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is the difference between `UNION` and `UNION ALL`?",
      "options": [
        {
          "id": "opt_1",
          "text": "`UNION` retains duplicates; `UNION ALL` removes them"
        },
        {
          "id": "opt_2",
          "text": "`UNION` removes duplicate rows by performing a sort/hash; `UNION ALL` concatenates all rows directly without duplicate elimination"
        },
        {
          "id": "opt_3",
          "text": "`UNION ALL` only works on numbers"
        },
        {
          "id": "opt_4",
          "text": "They produce identical performance"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Because `UNION` performs deduplication, it is computationally more expensive than `UNION ALL`, which appends result sets directly."
    },
    {
      "id": "sql-q21",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is the difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` window functions?",
      "options": [
        {
          "id": "opt_1",
          "text": "There is no difference in their output"
        },
        {
          "id": "opt_2",
          "text": "ROW_NUMBER assigns strictly sequential integers (1,2,3); RANK leaves gaps after ties (1,2,2,4); DENSE_RANK assigns consecutive ranks without gaps (1,2,2,3)"
        },
        {
          "id": "opt_3",
          "text": "DENSE_RANK is only used for dates"
        },
        {
          "id": "opt_4",
          "text": "ROW_NUMBER requires a GROUP BY clause"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "When ties occur, RANK skips subsequent ranks equal to the number of ties, whereas DENSE_RANK preserves consecutive numbering."
    },
    {
      "id": "sql-q22",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What are the 4 ACID properties of database transactions?",
      "options": [
        {
          "id": "opt_1",
          "text": "Accuracy, Consistency, Indexing, Durability"
        },
        {
          "id": "opt_2",
          "text": "Atomicity, Consistency, Isolation, Durability"
        },
        {
          "id": "opt_3",
          "text": "Access, Cryptography, Integrity, Distribution"
        },
        {
          "id": "opt_4",
          "text": "Aggregation, Concurrency, Iteration, Deletion"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "ACID guarantees all-or-nothing execution (Atomicity), schema/constraint validity (Consistency), independent concurrent transactions (Isolation), and committed persistence (Durability)."
    },
    {
      "id": "sql-q23",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is a \"Phantom Read\" in database transaction isolation levels?",
      "options": [
        {
          "id": "opt_1",
          "text": "Reading data that was never written"
        },
        {
          "id": "opt_2",
          "text": "When a transaction executes a range query twice and finds newly committed rows inserted by another concurrent transaction between reads"
        },
        {
          "id": "opt_3",
          "text": "A read that fails due to disk hardware failure"
        },
        {
          "id": "opt_4",
          "text": "Reading deleted rows from the transaction log"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Phantom reads occur when concurrent transactions insert or delete rows satisfying a search predicate, solved by SERIALIZABLE isolation or range locks."
    },
    {
      "id": "sql-q24",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is the difference between a Clustered Index and a Non-Clustered Index?",
      "options": [
        {
          "id": "opt_1",
          "text": "Clustered indexes are stored in RAM; non-clustered on disk"
        },
        {
          "id": "opt_2",
          "text": "A Clustered Index physically determines the order of data rows on disk (only one per table); Non-Clustered indexes store pointers/keys pointing to table rows"
        },
        {
          "id": "opt_3",
          "text": "Tables can have multiple clustered indexes"
        },
        {
          "id": "opt_4",
          "text": "Non-clustered indexes cannot have primary keys"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Because data can only be physically sorted one way on disk, a table can possess only one clustered index (typically the primary key)."
    },
    {
      "id": "sql-q25",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What does the `EXPLAIN ANALYZE` command do in PostgreSQL/MySQL?",
      "options": [
        {
          "id": "opt_1",
          "text": "Rewrites SQL into Java bytecode"
        },
        {
          "id": "opt_2",
          "text": "Executes the statement, outputs the query planner plan alongside real actual runtimes, row counts, and index scan strategies"
        },
        {
          "id": "opt_3",
          "text": "Encrypts the query execution plan"
        },
        {
          "id": "opt_4",
          "text": "Defragments table partitions"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`EXPLAIN ANALYZE` actually executes the query to measure exact node costs, buffers, and execution times, exposing query bottlenecks like sequential scans."
    },
    {
      "id": "sql-q11",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "basic",
      "question": "Which clause is used to filter rows returned by a `SELECT` statement in SQL?",
      "options": [
        {
          "id": "opt_1",
          "text": "FILTER BY"
        },
        {
          "id": "opt_2",
          "text": "WHERE"
        },
        {
          "id": "opt_3",
          "text": "GROUP BY"
        },
        {
          "id": "opt_4",
          "text": "ORDER BY"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `WHERE` clause filters individual records before any grouping or aggregation takes place."
    },
    {
      "id": "sql-q12",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "basic",
      "question": "What is the difference between `COUNT(*)` and `COUNT(column_name)`?",
      "options": [
        {
          "id": "opt_1",
          "text": "COUNT(*) counts all rows including NULLs; COUNT(col) counts only rows where col is NOT NULL"
        },
        {
          "id": "opt_2",
          "text": "COUNT(*) only counts primary keys"
        },
        {
          "id": "opt_3",
          "text": "COUNT(col) is always faster than COUNT(*)"
        },
        {
          "id": "opt_4",
          "text": "There is no difference in any SQL engine"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "`COUNT(*)` returns the total row count of the table or partition; `COUNT(column)` ignores rows where the specified column contains a NULL value."
    },
    {
      "id": "sql-q13",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "basic",
      "question": "Which keyword removes duplicate rows from the query result set?",
      "options": [
        {
          "id": "opt_1",
          "text": "UNIQUE"
        },
        {
          "id": "opt_2",
          "text": "DISTINCT"
        },
        {
          "id": "opt_3",
          "text": "GROUP"
        },
        {
          "id": "opt_4",
          "text": "ISOLATE"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`SELECT DISTINCT column FROM table` eliminates duplicate values from the final output set."
    },
    {
      "id": "sql-q14",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "basic",
      "question": "How do you check for a NULL value in a `WHERE` clause?",
      "options": [
        {
          "id": "opt_1",
          "text": "WHERE col == NULL"
        },
        {
          "id": "opt_2",
          "text": "WHERE col = NULL"
        },
        {
          "id": "opt_3",
          "text": "WHERE col IS NULL"
        },
        {
          "id": "opt_4",
          "text": "WHERE col.isNull()"
        }
      ],
      "correctOptionId": "opt_3",
      "explanation": "In Three-Valued SQL Logic, `col = NULL` evaluates to UNKNOWN, not TRUE. You must use `col IS NULL` or `col IS NOT NULL`."
    },
    {
      "id": "sql-q15",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "basic",
      "question": "Which SQL statement is used to insert new records into a database table?",
      "options": [
        {
          "id": "opt_1",
          "text": "ADD RECORD TO table"
        },
        {
          "id": "opt_2",
          "text": "INSERT INTO table VALUES (...)"
        },
        {
          "id": "opt_3",
          "text": "UPDATE table SET"
        },
        {
          "id": "opt_4",
          "text": "APPEND table"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`INSERT INTO table (columns) VALUES (values)` is the standard DML syntax for adding new rows."
    },
    {
      "id": "sql-q16",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "intermediate",
      "question": "What is the key difference between `WHERE` and `HAVING` clauses?",
      "options": [
        {
          "id": "opt_1",
          "text": "`WHERE` filters rows before aggregation; `HAVING` filters grouped aggregate results after `GROUP BY`"
        },
        {
          "id": "opt_2",
          "text": "`HAVING` is faster than `WHERE`"
        },
        {
          "id": "opt_3",
          "text": "`WHERE` is used with joins; `HAVING` is used with unions"
        },
        {
          "id": "opt_4",
          "text": "They are synonyms in standard ANSI SQL"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "`WHERE` filters source rows before grouping; `HAVING` filters the groups produced by `GROUP BY` using aggregate functions like `HAVING COUNT(*) > 5`."
    },
    {
      "id": "sql-q17",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "intermediate",
      "question": "What does a `LEFT JOIN` return if there is no match in the right table?",
      "options": [
        {
          "id": "opt_1",
          "text": "It excludes the row from the left table"
        },
        {
          "id": "opt_2",
          "text": "All columns from the right table contain NULL for that left row"
        },
        {
          "id": "opt_3",
          "text": "An error is raised"
        },
        {
          "id": "opt_4",
          "text": "It replaces missing values with empty strings"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`LEFT JOIN` guarantees all rows from the left table appear in the output, filling right-side columns with NULL if no match exists."
    },
    {
      "id": "sql-q18",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "intermediate",
      "question": "What is the purpose of a Database Index (e.g. B-Tree index)?",
      "options": [
        {
          "id": "opt_1",
          "text": "To encrypt data at rest"
        },
        {
          "id": "opt_2",
          "text": "To speed up query data retrieval at the cost of additional storage and slower write operations"
        },
        {
          "id": "opt_3",
          "text": "To compress table columns"
        },
        {
          "id": "opt_4",
          "text": "To automatically backup records"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Indexes create efficient lookup trees (O(log N)) for WHERE, JOIN, and ORDER BY clauses, but add overhead during INSERT, UPDATE, and DELETE operations."
    },
    {
      "id": "sql-q19",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "intermediate",
      "question": "What is a Common Table Expression (CTE) in SQL?",
      "options": [
        {
          "id": "opt_1",
          "text": "A permanent physical table created in system memory"
        },
        {
          "id": "opt_2",
          "text": "A temporary named result set defined using the `WITH` keyword to improve query readability and recursion"
        },
        {
          "id": "opt_3",
          "text": "An index that spans multiple database nodes"
        },
        {
          "id": "opt_4",
          "text": "A stored procedure written in C++"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "CTEs (`WITH cte_name AS (...)`) create modular, reusable temporary query blocks within the scope of an execution."
    },
    {
      "id": "sql-q20",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "intermediate",
      "question": "What is the difference between `UNION` and `UNION ALL`?",
      "options": [
        {
          "id": "opt_1",
          "text": "`UNION` retains duplicates; `UNION ALL` removes them"
        },
        {
          "id": "opt_2",
          "text": "`UNION` removes duplicate rows by performing a sort/hash; `UNION ALL` concatenates all rows directly without duplicate elimination"
        },
        {
          "id": "opt_3",
          "text": "`UNION ALL` only works on numbers"
        },
        {
          "id": "opt_4",
          "text": "They produce identical performance"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Because `UNION` performs deduplication, it is computationally more expensive than `UNION ALL`, which appends result sets directly."
    },
    {
      "id": "sql-q21",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is the difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` window functions?",
      "options": [
        {
          "id": "opt_1",
          "text": "There is no difference in their output"
        },
        {
          "id": "opt_2",
          "text": "ROW_NUMBER assigns strictly sequential integers (1,2,3); RANK leaves gaps after ties (1,2,2,4); DENSE_RANK assigns consecutive ranks without gaps (1,2,2,3)"
        },
        {
          "id": "opt_3",
          "text": "DENSE_RANK is only used for dates"
        },
        {
          "id": "opt_4",
          "text": "ROW_NUMBER requires a GROUP BY clause"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "When ties occur, RANK skips subsequent ranks equal to the number of ties, whereas DENSE_RANK preserves consecutive numbering."
    },
    {
      "id": "sql-q22",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What are the 4 ACID properties of database transactions?",
      "options": [
        {
          "id": "opt_1",
          "text": "Accuracy, Consistency, Indexing, Durability"
        },
        {
          "id": "opt_2",
          "text": "Atomicity, Consistency, Isolation, Durability"
        },
        {
          "id": "opt_3",
          "text": "Access, Cryptography, Integrity, Distribution"
        },
        {
          "id": "opt_4",
          "text": "Aggregation, Concurrency, Iteration, Deletion"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "ACID guarantees all-or-nothing execution (Atomicity), schema/constraint validity (Consistency), independent concurrent transactions (Isolation), and committed persistence (Durability)."
    },
    {
      "id": "sql-q23",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is a \"Phantom Read\" in database transaction isolation levels?",
      "options": [
        {
          "id": "opt_1",
          "text": "Reading data that was never written"
        },
        {
          "id": "opt_2",
          "text": "When a transaction executes a range query twice and finds newly committed rows inserted by another concurrent transaction between reads"
        },
        {
          "id": "opt_3",
          "text": "A read that fails due to disk hardware failure"
        },
        {
          "id": "opt_4",
          "text": "Reading deleted rows from the transaction log"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Phantom reads occur when concurrent transactions insert or delete rows satisfying a search predicate, solved by SERIALIZABLE isolation or range locks."
    },
    {
      "id": "sql-q24",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What is the difference between a Clustered Index and a Non-Clustered Index?",
      "options": [
        {
          "id": "opt_1",
          "text": "Clustered indexes are stored in RAM; non-clustered on disk"
        },
        {
          "id": "opt_2",
          "text": "A Clustered Index physically determines the order of data rows on disk (only one per table); Non-Clustered indexes store pointers/keys pointing to table rows"
        },
        {
          "id": "opt_3",
          "text": "Tables can have multiple clustered indexes"
        },
        {
          "id": "opt_4",
          "text": "Non-clustered indexes cannot have primary keys"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Because data can only be physically sorted one way on disk, a table can possess only one clustered index (typically the primary key)."
    },
    {
      "id": "sql-q25",
      "skillId": "sql",
      "skillName": "SQL",
      "difficulty": "advanced",
      "question": "What does the `EXPLAIN ANALYZE` command do in PostgreSQL/MySQL?",
      "options": [
        {
          "id": "opt_1",
          "text": "Rewrites SQL into Java bytecode"
        },
        {
          "id": "opt_2",
          "text": "Executes the statement, outputs the query planner plan alongside real actual runtimes, row counts, and index scan strategies"
        },
        {
          "id": "opt_3",
          "text": "Encrypts the query execution plan"
        },
        {
          "id": "opt_4",
          "text": "Defragments table partitions"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`EXPLAIN ANALYZE` actually executes the query to measure exact node costs, buffers, and execution times, exposing query bottlenecks like sequential scans."
    }
  ],
  "c": [
    {
      "id": "c-q1",
      "skillId": "c",
      "skillName": "C",
      "question": "What is the output of pointer arithmetic when incrementing `ptr++` where `int *ptr = 1000;` on a 64-bit system where `sizeof(int) == 4`?",
      "options": [
        {
          "id": "opt_1",
          "text": "1001"
        },
        {
          "id": "opt_2",
          "text": "1004"
        },
        {
          "id": "opt_3",
          "text": "1008"
        },
        {
          "id": "opt_4",
          "text": "Undefined behavior"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In C, incrementing a typed pointer increases its address by sizeof(T) bytes. Since sizeof(int) is 4, 1000 + 4 = 1004.",
      "difficulty": "basic"
    },
    {
      "id": "c-q2",
      "skillId": "c",
      "skillName": "C",
      "question": "What happens if you allocate dynamic memory with `malloc()` but never call `free()` before program exit?",
      "options": [
        {
          "id": "opt_1",
          "text": "A segmentation fault occurs immediately"
        },
        {
          "id": "opt_2",
          "text": "A memory leak occurs during execution; operating systems reclaim the virtual address space upon process termination"
        },
        {
          "id": "opt_3",
          "text": "The compiler issues a fatal syntax error"
        },
        {
          "id": "opt_4",
          "text": "The memory is automatically freed by the C runtime garbage collector"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Failing to free heap memory causes a memory leak that consumes RAM during program runtime. While modern OSes clean up process memory on exit, long-running services will exhaust system memory.",
      "difficulty": "basic"
    },
    {
      "id": "c-q3",
      "skillId": "c",
      "skillName": "C",
      "question": "What is a \"dangling pointer\" in C programming?",
      "options": [
        {
          "id": "opt_1",
          "text": "A pointer initialized to NULL"
        },
        {
          "id": "opt_2",
          "text": "A pointer that points to a memory location that has already been deallocated"
        },
        {
          "id": "opt_3",
          "text": "A pointer stored in read-only code segment"
        },
        {
          "id": "opt_4",
          "text": "A pointer that has not yet been declared"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A dangling pointer references memory that has been freed. Dereferencing it leads to undefined behavior or security vulnerabilities.",
      "difficulty": "basic"
    },
    {
      "id": "c-q4",
      "skillId": "c",
      "skillName": "C",
      "question": "What character marks the end of a valid C-string in memory?",
      "options": [
        {
          "id": "opt_1",
          "text": "Character '/n'"
        },
        {
          "id": "opt_2",
          "text": "Null character '\\0' (ASCII 0)"
        },
        {
          "id": "opt_3",
          "text": "EOF marker"
        },
        {
          "id": "opt_4",
          "text": "Character '$'"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "C strings are null-terminated byte sequences where the character '\\0' denotes the end of the string. Functions like strlen() scan until reaching this byte.",
      "difficulty": "intermediate"
    },
    {
      "id": "c-q5",
      "skillId": "c",
      "skillName": "C",
      "question": "Why do C compilers add padding bytes between struct members?",
      "options": [
        {
          "id": "opt_1",
          "text": "To encrypt struct data in memory"
        },
        {
          "id": "opt_2",
          "text": "To satisfy hardware memory alignment requirements for efficient CPU bus access"
        },
        {
          "id": "opt_3",
          "text": "To leave space for object-oriented virtual method tables"
        },
        {
          "id": "opt_4",
          "text": "To prevent buffer overflow exploits"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Modern CPU architectures access memory faster when multi-byte data types are aligned to addresses that are multiples of their size. Compilers insert padding to ensure proper data alignment.",
      "difficulty": "intermediate"
    },
    {
      "id": "c-q6",
      "skillId": "c",
      "skillName": "C",
      "question": "What does the `static` keyword mean when applied to a global variable in a C source file (.c)?",
      "options": [
        {
          "id": "opt_1",
          "text": "The variable cannot be modified (constant)"
        },
        {
          "id": "opt_2",
          "text": "The variable has internal linkage, meaning it is only visible within that compilation unit"
        },
        {
          "id": "opt_3",
          "text": "The variable is stored on the stack frame"
        },
        {
          "id": "opt_4",
          "text": "The variable is dynamically allocated at runtime"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "When used at file scope, static gives the symbol internal linkage, preventing other translation units from linking or referencing it directly.",
      "difficulty": "intermediate"
    },
    {
      "id": "c-q7",
      "skillId": "c",
      "skillName": "C",
      "question": "What is the difference between `malloc()` and `calloc()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "calloc() allocates stack memory; malloc() allocates heap memory"
        },
        {
          "id": "opt_2",
          "text": "calloc() initializes the allocated memory to all zero bits; malloc() leaves memory uninitialized"
        },
        {
          "id": "opt_3",
          "text": "malloc() automatically frees memory when out of scope"
        },
        {
          "id": "opt_4",
          "text": "calloc() can only allocate memory for char pointers"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "calloc(num, size) zeroes out all allocated memory bytes and checks for integer overflow in the size calculation. malloc(size) leaves the memory contents indeterminate.",
      "difficulty": "intermediate"
    },
    {
      "id": "c-q8",
      "skillId": "c",
      "skillName": "C",
      "question": "What is the bitwise result of `5 & 3` in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "7"
        },
        {
          "id": "opt_2",
          "text": "1"
        },
        {
          "id": "opt_3",
          "text": "0"
        },
        {
          "id": "opt_4",
          "text": "8"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "5 in binary is 0101; 3 in binary is 0011. Performing bitwise AND (0101 & 0011) results in 0001, which is 1.",
      "difficulty": "advanced"
    },
    {
      "id": "c-q9",
      "skillId": "c",
      "skillName": "C",
      "question": "What is the danger of using `gets()` in C, which led to its complete removal in C11?",
      "options": [
        {
          "id": "opt_1",
          "text": "It fails to convert uppercase to lowercase"
        },
        {
          "id": "opt_2",
          "text": "It does not perform boundary checks on the destination buffer, allowing catastrophic buffer overflow vulnerabilities"
        },
        {
          "id": "opt_3",
          "text": "It cannot read strings containing spaces"
        },
        {
          "id": "opt_4",
          "text": "It is too slow compared to scanf"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "gets() has no mechanism to limit the number of characters read, meaning user input exceeding the destination buffer will overwrite adjacent stack memory, enabling arbitrary code execution.",
      "difficulty": "advanced"
    },
    {
      "id": "c-q10",
      "skillId": "c",
      "skillName": "C",
      "question": "What does the `sizeof` operator in C return?",
      "options": [
        {
          "id": "opt_1",
          "text": "Size in bits as an int"
        },
        {
          "id": "opt_2",
          "text": "Size in bytes as an unsigned integer type `size_t`"
        },
        {
          "id": "opt_3",
          "text": "Memory address pointer"
        },
        {
          "id": "opt_4",
          "text": "Number of CPU clock cycles required"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "sizeof yields the memory size in bytes of its operand as a compile-time constant of type size_t.",
      "difficulty": "advanced"
    },
    {
      "id": "c-q11",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "basic",
      "question": "What is the correct format specifier for printing an unsigned integer using printf?",
      "options": [
        {
          "id": "opt_1",
          "text": "%d"
        },
        {
          "id": "opt_2",
          "text": "%u"
        },
        {
          "id": "opt_3",
          "text": "%i"
        },
        {
          "id": "opt_4",
          "text": "%f"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "%u is specifically designated for printing unsigned decimal integers in C."
    },
    {
      "id": "c-q12",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "basic",
      "question": "What does the sizeof operator return in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "Size in bits"
        },
        {
          "id": "opt_2",
          "text": "Size in bytes as a size_t"
        },
        {
          "id": "opt_3",
          "text": "Number of memory addresses allocated"
        },
        {
          "id": "opt_4",
          "text": "Length of string excluding null character"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "sizeof returns the memory size of an expression or type in bytes, represented as size_t."
    },
    {
      "id": "c-q13",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "basic",
      "question": "Which header file must be included to use malloc() and free() in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "<stdio.h>"
        },
        {
          "id": "opt_2",
          "text": "<stdlib.h>"
        },
        {
          "id": "opt_3",
          "text": "<string.h>"
        },
        {
          "id": "opt_4",
          "text": "<memory.h>"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "<stdlib.h> contains the function prototypes for dynamic memory allocation functions malloc, calloc, realloc, and free."
    },
    {
      "id": "c-q14",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "basic",
      "question": "What character is automatically appended to string literals to indicate their end in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "'\\n'"
        },
        {
          "id": "opt_2",
          "text": "'\\0'"
        },
        {
          "id": "opt_3",
          "text": "'EOF'"
        },
        {
          "id": "opt_4",
          "text": "';'"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "C strings are null-terminated character arrays ending with the null terminator character '\\0' (ASCII 0)."
    },
    {
      "id": "c-q15",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "basic",
      "question": "What is the value of 5 & 3 using the bitwise AND operator?",
      "options": [
        {
          "id": "opt_1",
          "text": "1"
        },
        {
          "id": "opt_2",
          "text": "7"
        },
        {
          "id": "opt_3",
          "text": "8"
        },
        {
          "id": "opt_4",
          "text": "0"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "5 in binary is 101, and 3 is 011. The bitwise AND produces 001, which is 1."
    },
    {
      "id": "c-q16",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "intermediate",
      "question": "What is a \"dangling pointer\" in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "A pointer that points to NULL"
        },
        {
          "id": "opt_2",
          "text": "A pointer pointing to a memory location that has already been deallocated"
        },
        {
          "id": "opt_3",
          "text": "An uninitialized pointer pointing to arbitrary memory"
        },
        {
          "id": "opt_4",
          "text": "A pointer declared inside a recursive function"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A dangling pointer arises when memory pointed to by a pointer has been freed, but the pointer was not reset to NULL."
    },
    {
      "id": "c-q17",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "intermediate",
      "question": "What is the primary difference between malloc() and calloc() in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "calloc allocates memory on the stack while malloc allocates on the heap"
        },
        {
          "id": "opt_2",
          "text": "calloc initializes allocated memory to zero; malloc leaves memory uninitialized"
        },
        {
          "id": "opt_3",
          "text": "malloc takes two parameters and calloc takes one"
        },
        {
          "id": "opt_4",
          "text": "malloc cannot allocate arrays"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "calloc(num, size) zeros out all allocated memory bits, whereas malloc(size) allocates raw memory containing indeterminate values."
    },
    {
      "id": "c-q18",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "intermediate",
      "question": "What is the meaning of the `static` keyword when applied to a global variable in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "The variable cannot be modified (read-only)"
        },
        {
          "id": "opt_2",
          "text": "The variable has internal linkage, restricting its scope to the translation unit (.c file) where it is defined"
        },
        {
          "id": "opt_3",
          "text": "The variable is stored in processor registers"
        },
        {
          "id": "opt_4",
          "text": "The variable is automatically freed when main exits"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A static global variable has internal linkage, preventing other object files from accessing it via the extern keyword."
    },
    {
      "id": "c-q19",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "intermediate",
      "question": "What happens when you pass an array to a function in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "A complete deep copy of the array elements is created on the call stack"
        },
        {
          "id": "opt_2",
          "text": "The array decays into a pointer to its first element"
        },
        {
          "id": "opt_3",
          "text": "The function receives the array length automatically as a hidden argument"
        },
        {
          "id": "opt_4",
          "text": "Compilation fails unless passed by reference using the & operator"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In C, array names decay into a pointer to the type of their first element when passed as function arguments."
    },
    {
      "id": "c-q20",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "intermediate",
      "question": "What is structure padding in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "Adding empty string fields to structs"
        },
        {
          "id": "opt_2",
          "text": "Compiler insertion of unused bytes between structure members to satisfy hardware memory alignment requirements"
        },
        {
          "id": "opt_3",
          "text": "Encrypting structure data in memory"
        },
        {
          "id": "opt_4",
          "text": "Reserving memory for future struct expansion"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Processors access memory more efficiently in 4-byte or 8-byte aligned words; compilers pad structures to align member offsets."
    },
    {
      "id": "c-q21",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "advanced",
      "question": "What does the `volatile` type qualifier tell the C compiler?",
      "options": [
        {
          "id": "opt_1",
          "text": "The variable will be stored on external persistent storage"
        },
        {
          "id": "opt_2",
          "text": "The variable can be modified by hardware or concurrent threads, disabling compiler caching/optimization into CPU registers"
        },
        {
          "id": "opt_3",
          "text": "The variable must be cleared when a function returns"
        },
        {
          "id": "opt_4",
          "text": "The variable is thread-safe and atomic"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`volatile` tells the compiler never to optimize away reads or writes to the variable, ensuring every read/write hits actual memory."
    },
    {
      "id": "c-q22",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "advanced",
      "question": "What is the syntax for declaring a pointer to a function taking two ints and returning an int in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "int *fp(int, int);"
        },
        {
          "id": "opt_2",
          "text": "int (*fp)(int, int);"
        },
        {
          "id": "opt_3",
          "text": "int (int, int) *fp;"
        },
        {
          "id": "opt_4",
          "text": "function<int(int, int)> fp;"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Parentheses around `(*fp)` bind the pointer operator to the identifier; without parentheses, it declares a function returning an int pointer."
    },
    {
      "id": "c-q23",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "advanced",
      "question": "What is Undefined Behavior (UB) in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "An error reported during compilation with code -1"
        },
        {
          "id": "opt_2",
          "text": "Code execution for which the ISO C standard imposes no requirements, allowing crashes, corrupted data, or erratic behavior"
        },
        {
          "id": "opt_3",
          "text": "A syntax error caught by linting tools"
        },
        {
          "id": "opt_4",
          "text": "Platform-dependent behavior with documented implementation choices"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Undefined behavior occurs when code violates standard rules (like buffer overflow or dereferencing null); compilers make no guarantees about execution."
    },
    {
      "id": "c-q24",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "advanced",
      "question": "What does realloc(ptr, 0) do in standard compliant modern C (C23)?",
      "options": [
        {
          "id": "opt_1",
          "text": "Doubles the allocated buffer"
        },
        {
          "id": "opt_2",
          "text": "Has undefined or deallocating behavior; modern C standard deprecates or treats zero size as freeing ptr or returning NULL"
        },
        {
          "id": "opt_3",
          "text": "Allocates a zero-length array"
        },
        {
          "id": "opt_4",
          "text": "Throws a BadAllocException"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Calling realloc with size 0 is historically undefined/inconsistent and in modern standards frees the memory or returns NULL."
    },
    {
      "id": "c-q25",
      "skillId": "c",
      "skillName": "C Programming",
      "difficulty": "advanced",
      "question": "How can you prevent multiple inclusion of header files in C?",
      "options": [
        {
          "id": "opt_1",
          "text": "Using static inline declarations"
        },
        {
          "id": "opt_2",
          "text": "Using preprocessor include guards (#ifndef HEADER_H ... #endif) or #pragma once"
        },
        {
          "id": "opt_3",
          "text": "Declaring all headers with extern"
        },
        {
          "id": "opt_4",
          "text": "Compiling with the -no-duplicate flag"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Include guards (#ifndef, #define, #endif) prevent compiler errors caused by re-declaring types when a header is included multiple times."
    }
  ],
  "cpp": [
    {
      "id": "cpp-q1",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What is the RAII (Resource Acquisition Is Initialization) idiom in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "A design pattern where resources are bound to object lifetime: acquired in constructor and automatically released in destructor"
        },
        {
          "id": "opt_2",
          "text": "A compiler optimization that converts C++ to raw assembly"
        },
        {
          "id": "opt_3",
          "text": "A manual memory management library requiring explicit delete statements"
        },
        {
          "id": "opt_4",
          "text": "A technique for serializing objects to JSON"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "RAII guarantees that resources (heap memory, file handles, mutex locks) are tied to stack object lifetime and properly cleaned up when unwinding the stack, even during exceptions.",
      "difficulty": "basic"
    },
    {
      "id": "cpp-q2",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "Which smart pointer in modern C++ represents exclusive ownership of a dynamic resource?",
      "options": [
        {
          "id": "opt_1",
          "text": "std::shared_ptr"
        },
        {
          "id": "opt_2",
          "text": "std::unique_ptr"
        },
        {
          "id": "opt_3",
          "text": "std::weak_ptr"
        },
        {
          "id": "opt_4",
          "text": "std::auto_ptr"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "std::unique_ptr owns and manages another object through a pointer and disposes of that object when the unique_ptr goes out of scope. It cannot be copied, only moved.",
      "difficulty": "basic"
    },
    {
      "id": "cpp-q3",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What purpose does a virtual destructor serve in a base class with virtual methods?",
      "options": [
        {
          "id": "opt_1",
          "text": "It makes the base class abstract"
        },
        {
          "id": "opt_2",
          "text": "It ensures that deleting a derived object via a base class pointer correctly calls the derived class destructor"
        },
        {
          "id": "opt_3",
          "text": "It prevents the class from being inherited"
        },
        {
          "id": "opt_4",
          "text": "It allocates the object in read-only memory"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Without a virtual destructor, deleting a derived object through a base pointer causes undefined behavior because only the base destructor executes, leaking derived resources.",
      "difficulty": "basic"
    },
    {
      "id": "cpp-q4",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What does `std::move` actually do in C++11 and beyond?",
      "options": [
        {
          "id": "opt_1",
          "text": "Physically moves bytes in RAM from one address to another"
        },
        {
          "id": "opt_2",
          "text": "Unconditionally casts an expression to an rvalue reference (T&&), enabling move constructors"
        },
        {
          "id": "opt_3",
          "text": "Spawns an asynchronous thread to copy data"
        },
        {
          "id": "opt_4",
          "text": "Zeros out the source variable immediately"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "std::move is purely a compile-time cast that converts its argument into an rvalue reference, signaling that the resource can be stolen rather than deep-copied.",
      "difficulty": "intermediate"
    },
    {
      "id": "cpp-q5",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What is the internal memory layout of `std::vector` in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "Doubly linked list of heap nodes"
        },
        {
          "id": "opt_2",
          "text": "Contiguous array of elements in heap memory"
        },
        {
          "id": "opt_3",
          "text": "Balanced Red-Black Tree"
        },
        {
          "id": "opt_4",
          "text": "Separate hash buckets"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "std::vector guarantees contiguous memory storage, offering cache-friendly sequential access and O(1) random access via indexing.",
      "difficulty": "intermediate"
    },
    {
      "id": "cpp-q6",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What problem does `std::weak_ptr` resolve when using `std::shared_ptr`?",
      "options": [
        {
          "id": "opt_1",
          "text": "Prevents segmentation faults on null dereference"
        },
        {
          "id": "opt_2",
          "text": "Breaks circular reference cycles that would otherwise prevent reference count from reaching 0 and cause memory leaks"
        },
        {
          "id": "opt_3",
          "text": "Speeds up pointer allocation by bypassing heap"
        },
        {
          "id": "opt_4",
          "text": "Allows multi-threaded memory allocation without locks"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "If two shared_ptrs reference each other, their reference counts never hit 0, causing a memory leak. std::weak_ptr references an object without incrementing its strong reference count.",
      "difficulty": "intermediate"
    },
    {
      "id": "cpp-q7",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What does the `const` keyword on a member function declaration mean, such as `int getValue() const;`?",
      "options": [
        {
          "id": "opt_1",
          "text": "The return value cannot be changed"
        },
        {
          "id": "opt_2",
          "text": "The function promises not to modify any non-mutable member variables of the calling instance"
        },
        {
          "id": "opt_3",
          "text": "The function can only be called once"
        },
        {
          "id": "opt_4",
          "text": "The function is executed during compilation"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A const member function treats `this` as a pointer to const (const Class*), guaranteeing it will not mutate class state unless a member is declared mutable.",
      "difficulty": "intermediate"
    },
    {
      "id": "cpp-q8",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What is the difference between `delete` and `delete[]` in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "delete is for pointers; delete[] is for references"
        },
        {
          "id": "opt_2",
          "text": "delete is for single objects allocated with new; delete[] is for arrays allocated with new[] to invoke destructors for every element"
        },
        {
          "id": "opt_3",
          "text": "delete[] automatically zeroes memory"
        },
        {
          "id": "opt_4",
          "text": "They are completely identical in modern C++"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Calling delete on an array allocated with new[] invokes the destructor for only the first element, causing undefined behavior and resource leaks. delete[] calls destructors for all elements.",
      "difficulty": "advanced"
    },
    {
      "id": "cpp-q9",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What is a \"pure virtual function\" in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "A function that takes no parameters and returns void"
        },
        {
          "id": "opt_2",
          "text": "A virtual function assigned `= 0`, making the class abstract and requiring derived classes to implement it"
        },
        {
          "id": "opt_3",
          "text": "A function that cannot throw exceptions"
        },
        {
          "id": "opt_4",
          "text": "A static method that operates on global variables"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A virtual function declared with `= 0` has no default implementation in the base class, making the base class abstract so it cannot be directly instantiated.",
      "difficulty": "advanced"
    },
    {
      "id": "cpp-q10",
      "skillId": "cpp",
      "skillName": "C++",
      "question": "What is the \"diamond problem\" in C++ multiple inheritance, and how is it solved?",
      "options": [
        {
          "id": "opt_1",
          "text": "Solved using template metaprogramming"
        },
        {
          "id": "opt_2",
          "text": "Ambiguity when two derived classes inherit from a common base and a fourth class inherits from both; solved using `virtual` base inheritance"
        },
        {
          "id": "opt_3",
          "text": "Memory fragmentation in heap allocations solved by memory pools"
        },
        {
          "id": "opt_4",
          "text": "Deadlocks in multi-threaded code solved by mutex hierarchies"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Virtual inheritance (`class B : virtual public A`) ensures that only one shared instance of the common base class A exists in the most-derived object.",
      "difficulty": "advanced"
    },
    {
      "id": "cpp-q11",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "basic",
      "question": "Which C++ stream is used for printing standard errors without buffering?",
      "options": [
        {
          "id": "opt_1",
          "text": "std::cout"
        },
        {
          "id": "opt_2",
          "text": "std::cerr"
        },
        {
          "id": "opt_3",
          "text": "std::cin"
        },
        {
          "id": "opt_4",
          "text": "std::clog"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "std::cerr is unbuffered, making it ideal for immediate display of critical diagnostic and error messages."
    },
    {
      "id": "cpp-q12",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "basic",
      "question": "Which keyword is used to prevent a class from being inherited or a virtual function from being overridden in C++11?",
      "options": [
        {
          "id": "opt_1",
          "text": "sealed"
        },
        {
          "id": "opt_2",
          "text": "final"
        },
        {
          "id": "opt_3",
          "text": "const"
        },
        {
          "id": "opt_4",
          "text": "override"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `final` specifier terminates the inheritance chain or prevents further overriding of a virtual member function."
    },
    {
      "id": "cpp-q13",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "basic",
      "question": "What is the default access specifier for members of a `class` in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "public"
        },
        {
          "id": "opt_2",
          "text": "private"
        },
        {
          "id": "opt_3",
          "text": "protected"
        },
        {
          "id": "opt_4",
          "text": "internal"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Members of a `class` in C++ default to `private`, whereas members of a `struct` default to `public`."
    },
    {
      "id": "cpp-q14",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "basic",
      "question": "Which operator is used to allocate dynamic memory for a single object in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "malloc"
        },
        {
          "id": "opt_2",
          "text": "new"
        },
        {
          "id": "opt_3",
          "text": "alloc"
        },
        {
          "id": "opt_4",
          "text": "create"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `new` operator dynamically allocates memory on the free store and automatically invokes the constructor."
    },
    {
      "id": "cpp-q15",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "basic",
      "question": "What does the `auto` keyword do in C++11 and later?",
      "options": [
        {
          "id": "opt_1",
          "text": "Declares automatic storage duration variable on heap"
        },
        {
          "id": "opt_2",
          "text": "Instructs the compiler to deduce the variable type from its initializer expression"
        },
        {
          "id": "opt_3",
          "text": "Automatically parallelizes loop iterations"
        },
        {
          "id": "opt_4",
          "text": "Converts data types automatically at runtime"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`auto` instructs the compiler to deduce the variable's type at compile time from the type of its initialization expression."
    },
    {
      "id": "cpp-q16",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "intermediate",
      "question": "What is RAII (Resource Acquisition Is Initialization) in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "An IDE tool for compiling headers"
        },
        {
          "id": "opt_2",
          "text": "A design idiom where resource lifetime is tied to object lifetime (acquired in constructor, released in destructor)"
        },
        {
          "id": "opt_3",
          "text": "A technique to initialize all pointers to null in main()"
        },
        {
          "id": "opt_4",
          "text": "Asynchronous event initialization"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "RAII binds resource ownership to object lifetime; when stack objects go out of scope, destructors automatically release heap memory, sockets, or mutexes."
    },
    {
      "id": "cpp-q17",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "intermediate",
      "question": "Why should a base class with virtual methods declare a virtual destructor in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "To allow the base class to be instantiated"
        },
        {
          "id": "opt_2",
          "text": "To ensure the derived class destructor is called when deleting through a base class pointer"
        },
        {
          "id": "opt_3",
          "text": "To enable copy construction"
        },
        {
          "id": "opt_4",
          "text": "To suppress compiler warnings about inline functions"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Without a virtual destructor, deleting a derived class instance via a base class pointer results in undefined behavior and memory leaks."
    },
    {
      "id": "cpp-q18",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "intermediate",
      "question": "What is the key difference between std::unique_ptr and std::shared_ptr in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "unique_ptr is thread-safe while shared_ptr is not"
        },
        {
          "id": "opt_2",
          "text": "unique_ptr expresses exclusive ownership and cannot be copied (only moved); shared_ptr uses reference counting for shared ownership"
        },
        {
          "id": "opt_3",
          "text": "unique_ptr has higher runtime overhead than shared_ptr"
        },
        {
          "id": "opt_4",
          "text": "shared_ptr can only manage array allocations"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "std::unique_ptr enforces sole ownership with zero overhead (move-only), while std::shared_ptr manages a control block with atomic reference counting."
    },
    {
      "id": "cpp-q19",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "intermediate",
      "question": "What is an lvalue reference vs an rvalue reference in modern C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "lvalues are stored in RAM; rvalues are in ROM"
        },
        {
          "id": "opt_2",
          "text": "lvalues represent identifiable memory locations with persistent names; rvalues represent temporary objects or values about to expire (denoted by &&)"
        },
        {
          "id": "opt_3",
          "text": "lvalues are const; rvalues are mutable"
        },
        {
          "id": "opt_4",
          "text": "rvalues can only be evaluated on the right side of loops"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Rvalue references (T&&) bind to temporary expressions, enabling move semantics which transfer resource pointers rather than performing expensive deep copies."
    },
    {
      "id": "cpp-q20",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "intermediate",
      "question": "Which STL container provides O(1) amortized insertion at both ends and random access indexing?",
      "options": [
        {
          "id": "opt_1",
          "text": "std::vector"
        },
        {
          "id": "opt_2",
          "text": "std::deque"
        },
        {
          "id": "opt_3",
          "text": "std::list"
        },
        {
          "id": "opt_4",
          "text": "std::set"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "std::deque (double-ended queue) supports constant time push_front, push_back, and O(1) indexed element access."
    },
    {
      "id": "cpp-q21",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "advanced",
      "question": "What does `std::move` actually do under the hood in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "Physically moves bytes in RAM from one address to another"
        },
        {
          "id": "opt_2",
          "text": "Unconditionally casts its argument to an rvalue reference (static_cast<T&&>), enabling move constructors or move assignments"
        },
        {
          "id": "opt_3",
          "text": "Zeroes out the source variable"
        },
        {
          "id": "opt_4",
          "text": "Allocates memory on the heap"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "std::move produces no runtime executable code; it simply casts an lvalue expression into an rvalue reference to allow move semantics."
    },
    {
      "id": "cpp-q22",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "advanced",
      "question": "What is a vtable (virtual method table) in C++ implementations?",
      "options": [
        {
          "id": "opt_1",
          "text": "A hash table storing source code line numbers for debugging"
        },
        {
          "id": "opt_2",
          "text": "An array of function pointers created per polymorphic class used to resolve virtual function calls dynamically at runtime"
        },
        {
          "id": "opt_3",
          "text": "A memory lookup table for template instantiations"
        },
        {
          "id": "opt_4",
          "text": "A database table used in embedded C++"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Every class with virtual methods has a vtable of function pointers; each instance contains a hidden vptr pointing to this table for dynamic dispatch."
    },
    {
      "id": "cpp-q23",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "advanced",
      "question": "What is SFINAE in C++ template programming?",
      "options": [
        {
          "id": "opt_1",
          "text": "Static Fast Instruction Network Architecture Engine"
        },
        {
          "id": "opt_2",
          "text": "Substitution Failure Is Not An Error: if a substituted template argument leads to invalid code, the candidate is discarded without compile error"
        },
        {
          "id": "opt_3",
          "text": "Synchronous File Input Not Always Enabled"
        },
        {
          "id": "opt_4",
          "text": "Single Function Interface Native Audio Extension"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "SFINAE enables template overload resolution and conditional compilation via std::enable_if and concepts."
    },
    {
      "id": "cpp-q24",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "advanced",
      "question": "What is the difference between `const` and `constexpr` in C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "constexpr variables can be modified, const cannot"
        },
        {
          "id": "opt_2",
          "text": "const promises immutability at runtime; constexpr guarantees that the value can and must be evaluated at compile-time"
        },
        {
          "id": "opt_3",
          "text": "constexpr only works with integers"
        },
        {
          "id": "opt_4",
          "text": "There is no difference in modern C++"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`constexpr` enforces compile-time evaluation, allowing its result to be used as array bounds, template arguments, and static assertions."
    },
    {
      "id": "cpp-q25",
      "skillId": "cpp",
      "skillName": "C++",
      "difficulty": "advanced",
      "question": "What is the \"Rule of Five\" in modern C++?",
      "options": [
        {
          "id": "opt_1",
          "text": "A guideline restricting classes to 5 member variables"
        },
        {
          "id": "opt_2",
          "text": "If a class customizes any of: Destructor, Copy Constructor, Copy Assignment, Move Constructor, or Move Assignment, it should define all five"
        },
        {
          "id": "opt_3",
          "text": "Maximum five layers of template inheritance"
        },
        {
          "id": "opt_4",
          "text": "Five design patterns required for clean code"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Managing resource lifetimes requires explicitly implementing or deleting all five special member functions to prevent resource leaks and double frees."
    }
  ],
  "java": [
    {
      "id": "java-q1",
      "skillId": "java",
      "skillName": "Java",
      "question": "Why are `String` objects immutable in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "Java memory is strictly read-only"
        },
        {
          "id": "opt_2",
          "text": "For security, String Pool caching, thread safety, and reliable use as HashMap keys"
        },
        {
          "id": "opt_3",
          "text": "To allow strings to be converted to primitive integers automatically"
        },
        {
          "id": "opt_4",
          "text": "Because the JVM cannot reallocate heap memory"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Immutability ensures strings can be safely shared across threads, cached in the String Constant Pool, and maintain deterministic hashCode values for hash-based collections.",
      "difficulty": "basic"
    },
    {
      "id": "java-q2",
      "skillId": "java",
      "skillName": "Java",
      "question": "What is the difference between `==` and `.equals()` when comparing two objects in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "== compares value equality; .equals() compares memory references"
        },
        {
          "id": "opt_2",
          "text": "== compares memory reference equality (identity); .equals() compares logical content equality"
        },
        {
          "id": "opt_3",
          "text": "== is used for Strings; .equals() is used for primitive numbers"
        },
        {
          "id": "opt_4",
          "text": "There is no difference in Java"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`==` checks if both variables refer to the exact same memory address. `.equals()` evaluates logical equality as implemented by the class.",
      "difficulty": "basic"
    },
    {
      "id": "java-q3",
      "skillId": "java",
      "skillName": "Java",
      "question": "What is the contract between `equals()` and `hashCode()` in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "If two objects have the same hashCode, they must be equal according to equals()"
        },
        {
          "id": "opt_2",
          "text": "If two objects are equal according to equals(), they must produce the same hashCode()"
        },
        {
          "id": "opt_3",
          "text": "hashCode() must return a negative number for equal objects"
        },
        {
          "id": "opt_4",
          "text": "equals() and hashCode() have no relationship in Java"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "If obj1.equals(obj2) is true, then obj1.hashCode() MUST equal obj2.hashCode(). Violating this contract breaks HashMaps and HashSets.",
      "difficulty": "basic"
    },
    {
      "id": "java-q4",
      "skillId": "java",
      "skillName": "Java",
      "question": "What does the `volatile` keyword ensure when applied to a variable in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "It makes the variable immutable"
        },
        {
          "id": "opt_2",
          "text": "It guarantees visibility of changes across threads by ensuring reads and writes happen directly from main memory"
        },
        {
          "id": "opt_3",
          "text": "It guarantees atomic execution of compound operations like count++"
        },
        {
          "id": "opt_4",
          "text": "It serializes the variable to disk"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "volatile ensures that any thread reading the field sees the most recent write by another thread, preventing threads from caching stale values in CPU registers.",
      "difficulty": "intermediate"
    },
    {
      "id": "java-q5",
      "skillId": "java",
      "skillName": "Java",
      "question": "What is the key difference between `ArrayList` and `LinkedList` in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "ArrayList provides O(1) random access by index; LinkedList provides O(1) insertion/deletion at endpoints but O(N) indexing"
        },
        {
          "id": "opt_2",
          "text": "LinkedList is thread-safe; ArrayList is not"
        },
        {
          "id": "opt_3",
          "text": "ArrayList cannot hold null values"
        },
        {
          "id": "opt_4",
          "text": "LinkedList stores primitives; ArrayList stores objects"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "ArrayList is backed by a contiguous resizable array offering O(1) index lookups. LinkedList is a doubly-linked list requiring traversal for arbitrary index lookups.",
      "difficulty": "intermediate"
    },
    {
      "id": "java-q6",
      "skillId": "java",
      "skillName": "Java",
      "question": "In Java exception handling, what is a \"checked exception\"?",
      "options": [
        {
          "id": "opt_1",
          "text": "An exception that inherits from RuntimeException and is optional to catch"
        },
        {
          "id": "opt_2",
          "text": "An exception checked at compile-time that must be declared in a `throws` clause or handled in a `try-catch`"
        },
        {
          "id": "opt_3",
          "text": "An error produced exclusively by hardware faults"
        },
        {
          "id": "opt_4",
          "text": "A syntax error caught by the compiler"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Checked exceptions (subclasses of Exception excluding RuntimeException) represent recoverable conditions that the compiler forces developers to handle explicitly.",
      "difficulty": "intermediate"
    },
    {
      "id": "java-q7",
      "skillId": "java",
      "skillName": "Java",
      "question": "What is the purpose of the Java Streams API introduced in Java 8?",
      "options": [
        {
          "id": "opt_1",
          "text": "To perform socket network streaming"
        },
        {
          "id": "opt_2",
          "text": "To provide functional, declarative pipelines for processing collections of data (map, filter, reduce)"
        },
        {
          "id": "opt_3",
          "text": "To replace the garbage collector"
        },
        {
          "id": "opt_4",
          "text": "To compile Java directly into WebAssembly"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Java Streams provide a functional approach to data transformation, supporting lazy evaluation, parallel execution, and composable pipelines.",
      "difficulty": "intermediate"
    },
    {
      "id": "java-q8",
      "skillId": "java",
      "skillName": "Java",
      "question": "Where are Java local variables declared inside a method stored in memory?",
      "options": [
        {
          "id": "opt_1",
          "text": "The Heap"
        },
        {
          "id": "opt_2",
          "text": "The Thread Stack"
        },
        {
          "id": "opt_3",
          "text": "Metaspace"
        },
        {
          "id": "opt_4",
          "text": "Disk cache"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Each thread has its own call stack where stack frames for method invocations are pushed, holding primitive local variables and references to heap objects.",
      "difficulty": "advanced"
    },
    {
      "id": "java-q9",
      "skillId": "java",
      "skillName": "Java",
      "question": "Can an interface in Java 8+ contain implemented methods?",
      "options": [
        {
          "id": "opt_1",
          "text": "No, interfaces can never contain method bodies"
        },
        {
          "id": "opt_2",
          "text": "Yes, using `default` or `static` keywords"
        },
        {
          "id": "opt_3",
          "text": "Only if the interface extends an abstract class"
        },
        {
          "id": "opt_4",
          "text": "Only in the java.lang package"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Java 8 introduced default and static methods in interfaces, allowing API designers to add new capabilities to interfaces without breaking existing implementations.",
      "difficulty": "advanced"
    },
    {
      "id": "java-q10",
      "skillId": "java",
      "skillName": "Java",
      "question": "What happens when `System.gc()` is called in a Java application?",
      "options": [
        {
          "id": "opt_1",
          "text": "The JVM is forced to perform an immediate full garbage collection cycle"
        },
        {
          "id": "opt_2",
          "text": "It sends a hint/suggestion to the JVM that garbage collection may be run, but execution is not guaranteed"
        },
        {
          "id": "opt_3",
          "text": "It terminates all running daemon threads"
        },
        {
          "id": "opt_4",
          "text": "It clears the String Constant Pool"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "System.gc() only suggests that the JVM exert effort toward recycling unused objects; the JVM implementation chooses whether and when to run.",
      "difficulty": "advanced"
    },
    {
      "id": "java-q11",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "basic",
      "question": "What is the default value of a boolean field in a Java class instance?",
      "options": [
        {
          "id": "opt_1",
          "text": "true"
        },
        {
          "id": "opt_2",
          "text": "false"
        },
        {
          "id": "opt_3",
          "text": "null"
        },
        {
          "id": "opt_4",
          "text": "0"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In Java, uninitialized instance variables of primitive boolean type default to false."
    },
    {
      "id": "java-q12",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "basic",
      "question": "Which keyword prevents a method from being overridden by subclasses in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "static"
        },
        {
          "id": "opt_2",
          "text": "final"
        },
        {
          "id": "opt_3",
          "text": "abstract"
        },
        {
          "id": "opt_4",
          "text": "constant"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Marking a method `final` disallows child classes from overriding that method implementation."
    },
    {
      "id": "java-q13",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "basic",
      "question": "What is the size of an `int` data type in Java across all platforms?",
      "options": [
        {
          "id": "opt_1",
          "text": "16 bits"
        },
        {
          "id": "opt_2",
          "text": "32 bits (4 bytes)"
        },
        {
          "id": "opt_3",
          "text": "64 bits"
        },
        {
          "id": "opt_4",
          "text": "Platform dependent"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Java guarantees that primitive int is strictly 32-bit signed two's complement on all JVM architectures."
    },
    {
      "id": "java-q14",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "basic",
      "question": "Which collection in java.util does NOT allow duplicate elements?",
      "options": [
        {
          "id": "opt_1",
          "text": "ArrayList"
        },
        {
          "id": "opt_2",
          "text": "HashSet"
        },
        {
          "id": "opt_3",
          "text": "LinkedList"
        },
        {
          "id": "opt_4",
          "text": "Vector"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Set implementations such as HashSet enforce mathematical set semantics with unique elements only."
    },
    {
      "id": "java-q15",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "basic",
      "question": "What is the entry point signature required for a standalone Java application?",
      "options": [
        {
          "id": "opt_1",
          "text": "public void main(String args[])"
        },
        {
          "id": "opt_2",
          "text": "public static void main(String[] args)"
        },
        {
          "id": "opt_3",
          "text": "static int main(String[] args)"
        },
        {
          "id": "opt_4",
          "text": "public abstract void main(String[] args)"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The JVM looks for public static void main(String[] args) as the standard executable entry point."
    },
    {
      "id": "java-q16",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "intermediate",
      "question": "Why are String objects immutable in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "Because char arrays cannot be modified in hardware"
        },
        {
          "id": "opt_2",
          "text": "For security, hashcode caching, thread safety, and string constant pool sharing"
        },
        {
          "id": "opt_3",
          "text": "To allow multiple inheritance"
        },
        {
          "id": "opt_4",
          "text": "Because JVM stack memory forbids updates"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Immutability ensures Strings can be safely cached in the String Pool, passed securely to network/database calls, and shared across threads without synchronization."
    },
    {
      "id": "java-q17",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "intermediate",
      "question": "What is the difference between `==` and `.equals()` when comparing two String objects in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "They are completely identical"
        },
        {
          "id": "opt_2",
          "text": "`==` compares memory reference addresses; `.equals()` compares actual character sequence content"
        },
        {
          "id": "opt_3",
          "text": "`==` compares length; `.equals()` compares memory addresses"
        },
        {
          "id": "opt_4",
          "text": "`.equals()` is only valid for numbers"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`==` checks if both references point to the exact same object in memory; `.equals()` compares value content."
    },
    {
      "id": "java-q18",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "intermediate",
      "question": "What does the try-with-resources statement do in Java 7+?",
      "options": [
        {
          "id": "opt_1",
          "text": "Automatically catches all unchecked runtime exceptions"
        },
        {
          "id": "opt_2",
          "text": "Ensures that any resource implementing AutoCloseable is automatically closed at the end of the block"
        },
        {
          "id": "opt_3",
          "text": "Prevents out-of-memory errors on large collections"
        },
        {
          "id": "opt_4",
          "text": "Retries failed network calls up to 3 times"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "try-with-resources guarantees automatic invocation of close() on declared resources even if exceptions occur."
    },
    {
      "id": "java-q19",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "intermediate",
      "question": "What is the contract between equals() and hashCode() in Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "If two objects have equal hash codes, they must be equal according to equals()"
        },
        {
          "id": "opt_2",
          "text": "If two objects are equal according to equals(), they must produce the same hashCode() value"
        },
        {
          "id": "opt_3",
          "text": "Objects with distinct hash codes must be equal"
        },
        {
          "id": "opt_4",
          "text": "hashCode() must return prime numbers only"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Violating this contract breaks hashing collections like HashMap and HashSet, causing duplicate entries and retrieval failures."
    },
    {
      "id": "java-q20",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "intermediate",
      "question": "What is the difference between an Abstract Class and an Interface in modern Java (Java 8+)?",
      "options": [
        {
          "id": "opt_1",
          "text": "Interfaces cannot have any method bodies whatsoever"
        },
        {
          "id": "opt_2",
          "text": "A class can implement multiple interfaces but extend only one class; abstract classes can have constructors and instance state"
        },
        {
          "id": "opt_3",
          "text": "Interfaces cannot contain static methods"
        },
        {
          "id": "opt_4",
          "text": "Abstract classes can be instantiated using new"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "While Java 8 introduced default/static methods in interfaces, interfaces still cannot hold non-static instance state, whereas abstract classes can."
    },
    {
      "id": "java-q21",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "advanced",
      "question": "What is \"Type Erasure\" in Java Generics?",
      "options": [
        {
          "id": "opt_1",
          "text": "Automatic deletion of unused class files by the compiler"
        },
        {
          "id": "opt_2",
          "text": "The compiler removes all generic type parameters during compilation, replacing them with bounds or Object in the bytecode for backward compatibility"
        },
        {
          "id": "opt_3",
          "text": "Garbage collecting untyped heap objects"
        },
        {
          "id": "opt_4",
          "text": "Casting primitives to their wrapper types"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Type erasure means generic types (like List<String>) exist only at compile time; at runtime, the JVM sees raw types (List) with inserted casts."
    },
    {
      "id": "java-q22",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "advanced",
      "question": "What does the `volatile` keyword guarantee in Java multi-threading?",
      "options": [
        {
          "id": "opt_1",
          "text": "Atomicity of compound operations like count++"
        },
        {
          "id": "opt_2",
          "text": "Memory visibility across threads (reads/writes bypass CPU caches directly to main memory) and prevents instruction reordering"
        },
        {
          "id": "opt_3",
          "text": "Mutual exclusion equivalent to synchronized blocks"
        },
        {
          "id": "opt_4",
          "text": "Deadlock immunity"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`volatile` establishes a happens-before relationship, guaranteeing updates made by one thread are immediately visible to others without locking."
    },
    {
      "id": "java-q23",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "advanced",
      "question": "In Java JVM memory architecture, where are object instances allocated vs local primitive variables?",
      "options": [
        {
          "id": "opt_1",
          "text": "Objects on Stack, primitives on Heap"
        },
        {
          "id": "opt_2",
          "text": "Objects on Heap, local primitive variables on Stack frames"
        },
        {
          "id": "opt_3",
          "text": "Both always on Metaspace"
        },
        {
          "id": "opt_4",
          "text": "Primitives on registers only"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "All Java objects live in the shared Heap memory managed by the Garbage Collector; method stack frames hold local variables and pointers."
    },
    {
      "id": "java-q24",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "advanced",
      "question": "What is the purpose of the `ForkJoinPool` in the Java concurrency framework?",
      "options": [
        {
          "id": "opt_1",
          "text": "Connecting to distributed relational databases"
        },
        {
          "id": "opt_2",
          "text": "Executing recursive divide-and-conquer tasks using a work-stealing algorithm across worker threads"
        },
        {
          "id": "opt_3",
          "text": "Managing HTTP socket requests in Tomcat"
        },
        {
          "id": "opt_4",
          "text": "Serializing JSON streams"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "ForkJoinPool uses work-stealing queues so idle threads steal subtasks from busy worker deques, backing Java parallel streams."
    },
    {
      "id": "java-q25",
      "skillId": "java",
      "skillName": "Java",
      "difficulty": "advanced",
      "question": "What is the difference between G1 GC and ZGC in modern Java?",
      "options": [
        {
          "id": "opt_1",
          "text": "G1 GC is for Android, ZGC is for iOS"
        },
        {
          "id": "opt_2",
          "text": "ZGC is a low-latency concurrent garbage collector with sub-millisecond pause times regardless of heap size, whereas G1 divides heap into regions with target pause times"
        },
        {
          "id": "opt_3",
          "text": "G1 stops the world for minutes while ZGC does not use memory"
        },
        {
          "id": "opt_4",
          "text": "ZGC requires hardware GPUs"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "ZGC performs virtually all GC phases (marking, relocation) concurrently using colored pointers and load barriers, targeting pauses < 1ms."
    }
  ],
  "javascript": [
    {
      "id": "js-q1",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What is the order of execution in the JavaScript Event Loop for Promises vs setTimeout?",
      "codeSnippet": "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
      "options": [
        {
          "id": "opt_1",
          "text": "1, 2, 3, 4"
        },
        {
          "id": "opt_2",
          "text": "1, 4, 3, 2"
        },
        {
          "id": "opt_3",
          "text": "1, 4, 2, 3"
        },
        {
          "id": "opt_4",
          "text": "1, 3, 4, 2"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Synchronous code runs first (1, 4). Microtasks (Promises) are processed immediately after synchronous execution completes (3). Macrotasks (setTimeout) execute in the next tick (2).",
      "difficulty": "basic"
    },
    {
      "id": "js-q2",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What is a JavaScript \"Closure\"?",
      "options": [
        {
          "id": "opt_1",
          "text": "A syntax construct for closing HTML tags"
        },
        {
          "id": "opt_2",
          "text": "A function bundled together with references to its lexical environment, allowing access to outer scope variables even after outer function returns"
        },
        {
          "id": "opt_3",
          "text": "A method to terminate an event listener"
        },
        {
          "id": "opt_4",
          "text": "A built-in garbage collector command"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A closure gives an inner function access to its outer enclosing function scope even after the outer function has finished executing.",
      "difficulty": "basic"
    },
    {
      "id": "js-q3",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What is the difference between `==` and `===` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "== checks both value and type; === checks only value"
        },
        {
          "id": "opt_2",
          "text": "== performs implicit type coercion before comparison; === is strict equality requiring identical types and values"
        },
        {
          "id": "opt_3",
          "text": "=== is only valid in TypeScript"
        },
        {
          "id": "opt_4",
          "text": "There is no functional difference"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`==` coerces operand types if they differ (e.g. `0 == \"\"` is true). `===` strictly requires matching types and values (e.g. `0 === \"\"` is false).",
      "difficulty": "basic"
    },
    {
      "id": "js-q4",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "How does the `this` keyword behave inside an ES6 arrow function compared to a standard function?",
      "options": [
        {
          "id": "opt_1",
          "text": "Arrow functions have their own dynamic this bound at call time"
        },
        {
          "id": "opt_2",
          "text": "Arrow functions do not have their own this; they inherit this lexically from the enclosing scope"
        },
        {
          "id": "opt_3",
          "text": "Arrow functions always bind this to the window/global object"
        },
        {
          "id": "opt_4",
          "text": "Arrow functions throw an error if this is referenced"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Arrow functions retain the `this` value of the enclosing lexical context when they are defined, making them ideal for callbacks without `.bind(this)`.",
      "difficulty": "intermediate"
    },
    {
      "id": "js-q5",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What is the difference between `null` and `undefined` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "null is assigned by the engine when a variable is declared without value; undefined is an intentional absence of value"
        },
        {
          "id": "opt_2",
          "text": "undefined means a variable has been declared but not assigned a value; null represents an intentional assignment of \"no value\""
        },
        {
          "id": "opt_3",
          "text": "typeof null is \"null\"; typeof undefined is \"undefined\""
        },
        {
          "id": "opt_4",
          "text": "null and undefined are strictly equal (null === undefined)"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "undefined indicates that a variable has not been initialized. null is an assigned primitive indicating an intentional absence of object value. (Note: typeof null is historically \"object\").",
      "difficulty": "intermediate"
    },
    {
      "id": "js-q6",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What is the purpose of the `Promise.allSettled()` method compared to `Promise.all()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "allSettled rejects immediately as soon as any single promise fails"
        },
        {
          "id": "opt_2",
          "text": "allSettled waits for all input promises to either fulfill or reject, returning an array of outcomes without short-circuiting on errors"
        },
        {
          "id": "opt_3",
          "text": "allSettled runs promises in synchronous sequential order"
        },
        {
          "id": "opt_4",
          "text": "allSettled can only be used with DOM events"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Promise.all fails fast if any promise rejects. Promise.allSettled waits for all promises to settle and returns their individual statuses and values/reasons.",
      "difficulty": "intermediate"
    },
    {
      "id": "js-q7",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What technique delays function execution until a specified delay has passed since the last invocation (commonly used for search inputs)?",
      "options": [
        {
          "id": "opt_1",
          "text": "Throttling"
        },
        {
          "id": "opt_2",
          "text": "Debouncing"
        },
        {
          "id": "opt_3",
          "text": "Currying"
        },
        {
          "id": "opt_4",
          "text": "Memoization"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Debouncing bunches multiple calls together and waits until user activity pauses for a threshold time. Throttling limits calls to once per fixed time interval.",
      "difficulty": "intermediate"
    },
    {
      "id": "js-q8",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What does `Array.prototype.reduce()` do?",
      "options": [
        {
          "id": "opt_1",
          "text": "Removes duplicate items from an array"
        },
        {
          "id": "opt_2",
          "text": "Executes a reducer function on each element, accumulating them into a single resultant value"
        },
        {
          "id": "opt_3",
          "text": "Shortens the array length by half"
        },
        {
          "id": "opt_4",
          "text": "Sorts the array in descending order"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "reduce() iterates through an array, passing an accumulator and current value to build a single output (e.g. sum, object dictionary, grouped map).",
      "difficulty": "advanced"
    },
    {
      "id": "js-q9",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What is the \"Temporal Dead Zone\" (TDZ) in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "The time during garbage collection when scripts pause"
        },
        {
          "id": "opt_2",
          "text": "The region of code from the start of a block until a `let` or `const` variable is initialized, where accessing it throws a ReferenceError"
        },
        {
          "id": "opt_3",
          "text": "The timeout delay before setTimeout fires"
        },
        {
          "id": "opt_4",
          "text": "The period before DOMContentLoaded fires"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "While `let` and `const` variables are hoisted, they are not initialized until their declaration line is evaluated. Accessing them in the TDZ throws ReferenceError.",
      "difficulty": "advanced"
    },
    {
      "id": "js-q10",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "question": "What is the output of `typeof NaN` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "\"undefined\""
        },
        {
          "id": "opt_2",
          "text": "\"number\""
        },
        {
          "id": "opt_3",
          "text": "\"NaN\""
        },
        {
          "id": "opt_4",
          "text": "\"boolean\""
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In the IEEE 754 floating-point specification and JavaScript standard, NaN (Not-a-Number) is a numeric data type representing an undefined or unrepresentable numeric result.",
      "difficulty": "advanced"
    },
    {
      "id": "js-q11",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the output of `typeof NaN` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "\"nan\""
        },
        {
          "id": "opt_2",
          "text": "\"number\""
        },
        {
          "id": "opt_3",
          "text": "\"undefined\""
        },
        {
          "id": "opt_4",
          "text": "\"object\""
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In the IEEE 754 floating-point specification and JavaScript, NaN represents \"Not-a-Number\", but its data type is officially \"number\"."
    },
    {
      "id": "js-q12",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the difference between `==` and `===` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "`==` checks value and type; `===` checks value only"
        },
        {
          "id": "opt_2",
          "text": "`==` performs type coercion before comparison; `===` strictly requires identical types and values"
        },
        {
          "id": "opt_3",
          "text": "`===` is deprecated in modern ECMAScript"
        },
        {
          "id": "opt_4",
          "text": "They behave identically for all primitives"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Loose equality (`==`) coerces operands of differing types (e.g. `5 == \"5\"` is true), while strict equality (`===`) rejects values of different types."
    },
    {
      "id": "js-q13",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "Which method adds one or more elements to the beginning of an array?",
      "options": [
        {
          "id": "opt_1",
          "text": "array.push()"
        },
        {
          "id": "opt_2",
          "text": "array.unshift()"
        },
        {
          "id": "opt_3",
          "text": "array.shift()"
        },
        {
          "id": "opt_4",
          "text": "array.prepend()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`unshift()` adds elements to the start of the array and returns the new array length, whereas `shift()` removes the first element."
    },
    {
      "id": "js-q14",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What does `Array.prototype.map()` return?",
      "options": [
        {
          "id": "opt_1",
          "text": "The original array mutated in place"
        },
        {
          "id": "opt_2",
          "text": "A new array with the results of calling the provided function on every element"
        },
        {
          "id": "opt_3",
          "text": "A single aggregated number or string"
        },
        {
          "id": "opt_4",
          "text": "A boolean indicating if all elements passed the test"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`map()` creates a new array populated with the results of invoking the callback on each element, without mutating the source array."
    },
    {
      "id": "js-q15",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the value of `Boolean(\"\")` and `Boolean(\"0\")`?",
      "options": [
        {
          "id": "opt_1",
          "text": "false, false"
        },
        {
          "id": "opt_2",
          "text": "false, true"
        },
        {
          "id": "opt_3",
          "text": "true, false"
        },
        {
          "id": "opt_4",
          "text": "true, true"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The empty string `\"\"` is falsy, but `\"0\"` is a non-empty string which evaluates to true."
    },
    {
      "id": "js-q16",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the output of `[1, 2, 10, 21].sort()` without a compare function?",
      "options": [
        {
          "id": "opt_1",
          "text": "[1, 2, 10, 21]"
        },
        {
          "id": "opt_2",
          "text": "[1, 10, 2, 21]"
        },
        {
          "id": "opt_3",
          "text": "[21, 10, 2, 1]"
        },
        {
          "id": "opt_4",
          "text": "TypeError: compareFunction missing"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "By default, `Array.prototype.sort()` converts elements to strings and compares UTF-16 code units, meaning `\"10\"` precedes `\"2\"` lexicographically."
    },
    {
      "id": "js-q17",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What happens to `this` inside an arrow function?",
      "options": [
        {
          "id": "opt_1",
          "text": "It binds to the object that invoked the function"
        },
        {
          "id": "opt_2",
          "text": "It lexically retains `this` from the enclosing execution context where it was defined"
        },
        {
          "id": "opt_3",
          "text": "It always equals `undefined`"
        },
        {
          "id": "opt_4",
          "text": "It can be rebound using `.bind()` or `.call()`"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Arrow functions do not possess their own `this` binding; they resolve `this` lexically from their containing scope."
    },
    {
      "id": "js-q18",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the purpose of `Promise.allSettled()` compared to `Promise.all()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "Promise.allSettled() rejects immediately on the first error"
        },
        {
          "id": "opt_2",
          "text": "Promise.allSettled() waits for all promises to complete regardless of fulfillment or rejection, returning statuses for all"
        },
        {
          "id": "opt_3",
          "text": "Promise.allSettled() runs promises on a background worker thread"
        },
        {
          "id": "opt_4",
          "text": "Promise.allSettled() can only accept synchronous values"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`Promise.all` fails fast as soon as one promise rejects, whereas `Promise.allSettled` waits until all promises finish and returns an array with status and value/reason."
    },
    {
      "id": "js-q19",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is optional chaining (`?.`) used for in modern JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "To perform optional math operations"
        },
        {
          "id": "opt_2",
          "text": "To read the value of a property located deep within a chain of connected objects without causing a TypeError if a reference is null or undefined"
        },
        {
          "id": "opt_3",
          "text": "To create weak references in memory"
        },
        {
          "id": "opt_4",
          "text": "To conditionally import ES modules"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`obj?.prop` short-circuits and returns `undefined` if `obj` is `null` or `undefined`, preventing `TypeError: Cannot read properties of undefined`."
    },
    {
      "id": "js-q20",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the result of using the Spread syntax on an object: `{ ...a, b: 2 }`?",
      "options": [
        {
          "id": "opt_1",
          "text": "It creates a deep copy of object a"
        },
        {
          "id": "opt_2",
          "text": "It shallow-copies enumerable own properties from object a into a new object, with b overwritten or appended"
        },
        {
          "id": "opt_3",
          "text": "It mutates object a directly"
        },
        {
          "id": "opt_4",
          "text": "It converts the object into an array"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Object spread copies own enumerable properties into a fresh object instance at the top level (shallow copy)."
    },
    {
      "id": "js-q21",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "In the JavaScript event loop, what is the priority order between Microtasks and Macrotasks?",
      "options": [
        {
          "id": "opt_1",
          "text": "Macrotasks always execute before any microtasks"
        },
        {
          "id": "opt_2",
          "text": "All queued Microtasks (Promises, queueMicrotask) execute immediately after the current script and before the next Macrotask (setTimeout, setInterval)"
        },
        {
          "id": "opt_3",
          "text": "They execute alternately one-by-one"
        },
        {
          "id": "opt_4",
          "text": "Priority is decided purely by memory allocation"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The microtask queue is drained completely after the execution of each callback before the browser/Node event loop moves to the next macrotask."
    },
    {
      "id": "js-q22",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the purpose of `WeakMap` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "A map that loses entries when computer memory is low"
        },
        {
          "id": "opt_2",
          "text": "A key-value collection whose keys must be objects and are weakly referenced, allowing garbage collection when no other references exist"
        },
        {
          "id": "opt_3",
          "text": "A map that only holds string keys"
        },
        {
          "id": "opt_4",
          "text": "A map without `.set()` or `.get()` methods"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`WeakMap` keys are held weakly, preventing memory leaks when associating metadata with objects whose lifecycles are managed elsewhere."
    },
    {
      "id": "js-q23",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What does `Object.freeze()` do vs `Object.seal()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "freeze prevents adding properties; seal allows adding properties"
        },
        {
          "id": "opt_2",
          "text": "freeze makes all existing properties read-only (non-writable) and prevents extensions; seal prevents extensions and deletions but allows modifying existing writable properties"
        },
        {
          "id": "opt_3",
          "text": "seal deletes all functions; freeze saves them"
        },
        {
          "id": "opt_4",
          "text": "There is no difference"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`Object.freeze()` locks down properties so their values cannot be changed; `Object.seal()` prevents adding or deleting keys, but existing values remain mutable if writable."
    },
    {
      "id": "js-q24",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is a JavaScript Generator function (`function*`) and what does `yield*` do?",
      "options": [
        {
          "id": "opt_1",
          "text": "It creates web worker threads; yield* stops the thread"
        },
        {
          "id": "opt_2",
          "text": "It returns a Generator object that can be paused/resumed; yield* delegates iteration to another iterable or generator"
        },
        {
          "id": "opt_3",
          "text": "It compiles JavaScript code into WebAssembly"
        },
        {
          "id": "opt_4",
          "text": "It runs synchronous loops asynchronously"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`function*` defines an iterator factory, and `yield*` delegates sequence emission to another iterable object sequentially."
    },
    {
      "id": "js-q25",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the Temporal Dead Zone (TDZ) in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "A zone in memory where deleted variables reside"
        },
        {
          "id": "opt_2",
          "text": "The period between entering a scope and declaring a `let` or `const` variable where accessing it throws a ReferenceError"
        },
        {
          "id": "opt_3",
          "text": "A timeout delay in asynchronous timers"
        },
        {
          "id": "opt_4",
          "text": "A garbage collection pause"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Variables declared with `let` and `const` are hoisted but uninitialized, remaining in the TDZ until execution evaluates their declaration statement."
    },
    {
      "id": "js-q11",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "basic",
      "question": "What is the output of `typeof NaN` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "\"nan\""
        },
        {
          "id": "opt_2",
          "text": "\"number\""
        },
        {
          "id": "opt_3",
          "text": "\"undefined\""
        },
        {
          "id": "opt_4",
          "text": "\"object\""
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In the IEEE 754 floating-point specification and JavaScript, NaN represents \"Not-a-Number\", but its data type is officially \"number\"."
    },
    {
      "id": "js-q12",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "basic",
      "question": "What is the difference between `==` and `===` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "`==` checks value and type; `===` checks value only"
        },
        {
          "id": "opt_2",
          "text": "`==` performs type coercion before comparison; `===` strictly requires identical types and values"
        },
        {
          "id": "opt_3",
          "text": "`===` is deprecated in modern ECMAScript"
        },
        {
          "id": "opt_4",
          "text": "They behave identically for all primitives"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Loose equality (`==`) coerces operands of differing types (e.g. `5 == \"5\"` is true), while strict equality (`===`) rejects values of different types."
    },
    {
      "id": "js-q13",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "basic",
      "question": "Which method adds one or more elements to the beginning of an array?",
      "options": [
        {
          "id": "opt_1",
          "text": "array.push()"
        },
        {
          "id": "opt_2",
          "text": "array.unshift()"
        },
        {
          "id": "opt_3",
          "text": "array.shift()"
        },
        {
          "id": "opt_4",
          "text": "array.prepend()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`unshift()` adds elements to the start of the array and returns the new array length, whereas `shift()` removes the first element."
    },
    {
      "id": "js-q14",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "basic",
      "question": "What does `Array.prototype.map()` return?",
      "options": [
        {
          "id": "opt_1",
          "text": "The original array mutated in place"
        },
        {
          "id": "opt_2",
          "text": "A new array with the results of calling the provided function on every element"
        },
        {
          "id": "opt_3",
          "text": "A single aggregated number or string"
        },
        {
          "id": "opt_4",
          "text": "A boolean indicating if all elements passed the test"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`map()` creates a new array populated with the results of invoking the callback on each element, without mutating the source array."
    },
    {
      "id": "js-q15",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "basic",
      "question": "What is the value of `Boolean(\"\")` and `Boolean(\"0\")`?",
      "options": [
        {
          "id": "opt_1",
          "text": "false, false"
        },
        {
          "id": "opt_2",
          "text": "false, true"
        },
        {
          "id": "opt_3",
          "text": "true, false"
        },
        {
          "id": "opt_4",
          "text": "true, true"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The empty string `\"\"` is falsy, but `\"0\"` is a non-empty string which evaluates to true."
    },
    {
      "id": "js-q16",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "intermediate",
      "question": "What is the output of `[1, 2, 10, 21].sort()` without a compare function?",
      "options": [
        {
          "id": "opt_1",
          "text": "[1, 2, 10, 21]"
        },
        {
          "id": "opt_2",
          "text": "[1, 10, 2, 21]"
        },
        {
          "id": "opt_3",
          "text": "[21, 10, 2, 1]"
        },
        {
          "id": "opt_4",
          "text": "TypeError: compareFunction missing"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "By default, `Array.prototype.sort()` converts elements to strings and compares UTF-16 code units, meaning `\"10\"` precedes `\"2\"` lexicographically."
    },
    {
      "id": "js-q17",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "intermediate",
      "question": "What happens to `this` inside an arrow function?",
      "options": [
        {
          "id": "opt_1",
          "text": "It binds to the object that invoked the function"
        },
        {
          "id": "opt_2",
          "text": "It lexically retains `this` from the enclosing execution context where it was defined"
        },
        {
          "id": "opt_3",
          "text": "It always equals `undefined`"
        },
        {
          "id": "opt_4",
          "text": "It can be rebound using `.bind()` or `.call()`"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Arrow functions do not possess their own `this` binding; they resolve `this` lexically from their containing scope."
    },
    {
      "id": "js-q18",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "intermediate",
      "question": "What is the purpose of `Promise.allSettled()` compared to `Promise.all()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "Promise.allSettled() rejects immediately on the first error"
        },
        {
          "id": "opt_2",
          "text": "Promise.allSettled() waits for all promises to complete regardless of fulfillment or rejection, returning statuses for all"
        },
        {
          "id": "opt_3",
          "text": "Promise.allSettled() runs promises on a background worker thread"
        },
        {
          "id": "opt_4",
          "text": "Promise.allSettled() can only accept synchronous values"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`Promise.all` fails fast as soon as one promise rejects, whereas `Promise.allSettled` waits until all promises finish and returns an array with status and value/reason."
    },
    {
      "id": "js-q19",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "intermediate",
      "question": "What is optional chaining (`?.`) used for in modern JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "To perform optional math operations"
        },
        {
          "id": "opt_2",
          "text": "To read the value of a property located deep within a chain of connected objects without causing a TypeError if a reference is null or undefined"
        },
        {
          "id": "opt_3",
          "text": "To create weak references in memory"
        },
        {
          "id": "opt_4",
          "text": "To conditionally import ES modules"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`obj?.prop` short-circuits and returns `undefined` if `obj` is `null` or `undefined`, preventing `TypeError: Cannot read properties of undefined`."
    },
    {
      "id": "js-q20",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "intermediate",
      "question": "What is the result of using the Spread syntax on an object: `{ ...a, b: 2 }`?",
      "options": [
        {
          "id": "opt_1",
          "text": "It creates a deep copy of object a"
        },
        {
          "id": "opt_2",
          "text": "It shallow-copies enumerable own properties from object a into a new object, with b overwritten or appended"
        },
        {
          "id": "opt_3",
          "text": "It mutates object a directly"
        },
        {
          "id": "opt_4",
          "text": "It converts the object into an array"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Object spread copies own enumerable properties into a fresh object instance at the top level (shallow copy)."
    },
    {
      "id": "js-q21",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "In the JavaScript event loop, what is the priority order between Microtasks and Macrotasks?",
      "options": [
        {
          "id": "opt_1",
          "text": "Macrotasks always execute before any microtasks"
        },
        {
          "id": "opt_2",
          "text": "All queued Microtasks (Promises, queueMicrotask) execute immediately after the current script and before the next Macrotask (setTimeout, setInterval)"
        },
        {
          "id": "opt_3",
          "text": "They execute alternately one-by-one"
        },
        {
          "id": "opt_4",
          "text": "Priority is decided purely by memory allocation"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The microtask queue is drained completely after the execution of each callback before the browser/Node event loop moves to the next macrotask."
    },
    {
      "id": "js-q22",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the purpose of `WeakMap` in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "A map that loses entries when computer memory is low"
        },
        {
          "id": "opt_2",
          "text": "A key-value collection whose keys must be objects and are weakly referenced, allowing garbage collection when no other references exist"
        },
        {
          "id": "opt_3",
          "text": "A map that only holds string keys"
        },
        {
          "id": "opt_4",
          "text": "A map without `.set()` or `.get()` methods"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`WeakMap` keys are held weakly, preventing memory leaks when associating metadata with objects whose lifecycles are managed elsewhere."
    },
    {
      "id": "js-q23",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What does `Object.freeze()` do vs `Object.seal()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "freeze prevents adding properties; seal allows adding properties"
        },
        {
          "id": "opt_2",
          "text": "freeze makes all existing properties read-only (non-writable) and prevents extensions; seal prevents extensions and deletions but allows modifying existing writable properties"
        },
        {
          "id": "opt_3",
          "text": "seal deletes all functions; freeze saves them"
        },
        {
          "id": "opt_4",
          "text": "There is no difference"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`Object.freeze()` locks down properties so their values cannot be changed; `Object.seal()` prevents adding or deleting keys, but existing values remain mutable if writable."
    },
    {
      "id": "js-q24",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is a JavaScript Generator function (`function*`) and what does `yield*` do?",
      "options": [
        {
          "id": "opt_1",
          "text": "It creates web worker threads; yield* stops the thread"
        },
        {
          "id": "opt_2",
          "text": "It returns a Generator object that can be paused/resumed; yield* delegates iteration to another iterable or generator"
        },
        {
          "id": "opt_3",
          "text": "It compiles JavaScript code into WebAssembly"
        },
        {
          "id": "opt_4",
          "text": "It runs synchronous loops asynchronously"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`function*` defines an iterator factory, and `yield*` delegates sequence emission to another iterable object sequentially."
    },
    {
      "id": "js-q25",
      "skillId": "javascript",
      "skillName": "JavaScript",
      "difficulty": "advanced",
      "question": "What is the Temporal Dead Zone (TDZ) in JavaScript?",
      "options": [
        {
          "id": "opt_1",
          "text": "A zone in memory where deleted variables reside"
        },
        {
          "id": "opt_2",
          "text": "The period between entering a scope and declaring a `let` or `const` variable where accessing it throws a ReferenceError"
        },
        {
          "id": "opt_3",
          "text": "A timeout delay in asynchronous timers"
        },
        {
          "id": "opt_4",
          "text": "A garbage collection pause"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Variables declared with `let` and `const` are hoisted but uninitialized, remaining in the TDZ until execution evaluates their declaration statement."
    }
  ],
  "htmlcss": [
    {
      "id": "hc-q1",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "What is the difference between `box-sizing: content-box` and `box-sizing: border-box` in CSS?",
      "options": [
        {
          "id": "opt_1",
          "text": "border-box excludes borders from the element calculation"
        },
        {
          "id": "opt_2",
          "text": "border-box includes padding and border within the specified width and height, whereas content-box adds them on top of the dimensions"
        },
        {
          "id": "opt_3",
          "text": "content-box renders elements without margins"
        },
        {
          "id": "opt_4",
          "text": "border-box only works on table elements"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "With border-box, an element with width: 200px and 20px padding remains 200px wide. With content-box, the total rendered width becomes 240px.",
      "difficulty": "basic"
    },
    {
      "id": "hc-q2",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "Which CSS property creates a two-dimensional grid layout capable of handling both rows and columns simultaneously?",
      "options": [
        {
          "id": "opt_1",
          "text": "display: flex"
        },
        {
          "id": "opt_2",
          "text": "display: grid"
        },
        {
          "id": "opt_3",
          "text": "display: inline-block"
        },
        {
          "id": "opt_4",
          "text": "display: table"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "CSS Grid is designed for 2D layouts (rows and columns simultaneously), whereas Flexbox is primarily designed for 1D layouts (a single row or column at a time).",
      "difficulty": "basic"
    },
    {
      "id": "hc-q3",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "What is the CSS specificity hierarchy from highest to lowest priority?",
      "options": [
        {
          "id": "opt_1",
          "text": "Element -> Class -> ID -> Inline style"
        },
        {
          "id": "opt_2",
          "text": "Inline style -> ID selector -> Class/Attribute/Pseudo-class -> Element selector"
        },
        {
          "id": "opt_3",
          "text": "Class -> ID -> Element -> Inline style"
        },
        {
          "id": "opt_4",
          "text": "All selectors have identical specificity weight"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Inline styles (1,0,0,0) override ID selectors (0,1,0,0), which override class/pseudo-classes (0,0,1,0), which override element selectors (0,0,0,1).",
      "difficulty": "basic"
    },
    {
      "id": "hc-q4",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "How does `position: sticky` behave in CSS?",
      "options": [
        {
          "id": "opt_1",
          "text": "It positions an element relative to the entire screen viewport at all times"
        },
        {
          "id": "opt_2",
          "text": "It acts as `relative` until a specified scroll threshold is reached, then sticks like `fixed` within its parent container"
        },
        {
          "id": "opt_3",
          "text": "It prevents the element from being clicked"
        },
        {
          "id": "opt_4",
          "text": "It animates smoothly to the center of the screen"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "sticky toggles between relative and fixed positioning based on the user scroll position, constrained within the bounds of its parent container.",
      "difficulty": "intermediate"
    },
    {
      "id": "hc-q5",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "Why should semantic HTML tags (like `<nav>`, `<article>`, `<main>`) be used instead of generic `<div>` tags?",
      "options": [
        {
          "id": "opt_1",
          "text": "They automatically style elements with dark backgrounds"
        },
        {
          "id": "opt_2",
          "text": "They provide accessible landmark navigation for screen readers and improve search engine (SEO) indexing"
        },
        {
          "id": "opt_3",
          "text": "They speed up JavaScript execution"
        },
        {
          "id": "opt_4",
          "text": "They prevent CSS styling errors"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Semantic HTML conveys meaning to assistive technologies (screen readers) and search engines, ensuring an accessible and structured document tree.",
      "difficulty": "intermediate"
    },
    {
      "id": "hc-q6",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "What is the purpose of the `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">` tag in HTML?",
      "options": [
        {
          "id": "opt_1",
          "text": "Enables 3D hardware acceleration in mobile browsers"
        },
        {
          "id": "opt_2",
          "text": "Instructs mobile browsers to match screen width and sets initial zoom level for responsive rendering"
        },
        {
          "id": "opt_3",
          "text": "Preloads all CSS stylesheets"
        },
        {
          "id": "opt_4",
          "text": "Enables dark mode automatically"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Without the viewport meta tag, mobile browsers assume a desktop viewport (~980px) and scale down content, breaking responsive media queries.",
      "difficulty": "intermediate"
    },
    {
      "id": "hc-q7",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "What CSS unit is relative to the font-size of the root `<html>` element?",
      "options": [
        {
          "id": "opt_1",
          "text": "em"
        },
        {
          "id": "opt_2",
          "text": "rem"
        },
        {
          "id": "opt_3",
          "text": "vh"
        },
        {
          "id": "opt_4",
          "text": "ch"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "rem stands for \"root em\" and scales relative to the root html font-size (typically 16px by default), unlike em which scales relative to the immediate parent font-size.",
      "difficulty": "intermediate"
    },
    {
      "id": "hc-q8",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "What does the CSS property `flex-wrap: wrap` do in a Flexbox container?",
      "options": [
        {
          "id": "opt_1",
          "text": "Shrinks all items to zero width"
        },
        {
          "id": "opt_2",
          "text": "Allows flex items to break onto multiple lines if they exceed container width instead of overflowing or squishing"
        },
        {
          "id": "opt_3",
          "text": "Reverses the order of flex items"
        },
        {
          "id": "opt_4",
          "text": "Aligns items vertically in the center"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "By default, flex-wrap is nowrap which forces all items onto a single line. Setting wrap allows elements to wrap gracefully onto subsequent lines.",
      "difficulty": "advanced"
    },
    {
      "id": "hc-q9",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "What creates a new Stacking Context in CSS affecting `z-index` layering?",
      "options": [
        {
          "id": "opt_1",
          "text": "Adding a class attribute to an element"
        },
        {
          "id": "opt_2",
          "text": "Positioned elements with z-index, opacity less than 1, transform properties, or filter effects"
        },
        {
          "id": "opt_3",
          "text": "Any paragraph element"
        },
        {
          "id": "opt_4",
          "text": "Setting font-size to 14px"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A stacking context is a 3D conceptualization of HTML elements. Once formed, child z-index values are contained and cannot break out relative to parent siblings.",
      "difficulty": "advanced"
    },
    {
      "id": "hc-q10",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "question": "What is the purpose of the `alt` attribute on `<img>` tags?",
      "options": [
        {
          "id": "opt_1",
          "text": "Defines the image width in pixels"
        },
        {
          "id": "opt_2",
          "text": "Provides descriptive alternative text for visually impaired users using screen readers and when images fail to load"
        },
        {
          "id": "opt_3",
          "text": "Applies visual filters to the image"
        },
        {
          "id": "opt_4",
          "text": "Specifies the URL for image caching"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The alt attribute is critical for web accessibility (WCAG) and provides fallback text if the image asset is unavailable.",
      "difficulty": "advanced"
    },
    {
      "id": "hc-q11",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "basic",
      "question": "Which HTML5 tag represents the primary navigation links of a website?",
      "options": [
        {
          "id": "opt_1",
          "text": "<navigate>"
        },
        {
          "id": "opt_2",
          "text": "<nav>"
        },
        {
          "id": "opt_3",
          "text": "<menu>"
        },
        {
          "id": "opt_4",
          "text": "<header-nav>"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The semantic HTML5 <nav> element designates a section intended for site or page navigation links."
    },
    {
      "id": "hc-q12",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "basic",
      "question": "What does the CSS property `box-sizing: border-box` do?",
      "options": [
        {
          "id": "opt_1",
          "text": "Adds a thick border around all containers"
        },
        {
          "id": "opt_2",
          "text": "Includes padding and border within the element's declared width and height"
        },
        {
          "id": "opt_3",
          "text": "Centers the element inside its parent"
        },
        {
          "id": "opt_4",
          "text": "Hides overflowing content"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`border-box` calculates width/height inclusive of padding and borders, avoiding unexpected layout overflows."
    },
    {
      "id": "hc-q13",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "basic",
      "question": "Which CSS unit is relative to the font-size of the root `<html>` element?",
      "options": [
        {
          "id": "opt_1",
          "text": "em"
        },
        {
          "id": "opt_2",
          "text": "rem"
        },
        {
          "id": "opt_3",
          "text": "vh"
        },
        {
          "id": "opt_4",
          "text": "px"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`rem` stands for \"root em\" and scales relative to the root html element's font-size, unlike `em` which scales relative to immediate parent font-size."
    },
    {
      "id": "hc-q14",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "basic",
      "question": "What is the default display value of a `<div>` element vs a `<span>` element?",
      "options": [
        {
          "id": "opt_1",
          "text": "inline for div, block for span"
        },
        {
          "id": "opt_2",
          "text": "block for div, inline for span"
        },
        {
          "id": "opt_3",
          "text": "flex for div, grid for span"
        },
        {
          "id": "opt_4",
          "text": "inline-block for both"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`div` is a block-level container taking 100% width of parent; `span` is an inline text container occupying only its content width."
    },
    {
      "id": "hc-q15",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "basic",
      "question": "Which HTML attribute provides alternative text for images when they fail to load?",
      "options": [
        {
          "id": "opt_1",
          "text": "title"
        },
        {
          "id": "opt_2",
          "text": "alt"
        },
        {
          "id": "opt_3",
          "text": "caption"
        },
        {
          "id": "opt_4",
          "text": "src-fallback"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `alt` attribute specifies accessibility descriptions for screen readers and fallbacks if images fail to load."
    },
    {
      "id": "hc-q16",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "intermediate",
      "question": "What is CSS margin collapsing?",
      "options": [
        {
          "id": "opt_1",
          "text": "Margins turning into padding automatically on mobile screens"
        },
        {
          "id": "opt_2",
          "text": "When adjoining top and bottom margins of block elements collapse into a single margin equal to the largest one"
        },
        {
          "id": "opt_3",
          "text": "When negative margins cancel out positive borders"
        },
        {
          "id": "opt_4",
          "text": "When margin values are ignored by flex containers"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Top and bottom vertical margins between sibling block elements combine into the maximum of the two rather than summing."
    },
    {
      "id": "hc-q17",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "intermediate",
      "question": "How is CSS selector specificity calculated?",
      "options": [
        {
          "id": "opt_1",
          "text": "By the total character length of the selector string"
        },
        {
          "id": "opt_2",
          "text": "By a hierarchy: Inline styles > ID selectors > Class/Attribute/Pseudo-class > Element/Pseudo-element"
        },
        {
          "id": "opt_3",
          "text": "Whichever rule was written latest in the CSS file always wins"
        },
        {
          "id": "opt_4",
          "text": "Alphabetical order of tag names"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "CSS specificity ranks weights across inline (1,0,0,0), IDs (0,1,0,0), classes/pseudo-classes (0,0,1,0), and tags (0,0,0,1)."
    },
    {
      "id": "hc-q18",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "intermediate",
      "question": "What is the primary difference between CSS Grid and CSS Flexbox?",
      "options": [
        {
          "id": "opt_1",
          "text": "Grid is obsolete and replaced by Flexbox"
        },
        {
          "id": "opt_2",
          "text": "Flexbox is primarily 1-dimensional (row OR column), whereas Grid is 2-dimensional (rows AND columns simultaneously)"
        },
        {
          "id": "opt_3",
          "text": "Flexbox cannot center items vertically"
        },
        {
          "id": "opt_4",
          "text": "Grid only works with fixed pixel units"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Flexbox distributes elements along a single main axis, whereas CSS Grid aligns elements across both rows and columns."
    },
    {
      "id": "hc-q19",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "intermediate",
      "question": "How does `position: sticky` behave in CSS?",
      "options": [
        {
          "id": "opt_1",
          "text": "It fixes the element relative to the viewport at all times"
        },
        {
          "id": "opt_2",
          "text": "Treated as relative until the viewport crosses a scroll threshold, then sticks like fixed within its parent container"
        },
        {
          "id": "opt_3",
          "text": "Prevents the element from being dragged by user cursor"
        },
        {
          "id": "opt_4",
          "text": "Sticks the element to the bottom edge of the document"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`position: sticky` toggles between relative and fixed positioning depending on user scroll position and parent bounding box."
    },
    {
      "id": "hc-q20",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "intermediate",
      "question": "What does the CSS pseudo-class `:nth-child(2n+1)` match?",
      "options": [
        {
          "id": "opt_1",
          "text": "Even numbered children"
        },
        {
          "id": "opt_2",
          "text": "Odd numbered children (1st, 3rd, 5th, etc.)"
        },
        {
          "id": "opt_3",
          "text": "The second child only"
        },
        {
          "id": "opt_4",
          "text": "Every child after the second"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "For n=0, 2(0)+1 = 1; for n=1, 2(1)+1 = 3; which targets all odd child elements."
    },
    {
      "id": "hc-q21",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "advanced",
      "question": "What triggers a new Stacking Context in CSS?",
      "options": [
        {
          "id": "opt_1",
          "text": "Any element with `float: left`"
        },
        {
          "id": "opt_2",
          "text": "Root element, positioned element with non-auto z-index, opacity < 1, transform, filter, or will-change properties"
        },
        {
          "id": "opt_3",
          "text": "Adding an id attribute to a div"
        },
        {
          "id": "opt_4",
          "text": "Any table row or table header"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Stacking contexts confine z-index values so child z-indices cannot escape or interleave with external elements outside their context."
    },
    {
      "id": "hc-q22",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "advanced",
      "question": "What is the performance advantage of animating `transform` and `opacity` over `top` and `left` in CSS?",
      "options": [
        {
          "id": "opt_1",
          "text": "There is no performance difference in modern browsers"
        },
        {
          "id": "opt_2",
          "text": "`transform` and `opacity` can be handled entirely by the GPU compositor thread without triggering layout reflow or repaint"
        },
        {
          "id": "opt_3",
          "text": "`top` and `left` are not supported in Safari"
        },
        {
          "id": "opt_4",
          "text": "`transform` automatically pauses background tabs"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Modifying geometry (top/left/width) forces expensive browser Reflow (layout) and Repaint; transform/opacity only triggers Composite on the GPU."
    },
    {
      "id": "hc-q23",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "advanced",
      "question": "What is the purpose of the CSS `contain` property (`contain: content / strict / layout`)?",
      "options": [
        {
          "id": "opt_1",
          "text": "To encrypt DOM nodes against web scraping"
        },
        {
          "id": "opt_2",
          "text": "To isolate a subtree from the rest of the page so browser recalculations of layout, style, and paint don't propagate globally"
        },
        {
          "id": "opt_3",
          "text": "To limit database queries from HTML"
        },
        {
          "id": "opt_4",
          "text": "To enforce strict HTML doctype validation"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "CSS containment isolates component DOM subtrees, enabling browser rendering engines to optimize rendering and skip offscreen subtrees."
    },
    {
      "id": "hc-q24",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "advanced",
      "question": "How do CSS Custom Properties (`--var-name`) differ from SASS/SCSS variables (`$var`)?",
      "options": [
        {
          "id": "opt_1",
          "text": "They are identical"
        },
        {
          "id": "opt_2",
          "text": "CSS Custom Properties live in the DOM, cascade down elements, and can be read or modified dynamically at runtime with JavaScript"
        },
        {
          "id": "opt_3",
          "text": "SASS variables can be accessed in browser devtools"
        },
        {
          "id": "opt_4",
          "text": "CSS Custom Properties require a Ruby precompiler"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "SASS variables are statically compiled away before reaching the browser, whereas CSS variables participate in runtime DOM cascading and theming."
    },
    {
      "id": "hc-q25",
      "skillId": "htmlcss",
      "skillName": "HTML & CSS",
      "difficulty": "advanced",
      "question": "What is the purpose of the `subgrid` value in CSS Grid Level 2?",
      "options": [
        {
          "id": "opt_1",
          "text": "Creates nested responsive SVG coordinates"
        },
        {
          "id": "opt_2",
          "text": "Allows a nested grid item to inherit track sizes and alignment lines directly from its parent grid container"
        },
        {
          "id": "opt_3",
          "text": "Enables WebGL rendering in CSS"
        },
        {
          "id": "opt_4",
          "text": "Duplicates column lines across multiple media queries"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`subgrid` allows child grid elements to align their own contents directly with the columns and rows defined in the ancestor grid."
    }
  ],
  "react": [
    {
      "id": "rc-q1",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "What is the Virtual DOM in React and why does React use it?",
      "options": [
        {
          "id": "opt_1",
          "text": "A direct replacement for the browser DOM written in WebAssembly"
        },
        {
          "id": "opt_2",
          "text": "A lightweight in-memory representation of the real DOM that React diffs to minimize slow physical DOM updates"
        },
        {
          "id": "opt_3",
          "text": "A browser plugin required to run JSX"
        },
        {
          "id": "opt_4",
          "text": "A database that stores React components on the server"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Direct DOM manipulation is computationally expensive. React maintains an in-memory Virtual DOM, computes changes using a reconciliation algorithm, and batches optimal DOM updates.",
      "difficulty": "basic"
    },
    {
      "id": "rc-q2",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "Why should you NOT use array indexes as `key` props in dynamic React lists?",
      "options": [
        {
          "id": "opt_1",
          "text": "React throws a compilation error if an index is used"
        },
        {
          "id": "opt_2",
          "text": "If items are reordered, inserted, or removed, index keys cause incorrect component state retention and rendering bugs"
        },
        {
          "id": "opt_3",
          "text": "Array indexes are not supported in JavaScript objects"
        },
        {
          "id": "opt_4",
          "text": "Indexes double the memory consumed by the Virtual DOM"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Keys give items stable identity across renders. When items are reordered or deleted, index keys shift, causing React to misidentify matching elements and corrupt local component state.",
      "difficulty": "basic"
    },
    {
      "id": "rc-q3",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "When does the cleanup function in a `useEffect` hook execute?",
      "options": [
        {
          "id": "opt_1",
          "text": "Only when the entire browser tab is closed"
        },
        {
          "id": "opt_2",
          "text": "Before the component unmounts and before re-running the effect on subsequent dependency updates"
        },
        {
          "id": "opt_3",
          "text": "Immediately after the component mounts"
        },
        {
          "id": "opt_4",
          "text": "Every time the user clicks on the page"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The function returned from useEffect runs prior to component unmounting or before re-executing the effect when dependencies change, preventing memory leaks and dangling subscriptions.",
      "difficulty": "basic"
    },
    {
      "id": "rc-q4",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "What is the difference between `useMemo` and `useCallback` in React?",
      "options": [
        {
          "id": "opt_1",
          "text": "useMemo memoizes a computed value; useCallback memoizes a function definition"
        },
        {
          "id": "opt_2",
          "text": "useCallback is for server components; useMemo is for client components"
        },
        {
          "id": "opt_3",
          "text": "useMemo triggers re-renders; useCallback prevents re-renders"
        },
        {
          "id": "opt_4",
          "text": "There is no difference in React 18"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "useMemo(fn, deps) caches the calculated result of a function. useCallback(fn, deps) caches the function instance itself across re-renders to prevent unnecessary child component re-renders.",
      "difficulty": "intermediate"
    },
    {
      "id": "rc-q5",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "What will happen if you update state in React by directly mutating it, e.g. `user.name = \"Alex\";`?",
      "options": [
        {
          "id": "opt_1",
          "text": "React re-renders the component immediately"
        },
        {
          "id": "opt_2",
          "text": "React will not detect the state change because the object reference remained identical, failing to trigger a re-render"
        },
        {
          "id": "opt_3",
          "text": "A fatal JavaScript TypeError is thrown"
        },
        {
          "id": "opt_4",
          "text": "The browser crashes"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "React compares state by shallow reference (Object.is). If you mutate an object directly without returning a new object reference (`setUser({...user, name})`), React skips re-rendering.",
      "difficulty": "intermediate"
    },
    {
      "id": "rc-q6",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "What is a \"Controlled Component\" in React?",
      "options": [
        {
          "id": "opt_1",
          "text": "A component rendered exclusively on the server"
        },
        {
          "id": "opt_2",
          "text": "An input element whose value is driven by React state, with updates handled via event handlers"
        },
        {
          "id": "opt_3",
          "text": "A component wrapped in an Error Boundary"
        },
        {
          "id": "opt_4",
          "text": "A component with strict TypeScript types"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In a controlled component, form data is handled by a React component state rather than the DOM, providing a single source of truth for input values.",
      "difficulty": "intermediate"
    },
    {
      "id": "rc-q7",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "What is the primary purpose of React Context?",
      "options": [
        {
          "id": "opt_1",
          "text": "To replace CSS stylesheets"
        },
        {
          "id": "opt_2",
          "text": "To share data globally across the component tree without manually passing props down through intermediate components (\"prop drilling\")"
        },
        {
          "id": "opt_3",
          "text": "To connect directly to SQL databases"
        },
        {
          "id": "opt_4",
          "text": "To optimize image loading"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Context provides a way to pass data (theme, authenticated user, locale) through the component tree without needing to pass props manually at every level.",
      "difficulty": "intermediate"
    },
    {
      "id": "rc-q8",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "What is the purpose of React Error Boundaries?",
      "options": [
        {
          "id": "opt_1",
          "text": "To catch 404 HTTP errors from API endpoints"
        },
        {
          "id": "opt_2",
          "text": "To catch JavaScript errors anywhere in child component trees, log errors, and display fallback UI instead of crashing the whole app"
        },
        {
          "id": "opt_3",
          "text": "To prevent users from navigating back in history"
        },
        {
          "id": "opt_4",
          "text": "To validate HTML form inputs"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Error Boundaries are React components that catch JavaScript errors during rendering, lifecycle methods, and constructors in the tree below them, preventing white-screen crashes.",
      "difficulty": "advanced"
    },
    {
      "id": "rc-q9",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "What is the `useRef` hook commonly used for in React?",
      "options": [
        {
          "id": "opt_1",
          "text": "To hold a mutable value that persists across renders without triggering a re-render when changed, or to reference a direct DOM node"
        },
        {
          "id": "opt_2",
          "text": "To perform database migrations"
        },
        {
          "id": "opt_3",
          "text": "To animate CSS transitions"
        },
        {
          "id": "opt_4",
          "text": "To replace useState in all scenarios"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "useRef returns a mutable object whose .current property persists for the full lifetime of the component. Changing it does not trigger a re-render.",
      "difficulty": "advanced"
    },
    {
      "id": "rc-q10",
      "skillId": "react",
      "skillName": "Frontend (React)",
      "question": "What is the rule regarding the placement of React Hook invocations?",
      "options": [
        {
          "id": "opt_1",
          "text": "Hooks must only be called inside loops and conditional if statements"
        },
        {
          "id": "opt_2",
          "text": "Hooks must only be called at the top level of React function components or custom hooks, never inside loops, conditions, or nested functions"
        },
        {
          "id": "opt_3",
          "text": "Hooks can be called anywhere in any JavaScript file"
        },
        {
          "id": "opt_4",
          "text": "Hooks must always be called inside setTimeout"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "React relies on the order in which Hooks are called to associate state with each hook call across renders. Calling hooks inside conditions or loops disrupts that sequence.",
      "difficulty": "advanced"
    },
    {
      "id": "react-q11",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "basic",
      "question": "What is JSX in React development?",
      "options": [
        {
          "id": "opt_1",
          "text": "A JSON database format"
        },
        {
          "id": "opt_2",
          "text": "A syntax extension for JavaScript that allows writing HTML-like markup inside JavaScript code"
        },
        {
          "id": "opt_3",
          "text": "A specialized CSS compiler"
        },
        {
          "id": "opt_4",
          "text": "A server framework"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "JSX compiles down to React.createElement() or jsx-runtime calls, providing a declarative syntax for UI."
    },
    {
      "id": "react-q12",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "basic",
      "question": "Which Hook is used to maintain local reactive state inside a function component?",
      "options": [
        {
          "id": "opt_1",
          "text": "useEffect"
        },
        {
          "id": "opt_2",
          "text": "useState"
        },
        {
          "id": "opt_3",
          "text": "useContext"
        },
        {
          "id": "opt_4",
          "text": "useRef"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`useState` returns a stateful value and a dispatch function to update it."
    },
    {
      "id": "react-q13",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "basic",
      "question": "Why should list items in React always have a unique `key` prop?",
      "options": [
        {
          "id": "opt_1",
          "text": "To apply CSS styling to each item"
        },
        {
          "id": "opt_2",
          "text": "To help React identify which items have changed, been added, or removed during virtual DOM reconciliation"
        },
        {
          "id": "opt_3",
          "text": "To encrypt list items for privacy"
        },
        {
          "id": "opt_4",
          "text": "Keys are mandatory only in TypeScript"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Keys give elements stable identities, avoiding unnecessary DOM re-creations and preserving internal component state across renders."
    },
    {
      "id": "react-q14",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "basic",
      "question": "How are props passed from parent components to child components in React?",
      "options": [
        {
          "id": "opt_1",
          "text": "Via two-way data binding sockets"
        },
        {
          "id": "opt_2",
          "text": "As read-only attributes on the JSX tag (unidirectional data flow)"
        },
        {
          "id": "opt_3",
          "text": "Through global window variables"
        },
        {
          "id": "opt_4",
          "text": "By mutating child component fields directly"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "React follows a strict top-down (unidirectional) data flow where props are immutable inputs passed down the hierarchy."
    },
    {
      "id": "react-q15",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "basic",
      "question": "What hook should be used to interact directly with a DOM node without triggering re-renders?",
      "options": [
        {
          "id": "opt_1",
          "text": "useMemo"
        },
        {
          "id": "opt_2",
          "text": "useRef"
        },
        {
          "id": "opt_3",
          "text": "useCallback"
        },
        {
          "id": "opt_4",
          "text": "useLayout"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "useRef returns a mutable ref object whose `.current` property persists for the component lifetime without causing re-renders."
    },
    {
      "id": "react-q16",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "intermediate",
      "question": "When does a `useEffect` cleanup function execute?",
      "options": [
        {
          "id": "opt_1",
          "text": "Only when the browser window is closed"
        },
        {
          "id": "opt_2",
          "text": "Before the component unmounts and before re-running the effect with new dependencies"
        },
        {
          "id": "opt_3",
          "text": "After every state change regardless of dependencies"
        },
        {
          "id": "opt_4",
          "text": "Only when an uncaught error occurs"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Cleanups run before unmounting and prior to re-executing the effect, preventing memory leaks, duplicate subscriptions, or stale timers."
    },
    {
      "id": "react-q17",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "intermediate",
      "question": "What is the primary difference between `useMemo` and `useCallback` in React?",
      "options": [
        {
          "id": "opt_1",
          "text": "useMemo is for class components; useCallback is for functional components"
        },
        {
          "id": "opt_2",
          "text": "`useMemo` caches the result of a calculated value; `useCallback` caches a function definition instance"
        },
        {
          "id": "opt_3",
          "text": "useCallback triggers HTTP calls while useMemo cannot"
        },
        {
          "id": "opt_4",
          "text": "They are aliases with no behavioral difference"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`useMemo(() => computeValue(a, b), [a, b])` memoizes the computed value, while `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`."
    },
    {
      "id": "react-q18",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "intermediate",
      "question": "How does React 18 automatic batching work for state updates?",
      "options": [
        {
          "id": "opt_1",
          "text": "It groups multiple setState calls into a single re-render, even inside promises, setTimeout, and native event handlers"
        },
        {
          "id": "opt_2",
          "text": "It prevents components from rendering more than once per hour"
        },
        {
          "id": "opt_3",
          "text": "It automatically saves form fields to localStorage"
        },
        {
          "id": "opt_4",
          "text": "It executes state updates on a background Web Worker thread"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "React 18 extends automatic batching beyond React event handlers into fetch promises, timeouts, and native listeners, avoiding unnecessary render cycles."
    },
    {
      "id": "react-q19",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "intermediate",
      "question": "What is the pitfall of passing an inline object literal or inline arrow function to a memoized child component?",
      "options": [
        {
          "id": "opt_1",
          "text": "It causes a syntax error"
        },
        {
          "id": "opt_2",
          "text": "A new object/function reference is created on every render, defeating React.memo and forcing child re-renders"
        },
        {
          "id": "opt_3",
          "text": "It causes infinite loops in React"
        },
        {
          "id": "opt_4",
          "text": "Inline objects are stripped by Webpack"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "JavaScript objects/functions are compared by reference. New references on each parent render break shallow equality checks in React.memo."
    },
    {
      "id": "react-q20",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "intermediate",
      "question": "What does `useReducer` provide compared to `useState`?",
      "options": [
        {
          "id": "opt_1",
          "text": "Automatic Redux store integration"
        },
        {
          "id": "opt_2",
          "text": "A structured way to manage complex state transitions via action dispatches and pure reducer functions"
        },
        {
          "id": "opt_3",
          "text": "Persistent cloud storage for state variables"
        },
        {
          "id": "opt_4",
          "text": "Faster DOM painting"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`useReducer` is best suited for complex state logic with interdependent sub-values or predictable action-based transitions."
    },
    {
      "id": "react-q21",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "advanced",
      "question": "What is the React Fiber architecture and what problem does it solve?",
      "options": [
        {
          "id": "opt_1",
          "text": "A CSS-in-JS library for fiber optic animations"
        },
        {
          "id": "opt_2",
          "text": "A complete reimplementation of React's reconciliation engine that allows rendering work to be split into chunks, paused, aborted, or prioritized"
        },
        {
          "id": "opt_3",
          "text": "A backend Node.js thread pool library"
        },
        {
          "id": "opt_4",
          "text": "A replacement for Redux Thunk"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Fiber replaces recursive call stack reconciliation with a virtual stack of fiber nodes, enabling concurrent features (interruptible renders, suspense)."
    },
    {
      "id": "react-q22",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "advanced",
      "question": "What is the difference between `useLayoutEffect` and `useEffect`?",
      "options": [
        {
          "id": "opt_1",
          "text": "useLayoutEffect runs on the server; useEffect runs on the client"
        },
        {
          "id": "opt_2",
          "text": "useLayoutEffect fires synchronously immediately after DOM mutations but before the browser paints; useEffect runs asynchronously after paint"
        },
        {
          "id": "opt_3",
          "text": "useEffect cannot accept dependencies"
        },
        {
          "id": "opt_4",
          "text": "useLayoutEffect is deprecated in React 18"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`useLayoutEffect` runs synchronously before paint, ideal for measuring DOM dimensions and preventing visual layout flickers."
    },
    {
      "id": "react-q23",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "advanced",
      "question": "How does React Server Components (RSC) differ from traditional SSR (Server-Side Rendering)?",
      "options": [
        {
          "id": "opt_1",
          "text": "RSC runs in browser Service Workers"
        },
        {
          "id": "opt_2",
          "text": "RSC execute exclusively on the server, have zero client bundle impact, and stream a serialized component tree without hydration overhead"
        },
        {
          "id": "opt_3",
          "text": "SSR renders JSON, while RSC only renders PDF documents"
        },
        {
          "id": "opt_4",
          "text": "RSC requires PHP on the server"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Traditional SSR ships HTML + full JS bundles for client hydration. RSC ships zero JS to the client for server-only components."
    },
    {
      "id": "react-q24",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "advanced",
      "question": "What is the purpose of `useTransition` in React 18+?",
      "options": [
        {
          "id": "opt_1",
          "text": "Configuring CSS page transitions"
        },
        {
          "id": "opt_2",
          "text": "Marking state updates as non-urgent transitions so urgent user inputs (typing, clicking) remain responsive and uninterrupted"
        },
        {
          "id": "opt_3",
          "text": "Managing transitions between React and Angular"
        },
        {
          "id": "opt_4",
          "text": "Handling WebSockets reconnection cycles"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "useTransition enables concurrent rendering by letting React yield execution to higher-priority user inputs during heavy background state updates."
    },
    {
      "id": "react-q25",
      "skillId": "react",
      "skillName": "React",
      "difficulty": "advanced",
      "question": "What causes Context re-render performance issues and how do you mitigate them?",
      "options": [
        {
          "id": "opt_1",
          "text": "Context causes CPU spikes because it uses Web Workers"
        },
        {
          "id": "opt_2",
          "text": "All consumers of a Context re-render whenever the context value changes; mitigated by splitting contexts or memoizing consumer subtrees"
        },
        {
          "id": "opt_3",
          "text": "Context cannot pass functions"
        },
        {
          "id": "opt_4",
          "text": "Context values cannot be stored in Redux"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Any update to a context provider value forces all subscribers to re-render. Splitting high-frequency data from static data resolves unnecessary re-renders."
    }
  ],
  "node": [
    {
      "id": "node-q1",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "How does Node.js handle high-concurrency I/O operations despite being single-threaded in JavaScript execution?",
      "options": [
        {
          "id": "opt_1",
          "text": "It creates a new OS process for every incoming HTTP request"
        },
        {
          "id": "opt_2",
          "text": "Using the libuv event loop and an underlying thread pool to offload asynchronous I/O operations non-blockingly"
        },
        {
          "id": "opt_3",
          "text": "It uses GPU hardware acceleration"
        },
        {
          "id": "opt_4",
          "text": "It pauses incoming requests until the previous request completes"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Node.js delegates asynchronous I/O (filesystem, network, crypto) to libuv and operating system kernel non-blocking mechanisms, processing completion callbacks on the event loop.",
      "difficulty": "basic"
    },
    {
      "id": "node-q2",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "In an Express.js middleware function, what happens if you forget to call `next()` and do not send a response?",
      "options": [
        {
          "id": "opt_1",
          "text": "The server crashes with a segmentation fault"
        },
        {
          "id": "opt_2",
          "text": "The client request will hang indefinitely until it times out"
        },
        {
          "id": "opt_3",
          "text": "Express automatically returns a 200 OK empty response"
        },
        {
          "id": "opt_4",
          "text": "The next middleware executes automatically"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Express middleware chains must either pass control to the next handler by invoking next() or terminate the request-response cycle by sending a response (e.g. res.send()).",
      "difficulty": "basic"
    },
    {
      "id": "node-q3",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "What is the purpose of Node.js Streams and the concept of \"Backpressure\"?",
      "options": [
        {
          "id": "opt_1",
          "text": "To encrypt network packets in real-time"
        },
        {
          "id": "opt_2",
          "text": "To process large data in chunks without consuming massive RAM, pausing the data source when the consumer buffer is full"
        },
        {
          "id": "opt_3",
          "text": "To throttle CPU speed during heavy computation"
        },
        {
          "id": "opt_4",
          "text": "To manage database connection pool timeouts"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Streams enable reading and writing data chunk-by-chunk. Backpressure ensures that if writing is slower than reading, the readable stream is paused to avoid buffer memory exhaustion.",
      "difficulty": "basic"
    },
    {
      "id": "node-q4",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "How should passwords be securely stored in a Node.js database?",
      "options": [
        {
          "id": "opt_1",
          "text": "As base64 encoded strings"
        },
        {
          "id": "opt_2",
          "text": "Hashed using a slow cryptographic key-derivation function (like bcrypt or argon2) with a unique salt"
        },
        {
          "id": "opt_3",
          "text": "Hashed using MD5 for fast verification"
        },
        {
          "id": "opt_4",
          "text": "In plain text so administrators can recover forgotten passwords"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Fast hashes like MD5/SHA1 are vulnerable to rainbow table attacks and brute force. bcrypt uses adaptive work factors and automatic salting to protect against offline cracking.",
      "difficulty": "intermediate"
    },
    {
      "id": "node-q5",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "What is the difference between CommonJS and ES Modules in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "CommonJS uses `require()` and is synchronous; ES Modules use `import/export` and support static analysis and top-level await"
        },
        {
          "id": "opt_2",
          "text": "CommonJS is for frontend only; ES Modules are for backend only"
        },
        {
          "id": "opt_3",
          "text": "CommonJS was removed in Node.js 14"
        },
        {
          "id": "opt_4",
          "text": "There is no difference in Node.js"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "CommonJS (require/module.exports) evaluates modules synchronously at runtime. ESM (import/export) is the standard modern specification with static dependency graphs.",
      "difficulty": "intermediate"
    },
    {
      "id": "node-q6",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "What is CORS (Cross-Origin Resource Sharing) and why is it needed in Express APIs?",
      "options": [
        {
          "id": "opt_1",
          "text": "A database query language for Node.js"
        },
        {
          "id": "opt_2",
          "text": "A browser security mechanism that restricts cross-origin HTTP requests unless the server explicitly grants permission via response headers"
        },
        {
          "id": "opt_3",
          "text": "A tool for compressing API payloads"
        },
        {
          "id": "opt_4",
          "text": "A protocol for WebSockets"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Browsers enforce the Same-Origin Policy. When frontend on port 5173 requests backend on port 3001, CORS headers (Access-Control-Allow-Origin) must allow the interaction.",
      "difficulty": "intermediate"
    },
    {
      "id": "node-q7",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "What does a JSON Web Token (JWT) consist of?",
      "options": [
        {
          "id": "opt_1",
          "text": "A single encrypted string containing database credentials"
        },
        {
          "id": "opt_2",
          "text": "Three base64url-encoded parts separated by dots: Header, Payload, and Signature"
        },
        {
          "id": "opt_3",
          "text": "A plain JSON object sent over HTTP cookies"
        },
        {
          "id": "opt_4",
          "text": "An SSL certificate"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A JWT comprises Header.Payload.Signature. The signature is created by hashing the header and payload with a secret key, verifying authenticity without database lookups.",
      "difficulty": "intermediate"
    },
    {
      "id": "node-q8",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "How should unhandled asynchronous errors in Express route handlers be handled in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "They are automatically silenced by the operating system"
        },
        {
          "id": "opt_2",
          "text": "Wrap async route logic in try-catch and forward errors to `next(err)` to trigger the Express error-handling middleware"
        },
        {
          "id": "opt_3",
          "text": "Restart the computer whenever an error occurs"
        },
        {
          "id": "opt_4",
          "text": "Async routes cannot throw errors"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In Express, unhandled rejected promises in route handlers cause unhandledRejection events. Passing errors to next(err) invokes custom error middlewares (`(err, req, res, next)`).",
      "difficulty": "advanced"
    },
    {
      "id": "node-q9",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "What is the Node.js `EventEmitter`?",
      "options": [
        {
          "id": "opt_1",
          "text": "A library that simulates mouse clicks on the server"
        },
        {
          "id": "opt_2",
          "text": "A core class implementing the Observer pattern, allowing objects to emit named events that trigger registered listener functions"
        },
        {
          "id": "opt_3",
          "text": "A timer that fires every 10 seconds"
        },
        {
          "id": "opt_4",
          "text": "An external package for handling WebSockets"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "EventEmitter powers much of Node.js core (like streams and HTTP servers). Objects inherit from EventEmitter to emit events and allow subscribers to listen with `.on()`.",
      "difficulty": "advanced"
    },
    {
      "id": "node-q10",
      "skillId": "node",
      "skillName": "Backend (Node.js)",
      "question": "Why should environment variables (`process.env`) be used for configuration in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "They compile JavaScript faster"
        },
        {
          "id": "opt_2",
          "text": "To keep sensitive secrets (database passwords, API keys) out of source control and allow different configs across environments"
        },
        {
          "id": "opt_3",
          "text": "Because Node.js does not allow hardcoded numbers"
        },
        {
          "id": "opt_4",
          "text": "To automatically format code"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Following the 12-Factor App methodology, configuration and secrets are injected via the environment (e.g. .env or cloud provider vars) rather than committed to Git.",
      "difficulty": "advanced"
    },
    {
      "id": "node-q11",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "basic",
      "question": "What is the primary global object representing the current running process in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "window"
        },
        {
          "id": "opt_2",
          "text": "process"
        },
        {
          "id": "opt_3",
          "text": "system"
        },
        {
          "id": "opt_4",
          "text": "globalThis.runtime"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `process` object is a global providing information about and control over the current Node.js runtime process (env, argv, exit, etc.)."
    },
    {
      "id": "node-q12",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "basic",
      "question": "Which built-in module provides utilities for handling file and directory paths in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "fs"
        },
        {
          "id": "opt_2",
          "text": "path"
        },
        {
          "id": "opt_3",
          "text": "url"
        },
        {
          "id": "opt_4",
          "text": "os"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The `path` module offers platform-independent methods like path.join(), path.resolve(), and path.extname()."
    },
    {
      "id": "node-q13",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "basic",
      "question": "What is the difference between `fs.readFile` and `fs.readFileSync` in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "fs.readFile returns JSON; fs.readFileSync returns binary"
        },
        {
          "id": "opt_2",
          "text": "`fs.readFile` is asynchronous and non-blocking; `fs.readFileSync` blocks the entire event loop until disk I/O completes"
        },
        {
          "id": "opt_3",
          "text": "readFileSync is faster under high concurrency"
        },
        {
          "id": "opt_4",
          "text": "readFile is only available in browser environments"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Sync methods block the single event thread, halting all other requests, while asynchronous methods delegate disk reading to the libuv thread pool."
    },
    {
      "id": "node-q14",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "basic",
      "question": "What file defines project metadata, scripts, and package dependencies in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "config.json"
        },
        {
          "id": "opt_2",
          "text": "package.json"
        },
        {
          "id": "opt_3",
          "text": "node.xml"
        },
        {
          "id": "opt_4",
          "text": "index.json"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`package.json` is the manifest file of any Node.js project or npm package."
    },
    {
      "id": "node-q15",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "basic",
      "question": "How do you read environment variables in a Node.js application?",
      "options": [
        {
          "id": "opt_1",
          "text": "process.env.VARIABLE_NAME"
        },
        {
          "id": "opt_2",
          "text": "system.getEnv(\"VARIABLE_NAME\")"
        },
        {
          "id": "opt_3",
          "text": "env.VARIABLE_NAME"
        },
        {
          "id": "opt_4",
          "text": "global.env[\"VARIABLE_NAME\"]"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`process.env` stores key-value pairs representing user environment variables."
    },
    {
      "id": "node-q16",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "intermediate",
      "question": "What is the role of `libuv` in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "A CSS rendering engine"
        },
        {
          "id": "opt_2",
          "text": "A C library that provides the event loop, cross-platform asynchronous I/O, file system operations, and a worker thread pool"
        },
        {
          "id": "opt_3",
          "text": "A parser for JavaScript syntax"
        },
        {
          "id": "opt_4",
          "text": "The default database driver in Node"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "libuv provides Node.js with its cross-platform asynchronous event loop abstraction and thread pool for non-blocking I/O."
    },
    {
      "id": "node-q17",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "intermediate",
      "question": "What is the difference between `process.nextTick()` and `setImmediate()` in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "They are completely identical"
        },
        {
          "id": "opt_2",
          "text": "`process.nextTick()` executes immediately after the current operation before the event loop continues; `setImmediate()` queues a callback in the Check phase of the event loop"
        },
        {
          "id": "opt_3",
          "text": "setImmediate runs before any microtasks"
        },
        {
          "id": "opt_4",
          "text": "process.nextTick is only available in clusters"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "nextTick queue is processed after each phase and before microtasks; setImmediate executes on the check phase of the libuv event loop."
    },
    {
      "id": "node-q18",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "intermediate",
      "question": "Why are Streams preferred over buffering entire files into memory in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "Streams automatically compress all data using gzip"
        },
        {
          "id": "opt_2",
          "text": "Streams process data piece-by-piece (chunks) without loading the entire payload into RAM, preventing memory exhaustion"
        },
        {
          "id": "opt_3",
          "text": "Streams bypass TCP sockets"
        },
        {
          "id": "opt_4",
          "text": "Streams cannot be used with HTTP"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Streams allow processing massive multi-gigabyte files with low, predictable memory footprints using backpressure mechanisms."
    },
    {
      "id": "node-q19",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "intermediate",
      "question": "What is the difference between CommonJS and ES Modules (ESM) in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "CommonJS uses `require()` and `module.exports` synchronously; ESM uses `import`/`export` with static asynchronous module analysis"
        },
        {
          "id": "opt_2",
          "text": "CommonJS only runs in browsers"
        },
        {
          "id": "opt_3",
          "text": "ESM does not support objects or functions"
        },
        {
          "id": "opt_4",
          "text": "CommonJS has been removed from Node.js 18"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "CommonJS loads modules synchronously on demand via require(); ESM parses dependencies statically before execution and supports top-level await."
    },
    {
      "id": "node-q20",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "intermediate",
      "question": "What happens when an unhandled Promise rejection occurs in modern Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "It is silently ignored"
        },
        {
          "id": "opt_2",
          "text": "The Node.js process terminates immediately with a non-zero exit code (status 1)"
        },
        {
          "id": "opt_3",
          "text": "The promise is automatically retried 3 times"
        },
        {
          "id": "opt_4",
          "text": "It converts into an HTTP 500 error response automatically"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Since Node.js v15, unhandled rejections trigger unhandledRejection and crash the process by default with a non-zero exit code."
    },
    {
      "id": "node-q21",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "advanced",
      "question": "What are the 6 phases of the Node.js Event Loop in order of execution?",
      "options": [
        {
          "id": "opt_1",
          "text": "Start -> Run -> Compute -> Wait -> Stop -> Exit"
        },
        {
          "id": "opt_2",
          "text": "Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check -> Close Callbacks"
        },
        {
          "id": "opt_3",
          "text": "Microtasks -> Macrotasks -> Promises -> Events -> Sockets -> Finish"
        },
        {
          "id": "opt_4",
          "text": "Fetch -> Parse -> Compile -> Link -> Execute -> Cleanup"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The libuv event loop iterates through Timers, Pending I/O callbacks, Idle/Prepare, Poll (incoming I/O), Check (setImmediate), and Close callbacks."
    },
    {
      "id": "node-q22",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "advanced",
      "question": "What is the purpose of the `worker_threads` module in Node.js?",
      "options": [
        {
          "id": "opt_1",
          "text": "Running multiple Node.js HTTP servers on distinct ports"
        },
        {
          "id": "opt_2",
          "text": "Executing CPU-intensive JavaScript tasks concurrently on separate system threads sharing memory via SharedArrayBuffer"
        },
        {
          "id": "opt_3",
          "text": "Managing Redis task queues"
        },
        {
          "id": "opt_4",
          "text": "Replacing async/await with thread sleeps"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`worker_threads` enables actual multithreaded CPU-bound computation without blocking the main event loop, overcoming single-thread bottlenecks."
    },
    {
      "id": "node-q23",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "advanced",
      "question": "How does backpressure work in Node.js Streams?",
      "options": [
        {
          "id": "opt_1",
          "text": "It compresses packets when network bandwidth drops"
        },
        {
          "id": "opt_2",
          "text": "When a writable stream's internal buffer is full (`stream.write()` returns false), the readable stream pauses until a 'drain' event is emitted"
        },
        {
          "id": "opt_3",
          "text": "It reverses the data flow back to the sender"
        },
        {
          "id": "opt_4",
          "text": "It discards dropped packets"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Backpressure prevents fast producers from overwhelming slow consumers by halting read streams until write buffers flush."
    },
    {
      "id": "node-q24",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "advanced",
      "question": "What is the difference between `child_process.fork()` and `child_process.spawn()`?",
      "options": [
        {
          "id": "opt_1",
          "text": "spawn can only run Node scripts, fork runs bash"
        },
        {
          "id": "opt_2",
          "text": "fork() is a special case of spawn() specifically designed for spawning new Node.js V8 processes with a built-in IPC communication channel"
        },
        {
          "id": "opt_3",
          "text": "fork() creates threads, spawn creates processes"
        },
        {
          "id": "opt_4",
          "text": "There is no difference"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`child_process.fork()` establishes an Inter-Process Communication (IPC) channel (process.send / process.on) to exchange serialized messages."
    },
    {
      "id": "node-q25",
      "skillId": "node",
      "skillName": "Node.js",
      "difficulty": "advanced",
      "question": "What is a memory leak commonly caused by in Node.js servers?",
      "options": [
        {
          "id": "opt_1",
          "text": "Using const instead of var"
        },
        {
          "id": "opt_2",
          "text": "Unclosed event listeners on global EventEmitters, uncleared intervals, or unbounded in-memory caches/closures"
        },
        {
          "id": "opt_3",
          "text": "Overuse of async/await"
        },
        {
          "id": "opt_4",
          "text": "Using JSON.stringify on arrays"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Retaining references in global objects, listener arrays, or long-lived closures prevents the V8 garbage collector from reclaiming heap memory."
    }
  ],
  "dataanalytics": [
    {
      "id": "da-q1",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "What is the Interquartile Range (IQR) method used for in exploratory data analysis?",
      "options": [
        {
          "id": "opt_1",
          "text": "Calculating the mean of a normal distribution"
        },
        {
          "id": "opt_2",
          "text": "Detecting statistical outliers by measuring the spread of the middle 50% of data (Q3 - Q1)"
        },
        {
          "id": "opt_3",
          "text": "Converting categorical data to numerical embeddings"
        },
        {
          "id": "opt_4",
          "text": "Compressing large datasets for storage"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "IQR = Q3 - Q1. Values falling below Q1 - 1.5*IQR or above Q3 + 1.5*IQR are typically flagged as outliers that could distort statistical models.",
      "difficulty": "basic"
    },
    {
      "id": "da-q2",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "What is the difference between `.loc[]` and `.iloc[]` in Python Pandas?",
      "options": [
        {
          "id": "opt_1",
          "text": "loc is label-based indexing; iloc is integer position-based indexing"
        },
        {
          "id": "opt_2",
          "text": "loc works only on columns; iloc works only on rows"
        },
        {
          "id": "opt_3",
          "text": "iloc sorts data alphabetically; loc sorts numerically"
        },
        {
          "id": "opt_4",
          "text": "They are identical aliases in Pandas"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "df.loc[] selects rows and columns using their labels or boolean arrays. df.iloc[] strictly selects using 0-based integer index positions.",
      "difficulty": "basic"
    },
    {
      "id": "da-q3",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "What does a Pearson correlation coefficient of -0.92 between two business metrics indicate?",
      "options": [
        {
          "id": "opt_1",
          "text": "No relationship exists between the metrics"
        },
        {
          "id": "opt_2",
          "text": "A very strong inverse linear relationship: as one metric increases, the other metric consistently decreases"
        },
        {
          "id": "opt_3",
          "text": "A data collection error in 92% of records"
        },
        {
          "id": "opt_4",
          "text": "That metric A caused metric B directly"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Pearson correlation ranges from -1 to +1. A value of -0.92 indicates a very strong negative linear relationship (though correlation does not imply causation).",
      "difficulty": "basic"
    },
    {
      "id": "da-q4",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "What is \"Cohort Retention Analysis\" in SaaS and Product Analytics?",
      "options": [
        {
          "id": "opt_1",
          "text": "Tracking the CPU usage of server clusters"
        },
        {
          "id": "opt_2",
          "text": "Grouping users by a common sign-up timeframe and measuring what percentage continue active engagement over subsequent weeks or months"
        },
        {
          "id": "opt_3",
          "text": "Calculating the average salary of employees"
        },
        {
          "id": "opt_4",
          "text": "A method for compressing SQL tables"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Cohort analysis groups users by their acquisition date to observe how retention and churn evolve over time, pinpointing product improvements or drop-off points.",
      "difficulty": "intermediate"
    },
    {
      "id": "da-q5",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "When should Median be preferred over Mean as a measure of central tendency?",
      "options": [
        {
          "id": "opt_1",
          "text": "When the dataset has a strictly symmetric normal distribution"
        },
        {
          "id": "opt_2",
          "text": "When the data is heavily skewed or contains extreme outliers (such as income or housing prices)"
        },
        {
          "id": "opt_3",
          "text": "When working with text labels"
        },
        {
          "id": "opt_4",
          "text": "Never; Mean is always more accurate"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The mean is sensitive to extreme outlier values. The median reflects the middle value of sorted observations and is robust against skewness.",
      "difficulty": "intermediate"
    },
    {
      "id": "da-q6",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "What is the purpose of a 7-day Rolling Moving Average in time-series sales data?",
      "options": [
        {
          "id": "opt_1",
          "text": "To delete weekends from the dataset"
        },
        {
          "id": "opt_2",
          "text": "To smooth out high-frequency daily noise and cyclical day-of-week seasonality to reveal underlying trends"
        },
        {
          "id": "opt_3",
          "text": "To predict sales 10 years into the future"
        },
        {
          "id": "opt_4",
          "text": "To normalize currency rates"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A rolling moving average calculates the average of overlapping subsets, reducing transient noise (like weekend dips) to clarify real growth or decline trends.",
      "difficulty": "intermediate"
    },
    {
      "id": "da-q7",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "What is the Customer Churn Rate formula for a given monthly period?",
      "options": [
        {
          "id": "opt_1",
          "text": "(Customers Lost during Month / Total Customers at Start of Month) * 100"
        },
        {
          "id": "opt_2",
          "text": "(New Customers Gained / Total Revenue) * 100"
        },
        {
          "id": "opt_3",
          "text": "(Customers Lost * Customer Acquisition Cost) / 12"
        },
        {
          "id": "opt_4",
          "text": "(Total Revenue / Total Customers)"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "Churn rate is the percentage of existing customers that cancel or do not renew during a specified time interval, calculated as Lost Customers / Starting Customers.",
      "difficulty": "intermediate"
    },
    {
      "id": "da-q8",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "What does \"Data Normalization\" (Min-Max Scaling) do to a numeric feature?",
      "options": [
        {
          "id": "opt_1",
          "text": "Transforms the feature values into a fixed range between 0 and 1"
        },
        {
          "id": "opt_2",
          "text": "Converts numeric values into category strings"
        },
        {
          "id": "opt_3",
          "text": "Sets the mean to 0 and standard deviation to 1"
        },
        {
          "id": "opt_4",
          "text": "Rounds floating point numbers to integers"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "Min-Max normalization scales values to a [0, 1] range: `(x - min) / (max - min)`. Standardization (Z-score) scales data to mean 0 and variance 1.",
      "difficulty": "advanced"
    },
    {
      "id": "da-q9",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "In statistical distributions, what does \"Positive Skewness\" (Right-Skewed) indicate?",
      "options": [
        {
          "id": "opt_1",
          "text": "The left tail is longer than the right tail"
        },
        {
          "id": "opt_2",
          "text": "The right tail is longer; the mass of distribution is concentrated on the left, and Mean > Median"
        },
        {
          "id": "opt_3",
          "text": "The distribution is a perfect bell curve"
        },
        {
          "id": "opt_4",
          "text": "All data points are greater than zero"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "In a right-skewed distribution, a long tail stretches out to high values on the right, pulling the mean higher than the median.",
      "difficulty": "advanced"
    },
    {
      "id": "da-q10",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "question": "What does Customer Lifetime Value (LTV) measure?",
      "options": [
        {
          "id": "opt_1",
          "text": "The marketing cost to acquire one new customer"
        },
        {
          "id": "opt_2",
          "text": "The total net revenue a business can reasonably expect to earn from a customer throughout their entire relationship"
        },
        {
          "id": "opt_3",
          "text": "The age of the oldest customer"
        },
        {
          "id": "opt_4",
          "text": "The number of days a user visits a website"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "LTV estimates the total monetary value a customer brings to the company over their entire lifespan as a paying account, essential for comparing against Customer Acquisition Cost (CAC).",
      "difficulty": "advanced"
    },
    {
      "id": "da-q11",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "basic",
      "question": "Which pandas method displays the first 5 rows of a DataFrame?",
      "options": [
        {
          "id": "opt_1",
          "text": "df.first(5)"
        },
        {
          "id": "opt_2",
          "text": "df.head()"
        },
        {
          "id": "opt_3",
          "text": "df.show(5)"
        },
        {
          "id": "opt_4",
          "text": "df.top()"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`df.head(n=5)` returns the first n rows of a pandas DataFrame or Series."
    },
    {
      "id": "da-q12",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "basic",
      "question": "What measure of central tendency represents the middle value of an ordered dataset?",
      "options": [
        {
          "id": "opt_1",
          "text": "Mean"
        },
        {
          "id": "opt_2",
          "text": "Median"
        },
        {
          "id": "opt_3",
          "text": "Mode"
        },
        {
          "id": "opt_4",
          "text": "Standard Deviation"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The median divides an ordered dataset into two equal halves and is resistant to extreme outliers."
    },
    {
      "id": "da-q13",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "basic",
      "question": "Which chart type is best suited to display the distribution and spread of continuous numeric data?",
      "options": [
        {
          "id": "opt_1",
          "text": "Pie chart"
        },
        {
          "id": "opt_2",
          "text": "Histogram or Box Plot"
        },
        {
          "id": "opt_3",
          "text": "Scatter plot only"
        },
        {
          "id": "opt_4",
          "text": "Radar chart"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Histograms group continuous values into bins to show frequency distribution, while box plots show quartiles and outliers."
    },
    {
      "id": "da-q14",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "basic",
      "question": "What does the pandas `df.dropna()` method do by default?",
      "options": [
        {
          "id": "opt_1",
          "text": "Replaces missing values with zero"
        },
        {
          "id": "opt_2",
          "text": "Drops rows containing any null or NaN values"
        },
        {
          "id": "opt_3",
          "text": "Drops duplicate records"
        },
        {
          "id": "opt_4",
          "text": "Deletes empty columns only"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`df.dropna(axis=0, how='any')` drops all rows that contain at least one null (NaN) entry."
    },
    {
      "id": "da-q15",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "basic",
      "question": "What is the range of values for Pearson's correlation coefficient (r)?",
      "options": [
        {
          "id": "opt_1",
          "text": "0 to 1"
        },
        {
          "id": "opt_2",
          "text": "-1 to +1"
        },
        {
          "id": "opt_3",
          "text": "-100 to +100"
        },
        {
          "id": "opt_4",
          "text": "0 to infinity"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Pearson's r ranges from -1 (perfect negative linear correlation) to +1 (perfect positive correlation), with 0 meaning no linear relationship."
    },
    {
      "id": "da-q16",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "intermediate",
      "question": "What is the difference between `loc` and `iloc` in pandas?",
      "options": [
        {
          "id": "opt_1",
          "text": "They are completely interchangeable"
        },
        {
          "id": "opt_2",
          "text": "`loc` selects rows and columns by labels/names; `iloc` selects by integer zero-based index positions"
        },
        {
          "id": "opt_3",
          "text": "`iloc` only works on strings"
        },
        {
          "id": "opt_4",
          "text": "`loc` only accesses column headers"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "`df.loc['row_label', 'col_label']` is label-based indexing, whereas `df.iloc[0, 1]` is strict integer positional indexing."
    },
    {
      "id": "da-q17",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "intermediate",
      "question": "What does Simpson's Paradox demonstrate in statistical analysis?",
      "options": [
        {
          "id": "opt_1",
          "text": "That sample variance is always greater than population variance"
        },
        {
          "id": "opt_2",
          "text": "A trend or correlation visible in several groups reverses or vanishes when the groups are combined"
        },
        {
          "id": "opt_3",
          "text": "That mean and median are always identical in large datasets"
        },
        {
          "id": "opt_4",
          "text": "That p-values decrease with lower confidence intervals"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Simpson's Paradox occurs when confounding variables alter aggregated group relationships, underscoring the importance of stratified analysis."
    },
    {
      "id": "da-q18",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "intermediate",
      "question": "When should you use One-Hot Encoding versus Label Encoding for categorical features?",
      "options": [
        {
          "id": "opt_1",
          "text": "One-Hot Encoding for nominal variables without intrinsic order; Label Encoding for ordinal variables with clear ranking"
        },
        {
          "id": "opt_2",
          "text": "Label Encoding for high-dimensional text only"
        },
        {
          "id": "opt_3",
          "text": "One-Hot Encoding should never be used"
        },
        {
          "id": "opt_4",
          "text": "Always use Label Encoding regardless of category nature"
        }
      ],
      "correctOptionId": "opt_1",
      "explanation": "Assigning integers (0, 1, 2) to unordered nominal data (e.g. Red, Blue, Green) inadvertently introduces false numeric hierarchy that biases models."
    },
    {
      "id": "da-q19",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "intermediate",
      "question": "What does the Interquartile Range (IQR) method define as outliers?",
      "options": [
        {
          "id": "opt_1",
          "text": "Values exceeding the mean by 1 standard deviation"
        },
        {
          "id": "opt_2",
          "text": "Values located below Q1 - 1.5 * IQR or above Q3 + 1.5 * IQR"
        },
        {
          "id": "opt_3",
          "text": "Values with negative signs"
        },
        {
          "id": "opt_4",
          "text": "The highest 10% of all values"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Tukey's fences define outliers as data points lying outside 1.5 times the IQR (Q3 - Q1) from the first and third quartiles."
    },
    {
      "id": "da-q20",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "intermediate",
      "question": "What is the difference between Min-Max Normalization and Z-score Standardization?",
      "options": [
        {
          "id": "opt_1",
          "text": "Standardization rescales values between 0 and 1"
        },
        {
          "id": "opt_2",
          "text": "Min-Max scales data to a fixed [0, 1] range; Z-score centers data around mean 0 with standard deviation 1"
        },
        {
          "id": "opt_3",
          "text": "They are mathematical synonyms"
        },
        {
          "id": "opt_4",
          "text": "Z-score requires categorical input"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Min-Max scales to [0, 1] sensitive to outliers; Z-score transformation `(x - μ)/σ` handles normally distributed data with outliers better."
    },
    {
      "id": "da-q21",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "advanced",
      "question": "What is a p-value in statistical hypothesis testing?",
      "options": [
        {
          "id": "opt_1",
          "text": "The probability that the null hypothesis is true"
        },
        {
          "id": "opt_2",
          "text": "The probability of observing test results at least as extreme as the observed data, assuming the null hypothesis is true"
        },
        {
          "id": "opt_3",
          "text": "The percentage of errors in the dataset"
        },
        {
          "id": "opt_4",
          "text": "The probability that the alternative hypothesis is false"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "A p-value quantifies evidence against the null hypothesis under the assumption of that null hypothesis."
    },
    {
      "id": "da-q22",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "advanced",
      "question": "What problem does Vectorization solve in NumPy and pandas compared to Python for-loops?",
      "options": [
        {
          "id": "opt_1",
          "text": "Reduces disk storage space"
        },
        {
          "id": "opt_2",
          "text": "Executes batch operations via compiled C SIMD instructions without Python interpreter loop overhead, executing 50x-200x faster"
        },
        {
          "id": "opt_3",
          "text": "Automatically removes missing data"
        },
        {
          "id": "opt_4",
          "text": "Converts arrays to SVG vectors"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Vectorized calculations operate on contiguous C memory arrays utilizing low-level CPU vector registers, avoiding Python bytecode interpretation overhead."
    },
    {
      "id": "da-q23",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "advanced",
      "question": "What does a Receiver Operating Characteristic (ROC) curve plot?",
      "options": [
        {
          "id": "opt_1",
          "text": "Precision against Recall across classification thresholds"
        },
        {
          "id": "opt_2",
          "text": "True Positive Rate (Sensitivity) vs. False Positive Rate (1 - Specificity) across different decision thresholds"
        },
        {
          "id": "opt_3",
          "text": "Training error vs validation error over epochs"
        },
        {
          "id": "opt_4",
          "text": "Cost vs iteration count"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "ROC curves illustrate trade-offs between TPR and FPR across all probability classification thresholds; the area under curve (AUC) evaluates model discrimination."
    },
    {
      "id": "da-q24",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "advanced",
      "question": "What is the Central Limit Theorem (CLT)?",
      "options": [
        {
          "id": "opt_1",
          "text": "Every population distribution is Gaussian"
        },
        {
          "id": "opt_2",
          "text": "The sampling distribution of the sample mean approaches a normal distribution as sample size increases (n >= 30), regardless of the underlying population distribution shape"
        },
        {
          "id": "opt_3",
          "text": "The mean equals the median in all datasets"
        },
        {
          "id": "opt_4",
          "text": "Outliers always cluster at the center of a distribution"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "The CLT justifies using normal hypothesis testing (Z-tests, t-tests) on sample means drawn from arbitrary distributions when sample size is sufficiently large."
    },
    {
      "id": "da-q25",
      "skillId": "dataanalytics",
      "skillName": "Data Analytics",
      "difficulty": "advanced",
      "question": "What is the distinction between Type I and Type II statistical errors?",
      "options": [
        {
          "id": "opt_1",
          "text": "Type I is calculation error; Type II is printing error"
        },
        {
          "id": "opt_2",
          "text": "Type I is False Positive (rejecting a true null hypothesis); Type II is False Negative (failing to reject a false null hypothesis)"
        },
        {
          "id": "opt_3",
          "text": "Type I is False Negative; Type II is False Positive"
        },
        {
          "id": "opt_4",
          "text": "Type I applies only to regressions"
        }
      ],
      "correctOptionId": "opt_2",
      "explanation": "Type I error rate is alpha (false alarm); Type II error rate is beta (missed detection), and (1 - beta) represents statistical power."
    }
  ]
};
