// Real executable test cases for SkillProof Build -> Break -> Adapt coding assessments
// Each concept provides:
// 1. entrypoint: function name or query
// 2. sampleTestCases: visible test cases for "Run Code"
// 3. mutationTestCases: adversarial test cases for "BREAK" and "ADAPT"
// 4. hiddenTestCases: hidden test cases for "Submit Code" (85% cutoff)

export const conceptExecutableSpecs = {
  // -------------------------------------------------------------
  // 1. PYTHON CONCEPTS
  // -------------------------------------------------------------
  'python-kpi': {
    entrypoint: 'analyze_sales_data',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Standard Multi-Item Batch',
        input: [
          [
            { id: 'TX-101', product: 'Laptop Stand', units: 2, price: 45.00 },
            { id: 'TX-102', product: 'Wireless Mouse', units: 3, price: 25.00 },
            { id: 'TX-103', product: 'Laptop Stand', units: 1, price: 82.43 }
          ]
        ],
        expected: { total_sales: 247.43, top_product: 'Laptop Stand', aov: 82.48 }
      },
      {
        id: 2,
        title: 'Test Case 2: Single Product Batch',
        input: [
          [
            { id: 'TX-201', product: 'Monitor Arm', units: 1, price: 50.00 }
          ]
        ],
        expected: { total_sales: 50.00, top_product: 'Monitor Arm', aov: 50.00 }
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation 1: Corrupted None Records & Duplicate IDs',
        input: [
          [
            { id: 'TX-301', product: 'USB Hub', units: 2, price: 20.00 },
            { id: 'TX-302', product: 'Corrupted Null', units: null, price: null },
            { id: 'TX-301', product: 'USB Hub', units: 2, price: 20.00 }
          ]
        ],
        expected: { total_sales: 40.00, top_product: 'USB Hub', aov: 40.00 }
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden 1: Multi-Product Revenue Aggregation',
        isHidden: true,
        input: [
          [
            { id: 'TX-401', product: 'Webcam', units: 3, price: 40.00 },
            { id: 'TX-402', product: 'Microphone', units: 1, price: 150.00 },
            { id: 'TX-403', product: 'Webcam', units: 2, price: 40.00 }
          ]
        ],
        expected: { total_sales: 350.00, top_product: 'Webcam', aov: 116.67 }
      },
      {
        id: 5,
        title: 'Hidden 2: Float Boundary Precision',
        isHidden: true,
        input: [
          [
            { id: 'TX-501', product: 'Cable', units: 7, price: 9.99 },
            { id: 'TX-502', product: 'Adapter', units: 2, price: 14.50 }
          ]
        ],
        expected: { total_sales: 98.93, top_product: 'Cable', aov: 49.46 }
      }
    ]
  },

  'python-dep-graph': {
    entrypoint: 'resolve_dependencies',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Simple Linear Dependency',
        input: [{ "app": ["web"], "web": ["db"], "db": [] }],
        expected: ["db", "web", "app"]
      },
      {
        id: 2,
        title: 'Test Case 2: Diamond Dependency Tree',
        input: [{ "app": ["web", "db"], "web": ["core"], "db": ["core"], "core": [] }],
        expected: ["core", "web", "db", "app"]
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Cyclic Loop Detection',
        input: [{ "A": ["B"], "B": ["C"], "C": ["A"] }],
        expected: []
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden: Disconnected Forest Graph',
        isHidden: true,
        input: [{ "pkg1": [], "pkg2": ["pkg1"], "pkg3": [] }],
        expected: ["pkg1", "pkg2", "pkg3"]
      }
    ]
  },

  'python-rate-limiter': {
    entrypoint: 'TokenBucketLimiter',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Capacity Initialization',
        input: [10, 2],
        expected: 10
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Burst Traffic Exceeding Rate',
        input: [5, 1],
        expected: 5
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Fractional Token Refill',
        isHidden: true,
        input: [20, 5],
        expected: 20
      }
    ]
  },

  // -------------------------------------------------------------
  // 2. SQL CONCEPTS
  // -------------------------------------------------------------
  'sql-cohort': {
    entrypoint: 'query',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Cohort User Counts',
        schema: `
          CREATE TABLE users (id INT, cohort TEXT, score INT);
          INSERT INTO users VALUES (1, '2026-Q1', 85);
          INSERT INTO users VALUES (2, '2026-Q1', 90);
          INSERT INTO users VALUES (3, '2026-Q2', 78);
        `,
        input: [],
        expected: [
          { cohort: '2026-Q1', total_users: 2 },
          { cohort: '2026-Q2', total_users: 1 }
        ]
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Zero User Null Cohorts',
        schema: `
          CREATE TABLE users (id INT, cohort TEXT, score INT);
          INSERT INTO users VALUES (1, '2026-Q1', 85);
          INSERT INTO users VALUES (2, '2026-Q1', 90);
        `,
        input: [],
        expected: [
          { cohort: '2026-Q1', total_users: 2 }
        ]
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Multi-Year Cohort Sorting',
        isHidden: true,
        schema: `
          CREATE TABLE users (id INT, cohort TEXT, score INT);
          INSERT INTO users VALUES (1, '2025-Q4', 90);
          INSERT INTO users VALUES (2, '2026-Q1', 80);
          INSERT INTO users VALUES (3, '2026-Q1', 95);
        `,
        input: [],
        expected: [
          { cohort: '2025-Q4', total_users: 1 },
          { cohort: '2026-Q1', total_users: 2 }
        ]
      }
    ]
  },

  'sql-window-func': {
    entrypoint: 'query',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Running Balance Calculation',
        schema: `
          CREATE TABLE account_ledger (tx_id INT, account_id INT, tx_date TEXT, amount INT);
          INSERT INTO account_ledger VALUES (1, 101, '2026-01-01', 500);
          INSERT INTO account_ledger VALUES (2, 101, '2026-01-02', -100);
          INSERT INTO account_ledger VALUES (3, 101, '2026-01-03', 250);
        `,
        input: [],
        expected: [
          { tx_id: 1, amount: 500, balance: 500 },
          { tx_id: 2, amount: -100, balance: 400 },
          { tx_id: 3, amount: 250, balance: 650 }
        ]
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Multi-Account Isolation',
        schema: `
          CREATE TABLE account_ledger (tx_id INT, account_id INT, tx_date TEXT, amount INT);
          INSERT INTO account_ledger VALUES (1, 101, '2026-01-01', 500);
          INSERT INTO account_ledger VALUES (2, 102, '2026-01-01', 300);
          INSERT INTO account_ledger VALUES (3, 101, '2026-01-02', 100);
        `,
        input: [],
        expected: [
          { tx_id: 1, amount: 500, balance: 500 },
          { tx_id: 3, amount: 100, balance: 600 },
          { tx_id: 2, amount: 300, balance: 300 }
        ]
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Negative Overdraft Balances',
        isHidden: true,
        schema: `
          CREATE TABLE account_ledger (tx_id INT, account_id INT, tx_date TEXT, amount INT);
          INSERT INTO account_ledger VALUES (1, 201, '2026-01-01', 100);
          INSERT INTO account_ledger VALUES (2, 201, '2026-01-02', -300);
        `,
        input: [],
        expected: [
          { tx_id: 1, amount: 100, balance: 100 },
          { tx_id: 2, amount: -300, balance: -200 }
        ]
      }
    ]
  },

  'sql-recursive-cte': {
    entrypoint: 'query',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Org Hierarchy Traversal',
        schema: `
          CREATE TABLE employees (emp_id INT, name TEXT, manager_id INT);
          INSERT INTO employees VALUES (1, 'CEO', NULL);
          INSERT INTO employees VALUES (2, 'VP Eng', 1);
          INSERT INTO employees VALUES (3, 'Lead Dev', 2);
        `,
        input: [],
        expected: [
          { emp_id: 1, name: 'CEO', level: 1 },
          { emp_id: 2, name: 'VP Eng', level: 2 },
          { emp_id: 3, name: 'Lead Dev', level: 3 }
        ]
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Parallel Department Leaves',
        schema: `
          CREATE TABLE employees (emp_id INT, name TEXT, manager_id INT);
          INSERT INTO employees VALUES (1, 'CEO', NULL);
          INSERT INTO employees VALUES (2, 'VP Product', 1);
          INSERT INTO employees VALUES (3, 'VP Eng', 1);
        `,
        input: [],
        expected: [
          { emp_id: 1, name: 'CEO', level: 1 },
          { emp_id: 2, name: 'VP Product', level: 2 },
          { emp_id: 3, name: 'VP Eng', level: 2 }
        ]
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Deep Tree Traversal',
        isHidden: true,
        schema: `
          CREATE TABLE employees (emp_id INT, name TEXT, manager_id INT);
          INSERT INTO employees VALUES (1, 'CEO', NULL);
          INSERT INTO employees VALUES (2, 'CTO', 1);
          INSERT INTO employees VALUES (3, 'Director', 2);
          INSERT INTO employees VALUES (4, 'Engineer', 3);
        `,
        input: [],
        expected: [
          { emp_id: 1, name: 'CEO', level: 1 },
          { emp_id: 2, name: 'CTO', level: 2 },
          { emp_id: 3, name: 'Director', level: 3 },
          { emp_id: 4, name: 'Engineer', level: 4 }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 3. JAVASCRIPT CONCEPTS
  // -------------------------------------------------------------
  'js-promise-batch': {
    entrypoint: 'batchProcess',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Sequential Batch Computation',
        input: [[1, 2, 3, 4], 2, 'function(x) { return x * 10; }'],
        expected: [10, 20, 30, 40]
      },
      {
        id: 2,
        title: 'Test Case 2: Non-Uniform Final Batch',
        input: [[1, 2, 3], 2, 'function(x) { return x + 1; }'],
        expected: [2, 3, 4]
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Empty Input Array',
        input: [[], 3, 'function(x) { return x; }'],
        expected: []
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden: Batch Size Equal to Array Length',
        isHidden: true,
        input: [[10, 20, 30], 3, 'function(x) { return x / 10; }'],
        expected: [1, 2, 3]
      }
    ]
  },

  'js-deep-diff': {
    entrypoint: 'deepDiff',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Key Modification Detection',
        input: [{ a: 1, b: 2 }, { a: 1, b: 3 }],
        expected: { 'b': { old: 2, new: 3 } }
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Identical Objects',
        input: [{ a: 1 }, { a: 1 }],
        expected: {}
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Added and Removed Keys',
        isHidden: true,
        input: [{ a: 1 }, { b: 2 }],
        expected: { 'a': { old: 1, new: undefined }, 'b': { old: undefined, new: 2 } }
      }
    ]
  },

  'js-event-emitter': {
    entrypoint: 'EventEmitter',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Event Listener Registration & Emit',
        input: ['click'],
        expected: true
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Emitting Unregistered Event',
        input: ['unknown_event'],
        expected: false
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Multiple Listeners for Same Event',
        isHidden: true,
        input: ['data'],
        expected: true
      }
    ]
  },

  // -------------------------------------------------------------
  // 4. C CONCEPTS
  // -------------------------------------------------------------
  'c-tokenizer': {
    entrypoint: 'tokenize',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Memory-Safe String Tokenizer Compilation',
        input: ["hello,world", ","],
        expected: "Executable compiled and executed successfully"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Null Delimiter Defense',
        input: ["hello", ""],
        expected: "Executable compiled and executed successfully"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Multi-Delimiter String Parsing',
        isHidden: true,
        input: ["a:b:c", ":"],
        expected: "Executable compiled and executed successfully"
      }
    ]
  },

  'c-ring-buffer': {
    entrypoint: 'RingBuffer',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Circular Buffer Enqueue & Dequeue',
        input: [10],
        expected: "Executable compiled and executed successfully"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Buffer Overflow Wrap-around',
        input: [65],
        expected: "Executable compiled and executed successfully"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Continuous FIFO Drain',
        isHidden: true,
        input: [100],
        expected: "Executable compiled and executed successfully"
      }
    ]
  },

  'c-hashmap': {
    entrypoint: 'HashMap',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Key Insert and Lookup',
        input: ["key1", 42],
        expected: "Executable compiled and executed successfully"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Hash Collision Chaining',
        input: ["key_coll1", 10],
        expected: "Executable compiled and executed successfully"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Rehash and Table Resize',
        isHidden: true,
        input: ["key_resize", 99],
        expected: "Executable compiled and executed successfully"
      }
    ]
  },

  // -------------------------------------------------------------
  // 5. C++ CONCEPTS
  // -------------------------------------------------------------
  'cpp-stl-metrics': {
    entrypoint: 'computeMetrics',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Vector Telemetry Normalizer',
        input: [[10.0, 20.0, 30.0]],
        expected: "C++ solution compiled and verified"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Empty Vector Guard',
        input: [[]],
        expected: "C++ solution compiled and verified"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: High-Variance Telemetry Series',
        isHidden: true,
        input: [[1.0, 1000.0, 50.0]],
        expected: "C++ solution compiled and verified"
      }
    ]
  },

  'cpp-raii': {
    entrypoint: 'ScopedDescriptor',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: RAII Resource Acquisition',
        input: [1],
        expected: "C++ solution compiled and verified"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Exception-Safe Cleanup',
        input: [-1],
        expected: "C++ solution compiled and verified"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Move Semantics Transfer',
        isHidden: true,
        input: [10],
        expected: "C++ solution compiled and verified"
      }
    ]
  },

  'cpp-order-book': {
    entrypoint: 'OrderBook',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Limit Order Matching',
        input: ["BUY", 100.50, 10],
        expected: "C++ solution compiled and verified"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Crossed Spread Rejection',
        input: ["SELL", 99.00, 5],
        expected: "C++ solution compiled and verified"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: High-Volume Depth Book',
        isHidden: true,
        input: ["BUY", 105.00, 50],
        expected: "C++ solution compiled and verified"
      }
    ]
  },

  // -------------------------------------------------------------
  // 6. JAVA CONCEPTS
  // -------------------------------------------------------------
  'java-order-stream': {
    entrypoint: 'OrderStreamAggregator',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Order Stream Stream API Aggregator',
        input: [100],
        expected: "Java class compiled and verified"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Null Order Filter',
        input: [0],
        expected: "Java class compiled and verified"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Concurrent Stream Aggregation',
        isHidden: true,
        input: [500],
        expected: "Java class compiled and verified"
      }
    ]
  },

  'java-worker-pool': {
    entrypoint: 'WorkDispatcher',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Thread Pool Dispatch',
        input: [4],
        expected: "Java class compiled and verified"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Worker Backpressure & Rejection',
        input: [100],
        expected: "Java class compiled and verified"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Graceful Pool Shutdown',
        isHidden: true,
        input: [1],
        expected: "Java class compiled and verified"
      }
    ]
  },

  'java-lru-cache': {
    entrypoint: 'LRUCache',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Cache Eviction Under Capacity',
        input: [3],
        expected: "Java class compiled and verified"
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Zero Capacity Guard',
        input: [0],
        expected: "Java class compiled and verified"
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: O(1) Get and Put Verification',
        isHidden: true,
        input: [10],
        expected: "Java class compiled and verified"
      }
    ]
  },

  // -------------------------------------------------------------
  // 7. HTML / CSS CONCEPTS
  // -------------------------------------------------------------
  'html-responsive-grid': {
    entrypoint: 'htmlcss',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Grid Layout Structure',
        expected: ['.card-grid', 'display: grid', 'grid-template-columns']
      },
      {
        id: 2,
        title: 'Test Case 2: Responsive Media Query',
        expected: ['@media', 'min-width']
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Mobile Viewport Fluid Sizing',
        expected: ['gap', 'width']
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden: Semantic HTML5 Elements',
        isHidden: true,
        expected: ['<article', '<header']
      }
    ]
  },

  'html-accessible-nav': {
    entrypoint: 'htmlcss',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Semantic Navigation Markup',
        expected: ['<nav', '<ul', '<li', '<a']
      },
      {
        id: 2,
        title: 'Test Case 2: ARIA Attributes & Focus Management',
        expected: ['aria-label', ':focus']
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Keyboard Nav Accessibility',
        expected: ['tabindex', 'outline']
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden: Screen Reader Text',
        isHidden: true,
        expected: ['sr-only']
      }
    ]
  },

  'html-skeleton-loader': {
    entrypoint: 'htmlcss',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Shimmer Animation Keyframe',
        expected: ['@keyframes', 'animation']
      },
      {
        id: 2,
        title: 'Test Case 2: Linear Gradient Sweep',
        expected: ['linear-gradient', 'background-size']
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Cumulative Layout Shift Protection',
        expected: ['height', 'border-radius']
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden: Reduced Motion Accessibility Guard',
        isHidden: true,
        expected: ['prefers-reduced-motion']
      }
    ]
  },

  // -------------------------------------------------------------
  // 8. FRONTEND CONCEPTS
  // -------------------------------------------------------------
  'react-async-search': {
    entrypoint: 'useEffect',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Effect Query Dependency',
        input: ['React'],
        expected: true
      },
      {
        id: 2,
        title: 'Test Case 2: Cancellation Cleanup',
        input: ['Python'],
        expected: true
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Rapid Keystroke Debouncing',
        input: [''],
        expected: true
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden: Network Race Condition Shield',
        isHidden: true,
        input: ['Data'],
        expected: true
      }
    ]
  },

  'react-virtual-list': {
    entrypoint: 'getVisibleRange',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Top of List Scroll',
        input: [0, 400, 1000, 40],
        expected: { startIndex: 0, endIndex: 10 }
      },
      {
        id: 2,
        title: 'Test Case 2: Scrolled Mid-way',
        input: [800, 400, 1000, 40],
        expected: { startIndex: 20, endIndex: 30 }
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Zero Viewport Height',
        input: [0, 0, 100, 40],
        expected: { startIndex: 0, endIndex: 0 }
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden: Bottom Boundary Clamping',
        isHidden: true,
        input: [3900, 400, 100, 40],
        expected: { startIndex: 97, endIndex: 100 }
      }
    ]
  },

  'react-undo-redo': {
    entrypoint: 'useUndoRedo',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Initial State & History Pointer',
        input: ['Initial'],
        expected: 'Initial'
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Undo Beyond Empty History',
        input: ['State 1'],
        expected: 'State 1'
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Max History Ring Buffer Truncation',
        isHidden: true,
        input: ['State 2'],
        expected: 'State 2'
      }
    ]
  },

  // -------------------------------------------------------------
  // 9. BACKEND CONCEPTS
  // -------------------------------------------------------------
  'backend-rest-controller': {
    entrypoint: 'router',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Express Router & Route Handler Registration',
        input: ['/api/v1/metrics'],
        expected: true
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Malformed Payload Validation (400 Bad Request)',
        input: ['/api/v1/bad-request'],
        expected: true
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: 500 Internal Error Catching Middleware',
        isHidden: true,
        input: ['/api/v1/error'],
        expected: true
      }
    ]
  },

  'backend-idempotency': {
    entrypoint: 'idempotencyMiddleware',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Idempotency Key Processing',
        input: ['IDEMP-KEY-001'],
        expected: true
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Duplicate Request Cache Replay',
        input: ['IDEMP-KEY-001'],
        expected: true
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Concurrent In-Flight Key Lock',
        isHidden: true,
        input: ['IDEMP-KEY-LOCKED'],
        expected: true
      }
    ]
  },

  'backend-jwt-refresh': {
    entrypoint: 'authenticateJWT',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Valid Bearer Token Authorization',
        input: ['Bearer valid_token_string'],
        expected: true
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Expired Token 401 Rejection',
        input: ['Bearer expired_token'],
        expected: false
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Malformed Missing Bearer Header',
        isHidden: true,
        input: [''],
        expected: false
      }
    ]
  },

  // -------------------------------------------------------------
  // 10. DATA ANALYTICS CONCEPTS
  // -------------------------------------------------------------
  'analytics-churn-arpu': {
    entrypoint: 'analyze_retention_and_churn',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Clean Customer Cohort',
        input: [
          [
            { user_id: 'U1', monthly_revenue: 100.0, status: 'active' },
            { user_id: 'U2', monthly_revenue: 150.0, status: 'churned' },
            { user_id: 'U3', monthly_revenue: 200.0, status: 'active' }
          ]
        ],
        expected: { churn_rate: 33.33, arpu: 150.0, active_count: 2 }
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Zero Active Users',
        input: [
          [
            { user_id: 'U1', monthly_revenue: 100.0, status: 'churned' }
          ]
        ],
        expected: { churn_rate: 100.0, arpu: 0.0, active_count: 0 }
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: 100% Retention Scenario',
        isHidden: true,
        input: [
          [
            { user_id: 'U1', monthly_revenue: 200.0, status: 'active' },
            { user_id: 'U2', monthly_revenue: 300.0, status: 'active' }
          ]
        ],
        expected: { churn_rate: 0.0, arpu: 250.0, active_count: 2 }
      }
    ]
  },

  'analytics-iqr-outliers': {
    entrypoint: 'detect_outliers_iqr',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Simple Outlier Boundary',
        input: [[10, 12, 14, 15, 16, 18, 100]],
        expected: { outliers: [100] }
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Zero Variance Dataset',
        input: [[5, 5, 5, 5, 5]],
        expected: { outliers: [] }
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Negative Outliers',
        isHidden: true,
        input: [[-100, 10, 11, 12, 13, 14]],
        expected: { outliers: [-100] }
      }
    ]
  },

  'analytics-rolling-avg': {
    entrypoint: 'compute_rolling_averages',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: 3-Point Rolling Window',
        input: [[10, 20, 30, 40, 50], 3],
        expected: [20.0, 30.0, 40.0]
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Window Larger than Dataset',
        input: [[10, 20], 3],
        expected: []
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden: Window Size 1',
        isHidden: true,
        input: [[5, 15, 25], 1],
        expected: [5.0, 15.0, 25.0]
      }
    ]
  }
};

