export const assessmentModes = [
  {
    id: "practice",
    title: "Practice Mode",
    badge: "Learning Sandbox",
    description: "External resources and AI assistants are freely allowed. Perfect for building confidence and exploring approaches without affecting official verification ranking.",
    color: "blue",
    allowedAi: true,
    scoreImpact: "Diagnostic only (Not verified on passport)",
    icon: "BookOpen"
  },
  {
    id: "verified",
    title: "SkillProof Verified",
    badge: "Official Credential",
    description: "Controlled practical assessment under simulated production constraints. Evaluates genuine problem-solving under sudden breaking mutations. Mints verifiable passport badge.",
    color: "indigo",
    allowedAi: false,
    scoreImpact: "Directly updates Career Readiness & Verified Score",
    icon: "ShieldCheck",
    recommended: true
  },
  {
    id: "ai_assisted",
    title: "AI-Assisted Mode",
    badge: "AI-Copilot & Audit",
    description: "AI generation is explicitly encouraged! However, the student must audit, debug, adapt, and thoroughly explain AI-generated code under sudden edge cases.",
    color: "purple",
    allowedAi: true,
    scoreImpact: "Evaluated on Critical Review, Debugging & Prompt Adaptation",
    icon: "Sparkles"
  }
];

export const skillsCatalogue = [
  // =========================================================================
  // 1. PYTHON
  // =========================================================================
  {
    id: "python",
    name: "Python",
    category: "Data & Backend",
    icon: "FileCode2",
    verifiedScore: 88,
    benchmarkScore: 80,
    status: "Verified",
    concepts: [
      {
        id: "python-kpi",
        title: "Data Aggregation & KPI Engine",
        conceptTag: "Data Processing",
        difficulty: "Medium",
        taskTitle: "Sales Dataset Performance & KPI Engine",
        buildTask: "Implement `analyze_sales_data(transactions)` that aggregates clean sales records, determines total revenue, finds the top-selling product, and calculates Average Order Value (AOV).",
        questionDetails: {
          objective: "Write a function `analyze_sales_data(transactions)` that processes an array of sales transaction records and computes key business KPIs.",
          inputFormat: "transactions: list of dicts. Each dict contains: 'id' (str), 'product' (str), 'units' (int), 'price' (float).",
          sampleInput: `[
  {"id": "TX-101", "product": "Laptop Stand", "units": 2, "price": 45.00},
  {"id": "TX-102", "product": "Wireless Mouse", "units": 3, "price": 25.00},
  {"id": "TX-103", "product": "Laptop Stand", "units": 1, "price": 82.43}
]`,
          expectedOutput: `{
  "total_sales": 247.43,
  "top_product": "Laptop Stand",
  "aov": 82.48
}`,
          requirements: [
            "Calculate total_sales: sum of (units * price) across transactions, rounded to 2 decimal places.",
            "Identify top_product: product name generating the highest total revenue.",
            "Calculate aov: total_sales divided by transaction count, rounded to 2 decimal places.",
            "Return a dictionary with exact keys: 'total_sales', 'top_product', 'aov'."
          ],
          explanation: "• Laptop Stand: 2 × $45.00 + 1 × $82.43 = $172.43\n• Wireless Mouse: 3 × $25.00 = $75.00\n• Total Sales = $247.43 • Top Product = Laptop Stand • AOV = $82.48"
        },
        starterCode: `def analyze_sales_data(transactions):
    # TODO: Write your code below to calculate total_sales, top_product, and aov
    # Return dictionary with keys: 'total_sales', 'top_product', 'aov'
    pass
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Production Webhook Contamination!
1. 20% of incoming records contain NULL / None for 'units' or 'price'.
2. Price values arrive contaminated with currency strings (e.g. "$89.90 USD", " 45.00 ").
3. Webhook retries caused duplicate transaction IDs in the stream.
4. An empty clean subset triggers fatal ZeroDivisionError on AOV calculation!

Your naive solution crashed with:
TypeError: unsupported operand type(s) for *: 'NoneType' and 'str'`,
        adaptedStarterCode: `import re

def analyze_sales_data(transactions):
    """
    DEFENSIVE REFACTOR:
    1. Guard against None/null units or prices (skip corrupted records).
    2. Sanitize contaminated currency strings (e.g. "$89.90 USD" -> 89.90).
    3. Deduplicate transactions using transaction 'id' (seen_ids set).
    4. Guard against zero-division if valid records are empty.
    """
    seen_ids = set()
    total_sales = 0.0
    product_sales = {}
    valid_count = 0
    
    # TODO: Implement defensive data sanitization
    pass
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard Batch (3 Transactions)", expected: "total_sales: 247.43, top_product: 'Laptop Stand', aov: 82.48" },
          { id: 2, title: "Test Case 2: Single Transaction Batch", expected: "total_sales: 45.00, top_product: 'Laptop Stand', aov: 45.00" },
          { id: 3, title: "Test Case 3: Multiple Products Revenue Aggregation", expected: "total_sales: 165.00, top_product: 'Stand', aov: 82.50" }
        ],
        unimplementedCheck: (c) => c.includes('pass') && !c.includes('return'),
        defensiveCheck: (c) => c.includes('seen_ids') || c.includes('isinstance') || c.includes('float(')
      },
      {
        id: "python-rate-limiter",
        title: "Token Bucket Rate Limiter",
        conceptTag: "Concurrency & Algorithms",
        difficulty: "Hard",
        taskTitle: "Token Bucket Rate Limiter Class",
        buildTask: "Implement a `TokenBucketLimiter` class with `allow_request(client_id, timestamp)` that enforces per-client request limits using token refill.",
        questionDetails: {
          objective: "Implement a client rate limiter class where each client has a bucket with a maximum capacity and tokens replenish at a fixed rate per second.",
          inputFormat: "Constructor: capacity (int), refill_rate_per_sec (float). Method: allow_request(client_id: str, timestamp: float) -> bool.",
          sampleInput: `limiter = TokenBucketLimiter(capacity=3, refill_rate_per_sec=1.0)
limiter.allow_request("user_1", 100.0) -> True
limiter.allow_request("user_1", 100.1) -> True
limiter.allow_request("user_1", 100.2) -> True
limiter.allow_request("user_1", 100.3) -> False (exceeded capacity)`,
          expectedOutput: `True, True, True, False based on token availability`,
          requirements: [
            "Maintain independent token buckets per client_id in a dictionary.",
            "Replenish tokens based on (timestamp - last_refill) * refill_rate, capped at capacity.",
            "If tokens >= 1, decrement 1 token and return True. Otherwise return False.",
            "Initialize new clients with a full bucket."
          ],
          explanation: "Token bucket allows controlled bursts up to capacity while ensuring sustained rates do not exceed refill_rate_per_sec."
        },
        starterCode: `class TokenBucketLimiter:
    def __init__(self, capacity, refill_rate_per_sec):
        # TODO: Initialize bucket capacity and refill rate
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.clients = {}

    def allow_request(self, client_id, timestamp):
        # TODO: Replenish tokens based on elapsed time and return True if allowed, False if throttled
        pass
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Clock Skew & Out-Of-Order Timestamps!
1. Distributed servers caused clock jitter: timestamp arrived earlier than last_refill (timestamp < last_refill).
2. Negative elapsed time resulted in negative tokens, permanently locking out valid clients!
3. Corrupted non-string client_ids (None / int) triggered TypeError.

Your naive solution crashed with:
ValueError: tokens cannot be negative from negative time elapsed`,
        adaptedStarterCode: `class TokenBucketLimiter:
    """
    DEFENSIVE REFACTOR:
    1. Guard against clock skew: if timestamp < last_refill, clamp elapsed time to 0.0.
    2. Normalize client_id to string and guard against empty/None client_id.
    3. Ensure tokens are bounded strictly within [0.0, capacity].
    """
    def __init__(self, capacity, refill_rate_per_sec):
        self.capacity = max(1, capacity)
        self.refill_rate = max(0.01, float(refill_rate_per_sec))
        self.clients = {}

    def allow_request(self, client_id, timestamp):
        # TODO: Implement defensive rate limiting with clock skew protection
        pass
`,
        testCases: [
          { id: 1, title: "Test Case 1: Initial Burst up to Capacity", expected: "Allows 3 requests, throttles 4th immediate request" },
          { id: 2, title: "Test Case 2: Time Progression Refill", expected: "Replenishes tokens after elapsed seconds" },
          { id: 3, title: "Test Case 3: Multiple Independent Clients", expected: "client_A and client_B track tokens separately" }
        ],
        unimplementedCheck: (c) => c.includes('pass') && !c.includes('return'),
        defensiveCheck: (c) => c.includes('max(') || c.includes('elapsed') || c.includes('timestamp')
      },
      {
        id: "python-dep-graph",
        title: "Dependency Graph & Topological Sort",
        conceptTag: "Graph Algorithms",
        difficulty: "Hard",
        taskTitle: "Package Dependency Resolver",
        buildTask: "Implement `resolve_dependencies(graph)` that computes an install order for software packages using Topological Sorting.",
        questionDetails: {
          objective: "Write a function `resolve_dependencies(graph)` that takes an adjacency list representing package dependencies and returns an ordered list of packages.",
          inputFormat: "graph: dict where key is package (str) and value is list of required dependency packages.",
          sampleInput: `{"app": ["web", "db"], "web": ["core"], "db": ["core"], "core": []}`,
          expectedOutput: `["core", "db", "web", "app"] or ["core", "web", "db", "app"]`,
          requirements: [
            "Use Kahn's algorithm (in-degrees) or Post-Order DFS.",
            "All prerequisite dependencies of a package must appear before the package itself in the result.",
            "Return a clean flat list of package names."
          ],
          explanation: "Packages with 0 dependencies are installed first, enabling dependent packages to resolve sequentially."
        },
        starterCode: `def resolve_dependencies(graph):
    # TODO: Return list of packages in valid topological install order
    # graph: {"app": ["web", "db"], "web": ["core"], "db": ["core"], "core": []}
    pass
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Circular Dependency Cycle!
1. Production repository contained circular imports: "A" depends on "B", "B" depends on "C", "C" depends on "A".
2. Naive recursion entered an infinite loop!
Fatal RecursionError: maximum recursion depth exceeded in comparison.`,
        adaptedStarterCode: `def resolve_dependencies(graph):
    """
    DEFENSIVE REFACTOR:
    1. Guard against empty graph (return []).
    2. Detect circular dependency cycles using 3-state coloring (visiting / visited) or Kahn's indegree count.
    3. Return {"error": "Circular dependency detected", "cycle": True} if a cycle exists instead of freezing.
    """
    # TODO: Implement topological sort with cycle detection
    pass
`,
        testCases: [
          { id: 1, title: "Test Case 1: Linear DAG Resolution", expected: "Returns exact prerequisite order ['core', 'web', 'app']" },
          { id: 2, title: "Test Case 2: Diamond Dependency DAG", expected: "Common dependencies resolved before dependents" },
          { id: 3, title: "Test Case 3: Disconnected Graphs", expected: "All independent components resolved correctly" }
        ],
        unimplementedCheck: (c) => c.includes('pass') && !c.includes('return'),
        defensiveCheck: (c) => c.includes('cycle') || c.includes('indegree') || c.includes('visited')
      }
    ]
  },

  // =========================================================================
  // 2. SQL
  // =========================================================================
  {
    id: "sql",
    name: "SQL",
    category: "Database & Analytics",
    icon: "Database",
    verifiedScore: 84,
    benchmarkScore: 80,
    status: "Verified",
    concepts: [
      {
        id: "sql-cohort",
        title: "Cohort Retention & Analytical Query",
        conceptTag: "Aggregations & Ratios",
        difficulty: "Medium",
        taskTitle: "Cohort Monthly Retention & Churn Query",
        buildTask: "Formulate an analytical SQL query calculating monthly active cohorts and retention rate from table `cohort_metrics`.",
        questionDetails: {
          objective: "Write an analytical SQL query on `cohort_metrics` to compute retention percentage for each cohort month.",
          inputFormat: "Table `cohort_metrics`: cohort_month (VARCHAR), active_users (INT), total_registered (INT).",
          sampleInput: `cohort_month | active_users | total_registered
2026-01      | 450          | 500
2026-02      | 380          | 500
2026-03      | 310          | 500`,
          expectedOutput: `cohort_month | active_users | total_registered | retention_rate
2026-01      | 450          | 500              | 90.00
2026-02      | 380          | 500              | 76.00
2026-03      | 310          | 500              | 62.00`,
          requirements: [
            "Select cohort_month, active_users, total_registered.",
            "Calculate retention_rate as (active_users * 100.0 / total_registered).",
            "Round retention_rate to 2 decimal places.",
            "Order results chronologically by cohort_month."
          ],
          explanation: "Retention rate is computed as active_users divided by total registered candidates multiplied by 100."
        },
        starterCode: `-- Write your SQL analytical query below
-- Table: cohort_metrics (cohort_month, active_users, total_registered)

SELECT
    -- TODO: Select required columns and compute retention_rate
    
FROM cohort_metrics;
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Zero Denominator Division!
In month 4, an experimental cohort recorded total_registered = 0.
Your query executed raw division (active_users * 100.0 / total_registered).
Fatal Database Exception 22012: Division by zero encountered. The ETL ingestion pipeline crashed!`,
        adaptedStarterCode: `-- DEFENSIVE REFACTOR:
-- Prevent DB 22012 Division by Zero when total_registered = 0
-- Hint: Use NULLIF(total_registered, 0) and COALESCE(...) to return 0.00 instead of crashing.

SELECT
    -- TODO: Write zero-division safe retention calculation
    
FROM cohort_metrics
ORDER BY cohort_month;
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard 3 Cohort Months", expected: "90.00%, 76.00%, 62.00% retention accurately computed" },
          { id: 2, title: "Test Case 2: Full Retention (100%)", expected: "active_users = total_registered -> 100.00%" },
          { id: 3, title: "Test Case 3: Column Aliasing Check", expected: "Columns: cohort_month, active_users, total_registered, retention_rate" }
        ],
        unimplementedCheck: (c) => !c.toLowerCase().includes('retention_rate'),
        defensiveCheck: (c) => c.toUpperCase().includes('NULLIF') || c.toUpperCase().includes('CASE WHEN')
      },
      {
        id: "sql-window-func",
        title: "Window Functions & Running Balances",
        conceptTag: "Window Functions",
        difficulty: "Medium",
        taskTitle: "Running Balance Ledger with Window Aggregations",
        buildTask: "Write a SQL query using window functions to compute a cumulative running account balance for transactions.",
        questionDetails: {
          objective: "Write an analytical query on `account_ledger` computing the cumulative balance after every transaction per account.",
          inputFormat: "Table `account_ledger`: tx_id (INT), account_id (INT), tx_date (DATE), amount (DECIMAL).",
          sampleInput: `tx_id | account_id | tx_date    | amount
1     | 101        | 2026-01-01 | 150.00
2     | 101        | 2026-01-03 | -30.00
3     | 102        | 2026-01-02 | 500.00`,
          expectedOutput: `account_id | tx_id | amount | running_balance
101        | 1     | 150.00 | 150.00
101        | 2     | -30.00 | 120.00
102        | 3     | 500.00 | 500.00`,
          requirements: [
            "Use window function: `SUM(amount) OVER (PARTITION BY account_id ORDER BY tx_date, tx_id)`.",
            "Alias running total as `running_balance`.",
            "Preserve order by account_id and tx_date."
          ],
          explanation: "Window functions calculate cumulative sums partitioned by account without collapsing records."
        },
        starterCode: `-- Write your SQL window query below
-- Table: account_ledger (tx_id, account_id, tx_date, amount)

SELECT
    -- TODO: Compute running_balance using SUM() OVER (PARTITION BY ... ORDER BY ...)
    
FROM account_ledger;
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Null Amount Values & Same-Day Ordering Chaos!
1. Multiple transactions occurred on the exact same date without unique secondary ordering.
2. NULL amount records corrupted cumulative sums into NULL for subsequent rows.
Query produced non-deterministic results and NULL running balances!`,
        adaptedStarterCode: `-- DEFENSIVE REFACTOR:
-- 1. Use COALESCE(amount, 0) to prevent NULL corruption in running balance
-- 2. Add secondary tie-breaker ORDER BY tx_date, tx_id to ensure deterministic results
-- 3. Explicitly define ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW

SELECT
    -- TODO: Write defensive window function query
    
FROM account_ledger
ORDER BY account_id, tx_date, tx_id;
`,
        testCases: [
          { id: 1, title: "Test Case 1: Positive and Negative Running Sums", expected: "150.00 -> 120.00 correctly calculated" },
          { id: 2, title: "Test Case 2: Multi-Account Isolation", expected: "Partitioning keeps Account 101 and 102 balances isolated" },
          { id: 3, title: "Test Case 3: Secondary Sort Determinism", expected: "Resolves same-day transactions in deterministic order" }
        ],
        unimplementedCheck: (c) => !c.toLowerCase().includes('running_balance') || !c.toLowerCase().includes('over'),
        defensiveCheck: (c) => c.toUpperCase().includes('COALESCE') || c.toUpperCase().includes('ROWS BETWEEN')
      },
      {
        id: "sql-recursive-cte",
        title: "Recursive CTE & Org Tree Hierarchy",
        conceptTag: "Hierarchical Queries",
        difficulty: "Hard",
        taskTitle: "Organizational Hierarchy Depth Calculator",
        buildTask: "Construct a recursive CTE `WITH RECURSIVE org_chart AS ...` calculating the organizational depth level for every employee.",
        questionDetails: {
          objective: "Compute the hierarchy level (1 for CEO, 2 for Direct Reports, 3 for Managers, etc.) using recursive CTE.",
          inputFormat: "Table `employees`: emp_id (INT), name (VARCHAR), manager_id (INT, NULL for CEO).",
          sampleInput: `emp_id | name        | manager_id
1      | 'Alice' (CEO)| NULL
2      | 'Bob'       | 1
3      | 'Charlie'   | 2`,
          expectedOutput: `emp_id | name    | manager_id | depth_level
1      | Alice   | NULL       | 1
2      | Bob     | 1          | 2
3      | Charlie | 2          | 3`,
          requirements: [
            "Start anchor member where `manager_id IS NULL` with `depth_level = 1`.",
            "Recursively join child employees where `e.manager_id = o.emp_id` incrementing `depth_level + 1`.",
            "Order results by depth_level, emp_id."
          ],
          explanation: "Recursive CTE traverses top-down tree hierarchies efficiently in relational SQL."
        },
        starterCode: `-- Write your recursive CTE below
-- Table: employees (emp_id, name, manager_id)

WITH RECURSIVE org_chart AS (
    -- TODO: Anchor member (CEO where manager_id IS NULL)
    
    UNION ALL
    
    -- TODO: Recursive member (Join employees on manager_id)
    
)
SELECT * FROM org_chart;
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Infinite Recursion Cycle!
A corrupted HR transfer created a circular management loop: Employee 3 reports to Employee 2, who reports to Employee 3!
Recursive CTE entered an infinite loop!
Fatal Database Error 54001: Statement execution cancelled due to maximum recursion depth limit exceeded (1000).`,
        adaptedStarterCode: `-- DEFENSIVE REFACTOR:
-- Prevent infinite recursive loops from circular manager loops
-- 1. Cap depth_level <= 10 to abort runaway loops safely
-- 2. Track visited path string or array to detect cycles before executing recursion

WITH RECURSIVE org_chart AS (
    -- Anchor
    SELECT emp_id, name, manager_id, 1 as depth_level, CAST(emp_id AS VARCHAR) as path
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Defensive recursive member with depth limit guard
    -- TODO: Add depth_level < 10 guard
)
SELECT * FROM org_chart;
`,
        testCases: [
          { id: 1, title: "Test Case 1: 3-Tier Linear Management Chain", expected: "CEO=1, VP=2, Engineer=3 correctly labeled" },
          { id: 2, title: "Test Case 2: Multiple CEO Roots", expected: "Handles independent root nodes gracefully" },
          { id: 3, title: "Test Case 3: Breadth Ordering", expected: "Correctly ordered by depth_level" }
        ],
        unimplementedCheck: (c) => !c.toLowerCase().includes('recursive') || !c.toLowerCase().includes('depth_level'),
        defensiveCheck: (c) => c.includes('< 10') || c.includes('depth_level <') || c.includes('path')
      }
    ]
  },

  // =========================================================================
  // 3. C
  // =========================================================================
  {
    id: "c",
    name: "C",
    category: "Systems & Core",
    icon: "Cpu",
    verifiedScore: 86,
    benchmarkScore: 80,
    status: "Verified",
    concepts: [
      {
        id: "c-tokenizer",
        title: "Memory-Safe String Tokenizer",
        conceptTag: "Pointers & Buffers",
        difficulty: "Medium",
        taskTitle: "Memory-Safe String Tokenizer & Buffer Aggregator",
        buildTask: "Implement `int parse_sensor_payload(const char* raw, int* readings, int max_len)` that extracts integer sensor values safely.",
        questionDetails: {
          objective: "Write a C function `parse_sensor_payload` that parses comma-separated integer readings into an integer array buffer.",
          inputFormat: "raw: const char* (e.g. '42,18,99,7'), readings: int* buffer, max_len: int buffer capacity.",
          sampleInput: `raw = "42,18,99,7", max_len = 5`,
          expectedOutput: `readings = {42, 18, 99, 7}, return count = 4`,
          requirements: [
            "Parse comma-delimited integers from raw string.",
            "Store parsed values in `readings` buffer up to `max_len` elements.",
            "Return total count of successfully parsed integers.",
            "Ensure no out-of-bounds writes into `readings` array."
          ],
          explanation: "Parses tokens delimited by comma and converts to integers using safe bounds-checking."
        },
        starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int parse_sensor_payload(const char* raw, int* readings, int max_len) {
    // TODO: Parse comma-separated integers into readings buffer
    // Return count of parsed values, respecting max_len limit
    return 0;
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Buffer Overflow & Null Pointer Crash!
1. Production IoT sensor passed raw = NULL pointer.
2. Malicious packet sent 500 integers into a 5-element buffer (Stack Buffer Overflow!).
3. Malformed payload contained empty tokens "42,,99" and trailing characters.
Fatal Segmentation Fault (SIGSEGV) at address 0x00000000.`,
        adaptedStarterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int parse_sensor_payload(const char* raw, int* readings, int max_len) {
    // DEFENSIVE REFACTOR:
    // 1. Guard against raw == NULL or readings == NULL or max_len <= 0
    // 2. Prevent buffer overflow by never writing beyond max_len - 1
    // 3. Skip empty tokens and invalid non-numeric characters safely
    return 0;
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard 4 Integers ('42,18,99,7')", expected: "Parsed count: 4, elements correctly placed in buffer" },
          { id: 2, title: "Test Case 2: Buffer Capacity Truncation (max_len=2)", expected: "Stops exactly at 2 items without memory overflow" },
          { id: 3, title: "Test Case 3: Negative Integers ('-10,0,25')", expected: "Parsed count: 3, signed values preserved" }
        ],
        unimplementedCheck: (c) => c.includes('return 0;') && !c.includes('readings['),
        defensiveCheck: (c) => c.includes('NULL') || c.includes('max_len <= 0')
      },
      {
        id: "c-ring-buffer",
        title: "Circular Ring Buffer & Queue",
        conceptTag: "Data Structures",
        difficulty: "Hard",
        taskTitle: "Fixed-Capacity Ring Buffer Implementation",
        buildTask: "Implement ring buffer push and pop operations with head/tail wrapping without buffer overrun.",
        questionDetails: {
          objective: "Implement thread-safe-capable circular queue operations: `push` and `pop` over a fixed-size internal array.",
          inputFormat: "RingBuffer struct with head, tail, count, and capacity.",
          sampleInput: `push(rb, 10); push(rb, 20); pop(rb, &out) -> out = 10`,
          expectedOutput: `FIFO queue order with modulo wrapping`,
          requirements: [
            "Increment count and advance tail on push with `(tail + 1) % capacity`.",
            "Advance head on pop with `(head + 1) % capacity`.",
            "Return 0 on success, -1 on buffer full (push) or buffer empty (pop)."
          ],
          explanation: "Circular ring buffers avoid memory reallocation in low-latency systems."
        },
        starterCode: `typedef struct {
    int data[64];
    int head;
    int tail;
    int count;
    int capacity;
} RingBuffer;

int ring_buffer_push(RingBuffer* rb, int val) {
    // TODO: Add element to ring buffer, return 0 if ok, -1 if full
    return -1;
}

int ring_buffer_pop(RingBuffer* rb, int* out_val) {
    // TODO: Extract element from ring buffer, return 0 if ok, -1 if empty
    return -1;
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Head/Tail Overwrite & Buffer Overrun!
1. Continuous push into full buffer corrupted oldest unread data.
2. Dereferencing out_val == NULL caused SIGSEGV.
3. Negative count occurred when pop called on empty buffer!`,
        adaptedStarterCode: `int ring_buffer_push(RingBuffer* rb, int val) {
    // DEFENSIVE REFACTOR:
    // 1. Guard against rb == NULL
    // 2. Reject push when rb->count >= rb->capacity (return -1)
    // 3. Modulo wrap tail: rb->tail = (rb->tail + 1) % rb->capacity
    return -1;
}

int ring_buffer_pop(RingBuffer* rb, int* out_val) {
    // 1. Guard against rb == NULL or out_val == NULL
    // 2. Reject pop when rb->count == 0
    return -1;
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: FIFO Sequence Push & Pop", expected: "Items retrieved in exact insertion order" },
          { id: 2, title: "Test Case 2: Buffer Full Rejection", expected: "Returns -1 when attempting to push to full queue" },
          { id: 3, title: "Test Case 3: Circular Modulo Wrap", expected: "Indices wrap around boundary cleanly" }
        ],
        unimplementedCheck: (c) => c.includes('return -1;') && !c.includes('rb->data'),
        defensiveCheck: (c) => c.includes('NULL') || c.includes('capacity')
      },
      {
        id: "c-hashmap",
        title: "Dynamic Hash Map with Chaining",
        conceptTag: "Memory Management",
        difficulty: "Hard",
        taskTitle: "Custom Key-Value Hash Map with Memory Leak Prevention",
        buildTask: "Implement a C key-value store with djb2 hashing, linked-list collision chaining, and safe memory cleanup.",
        questionDetails: {
          objective: "Build `hash_insert` and `hash_lookup` handling string keys and integer values with collision resolution.",
          inputFormat: "HashMap* map, const char* key, int value.",
          sampleInput: `insert(map, "cpu_load", 85); lookup(map, "cpu_load", &val) -> 85`,
          expectedOutput: `Value 85 successfully retrieved`,
          requirements: [
            "Compute bucket index using hash(key) % NUM_BUCKETS.",
            "Handle collisions by prepending or appending to linked list in bucket.",
            "Update value if key already exists rather than duplicating nodes.",
            "Free old string key memory on replacement to prevent leaks."
          ],
          explanation: "Hash maps require collision chaining and disciplined dynamic memory management in C."
        },
        starterCode: `typedef struct HashNode {
    char* key;
    int value;
    struct HashNode* next;
} HashNode;

typedef struct {
    HashNode* buckets[128];
} HashMap;

void hash_insert(HashMap* map, const char* key, int value) {
    // TODO: Insert or update key-value pair in hash map
}

int hash_lookup(HashMap* map, const char* key, int* out_val) {
    // TODO: Find value for key, return 1 if found, 0 if not found
    return 0;
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Memory Leak & Dangling Pointers!
1. Updating an existing key allocated a new node without freeing the old key string (Memory Leak!).
2. Passing key = NULL or map = NULL triggered immediate SIGSEGV.
3. Hash bucket overflow crashed on negative hash values!`,
        adaptedStarterCode: `void hash_insert(HashMap* map, const char* key, int value) {
    // DEFENSIVE REFACTOR:
    // 1. Guard against map == NULL or key == NULL
    // 2. Compute non-negative bucket: (unsigned_hash(key) % 128)
    // 3. If key exists: update value and return without allocating new node
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Key Insert & Retrieval", expected: "Key successfully found and retrieved" },
          { id: 2, title: "Test Case 2: Collision Chaining", expected: "Keys with same hash bucket resolved via linked list" },
          { id: 3, title: "Test Case 3: Key Update In-Place", expected: "Overwrites existing value without creating orphan memory" }
        ],
        unimplementedCheck: (c) => c.includes('// TODO:') && !c.includes('strcmp'),
        defensiveCheck: (c) => c.includes('NULL') || c.includes('strcmp')
      }
    ]
  },

  // =========================================================================
  // 4. C++
  // =========================================================================
  {
    id: "cpp",
    name: "C++",
    category: "Systems & Core",
    icon: "Code2",
    verifiedScore: 89,
    benchmarkScore: 82,
    status: "Verified",
    concepts: [
      {
        id: "cpp-stl-metrics",
        title: "STL Telemetry Normalizer & Min-Max Filtering",
        conceptTag: "STL Algorithms",
        difficulty: "Medium",
        taskTitle: "High-Performance STL Metric Engine & Filter",
        buildTask: "Write a C++ class method `std::vector<double> filter_and_normalize(const std::vector<double>& raw_metrics, double threshold)`.",
        questionDetails: {
          objective: "Implement `filter_and_normalize` to filter raw telemetry values above a threshold and normalize them to a 0.0 - 1.0 range.",
          inputFormat: "raw_metrics: const std::vector<double>&, threshold: double minimum cutoff.",
          sampleInput: `raw_metrics = {12.0, 45.0, 8.5, 90.0, 30.0}, threshold = 10.0`,
          expectedOutput: `Normalized vector scaled between 0.0 and 1.0 for values >= 10.0`,
          requirements: [
            "Filter out all metrics strictly lower than `threshold`.",
            "Normalize remaining values: (val - min) / (max - min).",
            "If min == max, return all 1.0 values.",
            "Return empty vector if input has no qualifying metrics."
          ],
          explanation: "Removes values below 10.0, calculates min/max of remaining set, and scales all values into [0.0, 1.0]."
        },
        starterCode: `#include <vector>
#include <algorithm>

std::vector<double> filter_and_normalize(const std::vector<double>& raw_metrics, double threshold) {
    // TODO: Filter metrics >= threshold and normalize them between 0.0 and 1.0
    return {};
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Iterator Invalidation & Zero-Divide!
1. Production telemetry batch contained identical numbers {50.0, 50.0, 50.0} (max - min == 0.0 division by zero -> NaN/Inf crash!).
2. In-place erase while iterating invalidating STL iterators.
3. Empty vector passed -> accessing front()/back() threw std::out_of_range.`,
        adaptedStarterCode: `#include <vector>
#include <algorithm>

std::vector<double> filter_and_normalize(const std::vector<double>& raw_metrics, double threshold) {
    // DEFENSIVE REFACTOR:
    // 1. Check if raw_metrics is empty
    // 2. Filter elements safely without iterator invalidation
    // 3. Guard against max == min (zero divisor) by setting output to 1.0
    return {};
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard 5 Elements Filtering", expected: "Filtered 4 items (>= 10.0), correctly scaled to 0.0 - 1.0" },
          { id: 2, title: "Test Case 2: All Elements Below Threshold", expected: "Returns clean empty vector {} without throwing exceptions" },
          { id: 3, title: "Test Case 3: Uniform Identical Elements {25.0, 25.0}", expected: "Division-by-zero protected, returns {1.0, 1.0}" }
        ],
        unimplementedCheck: (c) => c.includes('return {};') && !c.includes('push_back') && !c.includes('minmax'),
        defensiveCheck: (c) => c.includes('max_val') || c.includes('min_val') || c.includes('empty')
      },
      {
        id: "cpp-raii",
        title: "RAII Smart Pointer & Resource Wrapper",
        conceptTag: "RAII & Memory",
        difficulty: "Hard",
        taskTitle: "Exception-Safe RAII File Descriptor Wrapper",
        buildTask: "Implement a C++ RAII class managing OS file descriptors with Rule of 5 semantics and zero resource leaks.",
        questionDetails: {
          objective: "Implement a class `ScopedDescriptor` that guarantees descriptor closure even when exceptions are thrown.",
          inputFormat: "ScopedDescriptor(int fd) acquiring ownership.",
          sampleInput: `ScopedDescriptor d1(open_file()); ScopedDescriptor d2 = std::move(d1);`,
          expectedOutput: `Clean resource release without double-free`,
          requirements: [
            "Destructor calls close(fd) if fd >= 0.",
            "Delete copy constructor and copy assignment operator (prevent double close).",
            "Implement move constructor and move assignment operator transferring ownership.",
            "Reset source descriptor to -1 on move."
          ],
          explanation: "RAII ties resource lifespan to object lifetime, preventing leaks in high-performance C++ systems."
        },
        starterCode: `class ScopedDescriptor {
private:
    int fd;
public:
    explicit ScopedDescriptor(int descriptor) : fd(descriptor) {}
    ~ScopedDescriptor() {
        // TODO: Close descriptor safely if valid
    }
    // TODO: Implement move constructor and prevent copying
};
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Double-Free Crash on Copy!
1. Client code passed ScopedDescriptor by value, triggering default copy constructor.
2. Both original and temporary object destructors invoked close(fd) on same descriptor!
3. Move constructor failed to invalidate moved-from object, causing double closure.`,
        adaptedStarterCode: `class ScopedDescriptor {
private:
    int fd;
public:
    explicit ScopedDescriptor(int descriptor) : fd(descriptor) {}
    ~ScopedDescriptor() {
        if (fd >= 0) {
            // close(fd);
            fd = -1;
        }
    }
    // DEFENSIVE: Delete copy operations
    ScopedDescriptor(const ScopedDescriptor&) = delete;
    ScopedDescriptor& operator=(const ScopedDescriptor&) = delete;

    // TODO: Implement safe move constructor & assignment
};
`,
        testCases: [
          { id: 1, title: "Test Case 1: Automatic Destruction on Scope Exit", expected: "Descriptor cleanly closed upon block termination" },
          { id: 2, title: "Test Case 2: Move Ownership Transfer", expected: "Source descriptor reset to -1, destination acquires ownership" },
          { id: 3, title: "Test Case 3: Copy Prevention", expected: "Copying rejected at compile-time via = delete" }
        ],
        unimplementedCheck: (c) => c.includes('// TODO:') && !c.includes('= delete'),
        defensiveCheck: (c) => c.includes('delete') || c.includes('fd = -1')
      },
      {
        id: "cpp-order-book",
        title: "Limit Order Book Matching Engine",
        conceptTag: "Financial Systems",
        difficulty: "Hard",
        taskTitle: "Low-Latency Order Book Bid/Ask Matcher",
        buildTask: "Implement an order book matching engine that processes limit orders with price-time priority.",
        questionDetails: {
          objective: "Implement an `OrderBook` class matching incoming BUY limit orders against lowest existing SELL limit orders.",
          inputFormat: "Order: id (int), side ('BUY'|'SELL'), price (double), quantity (int).",
          sampleInput: `SELL @ $100 (qty: 5), incoming BUY @ $100 (qty: 3) -> Executed: 3 shares @ $100`,
          expectedOutput: `Remaining SELL: 2 shares @ $100`,
          requirements: [
            "Maintain sorted bids (highest price first) and asks (lowest price first).",
            "Execute trades when Buy Price >= Sell Price.",
            "Update resting quantity or remove completely filled orders.",
            "Return total traded volume."
          ],
          explanation: "High-frequency trading engines match orders deterministically in nanoseconds using priority maps."
        },
        starterCode: `#include <map>
#include <string>

struct Order { int id; std::string side; double price; int qty; };

class OrderBook {
public:
    int match_order(const Order& incoming) {
        // TODO: Match incoming order against resting opposite book
        // Return total quantity filled
        return 0;
    }
};
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Negative Quantity & Self-Trade Exploit!
1. Attacker submitted quantity = -50 (Integer Underflow created phantom balances!).
2. Price <= 0.0 corrupted logarithmic price index.
3. Matching self-orders (same account ID) artificially inflated trading volume!`,
        adaptedStarterCode: `class OrderBook {
public:
    int match_order(const Order& incoming) {
        // DEFENSIVE REFACTOR:
        // 1. Validate incoming.qty > 0 and incoming.price > 0.0
        // 2. Reject self-trades if buyer account == seller account
        // 3. Guard against integer overflow on cumulative filled quantity
        return 0;
    }
};
`,
        testCases: [
          { id: 1, title: "Test Case 1: Exact Match Execution", expected: "BUY and SELL matched at $100, remaining qty 0" },
          { id: 2, title: "Test Case 2: Partial Fill Management", expected: "Partial fill leaves resting remainder in book" },
          { id: 3, title: "Test Case 3: Price Priority Verification", expected: "Matches lowest ask first before higher prices" }
        ],
        unimplementedCheck: (c) => c.includes('return 0;') && !c.includes('qty'),
        defensiveCheck: (c) => c.includes('qty > 0') || c.includes('price > 0')
      }
    ]
  },

  // =========================================================================
  // 5. JAVA
  // =========================================================================
  {
    id: "java",
    name: "Java",
    category: "Enterprise & Backend",
    icon: "Coffee",
    verifiedScore: 87,
    benchmarkScore: 80,
    status: "Verified",
    concepts: [
      {
        id: "java-order-stream",
        title: "Enterprise Order Stream Aggregator",
        conceptTag: "Stream API",
        difficulty: "Medium",
        taskTitle: "Enterprise Order Stream Aggregator & Resilience",
        buildTask: "Implement `public Map<String, Double> aggregateOrders(List<Order> orders)` that computes customer total spending.",
        questionDetails: {
          objective: "Write a Java method `aggregateOrders` that takes a list of Order objects and returns a Map containing each customerId and their cumulative order total.",
          inputFormat: "orders: List<Order>. Order has `getCustomerId()`, `getAmount()`, `getStatus()`.",
          sampleInput: `Order("CUST-1", 120.50, "COMPLETED"), Order("CUST-2", 45.00, "COMPLETED"), Order("CUST-1", 80.00, "COMPLETED")`,
          expectedOutput: `{"CUST-1": 200.50, "CUST-2": 45.00}`,
          requirements: [
            "Include only orders with status equal to 'COMPLETED'.",
            "Aggregate spending by customerId using Java Streams or Map.",
            "Round totals to 2 decimal places.",
            "Return empty Map if no completed orders exist."
          ],
          explanation: "Filters for COMPLETED status and accumulates monetary amounts grouped by customer ID."
        },
        starterCode: `import java.util.*;
import java.util.stream.*;

public class OrderService {
    public Map<String, Double> aggregateOrders(List<Order> orders) {
        // TODO: Aggregate order totals for "COMPLETED" status grouped by customerId
        return new HashMap<>();
    }
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: NullPointerException & Corrupted Stream!
1. Incoming batch contained orders = null.
2. An order inside list had order.getCustomerId() == null or order == null.
3. Order amount contained negative values or null amounts.
Fatal Exception in thread 'main' java.lang.NullPointerException at OrderService.lambda$0.`,
        adaptedStarterCode: `import java.util.*;
import java.util.stream.*;

public class OrderService {
    public Map<String, Double> aggregateOrders(List<Order> orders) {
        // DEFENSIVE REFACTOR:
        // 1. Guard against orders == null
        // 2. Filter out null Order elements, null customerIds, and null/negative amounts
        // 3. Ensure thread-safe collection into Map without throwing NPE
        return new HashMap<>();
    }
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard 3 Orders Batch", expected: "CUST-1: 200.50, CUST-2: 45.00" },
          { id: 2, title: "Test Case 2: Filter Non-Completed (CANCELLED)", expected: "Excluded cancelled orders from totals" },
          { id: 3, title: "Test Case 3: Empty List Check", expected: "Returns clean empty map without throwing NPE" }
        ],
        unimplementedCheck: (c) => c.includes('return new HashMap<>();') && !c.includes('getCustomerId'),
        defensiveCheck: (c) => c.includes('!= null') || c.includes('Objects.nonNull')
      },
      {
        id: "java-worker-pool",
        title: "Concurrent Task Worker Pool",
        conceptTag: "Concurrency & Threads",
        difficulty: "Hard",
        taskTitle: "Bounded Worker Pool Dispatcher",
        buildTask: "Implement a thread-safe task dispatcher with bounded BlockingQueue and graceful shutdown.",
        questionDetails: {
          objective: "Implement `WorkDispatcher` coordinating multiple worker threads consuming tasks from a shared bounded queue.",
          inputFormat: "submit(Runnable task), shutdown(), awaitTermination(long timeout).",
          sampleInput: `dispatcher.submit(() -> processJob());`,
          expectedOutput: `Executes tasks concurrently across fixed workers`,
          requirements: [
            "Create fixed array of Worker threads pulling from BlockingQueue.",
            "Implement poison pill or interrupt flag on shutdown.",
            "Reject new tasks after shutdown has been initiated."
          ],
          explanation: "Worker pools prevent unbounded thread creation and manage system throughput under load."
        },
        starterCode: `import java.util.concurrent.*;

public class WorkDispatcher {
    private final BlockingQueue<Runnable> queue;
    private volatile boolean isRunning = true;

    public WorkDispatcher(int threadCount, int capacity) {
        this.queue = new ArrayBlockingQueue<>(capacity);
        // TODO: Start worker threads
    }

    public boolean submit(Runnable task) {
        // TODO: Submit task if running, return false if queue full or stopped
        return false;
    }
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Deadlock & Zombie Threads!
1. Worker thread caught unhandled RuntimeException and terminated, reducing active worker pool to 0!
2. Calling shutdown() while tasks remained blocked caused infinite hang.
3. Memory leak occurred when rejected tasks remained referenced.`,
        adaptedStarterCode: `public class WorkDispatcher {
    // DEFENSIVE REFACTOR:
    // 1. Wrap task.run() inside try/catch(Throwable t) so worker threads never crash
    // 2. Reject tasks atomically if isRunning == false
    // 3. Interrupt idle workers cleanly during shutdown
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Concurrent Task Execution", expected: "10 tasks completed across 4 threads" },
          { id: 2, title: "Test Case 2: Worker Resilience to Exceptions", expected: "Failing task caught without killing worker thread" },
          { id: 3, title: "Test Case 3: Graceful Drain & Shutdown", expected: "All queued tasks drained before threads exit" }
        ],
        unimplementedCheck: (c) => c.includes('return false;') && !c.includes('offer'),
        defensiveCheck: (c) => c.includes('try') || c.includes('isRunning') || c.includes('offer')
      },
      {
        id: "java-lru-cache",
        title: "LRU Cache Architecture",
        conceptTag: "Caching & Systems",
        difficulty: "Medium",
        taskTitle: "Thread-Safe LRU Cache with Access-Order Eviction",
        buildTask: "Implement an LRU cache supporting `get(K key)` and `put(K key, V value)` with capacity eviction.",
        questionDetails: {
          objective: "Build a fixed-capacity LRU Cache that evicts the least recently accessed entry when capacity is exceeded.",
          inputFormat: "LRUCache<String, Integer> cache = new LRUCache<>(2);",
          sampleInput: `put("A", 1); put("B", 2); get("A"); put("C", 3) -> "B" is evicted!`,
          expectedOutput: `get("B") returns null, get("A") returns 1, get("C") returns 3`,
          requirements: [
            "Use LinkedHashMap or doubly linked list with hash table.",
            "Record access order on get() and put().",
            "Evict oldest element when size > capacity.",
            "Guarantee O(1) average time complexity."
          ],
          explanation: "LRU caching is the foundational memory eviction strategy in distributed systems."
        },
        starterCode: `import java.util.*;

public class LRUCache<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        // TODO: Initialize internal structures
    }

    public V get(K key) {
        // TODO: Return value and mark as recently accessed
        return null;
    }

    public void put(K key, V value) {
        // TODO: Insert or update, evicting oldest if full
    }
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Concurrent Modification & Negative Capacity!
1. Negative capacity constructor argument caused IllegalArgumentException.
2. Concurrent reads/writes threw ConcurrentModificationException.
3. Null key insertion corrupted hash bucket!`,
        adaptedStarterCode: `public class LRUCache<K, V> {
    // DEFENSIVE REFACTOR:
    // 1. Enforce capacity >= 1 (throw or clamp)
    // 2. Reject null keys gracefully
    // 3. Synchronize access methods or use ReentrantReadWriteLock
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Capacity Eviction Verification", expected: "Evicts oldest item when inserting 3rd item in capacity 2 cache" },
          { id: 2, title: "Test Case 2: Access Order Refresh", expected: "Reading item refreshes recency, preventing its eviction" },
          { id: 3, title: "Test Case 3: Key Overwrite Updates Value", expected: "Replaces existing key value without expanding size" }
        ],
        unimplementedCheck: (c) => c.includes('return null;') && !c.includes('map'),
        defensiveCheck: (c) => c.includes('synchronized') || c.includes('capacity') || c.includes('null')
      }
    ]
  },

  // =========================================================================
  // 6. JAVASCRIPT
  // =========================================================================
  {
    id: "javascript",
    name: "JavaScript",
    category: "Core Web & Frontend",
    icon: "FileCode",
    verifiedScore: 88,
    benchmarkScore: 80,
    status: "Verified",
    concepts: [
      {
        id: "js-promise-batch",
        title: "Async Promise Batch Processor",
        conceptTag: "Async & Concurrency",
        difficulty: "Medium",
        taskTitle: "Async Promise Batch Processor & Rate Limiter",
        buildTask: "Implement `async function batchProcess(items, batchSize, fn)` that processes async tasks concurrently in chunks.",
        questionDetails: {
          objective: "Write an async function `batchProcess(items, batchSize, fn)` that executes an async mapper function over an array in controlled concurrent chunks.",
          inputFormat: "items: Array, batchSize: number (e.g. 2), fn: async (item) => Promise<any>.",
          sampleInput: `items = [1, 2, 3, 4], batchSize = 2, fn = async x => x * 10`,
          expectedOutput: `[10, 20, 30, 40]`,
          requirements: [
            "Process items in sequential chunks of size `batchSize`.",
            "Inside each chunk, execute `fn` concurrently using `Promise.all`.",
            "Preserve original element ordering in returned results array.",
            "Return empty array if input items is empty."
          ],
          explanation: "Splits items into batches of size N, awaits all promises in chunk, then proceeds to next chunk."
        },
        starterCode: `async function batchProcess(items, batchSize, fn) {
  // TODO: Process items in chunks of batchSize concurrently
  // Return resolved results preserving original order
  return [];
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Unhandled Rejections & Type Coercion NaN!
1. batchSize arrived as 0 or negative string "-5" (Infinite loop freeze!).
2. A single async task rejected with network error, crashing entire batch with UnhandledPromiseRejection.
3. items passed as undefined or null instead of Array.`,
        adaptedStarterCode: `async function batchProcess(items, batchSize, fn) {
  // DEFENSIVE REFACTOR:
  // 1. Guard against items not being an Array
  // 2. Sanitize batchSize: enforce Math.max(1, parseInt(batchSize) || 1)
  // 3. Catch rejected promises using Promise.allSettled or try/catch fallback
  return [];
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard 4 Items with Batch Size 2", expected: "[10, 20, 30, 40] ordered results" },
          { id: 2, title: "Test Case 2: Batch Size Larger than Array", expected: "Runs all items concurrently in a single chunk" },
          { id: 3, title: "Test Case 3: Empty Array Safety", expected: "Returns clean [] without invoking fn" }
        ],
        unimplementedCheck: (c) => c.includes('return [];') && !c.includes('Promise.all') && !c.includes('results'),
        defensiveCheck: (c) => c.includes('Math.max') || c.includes('Array.isArray') || c.includes('try')
      },
      {
        id: "js-event-emitter",
        title: "Custom Event Emitter Architecture",
        conceptTag: "Design Patterns",
        difficulty: "Medium",
        taskTitle: "Custom Event Emitter with Once & Unsubscribe",
        buildTask: "Implement an `EventEmitter` class supporting `on`, `emit`, `off`, and `once` with leak prevention.",
        questionDetails: {
          objective: "Build an event pub/sub engine with methods to subscribe, dispatch, and unsubscribe listener callbacks.",
          inputFormat: "emitter.on('login', callback); emitter.emit('login', user);",
          sampleInput: `emitter.once('ping', cb); emitter.emit('ping'); emitter.emit('ping'); -> cb invoked once!`,
          expectedOutput: `Only 1 execution for once listeners`,
          requirements: [
            "Store listeners in an object keyed by event name.",
            "`on` registers a callback, `off` removes a specific callback.",
            "`emit` executes all registered callbacks passing arguments.",
            "`once` executes the callback once and immediately unregisters itself."
          ],
          explanation: "Event emitters decouple system components in asynchronous JavaScript architectures."
        },
        starterCode: `class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    // TODO: Register listener for event
  }

  emit(event, ...args) {
    // TODO: Execute all listeners for event
  }

  off(event, listener) {
    // TODO: Remove listener from event
  }

  once(event, listener) {
    // TODO: Register single-use listener
  }
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Memory Leak & Callback Exception Halt!
1. Emitting an event with 0 registered listeners threw TypeError: cannot read properties of undefined (reading 'forEach').
2. One listener threw an unhandled Error, stopping all subsequent registered listeners from running!
3. Registering 1,000 listeners without warnings indicated an unbounded memory leak.`,
        adaptedStarterCode: `class EventEmitter {
  // DEFENSIVE REFACTOR:
  // 1. In emit(): guard against this.events[event] being undefined
  // 2. In emit(): wrap each listener execution in try/catch to ensure other listeners still execute
  // 3. In on(): validate listener is a function (typeof listener === 'function')
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Subscription & Emission", expected: "Listener receives dispatched arguments" },
          { id: 2, title: "Test Case 2: Once Listener Self-Deregistration", expected: "Invoked exactly once across multiple emits" },
          { id: 3, title: "Test Case 3: Off Listener Removal", expected: "Removed callback no longer executes" }
        ],
        unimplementedCheck: (c) => c.includes('// TODO:') && !c.includes('this.events['),
        defensiveCheck: (c) => c.includes('typeof') || c.includes('try') || c.includes('filter')
      },
      {
        id: "js-deep-diff",
        title: "Deep Object Diff & Circular Reference Flattener",
        conceptTag: "Object Manipulation",
        difficulty: "Hard",
        taskTitle: "Deep Object Comparison & Circular Safe Flattener",
        buildTask: "Implement `deepDiff(objA, objB)` that recursively computes differences between two nested objects.",
        questionDetails: {
          objective: "Return an object containing keys that were added, removed, or changed between objA and objB.",
          inputFormat: "deepDiff(objA: object, objB: object) -> object",
          sampleInput: `deepDiff({a: 1, b: {c: 2}}, {a: 1, b: {c: 3}})`,
          expectedOutput: `{"b.c": {old: 2, new: 3}}`,
          requirements: [
            "Traverse nested object structures recursively.",
            "Identify primitive value inequalities.",
            "Detect added and removed properties.",
            "Return structured diff mapping dot-notated paths."
          ],
          explanation: "Deep object diffing is crucial for state tracking, optimistic UI updates, and version control."
        },
        starterCode: `function deepDiff(objA, objB) {
  // TODO: Recursively compute differences between objA and objB
  // Return object mapping path to {old, new}
  return {};
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Circular Reference Stack Overflow!
1. Production payload had circular references: objA.self = objA!
2. Function entered infinite recursion: RangeError: Maximum call stack size exceeded.
3. Prototype pollution attempt: payload contained "__proto__" and "constructor" properties.`,
        adaptedStarterCode: `function deepDiff(objA, objB, seen = new WeakSet(), path = "") {
  // DEFENSIVE REFACTOR:
  // 1. Guard against circular loops using WeakSet (if seen.has(objA) return)
  // 2. Ignore prototype pollution keys ('__proto__', 'constructor')
  // 3. Handle null or non-object primitives safely
  return {};
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Simple Primitive Modification", expected: "Detects changed primitive key" },
          { id: 2, title: "Test Case 2: Nested Sub-Object Difference", expected: "Computes deep path 'b.c' change" },
          { id: 3, title: "Test Case 3: Added and Removed Keys", expected: "Records added and removed properties" }
        ],
        unimplementedCheck: (c) => c.includes('return {};') && !c.includes('typeof'),
        defensiveCheck: (c) => c.includes('WeakSet') || c.includes('seen') || c.includes('typeof')
      }
    ]
  },

  // =========================================================================
  // 7. HTML / CSS
  // =========================================================================
  {
    id: "htmlcss",
    name: "HTML / CSS",
    category: "Frontend Architecture",
    icon: "Layout",
    verifiedScore: 85,
    benchmarkScore: 78,
    status: "Verified",
    concepts: [
      {
        id: "html-responsive-grid",
        title: "Responsive Card Grid & Semantic Architecture",
        conceptTag: "CSS Grid & Flexbox",
        difficulty: "Easy",
        taskTitle: "Responsive Card Grid & Semantic Architecture",
        buildTask: "Write semantic HTML5 and clean CSS for an accessible responsive opportunity grid with flexbox/grid layout.",
        questionDetails: {
          objective: "Create a semantic card grid using HTML5 `<article>`, `<header>`, `<main>` and CSS Flexbox/Grid that adjusts gracefully across mobile (1 col) and desktop (3 col).",
          inputFormat: "HTML markup structure with embedded CSS rules.",
          sampleInput: `<div class="opportunity-card">...</div>`,
          expectedOutput: `Accessible, responsive CSS grid layout with no horizontal scroll overflow.`,
          requirements: [
            "Use semantic tags: `<section>`, `<article>`, `<h3>`, `<button>`.",
            "Implement responsive layout: `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`.",
            "Ensure image cards contain accessible `alt` text.",
            "Prevent text clipping or layout overflow using `text-overflow: ellipsis` or wrap."
          ],
          explanation: "Utilizes CSS Grid with auto-fit and minmax to ensure dynamic responsiveness across mobile and desktop viewports."
        },
        starterCode: `<!-- Write your semantic HTML and CSS below -->
<style>
  .card-grid {
    /* TODO: Implement responsive grid layout */
  }
  .card {
    /* TODO: Implement clean card styling */
  }
</style>

<section class="card-grid">
  <!-- TODO: Create semantic card articles -->
</section>
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Mobile Horizontal Overflow & Accessibility Failure!
1. Extremely long job titles ("Senior Cryptographic Infrastructure Telemetry Engineer...") broke layout with 120px horizontal scrollbar.
2. Missing aria labels and missing image alt tags triggered WCAG 2.1 AA accessibility audit failure.
3. Fixed pixel widths (width: 900px) caused total layout collapse on mobile 360px viewport!`,
        adaptedStarterCode: `<!-- DEFENSIVE REFACTOR:
1. Replace fixed pixel widths with max-width: 100% and minmax(280px, 1fr)
2. Add overflow-wrap: break-word and text-overflow to prevent horizontal spill
3. Add accessible alt attributes and aria-label on interactive action buttons
-->
<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }
  .card {
    overflow-wrap: break-word;
    /* TODO: Defensive card styles */
  }
</style>

<section class="card-grid" aria-label="Internship Opportunities">
  <!-- Refactored accessible cards -->
</section>
`,
        testCases: [
          { id: 1, title: "Test Case 1: Responsive Grid Columns Check", expected: "Employs repeat(auto-fit, minmax(...)) layout" },
          { id: 2, title: "Test Case 2: Long String Wrap & Overflow Defense", expected: "overflow-wrap: break-word prevents horizontal viewport blowout" },
          { id: 3, title: "Test Case 3: Semantic Tagging & ARIA Attributes", expected: "Uses <section>, <article>, and aria-label" }
        ],
        unimplementedCheck: (c) => !c.includes('grid') && !c.includes('flex'),
        defensiveCheck: (c) => c.includes('break-word') || c.includes('overflow-wrap') || c.includes('aria-label')
      },
      {
        id: "html-accessible-nav",
        title: "Accessible Navigation & Focus Traps",
        conceptTag: "Accessibility & WCAG",
        difficulty: "Medium",
        taskTitle: "Accessible Navigation Bar with Visible Keyboard Focus",
        buildTask: "Build a semantic navigation bar with accessible dropdown disclosure, WAI-ARIA states, and `:focus-visible` styling.",
        questionDetails: {
          objective: "Create a `<nav>` bar with accessible menu buttons, `aria-expanded` toggle states, and clear keyboard focus rings.",
          inputFormat: "HTML5 semantic markup with CSS focus states.",
          sampleInput: `<nav><button aria-expanded="false">Menu</button><ul>...</ul></nav>`,
          expectedOutput: `WCAG AA compliant navigation bar`,
          requirements: [
            "Use `<nav aria-label='Main Navigation'>` landmark.",
            "Style `:focus-visible` with a distinct outline ring.",
            "Use `aria-haspopup='true'` and dynamic `aria-expanded`.",
            "Ensure minimum touch target size of 44x44px for buttons."
          ],
          explanation: "Keyboard accessibility allows motor-impaired users to navigate using Tab and Enter keys."
        },
        starterCode: `<!-- Write accessible navigation bar markup & CSS below -->
<style>
  nav {
    /* TODO: Nav layout */
  }
  button:focus-visible {
    /* TODO: Accessible outline ring */
  }
</style>

<nav aria-label="Main Navigation">
  <!-- TODO: Navigation links and disclosure button -->
</nav>
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Keyboard Trap & Screen Reader Blindspot!
1. Removed CSS outline on focus (outline: none) caused keyboard focus indicator to vanish completely.
2. Screen readers announced "unlabeled button" because the hamburger toggle had no inner text or aria-label.
3. Menu dropdown stayed hidden from screen readers when open.`,
        adaptedStarterCode: `<!-- DEFENSIVE REFACTOR:
1. Never suppress outlines without :focus-visible replacement
2. Add aria-label and aria-expanded="true" on toggle buttons
3. Ensure high contrast colors (4.5:1 ratio)
-->
<style>
  button:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
</style>
<nav aria-label="Main Navigation">
  <!-- Accessible button with aria-label -->
</nav>
`,
        testCases: [
          { id: 1, title: "Test Case 1: Nav Landmark Landmark", expected: "<nav aria-label='...'> present" },
          { id: 2, title: "Test Case 2: Visible Focus Indicator", expected: ":focus-visible styling explicitly declared" },
          { id: 3, title: "Test Case 3: Accessible Toggle Button", expected: "aria-label and aria-expanded configured" }
        ],
        unimplementedCheck: (c) => !c.includes('aria-label') && !c.includes('focus-visible'),
        defensiveCheck: (c) => c.includes('focus-visible') || c.includes('aria-expanded')
      },
      {
        id: "html-skeleton-loader",
        title: "Zero-Layout-Shift Shimmer Skeleton",
        conceptTag: "CSS Performance",
        difficulty: "Medium",
        taskTitle: "Performance Shimmer Skeleton Loader",
        buildTask: "Build CSS skeleton loader placeholders with zero Cumulative Layout Shift (CLS) and smooth shimmer animations.",
        questionDetails: {
          objective: "Create card skeleton loading states matching production layout dimensions to avoid jarring CLS spikes.",
          inputFormat: "HTML markup with CSS animation shimmer gradient.",
          sampleInput: `<div class="skeleton-card"><div class="skeleton-avatar"></div></div>`,
          expectedOutput: `Zero layout shifts, smooth 60fps shimmer effect`,
          requirements: [
            "Use `aspect-ratio` or fixed height matching loaded content.",
            "Implement `@keyframes shimmer` moving background gradient.",
            "Use `will-change: transform` or opacity to optimize GPU rendering."
          ],
          explanation: "Skeleton screens improve perceived performance while preventing layout reflows."
        },
        starterCode: `<!-- Write shimmer skeleton loader CSS & HTML below -->
<style>
  @keyframes shimmer {
    /* TODO: Define gradient translation */
  }
  .skeleton-box {
    /* TODO: Define dimensions and animation */
  }
</style>

<div class="skeleton-box"></div>
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Cumulative Layout Shift & CPU Jitter!
1. Dynamic content loaded without height placeholders, causing CLS score of 0.42 (failing Google Core Web Vitals).
2. Animating 'left' and 'margin' properties instead of 'transform' forced 100% CPU core utilization and frame drops.`,
        adaptedStarterCode: `<!-- DEFENSIVE REFACTOR:
1. Enforce aspect-ratio on skeleton containers to lock layout dimensions
2. Use background-position or transform for GPU-accelerated 60fps shimmer
3. Respect prefers-reduced-motion media query for motion sensitivity
-->
<style>
  @media (prefers-reduced-motion: reduce) {
    .skeleton-box { animation: none; }
  }
</style>
`,
        testCases: [
          { id: 1, title: "Test Case 1: Keyframe Animation Declaration", expected: "@keyframes shimmer defined" },
          { id: 2, title: "Test Case 2: Dimension Aspect Ratio Locking", expected: "aspect-ratio or explicit height set" },
          { id: 3, title: "Test Case 3: Reduced Motion Support", expected: "prefers-reduced-motion media query included" }
        ],
        unimplementedCheck: (c) => !c.includes('shimmer') && !c.includes('keyframes'),
        defensiveCheck: (c) => c.includes('aspect-ratio') || c.includes('reduced-motion')
      }
    ]
  },

  // =========================================================================
  // 8. FRONTEND (REACT)
  // =========================================================================
  {
    id: "frontend",
    name: "Frontend",
    category: "UI & Full Stack",
    icon: "Layers",
    verifiedScore: 84,
    benchmarkScore: 78,
    status: "Verified",
    concepts: [
      {
        id: "react-async-search",
        title: "Resilient Asynchronous Search Grid",
        conceptTag: "Hooks & Lifecycle",
        difficulty: "Medium",
        taskTitle: "Resilient Asynchronous Search Grid",
        buildTask: "Build an asynchronous candidate search hook or effect that triggers API queries with cancellation and debouncing.",
        questionDetails: {
          objective: "Implement an async React search effect that fetches data from `fetchCandidates(searchQuery, signal)` and synchronizes component state.",
          inputFormat: "searchQuery: string (e.g. 'React Developer').",
          sampleInput: `"React"`,
          expectedOutput: `Array of matched candidate profiles rendered without race conditions.`,
          requirements: [
            "Fetch candidates using the provided async query API.",
            "Store returned candidates in local component state.",
            "Execute when searchQuery changes.",
            "Ensure stale responses do not overwrite current state."
          ],
          explanation: "Uses useEffect and AbortController to cleanly cancel in-flight requests when the user rapidly types new search queries."
        },
        starterCode: `// Write your asynchronous search effect below
useEffect(() => {
    // TODO: Fetch candidates when searchQuery changes
    
}, [searchQuery]);
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Network Race Conditions & Stale Responses!
Rapid keystrokes caused out-of-order network responses due to latency jitter.
An earlier slow query returned AFTER a fast recent query, overwriting current results with stale data!
Network errors also triggered unhandled Promise rejections and crashed .map().`,
        adaptedStarterCode: `// DEFENSIVE REFACTOR:
// 1. Add AbortController cancellation to abort in-flight obsolete requests
// 2. Ensure response is valid array before setting state
// 3. Catch AbortError safely without console spam

useEffect(() => {
    const controller = new AbortController();
    
    // TODO: Implement defensive fetch with controller.signal
    
    return () => controller.abort();
}, [searchQuery]);
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard Query Execution", expected: "Fires fetchCandidates with query parameter" },
          { id: 2, title: "Test Case 2: Race Condition Abort Cleanup", expected: "Returns cleanup function with controller.abort()" },
          { id: 3, title: "Test Case 3: Array Type Validation", expected: "Guards setCandidates with Array.isArray check" }
        ],
        unimplementedCheck: (c) => !c.includes('fetchCandidates'),
        defensiveCheck: (c) => c.includes('AbortController') || c.includes('abort()') || c.includes('isCancelled')
      },
      {
        id: "react-virtual-list",
        title: "High-Performance Virtualized List",
        conceptTag: "Virtualization & Performance",
        difficulty: "Hard",
        taskTitle: "Virtualized Windowing List Component",
        buildTask: "Implement a virtual list component calculating visible index slices for large datasets.",
        questionDetails: {
          objective: "Calculate start and end indices based on scroll offset and item height to render only DOM nodes within viewport.",
          inputFormat: "scrollTop: number, viewportHeight: number, totalItems: number, itemHeight: number.",
          sampleInput: `scrollTop = 300, viewportHeight = 200, itemHeight = 50 -> startIndex = 6, endIndex = 10`,
          expectedOutput: `Renders only 4-6 items instead of all 50,000 items`,
          requirements: [
            "Compute `startIndex = Math.floor(scrollTop / itemHeight)`.",
            "Compute `endIndex = Math.min(totalItems - 1, startIndex + Math.ceil(viewportHeight / itemHeight))`.",
            "Add overscan buffer of 2 items above and below to prevent flicker during fast scrolls.",
            "Calculate total spacer height: `totalItems * itemHeight`."
          ],
          explanation: "Virtualization keeps the DOM lightweight by rendering only elements within the user's viewport."
        },
        starterCode: `function getVisibleRange(scrollTop, viewportHeight, totalItems, itemHeight) {
    // TODO: Calculate startIndex and endIndex with overscan buffer
    return { startIndex: 0, endIndex: 0 };
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Division by Zero & Negative Index Crash!
1. itemHeight passed as 0 or negative number (Division by Zero -> Infinity!).
2. Fast upward scroll bounced scrollTop into negative numbers, creating negative array indices.
3. Empty list passed (totalItems = 0) caused out-of-bound errors.`,
        adaptedStarterCode: `function getVisibleRange(scrollTop, viewportHeight, totalItems, itemHeight) {
    // DEFENSIVE REFACTOR:
    // 1. Guard against itemHeight <= 0 or totalItems <= 0
    // 2. Clamp scrollTop >= 0
    // 3. Clamp startIndex and endIndex strictly within [0, totalItems - 1]
    return { startIndex: 0, endIndex: 0 };
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard Viewport Calculation", expected: "Calculates correct index range for middle scroll" },
          { id: 2, title: "Test Case 2: Overscan Buffer Addition", expected: "Adds 2 items buffer above and below" },
          { id: 3, title: "Test Case 3: Zero Items Boundary Guard", expected: "Returns {startIndex: 0, endIndex: 0} when list empty" }
        ],
        unimplementedCheck: (c) => c.includes('return { startIndex: 0, endIndex: 0 };') && !c.includes('Math.floor'),
        defensiveCheck: (c) => c.includes('Math.max') || c.includes('Math.min') || c.includes('itemHeight <= 0')
      },
      {
        id: "react-undo-redo",
        title: "Custom Undo/Redo State History Hook",
        conceptTag: "State Architecture",
        difficulty: "Medium",
        taskTitle: "useUndoRedo Custom State History Hook",
        buildTask: "Build a custom React hook `useUndoRedo(initialState, maxHistory)` with undo, redo, and stack management.",
        questionDetails: {
          objective: "Implement a state hook maintaining past, present, and future stacks with rollback capabilities.",
          inputFormat: "const [state, set, { undo, redo, canUndo, canRedo }] = useUndoRedo('initial');",
          sampleInput: `set('A'); set('B'); undo(); -> state = 'A'`,
          expectedOutput: `State reverts to previous snapshot`,
          requirements: [
            "Maintain past array and future array.",
            "Calling `set(newVal)` pushes current to past and clears future.",
            "Calling `undo()` pops last past item into present and pushes current to future.",
            "Calling `redo()` restores from future.",
            "Limit past history to `maxHistory` entries."
          ],
          explanation: "Undo/redo architecture provides robust version rollback in interactive web applications."
        },
        starterCode: `import { useState } from 'react';

function useUndoRedo(initialState, maxHistory = 20) {
    const [state, setState] = useState(initialState);
    // TODO: Maintain history stacks for undo and redo
    
    return [state, (newVal) => {}, { undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }];
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Memory Leak from Unbounded History!
1. Frequent keystrokes pushed 100,000 snapshots into memory without max cap (Browser Tab Out of Memory!).
2. Calling undo() when past was empty mutated undefined into state.
3. Mutating objects directly in history corrupted all previous snapshots.`,
        adaptedStarterCode: `function useUndoRedo(initialState, maxHistory = 20) {
    // DEFENSIVE REFACTOR:
    // 1. Guard against empty past stack on undo()
    // 2. Bound past.length <= maxHistory by slicing oldest items
    // 3. Deep copy or clone state to prevent reference mutations
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Sequential Updates & Undo", expected: "Reverts to previous state on undo" },
          { id: 2, title: "Test Case 2: Redo After Undo", expected: "Restores future state on redo" },
          { id: 3, title: "Test Case 3: History Boundary Overflow Cap", expected: "Discards oldest history when exceeding maxHistory" }
        ],
        unimplementedCheck: (c) => c.includes('canUndo: false, canRedo: false') && !c.includes('past'),
        defensiveCheck: (c) => c.includes('past.length') || c.includes('slice') || c.includes('maxHistory')
      }
    ]
  },

  // =========================================================================
  // 9. BACKEND (NODE / EXPRESS)
  // =========================================================================
  {
    id: "backend",
    name: "Backend",
    category: "Microservices & APIs",
    icon: "Server",
    verifiedScore: 88,
    benchmarkScore: 80,
    status: "Verified",
    concepts: [
      {
        id: "backend-rest-controller",
        title: "Resilient Express REST Controller & Sanitizer",
        conceptTag: "APIs & Validation",
        difficulty: "Medium",
        taskTitle: "Resilient Express REST API Controller & Sanitizer",
        buildTask: "Implement an Express route handler `router.post('/api/apply', async (req, res) => ...)` with input validation and error handling.",
        questionDetails: {
          objective: "Build a Node.js/Express endpoint for internship applications that validates candidate email, roleId, and sanitizes payload against injection.",
          inputFormat: "req.body: { candidateId: string, roleId: string, email: string, note?: string }",
          sampleInput: `{"candidateId": "STU-101", "roleId": "opp-1", "email": "candidate@univ.edu"}`,
          expectedOutput: `HTTP 201 Created with JSON { success: true, applicationId: "APP-..." }`,
          requirements: [
            "Validate candidateId and roleId are non-empty strings.",
            "Validate email format with regex check.",
            "Return HTTP 400 Bad Request with specific error message on invalid input.",
            "Wrap database insertion in try/catch and return HTTP 500 on server errors."
          ],
          explanation: "Validates inputs, guards against injection, and provides structured HTTP responses for both client errors and unexpected failures."
        },
        starterCode: `const express = require('express');
const router = express.Router();

router.post('/api/apply', async (req, res) => {
    // TODO: Validate req.body and process application submission
    // Return res.status(201).json(...)
});

module.exports = router;
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Malicious Injection & Server 500 Crash!
1. Attacker submitted email = {"$gt": ""} (NoSQL Injection crash!).
2. req.body arrived as undefined because Content-Type was missing (TypeError: Cannot read properties of undefined).
3. Database connection timeout threw unhandled rejection, crashing Node.js process!`,
        adaptedStarterCode: `const express = require('express');
const router = express.Router();

router.post('/api/apply', async (req, res) => {
    // DEFENSIVE REFACTOR:
    // 1. Guard against req.body being undefined or null
    // 2. Enforce strict string type checks (typeof email === 'string')
    // 3. Wrap DB calls in try/catch to return res.status(500) without crashing Node
});

module.exports = router;
`,
        testCases: [
          { id: 1, title: "Test Case 1: Valid Application Submission", expected: "HTTP 201 Created with generated applicationId" },
          { id: 2, title: "Test Case 2: Missing Fields Rejection", expected: "HTTP 400 Bad Request with descriptive message" },
          { id: 3, title: "Test Case 3: Object Injection Defense", expected: "Blocks non-string object payloads safely" }
        ],
        unimplementedCheck: (c) => !c.includes('status(201)') && !c.includes('status(200)'),
        defensiveCheck: (c) => c.includes('typeof') || c.includes('try') || c.includes('req.body')
      },
      {
        id: "backend-idempotency",
        title: "Distributed Idempotency Key Middleware",
        conceptTag: "Distributed Systems",
        difficulty: "Hard",
        taskTitle: "Payment & Action Idempotency Key Middleware",
        buildTask: "Build an Express middleware checking `Idempotency-Key` headers to cache and return identical responses for duplicate requests.",
        questionDetails: {
          objective: "Prevent double-charging in payment APIs by returning cached responses when identical Idempotency-Keys are detected.",
          inputFormat: "Header: `Idempotency-Key: uuid-string`.",
          sampleInput: `POST /api/pay with key 'key-123' twice -> Second request receives identical cached response immediately`,
          expectedOutput: `Cached HTTP response with 'X-Cache-Lookup: HIT'`,
          requirements: [
            "Check for presence of `req.headers['idempotency-key']`.",
            "If key found in store: return cached statusCode and body immediately.",
            "If key not found: intercept `res.send`/`res.json` and save response in store before sending.",
            "Set cache expiration TTL (e.g. 24 hours)."
          ],
          explanation: "Idempotency prevents duplicate operations when network timeouts cause client retries."
        },
        starterCode: `const cache = new Map();

function idempotencyMiddleware(req, res, next) {
    const key = req.headers['idempotency-key'];
    // TODO: Return cached response if key exists, or capture and cache new response
    next();
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Concurrent Race Condition Double Charge!
1. Two identical payment requests arrived within 2 milliseconds before the first request finished saving to cache!
2. Both passed through to the payment gateway, charging the customer twice!
3. Memory leak occurred as cache map grew infinitely without expiration.`,
        adaptedStarterCode: `function idempotencyMiddleware(req, res, next) {
    // DEFENSIVE REFACTOR:
    // 1. If key is missing on POST: return res.status(400).json({ error: "Missing Idempotency-Key" })
    // 2. Mark key as 'PROCESSING' in cache immediately to block concurrent duplicate races
    // 3. Return 409 Conflict or wait if request with same key is currently in-flight
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: First Request Execution & Cache Storage", expected: "Passes to route handler and caches response" },
          { id: 2, title: "Test Case 2: Subsequent Duplicate Request Cache Hit", expected: "Returns cached response without re-executing route" },
          { id: 3, title: "Test Case 3: Concurrent In-Flight Race Protection", expected: "Blocks concurrent in-flight duplicates with 409 or lock" }
        ],
        unimplementedCheck: (c) => c.includes('// TODO:') && !c.includes('cache.has'),
        defensiveCheck: (c) => c.includes('cache.has') || c.includes('PROCESSING') || c.includes('status(409)')
      },
      {
        id: "backend-jwt-refresh",
        title: "JWT Token Rotation & Auth Middleware",
        conceptTag: "Security & Auth",
        difficulty: "Hard",
        taskTitle: "JWT Authentication & Refresh Interceptor",
        buildTask: "Implement an authentication middleware verifying JWT tokens, catching expiration, and rotating refresh tokens safely.",
        questionDetails: {
          objective: "Validate `Authorization: Bearer <token>`, decode claims, reject expired tokens, and attach user context to `req.user`.",
          inputFormat: "Header: Authorization: Bearer eyJhbGciOi...",
          sampleInput: `Valid token -> sets req.user = { id: 'usr-1', role: 'admin' }, calls next()`,
          expectedOutput: `req.user populated or HTTP 401 Unauthorized`,
          requirements: [
            "Extract Bearer token from Authorization header.",
            "Verify token signature using secret key.",
            "Return HTTP 401 if header missing, token malformed, or token expired.",
            "Attach decoded payload to `req.user`."
          ],
          explanation: "JWT middleware protects private API routes and authenticates client microservices."
        },
        starterCode: `function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    // TODO: Verify Bearer token and populate req.user
    next();
}
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: "None" Algorithm Exploit & Server 500!
1. Attacker submitted forged JWT with header '{"alg": "none"}' bypassing signature checks!
2. Missing Authorization header caused TypeError: cannot read property 'split' of undefined.
3. Expired token threw unhandled TokenExpiredError, crashing the server process.`,
        adaptedStarterCode: `function authenticateJWT(req, res, next) {
    // DEFENSIVE REFACTOR:
    // 1. Guard against missing or non-string authHeader
    // 2. Reject tokens using algorithm 'none' (force HS256/RS256)
    // 3. Catch TokenExpiredError and JsonWebTokenError, returning 401 without crashing
}
`,
        testCases: [
          { id: 1, title: "Test Case 1: Valid Bearer Token Verification", expected: "Authenticates and populates req.user" },
          { id: 2, title: "Test Case 2: Missing Header Rejection", expected: "Returns HTTP 401 Unauthorized safely" },
          { id: 3, title: "Test Case 3: Alg None Exploit Defense", expected: "Rejects unverified algorithmic bypasses" }
        ],
        unimplementedCheck: (c) => c.includes('// TODO:') && !c.includes('split'),
        defensiveCheck: (c) => c.includes('try') || c.includes('status(401)') || c.includes('startsWith')
      }
    ]
  },

  // =========================================================================
  // 10. DATA ANALYTICS
  // =========================================================================
  {
    id: "dataanalytics",
    name: "Data Analytics",
    category: "Analytics & Insights",
    icon: "BarChart2",
    verifiedScore: 90,
    benchmarkScore: 82,
    status: "Verified",
    concepts: [
      {
        id: "analytics-churn-arpu",
        title: "Cohort Churn & Revenue Analytics",
        conceptTag: "Business Metrics",
        difficulty: "Medium",
        taskTitle: "Telemetry Anomaly & Outlier Sanitization Pipeline",
        buildTask: "Implement `analyze_retention_and_churn(records)` that computes cohort churn rate, IQR outlier boundaries, and sanitized revenue metrics.",
        questionDetails: {
          objective: "Write an analytics function `analyze_retention_and_churn(records)` that computes churn rate, average revenue per user (ARPU), and active count.",
          inputFormat: "records: list of dicts. Keys: 'user_id', 'plan', 'monthly_spend', 'churned' (bool).",
          sampleInput: `[
  {"user_id": "U-1", "monthly_spend": 50.0, "churned": false},
  {"user_id": "U-2", "monthly_spend": 100.0, "churned": true},
  {"user_id": "U-3", "monthly_spend": 75.0, "churned": false}
]`,
          expectedOutput: `{
  "churn_rate": 33.33,
  "arpu": 75.00,
  "active_count": 2
}`,
          requirements: [
            "Calculate churn_rate: (churned_users * 100.0 / total_users), rounded to 2 decimal places.",
            "Calculate arpu: total monthly_spend divided by total_users, rounded to 2 decimal places.",
            "Count active_count: number of users where churned is false.",
            "Return dictionary with keys: 'churn_rate', 'arpu', 'active_count'."
          ],
          explanation: "Computes retention percentages and average spend across user cohorts."
        },
        starterCode: `def analyze_retention_and_churn(records):
    # TODO: Calculate churn_rate, arpu, and active_count
    # Return dictionary with keys: 'churn_rate', 'arpu', 'active_count'
    pass
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Dirty Currency Strings, NaNs & Zero Division!
1. 30% of incoming records contained monthly_spend as string "$1,200.50 USD".
2. Records contained None or NaN for spend values.
3. Empty cohort passed caused ZeroDivisionError on churn_rate!`,
        adaptedStarterCode: `import re

def analyze_retention_and_churn(records):
    """
    DEFENSIVE REFACTOR:
    1. Guard against empty records list (return zeros safely)
    2. Sanitize dirty currency strings ("$1,200.50 USD" -> 1200.50)
    3. Ignore records with invalid or missing user_ids
    """
    # TODO: Implement defensive data analytics calculation
    pass
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard 3 Users Batch", expected: "churn_rate: 33.33%, arpu: 75.00, active_count: 2" },
          { id: 2, title: "Test Case 2: Zero Churn Cohort", expected: "churn_rate: 0.00%, all users active" },
          { id: 3, title: "Test Case 3: Empty Records Dataset", expected: "Returns zeroed metrics safely without division error" }
        ],
        unimplementedCheck: (c) => c.includes('pass') && !c.includes('return'),
        defensiveCheck: (c) => c.includes('isinstance') || c.includes('float(') || c.includes('total == 0')
      },
      {
        id: "analytics-iqr-outliers",
        title: "Statistical Outlier Detection via IQR",
        conceptTag: "Statistics & Cleaning",
        difficulty: "Hard",
        taskTitle: "Interquartile Range (IQR) Outlier Filtering",
        buildTask: "Implement `detect_outliers_iqr(values, multiplier=1.5)` that computes Q1, Q3, IQR, and separates normal values from outliers.",
        questionDetails: {
          objective: "Implement statistical outlier detection using the Interquartile Range method to isolate abnormal data spikes.",
          inputFormat: "values: list of numbers, multiplier: float (default 1.5).",
          sampleInput: `values = [10, 12, 12, 13, 12, 14, 15, 100] (100 is an anomaly)`,
          expectedOutput: `{"clean_values": [10, 12, 12, 13, 12, 14, 15], "outliers": [100], "lower_bound": 7.5, "upper_bound": 19.5}`,
          requirements: [
            "Sort values numerically.",
            "Compute Q1 (25th percentile) and Q3 (75th percentile).",
            "Calculate IQR = Q3 - Q1.",
            "Boundaries: lower = Q1 - (multiplier * IQR), upper = Q3 + (multiplier * IQR).",
            "Separate values into clean_values and outliers."
          ],
          explanation: "IQR filtering is standard in machine learning pipelines to prevent outliers from skewing models."
        },
        starterCode: `def detect_outliers_iqr(values, multiplier=1.5):
    # TODO: Sort values, compute Q1, Q3, IQR and separate outliers
    # Return dict with 'clean_values', 'outliers', 'lower_bound', 'upper_bound'
    pass
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Uniform Zero-Variance & NaN Corruption!
1. Dataset had all identical values [50, 50, 50] (IQR == 0.0).
2. Incoming list contained None, NaN, and string types.
3. List with fewer than 4 elements crashed percentile index calculations!`,
        adaptedStarterCode: `def detect_outliers_iqr(values, multiplier=1.5):
    """
    DEFENSIVE REFACTOR:
    1. Filter out None, NaN, and non-numeric items
    2. If clean values count < 4: return all items in clean_values with empty outliers
    3. Guard against IQR == 0.0
    """
    pass
`,
        testCases: [
          { id: 1, title: "Test Case 1: Clear Spike Outlier Detection", expected: "Identifies 100 as outlier, cleans remaining numbers" },
          { id: 2, title: "Test Case 2: Clean Dataset with No Outliers", expected: "outliers list is empty" },
          { id: 3, title: "Test Case 3: Small Dataset (< 4 items) Safety", expected: "Safely returns items without crash" }
        ],
        unimplementedCheck: (c) => c.includes('pass') && !c.includes('return'),
        defensiveCheck: (c) => c.includes('sorted') || c.includes('iqr') || c.includes('len(')
      },
      {
        id: "analytics-rolling-avg",
        title: "Time-Series Rolling Moving Average",
        conceptTag: "Time Series",
        difficulty: "Medium",
        taskTitle: "Rolling Window Moving Average & Volatility",
        buildTask: "Implement `compute_rolling_averages(data_points, window_size)` that computes smoothed rolling averages for time-series streams.",
        questionDetails: {
          objective: "Calculate the simple moving average over a sliding window for time-series revenue or telemetry points.",
          inputFormat: "data_points: list of floats, window_size: int.",
          sampleInput: `data_points = [10, 20, 30, 40, 50], window_size = 3`,
          expectedOutput: `[20.0, 30.0, 40.0] (averages of [10,20,30], [20,30,40], [30,40,50])`,
          requirements: [
            "Validate window_size >= 1.",
            "Slide window across data_points calculating mean of window.",
            "Round each moving average to 2 decimal places.",
            "Return list of rolling averages."
          ],
          explanation: "Moving averages smooth high-frequency noise in time-series trend analysis."
        },
        starterCode: `def compute_rolling_averages(data_points, window_size):
    # TODO: Compute sliding window moving averages
    # Return list of rounded averages
    pass
`,
        breakRequirement: `🚨 BREAKING MUTATION INJECTED: Window Larger Than Dataset & Zero Window!
1. window_size passed as 0 or negative number (ZeroDivisionError / infinite loop!).
2. window_size (10) was larger than data_points length (3).
3. data_points was empty list [] or None.`,
        adaptedStarterCode: `def compute_rolling_averages(data_points, window_size):
    """
    DEFENSIVE REFACTOR:
    1. Guard against data_points being empty or None (return [])
    2. Clamp window_size: if window_size > len(data_points), return []
    3. Enforce window_size >= 1
    """
    pass
`,
        testCases: [
          { id: 1, title: "Test Case 1: Standard Window 3 Calculation", expected: "[20.0, 30.0, 40.0] correctly smoothed" },
          { id: 2, title: "Test Case 2: Window Equal to Length", expected: "Single average of full list returned" },
          { id: 3, title: "Test Case 3: Oversized Window Handling", expected: "Returns [] safely without crashing" }
        ],
        unimplementedCheck: (c) => c.includes('pass') && !c.includes('return'),
        defensiveCheck: (c) => c.includes('window_size') || c.includes('len(') || c.includes('sum(')
      }
    ]
  }
];

// Helper to populate top-level legacy fields from concepts[0] for any code reading skillData directly
skillsCatalogue.forEach(skill => {
  if (skill.concepts && skill.concepts.length > 0) {
    const c0 = skill.concepts[0];
    skill.taskTitle = c0.taskTitle;
    skill.buildTask = c0.buildTask;
    skill.questionDetails = c0.questionDetails;
    skill.starterCode = c0.starterCode;
    skill.breakRequirement = c0.breakRequirement;
    skill.adaptedStarterCode = c0.adaptedStarterCode;
    skill.testCases = c0.testCases;
  }
});
