// Client-safe executable test specifications
// Sample & Mutation test cases for visible Run & Debug steps
// Hidden test cases are securely executed on the backend compiler service only

export const conceptExecutableSpecs = {
  "python-kpi": {
    "entrypoint": "analyze_sales_data",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Standard Multi-Item Batch",
        "input": [
          [
            {
              "id": "TX-101",
              "product": "Laptop Stand",
              "units": 2,
              "price": 45
            },
            {
              "id": "TX-102",
              "product": "Wireless Mouse",
              "units": 3,
              "price": 25
            },
            {
              "id": "TX-103",
              "product": "Laptop Stand",
              "units": 1,
              "price": 82.43
            }
          ]
        ],
        "expected": {
          "total_sales": 247.43,
          "top_product": "Laptop Stand",
          "aov": 82.48
        }
      },
      {
        "id": 2,
        "title": "Test Case 2: Single Product Batch",
        "input": [
          [
            {
              "id": "TX-201",
              "product": "Monitor Arm",
              "units": 1,
              "price": 50
            }
          ]
        ],
        "expected": {
          "total_sales": 50,
          "top_product": "Monitor Arm",
          "aov": 50
        }
      }
    ],
    "mutationTestCases": [
      {
        "id": 3,
        "title": "Mutation 1: Corrupted None Records & Duplicate IDs",
        "input": [
          [
            {
              "id": "TX-301",
              "product": "USB Hub",
              "units": 2,
              "price": 20
            },
            {
              "id": "TX-302",
              "product": "Corrupted Null",
              "units": null,
              "price": null
            },
            {
              "id": "TX-301",
              "product": "USB Hub",
              "units": 2,
              "price": 20
            }
          ]
        ],
        "expected": {
          "total_sales": 40,
          "top_product": "USB Hub",
          "aov": 40
        }
      }
    ],
    "hiddenTestCases": []
  },
  "python-dep-graph": {
    "entrypoint": "resolve_dependencies",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Simple Linear Dependency",
        "input": [
          {
            "app": [
              "web"
            ],
            "web": [
              "db"
            ],
            "db": []
          }
        ],
        "expected": [
          "db",
          "web",
          "app"
        ]
      },
      {
        "id": 2,
        "title": "Test Case 2: Diamond Dependency Tree",
        "input": [
          {
            "app": [
              "web",
              "db"
            ],
            "web": [
              "core"
            ],
            "db": [
              "core"
            ],
            "core": []
          }
        ],
        "expected": [
          "core",
          "web",
          "db",
          "app"
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 3,
        "title": "Mutation: Cyclic Loop Detection",
        "input": [
          {
            "A": [
              "B"
            ],
            "B": [
              "C"
            ],
            "C": [
              "A"
            ]
          }
        ],
        "expected": []
      }
    ],
    "hiddenTestCases": []
  },
  "python-rate-limiter": {
    "entrypoint": "TokenBucketLimiter",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Burst Traffic Throttling & Token Replenishment",
        "input": [
          2,
          1
        ],
        "expected": [
          true,
          true,
          false,
          true
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Burst Traffic Exceeding Rate",
        "input": [
          2,
          1
        ],
        "expected": [
          true,
          true,
          false,
          true
        ]
      }
    ],
    "hiddenTestCases": []
  },
  "sql-cohort": {
    "entrypoint": "query",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Cohort User Counts",
        "schema": "\n          CREATE TABLE users (id INT, cohort TEXT, score INT);\n          INSERT INTO users VALUES (1, '2026-Q1', 85);\n          INSERT INTO users VALUES (2, '2026-Q1', 90);\n          INSERT INTO users VALUES (3, '2026-Q2', 78);\n        ",
        "input": [],
        "expected": [
          {
            "cohort": "2026-Q1",
            "total_users": 2
          },
          {
            "cohort": "2026-Q2",
            "total_users": 1
          }
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Zero User Null Cohorts",
        "schema": "\n          CREATE TABLE users (id INT, cohort TEXT, score INT);\n          INSERT INTO users VALUES (1, '2026-Q1', 85);\n          INSERT INTO users VALUES (2, '2026-Q1', 90);\n        ",
        "input": [],
        "expected": [
          {
            "cohort": "2026-Q1",
            "total_users": 2
          }
        ]
      }
    ],
    "hiddenTestCases": []
  },
  "sql-window-func": {
    "entrypoint": "query",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Running Balance Calculation",
        "schema": "\n          CREATE TABLE account_ledger (tx_id INT, account_id INT, tx_date TEXT, amount INT);\n          INSERT INTO account_ledger VALUES (1, 101, '2026-01-01', 500);\n          INSERT INTO account_ledger VALUES (2, 101, '2026-01-02', -100);\n          INSERT INTO account_ledger VALUES (3, 101, '2026-01-03', 250);\n        ",
        "input": [],
        "expected": [
          {
            "tx_id": 1,
            "amount": 500,
            "balance": 500
          },
          {
            "tx_id": 2,
            "amount": -100,
            "balance": 400
          },
          {
            "tx_id": 3,
            "amount": 250,
            "balance": 650
          }
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Multi-Account Isolation",
        "schema": "\n          CREATE TABLE account_ledger (tx_id INT, account_id INT, tx_date TEXT, amount INT);\n          INSERT INTO account_ledger VALUES (1, 101, '2026-01-01', 500);\n          INSERT INTO account_ledger VALUES (2, 102, '2026-01-01', 300);\n          INSERT INTO account_ledger VALUES (3, 101, '2026-01-02', 100);\n        ",
        "input": [],
        "expected": [
          {
            "tx_id": 1,
            "amount": 500,
            "balance": 500
          },
          {
            "tx_id": 3,
            "amount": 100,
            "balance": 600
          },
          {
            "tx_id": 2,
            "amount": 300,
            "balance": 300
          }
        ]
      }
    ],
    "hiddenTestCases": []
  },
  "sql-recursive-cte": {
    "entrypoint": "query",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Org Hierarchy Traversal",
        "schema": "\n          CREATE TABLE employees (emp_id INT, name TEXT, manager_id INT);\n          INSERT INTO employees VALUES (1, 'CEO', NULL);\n          INSERT INTO employees VALUES (2, 'VP Eng', 1);\n          INSERT INTO employees VALUES (3, 'Lead Dev', 2);\n        ",
        "input": [],
        "expected": [
          {
            "emp_id": 1,
            "name": "CEO",
            "level": 1
          },
          {
            "emp_id": 2,
            "name": "VP Eng",
            "level": 2
          },
          {
            "emp_id": 3,
            "name": "Lead Dev",
            "level": 3
          }
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Parallel Department Leaves",
        "schema": "\n          CREATE TABLE employees (emp_id INT, name TEXT, manager_id INT);\n          INSERT INTO employees VALUES (1, 'CEO', NULL);\n          INSERT INTO employees VALUES (2, 'VP Product', 1);\n          INSERT INTO employees VALUES (3, 'VP Eng', 1);\n        ",
        "input": [],
        "expected": [
          {
            "emp_id": 1,
            "name": "CEO",
            "level": 1
          },
          {
            "emp_id": 2,
            "name": "VP Product",
            "level": 2
          },
          {
            "emp_id": 3,
            "name": "VP Eng",
            "level": 2
          }
        ]
      }
    ],
    "hiddenTestCases": []
  },
  "js-promise-batch": {
    "entrypoint": "batchProcess",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Sequential Batch Computation",
        "input": [
          [
            1,
            2,
            3,
            4
          ],
          2,
          "function(x) { return x * 10; }"
        ],
        "expected": [
          10,
          20,
          30,
          40
        ]
      },
      {
        "id": 2,
        "title": "Test Case 2: Non-Uniform Final Batch",
        "input": [
          [
            1,
            2,
            3
          ],
          2,
          "function(x) { return x + 1; }"
        ],
        "expected": [
          2,
          3,
          4
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 3,
        "title": "Mutation: Empty Input Array",
        "input": [
          [],
          3,
          "function(x) { return x; }"
        ],
        "expected": []
      }
    ],
    "hiddenTestCases": []
  },
  "js-deep-diff": {
    "entrypoint": "deepDiff",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Key Modification Detection",
        "input": [
          {
            "a": 1,
            "b": 2
          },
          {
            "a": 1,
            "b": 3
          }
        ],
        "expected": {
          "b": {
            "old": 2,
            "new": 3
          }
        }
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Identical Objects",
        "input": [
          {
            "a": 1
          },
          {
            "a": 1
          }
        ],
        "expected": {}
      }
    ],
    "hiddenTestCases": []
  },
  "js-event-emitter": {
    "entrypoint": "EventEmitter",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Event Listener Registration & Emit",
        "input": [
          "click"
        ],
        "expected": 1
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Listener Detachment & Re-emit",
        "input": [
          "unknown_event"
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": []
  },
  "c-tokenizer": {
    "entrypoint": "tokenize",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Memory-Safe String Tokenizer Compilation",
        "input": [
          "hello,world",
          ","
        ],
        "expected": "Executable compiled and executed successfully"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Null Delimiter Defense",
        "input": [
          "hello",
          ""
        ],
        "expected": "Executable compiled and executed successfully"
      }
    ],
    "hiddenTestCases": []
  },
  "c-ring-buffer": {
    "entrypoint": "RingBuffer",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Circular Buffer Enqueue & Dequeue",
        "input": [
          10
        ],
        "expected": "Executable compiled and executed successfully"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Buffer Overflow Wrap-around",
        "input": [
          65
        ],
        "expected": "Executable compiled and executed successfully"
      }
    ],
    "hiddenTestCases": []
  },
  "c-hashmap": {
    "entrypoint": "HashMap",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Key Insert and Lookup",
        "input": [
          "key1",
          42
        ],
        "expected": "Executable compiled and executed successfully"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Hash Collision Chaining",
        "input": [
          "key_coll1",
          10
        ],
        "expected": "Executable compiled and executed successfully"
      }
    ],
    "hiddenTestCases": []
  },
  "cpp-stl-metrics": {
    "entrypoint": "computeMetrics",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Vector Telemetry Normalizer",
        "input": [
          [
            10,
            20,
            30
          ]
        ],
        "expected": "C++ solution compiled and verified"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Empty Vector Guard",
        "input": [
          []
        ],
        "expected": "C++ solution compiled and verified"
      }
    ],
    "hiddenTestCases": []
  },
  "cpp-raii": {
    "entrypoint": "ScopedDescriptor",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: RAII Resource Acquisition",
        "input": [
          1
        ],
        "expected": "C++ solution compiled and verified"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Exception-Safe Cleanup",
        "input": [
          -1
        ],
        "expected": "C++ solution compiled and verified"
      }
    ],
    "hiddenTestCases": []
  },
  "cpp-order-book": {
    "entrypoint": "OrderBook",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Limit Order Matching",
        "input": [
          "BUY",
          100.5,
          10
        ],
        "expected": "C++ solution compiled and verified"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Crossed Spread Rejection",
        "input": [
          "SELL",
          99,
          5
        ],
        "expected": "C++ solution compiled and verified"
      }
    ],
    "hiddenTestCases": []
  },
  "java-order-stream": {
    "entrypoint": "OrderService",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Order Stream Stream API Aggregator",
        "input": [
          100
        ],
        "expected": "Java class compiled and verified"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Null Order Filter",
        "input": [
          0
        ],
        "expected": "Java class compiled and verified"
      }
    ],
    "hiddenTestCases": []
  },
  "java-worker-pool": {
    "entrypoint": "WorkDispatcher",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Thread Pool Dispatch",
        "input": [
          4
        ],
        "expected": "Java class compiled and verified"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Worker Backpressure & Rejection",
        "input": [
          100
        ],
        "expected": "Java class compiled and verified"
      }
    ],
    "hiddenTestCases": []
  },
  "java-lru-cache": {
    "entrypoint": "LRUCache",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Cache Eviction Under Capacity",
        "input": [
          3
        ],
        "expected": "Java class compiled and verified"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Zero Capacity Guard",
        "input": [
          0
        ],
        "expected": "Java class compiled and verified"
      }
    ],
    "hiddenTestCases": []
  },
  "html-responsive-grid": {
    "entrypoint": "htmlcss",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Grid Layout Structure",
        "expected": [
          ".card-grid",
          "display: grid",
          "grid-template-columns"
        ]
      },
      {
        "id": 2,
        "title": "Test Case 2: Responsive Media Query",
        "expected": [
          "@media",
          "min-width"
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 3,
        "title": "Mutation: Mobile Viewport Fluid Sizing",
        "expected": [
          "gap",
          "width"
        ]
      }
    ],
    "hiddenTestCases": []
  },
  "html-accessible-nav": {
    "entrypoint": "htmlcss",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Semantic Navigation Markup",
        "expected": [
          "<nav",
          "<ul",
          "<li",
          "<a"
        ]
      },
      {
        "id": 2,
        "title": "Test Case 2: ARIA Attributes & Focus Management",
        "expected": [
          "aria-label",
          ":focus"
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 3,
        "title": "Mutation: Keyboard Nav Accessibility",
        "expected": [
          "tabindex",
          "outline"
        ]
      }
    ],
    "hiddenTestCases": []
  },
  "html-skeleton-loader": {
    "entrypoint": "htmlcss",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Shimmer Animation Keyframe",
        "expected": [
          "@keyframes",
          "animation"
        ]
      },
      {
        "id": 2,
        "title": "Test Case 2: Linear Gradient Sweep",
        "expected": [
          "linear-gradient",
          "background-size"
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 3,
        "title": "Mutation: Cumulative Layout Shift Protection",
        "expected": [
          "height",
          "border-radius"
        ]
      }
    ],
    "hiddenTestCases": []
  },
  "react-async-search": {
    "entrypoint": "useEffect",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Effect Query Dependency",
        "input": [
          "React"
        ],
        "expected": true
      },
      {
        "id": 2,
        "title": "Test Case 2: Cancellation Cleanup",
        "input": [
          "Python"
        ],
        "expected": true
      }
    ],
    "mutationTestCases": [
      {
        "id": 3,
        "title": "Mutation: Rapid Keystroke Debouncing",
        "input": [
          ""
        ],
        "expected": true
      }
    ],
    "hiddenTestCases": []
  },
  "react-virtual-list": {
    "entrypoint": "getVisibleRange",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Top of List Scroll",
        "input": [
          0,
          400,
          1000,
          40
        ],
        "expected": {
          "startIndex": 0,
          "endIndex": 10
        }
      },
      {
        "id": 2,
        "title": "Test Case 2: Scrolled Mid-way",
        "input": [
          800,
          400,
          1000,
          40
        ],
        "expected": {
          "startIndex": 20,
          "endIndex": 30
        }
      }
    ],
    "mutationTestCases": [
      {
        "id": 3,
        "title": "Mutation: Zero Viewport Height",
        "input": [
          0,
          0,
          100,
          40
        ],
        "expected": {
          "startIndex": 0,
          "endIndex": 0
        }
      }
    ],
    "hiddenTestCases": []
  },
  "react-undo-redo": {
    "entrypoint": "useUndoRedo",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Initial State & History Pointer",
        "input": [
          "Initial"
        ],
        "expected": "Undo/Redo state transitions verified"
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Undo Beyond Empty History",
        "input": [
          "State 1"
        ],
        "expected": "Undo/Redo state transitions verified"
      }
    ],
    "hiddenTestCases": []
  },
  "backend-rest-controller": {
    "entrypoint": "router",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Express Router & Route Handler Registration",
        "input": [
          "/api/apply"
        ],
        "expected": true
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Malformed Payload Validation (400 Bad Request)",
        "input": [
          "/api/apply/bad-request"
        ],
        "expected": true
      }
    ],
    "hiddenTestCases": []
  },
  "backend-idempotency": {
    "entrypoint": "idempotencyMiddleware",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Idempotency Key Processing",
        "input": [
          "IDEMP-KEY-001"
        ],
        "expected": true
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Duplicate Request Cache Replay",
        "input": [
          "IDEMP-KEY-001"
        ],
        "expected": true
      }
    ],
    "hiddenTestCases": []
  },
  "backend-jwt-refresh": {
    "entrypoint": "authenticateJWT",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Valid Bearer Token Authorization",
        "input": [
          "Bearer valid_token_string"
        ],
        "expected": true
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Expired Token 401 Rejection",
        "input": [
          "Bearer expired_token"
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": []
  },
  "analytics-churn-arpu": {
    "entrypoint": "analyze_retention_and_churn",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Clean Customer Cohort",
        "input": [
          [
            {
              "user_id": "U1",
              "monthly_revenue": 100,
              "status": "active"
            },
            {
              "user_id": "U2",
              "monthly_revenue": 150,
              "status": "churned"
            },
            {
              "user_id": "U3",
              "monthly_revenue": 200,
              "status": "active"
            }
          ]
        ],
        "expected": {
          "churn_rate": 33.33,
          "arpu": 150,
          "active_count": 2
        }
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Zero Active Users",
        "input": [
          [
            {
              "user_id": "U1",
              "monthly_revenue": 100,
              "status": "churned"
            }
          ]
        ],
        "expected": {
          "churn_rate": 100,
          "arpu": 0,
          "active_count": 0
        }
      }
    ],
    "hiddenTestCases": []
  },
  "analytics-iqr-outliers": {
    "entrypoint": "detect_outliers_iqr",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: Simple Outlier Boundary",
        "input": [
          [
            10,
            12,
            14,
            15,
            16,
            18,
            100
          ]
        ],
        "expected": {
          "outliers": [
            100
          ]
        }
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Zero Variance Dataset",
        "input": [
          [
            5,
            5,
            5,
            5,
            5
          ]
        ],
        "expected": {
          "outliers": []
        }
      }
    ],
    "hiddenTestCases": []
  },
  "analytics-rolling-avg": {
    "entrypoint": "compute_rolling_averages",
    "sampleTestCases": [
      {
        "id": 1,
        "title": "Test Case 1: 3-Point Rolling Window",
        "input": [
          [
            10,
            20,
            30,
            40,
            50
          ],
          3
        ],
        "expected": [
          20,
          30,
          40
        ]
      }
    ],
    "mutationTestCases": [
      {
        "id": 2,
        "title": "Mutation: Window Larger than Dataset",
        "input": [
          [
            10,
            20
          ],
          3
        ],
        "expected": []
      }
    ],
    "hiddenTestCases": []
  }
};

export function getExecutableSpec(conceptId, skillId, starterCode) {
  if (conceptExecutableSpecs[conceptId]) {
    return conceptExecutableSpecs[conceptId];
  }

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
    hiddenTestCases: []
  };
}
