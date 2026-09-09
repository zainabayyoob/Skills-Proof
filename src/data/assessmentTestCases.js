// Real executable test cases for SkillProof Build -> Break -> Adapt coding assessments
// Each concept provides:
// 1. entrypoint: function name or query
// 2. sampleTestCases: visible test cases for "Run Code"
// 3. mutationTestCases: adversarial test cases for "BREAK" and "ADAPT"
// 4. hiddenTestCases: hidden test cases for "Submit Code" (85% cutoff)

export const conceptExecutableSpecs = {
  // -------------------------------------------------------------
  // PYTHON CONCEPTS
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

  // -------------------------------------------------------------
  // SQL CONCEPTS
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

  // -------------------------------------------------------------
  // JAVASCRIPT CONCEPTS
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

  // -------------------------------------------------------------
  // DATA ANALYTICS CONCEPTS
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
  },

  // -------------------------------------------------------------
  // FRONTEND / REACT CONCEPTS
  // -------------------------------------------------------------
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
    if (pyMatch) entrypoint = pyMatch[1];
    else if (jsMatch) entrypoint = jsMatch[1] || jsMatch[2];
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
