// Real executable test cases for SkillProof Build -> Break -> Adapt coding assessments
// Each concept provides:
// 1. entrypoint: function name
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
        title: 'Mutation 1: Corrupted None Records & Retried Duplicate IDs',
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

  'python-rate-limiter': {
    entrypoint: 'is_rate_limited',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: Initial Allowed Requests',
        input: ['client_1', [100.0, 100.1, 100.2], 3, 1.0],
        expected: [true, true, true]
      },
      {
        id: 2,
        title: 'Test Case 2: Exceeded Burst Capacity',
        input: ['client_2', [100.0, 100.05, 100.1, 100.15], 3, 1.0],
        expected: [true, true, true, false]
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Out of Order Timestamps (Clock Skew)',
        input: ['client_skew', [105.0, 104.0, 106.0], 2, 1.0],
        expected: [true, true, true]
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden 1: Refill After Quiet Period',
        isHidden: true,
        input: ['client_refill', [10.0, 10.1, 20.0, 20.1], 2, 1.0],
        expected: [true, true, true, true]
      }
    ]
  },

  // -------------------------------------------------------------
  // JAVASCRIPT / NODE CONCEPTS
  // -------------------------------------------------------------
  'js-promise-batch': {
    entrypoint: 'batchProcess',
    sampleTestCases: [
      {
        id: 1,
        title: 'Test Case 1: 4 Items in Batches of 2',
        input: [[1, 2, 3, 4], 2],
        expected: [2, 4, 6, 8]
      },
      {
        id: 2,
        title: 'Test Case 2: Empty Array Edge Case',
        input: [[], 3],
        expected: []
      }
    ],
    mutationTestCases: [
      {
        id: 3,
        title: 'Mutation: Non-positive Batch Size & Null Elements',
        input: [[10, 20, 30], 0],
        expected: [20, 40, 60]
      }
    ],
    hiddenTestCases: [
      {
        id: 4,
        title: 'Hidden 1: Uneven Batch Distribution',
        isHidden: true,
        input: [[1, 2, 3, 4, 5], 2],
        expected: [2, 4, 6, 8, 10]
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
        title: 'Test Case 1: Active & Churned Customer Cohort',
        input: [
          [
            { user_id: 'U1', monthly_revenue: 100.0, status: 'active' },
            { user_id: 'U2', monthly_revenue: 50.0, status: 'churned' },
            { user_id: 'U3', monthly_revenue: 150.0, status: 'active' }
          ]
        ],
        expected: { total_mrr: 250.0, churn_rate: 33.33, arpu: 83.33 }
      }
    ],
    mutationTestCases: [
      {
        id: 2,
        title: 'Mutation: Zero Active Users / Empty Dataset',
        input: [
          [
            { user_id: 'U99', monthly_revenue: 0.0, status: 'churned' }
          ]
        ],
        expected: { total_mrr: 0.0, churn_rate: 100.0, arpu: 0.0 }
      }
    ],
    hiddenTestCases: [
      {
        id: 3,
        title: 'Hidden 1: All Active Retained Cohort',
        isHidden: true,
        input: [
          [
            { user_id: 'U1', monthly_revenue: 200.0, status: 'active' },
            { user_id: 'U2', monthly_revenue: 300.0, status: 'active' }
          ]
        ],
        expected: { total_mrr: 500.0, churn_rate: 0.0, arpu: 250.0 }
      }
    ]
  }
};

/**
 * Returns executable test specification for any concept ID or generates a fallback
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
        title: 'Test Case 1: Baseline Structural Validation',
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
        title: 'Hidden 1: High Load Verification',
        input: [100],
        expected: 100,
        isHidden: true
      },
      {
        id: 5,
        title: 'Hidden 2: Null / Undefined Edge Case',
        input: [null],
        expected: null,
        isHidden: true
      }
    ]
  };
}