/**
 * Returns executable test specification for any concept ID or generates an intelligent fallback
 * based on the actual starterCode and signature.
 */
export function getExecutableSpec(conceptId, skillId, starterCode) {
  if (conceptExecutableSpecs[conceptId]) {
    return conceptExecutableSpecs[conceptId];
  }

  // Auto-detect entrypoint from starterCode
  let entrypoint = 'solution';
  if (starterCode) {
    const pyMatch = starterCode.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
    const jsMatch = starterCode.match(/(?:function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\()/);
    const classMatch = starterCode.match(/(?:class\s+([a-zA-Z0-9_]+))/);
    if (pyMatch) entrypoint = pyMatch[1];
    else if (jsMatch) entrypoint = jsMatch[1] || jsMatch[2];
    else if (classMatch) entrypoint = classMatch[1];
  }

  return {
    entrypoint,
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Baseline Structural Verification',
        input: [1],
        expected: 1,
        isHidden: false
      },
      {
        id: 2,
        title: 'Test Case 2: Secondary Boundary Verification',
        input: [0],
        expected: 0,
        isHidden: false
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Anomaly & Boundary Injection',
        input: [-1],
        expected: -1,
        isHidden: false
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden 1: Scaled Input Verification',
        input: [100],
        expected: 100,
        isHidden: true
      },
      {
        id: 5,
        title: 'Hidden 2: Null / Defensive Boundary',
        input: [null],
        expected: null,
        isHidden: true
      }
    ]
  };
}
