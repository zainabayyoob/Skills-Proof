// src/data/skillsRegistry.js
// Central Canonical Skill Registry and Domain-CareerTrack-Skill Mapping for SkillProof

import { skillsCatalogue } from './assessmentsData.js';
import { getCareerRoleByTitle } from './careerRolesData.js';
import { getDomainByIdOrName } from './domainsData.js';

// Metadata for base assessed skills to establish accurate type and editor settings
export const baseSkillMeta = {
  python: {
    skillType: 'programming-language',
    skillTypeLabel: 'Programming Language',
    categoryGroup: 'programming-languages',
    isExecutable: true,
    editorLanguage: 'python',
    editorFile: 'solution.py',
  },
  sql: {
    skillType: 'query-language',
    skillTypeLabel: 'Query Language',
    categoryGroup: 'query-data',
    isExecutable: true,
    editorLanguage: 'sql',
    editorFile: 'solution.sql',
  },
  c: {
    skillType: 'programming-language',
    skillTypeLabel: 'Programming Language',
    categoryGroup: 'programming-languages',
    isExecutable: true,
    editorLanguage: 'c',
    editorFile: 'solution.c',
  },
  cpp: {
    skillType: 'programming-language',
    skillTypeLabel: 'Programming Language',
    categoryGroup: 'programming-languages',
    isExecutable: true,
    editorLanguage: 'cpp',
    editorFile: 'solution.cpp',
  },
  java: {
    skillType: 'programming-language',
    skillTypeLabel: 'Programming Language',
    categoryGroup: 'programming-languages',
    isExecutable: true,
    editorLanguage: 'java',
    editorFile: 'Solution.java',
  },
  javascript: {
    skillType: 'programming-language',
    skillTypeLabel: 'Programming Language',
    categoryGroup: 'programming-languages',
    isExecutable: true,
    editorLanguage: 'javascript',
    editorFile: 'solution.js',
  },
  htmlcss: {
    skillType: 'markup-styling',
    skillTypeLabel: 'Markup & Styling',
    categoryGroup: 'frameworks-stacks',
    isExecutable: true,
    editorLanguage: 'html',
    editorFile: 'index.html',
  },
  frontend: {
    skillType: 'framework-stack',
    skillTypeLabel: 'Engineering Stack',
    categoryGroup: 'frameworks-stacks',
    isExecutable: true,
    editorLanguage: 'javascript',
    editorFile: 'App.jsx',
  },
  backend: {
    skillType: 'framework-stack',
    skillTypeLabel: 'Engineering Stack',
    categoryGroup: 'frameworks-stacks',
    isExecutable: true,
    editorLanguage: 'javascript',
    editorFile: 'server.js',
  },
  dataanalytics: {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: true,
    editorLanguage: 'python',
    editorFile: 'analytics.py',
  },
};

// 1. Existing Fully Functional Skills (Mapped from assessmentsData)
// These 10 skills have complete interactive code challenges, test suites, and dynamic question banks.
const baseAssessedSkills = skillsCatalogue.map((s) => {
  const meta = baseSkillMeta[s.id.toLowerCase()] || {};
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    icon: s.icon,
    benchmarkScore: s.benchmarkScore || 80,
    hasAssessment: true,
    isExecutable: meta.isExecutable ?? true,
    skillType: meta.skillType || 'domain-competency',
    skillTypeLabel: meta.skillTypeLabel || 'Technical Competency',
    categoryGroup: meta.categoryGroup || 'all',
    editorLanguage: meta.editorLanguage || 'javascript',
    editorFile: meta.editorFile || 'solution.js',
    status: 'Assessment Live',
    concepts: s.concepts ? s.concepts.map((c) => ({
      id: c.id,
      title: c.title,
      conceptTag: c.conceptTag || 'Core Competency',
      difficulty: c.difficulty || 'Medium',
    })) : [
      { title: 'Core Foundations & Architecture' },
      { title: 'Production Fault Tolerance & Mutability' },
      { title: 'Optimization & Defensive Implementation' }
    ]
  };
});

// Metadata mapping for 28 canonical extension skills
export const extensionSkillMeta = {
  'machine-learning': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'deep-learning': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'numpy': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'pandas': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'statistics': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'model-evaluation': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'data-visualization': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'cybersecurity-fundamentals': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Security & Systems',
    categoryGroup: 'security-systems',
    isExecutable: false,
  },
  'network-security': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Security & Systems',
    categoryGroup: 'security-systems',
    isExecutable: false,
  },
  'web-security': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Security & Systems',
    categoryGroup: 'security-systems',
    isExecutable: false,
  },
  'auth-iam': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Security & Systems',
    categoryGroup: 'security-systems',
    isExecutable: false,
  },
  'cryptography': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Security & Systems',
    categoryGroup: 'security-systems',
    isExecutable: false,
  },
  'vulnerability-assessment': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Security & Systems',
    categoryGroup: 'security-systems',
    isExecutable: false,
  },
  'cloud-fundamentals': {
    skillType: 'infrastructure-tools',
    skillTypeLabel: 'Infrastructure & Tools',
    categoryGroup: 'cloud-infrastructure',
    isExecutable: false,
  },
  'docker-containers': {
    skillType: 'infrastructure-tools',
    skillTypeLabel: 'Infrastructure & Tools',
    categoryGroup: 'cloud-infrastructure',
    isExecutable: false,
  },
  'kubernetes': {
    skillType: 'infrastructure-tools',
    skillTypeLabel: 'Infrastructure & Tools',
    categoryGroup: 'cloud-infrastructure',
    isExecutable: false,
  },
  'cicd-automation': {
    skillType: 'infrastructure-tools',
    skillTypeLabel: 'Infrastructure & Tools',
    categoryGroup: 'cloud-infrastructure',
    isExecutable: false,
  },
  'linux-systems': {
    skillType: 'infrastructure-tools',
    skillTypeLabel: 'Infrastructure & Tools',
    categoryGroup: 'cloud-infrastructure',
    isExecutable: false,
  },
  'git-version-control': {
    skillType: 'infrastructure-tools',
    skillTypeLabel: 'Infrastructure & Tools',
    categoryGroup: 'cloud-infrastructure',
    isExecutable: false,
  },
  'rest-apis': {
    skillType: 'framework-stack',
    skillTypeLabel: 'Engineering Stack',
    categoryGroup: 'frameworks-stacks',
    isExecutable: false,
  },
  'typescript': {
    skillType: 'programming-language',
    skillTypeLabel: 'Programming Language',
    categoryGroup: 'programming-languages',
    isExecutable: false,
  },
  'etl-pipelines': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'data-warehousing': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Technical Competency',
    categoryGroup: 'query-data',
    isExecutable: false,
  },
  'qa-testing-fundamentals': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Security & Systems',
    categoryGroup: 'security-systems',
    isExecutable: false,
  },
  'automation-testing': {
    skillType: 'infrastructure-tools',
    skillTypeLabel: 'Infrastructure & Tools',
    categoryGroup: 'cloud-infrastructure',
    isExecutable: false,
  },
  'ui-design-systems': {
    skillType: 'framework-stack',
    skillTypeLabel: 'Engineering Stack',
    categoryGroup: 'frameworks-stacks',
    isExecutable: false,
  },
  'smart-contracts': {
    skillType: 'programming-language',
    skillTypeLabel: 'Programming Language',
    categoryGroup: 'programming-languages',
    isExecutable: false,
  },
  'embedded-rtos': {
    skillType: 'domain-competency',
    skillTypeLabel: 'Security & Systems',
    categoryGroup: 'security-systems',
    isExecutable: false,
  },
};

// 2. Canonical New Skills for CSE Career Tracks & Domains
// Mapped cleanly with stable IDs so they connect seamlessly across Skill Assessment, Skill Gap, Roadmap, and Passport.
const rawExtensionSkills = [
  // --- AI & Machine Learning ---
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'Artificial Intelligence',
    icon: 'Cpu',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Supervised & Unsupervised Learning Models' },
      { title: 'Regression, Decision Trees & Ensemble Methods' },
      { title: 'Feature Scaling & Cross-Validation Stratification' }
    ]
  },
  {
    id: 'deep-learning',
    name: 'Deep Learning & Neural Networks',
    category: 'Artificial Intelligence',
    icon: 'Layers',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'CNNs, RNNs & Attention Architectures' },
      { title: 'Backpropagation & Loss Optimization' },
      { title: 'Transfer Learning & Foundation Model Fine-Tuning' }
    ]
  },
  {
    id: 'numpy',
    name: 'NumPy',
    category: 'Scientific Computing',
    icon: 'CodeXml',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'N-Dimensional Array Manipulation' },
      { title: 'Vectorized Operations & Broadcasting Rules' },
      { title: 'Memory-Efficient Numerical Computations' }
    ]
  },
  {
    id: 'pandas',
    name: 'Pandas',
    category: 'Data Science',
    icon: 'BarChart2',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'DataFrames & Series Transformation' },
      { title: 'Aggregation, GroupBy & Pivot Tables' },
      { title: 'Missing Data Imputation & Time Series Filtering' }
    ]
  },
  {
    id: 'statistics',
    name: 'Statistics & Probability',
    category: 'Mathematical Modeling',
    icon: 'BarChart2',
    benchmarkScore: 75,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Probability Distributions & Bayes Theorem' },
      { title: 'Hypothesis Testing & p-value Interpretation' },
      { title: 'Confidence Intervals & Variance Analysis' }
    ]
  },
  {
    id: 'model-evaluation',
    name: 'Model Evaluation & Metrics',
    category: 'Artificial Intelligence',
    icon: 'Award',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Precision, Recall, F1-Score & ROC-AUC Curves' },
      { title: 'Bias-Variance Tradeoff Analysis' },
      { title: 'Data Leakage Prevention & Train/Val/Test Splits' }
    ]
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    category: 'Data & Analytics',
    icon: 'BarChart2',
    benchmarkScore: 75,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Exploratory Visual Data Analytics' },
      { title: 'Matplotlib, Seaborn & Chart Grammar' },
      { title: 'Interactive Dashboards & Business Storytelling' }
    ]
  },

  // --- Cybersecurity ---
  {
    id: 'cybersecurity-fundamentals',
    name: 'Cybersecurity Fundamentals',
    category: 'Security & Compliance',
    icon: 'ShieldCheck',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'CIA Triad, Security Principles & Threat Modeling' },
      { title: 'Attack Vectors, Malware Types & MITRE ATT&CK' },
      { title: 'Security Governance & Defensive Defense-in-Depth' }
    ]
  },
  {
    id: 'network-security',
    name: 'Network Security',
    category: 'Security & Networking',
    icon: 'Server',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'TCP/IP Model, Packet Analysis & Wireshark' },
      { title: 'Firewalls, IDS/IPS & DMZ Segmentation' },
      { title: 'TLS/SSL Handshake & Secure Protocol Hardening' }
    ]
  },
  {
    id: 'web-security',
    name: 'Web Application Security',
    category: 'Security & Web',
    icon: 'ShieldCheck',
    benchmarkScore: 82,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'OWASP Top 10 Vulnerabilities Identification' },
      { title: 'XSS, CSRF & SQL Injection Remediation' },
      { title: 'CORS, CSP Headers & Cookie Security Flags' }
    ]
  },
  {
    id: 'auth-iam',
    name: 'Authentication & Access Control',
    category: 'Security & Systems',
    icon: 'ShieldCheck',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'OAuth 2.0, OpenID Connect & JWT Architecture' },
      { title: 'Role-Based & Attribute-Based Access Control (RBAC)' },
      { title: 'MFA & Session Management Security' }
    ]
  },
  {
    id: 'cryptography',
    name: 'Cryptography Fundamentals',
    category: 'Security & Mathematics',
    icon: 'CodeXml',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Symmetric vs Asymmetric Encryption (AES & RSA)' },
      { title: 'Cryptographic Hashes & Salted Storage (SHA-256, bcrypt)' },
      { title: 'Digital Signatures & Public Key Infrastructure (PKI)' }
    ]
  },
  {
    id: 'vulnerability-assessment',
    name: 'Vulnerability Assessment',
    category: 'Security & Compliance',
    icon: 'ShieldCheck',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Automated Vulnerability Scanning & CVE Scoring' },
      { title: 'Penetration Testing Scoping & Execution' },
      { title: 'Security Advisory Remediation Verification' }
    ]
  },

  // --- Cloud & DevOps ---
  {
    id: 'cloud-fundamentals',
    name: 'Cloud Architecture',
    category: 'Cloud & Infrastructure',
    icon: 'Server',
    benchmarkScore: 78,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Cloud Service Models (IaaS, PaaS, Serverless)' },
      { title: 'VPC Networks, Subnets & Route Tables' },
      { title: 'High Availability & Multi-Region Fault Tolerance' }
    ]
  },
  {
    id: 'docker-containers',
    name: 'Docker & Containerization',
    category: 'Cloud & DevOps',
    icon: 'Layers',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Dockerfile Optimization & Multi-Stage Builds' },
      { title: 'Container Networking & Volume Persistence' },
      { title: 'Docker Compose Microservices Topologies' }
    ]
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes Orchestration',
    category: 'Cloud & DevOps',
    icon: 'Layers',
    benchmarkScore: 78,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Pods, Deployments, ReplicaSets & Services' },
      { title: 'Ingress Controllers & Cluster Load Balancing' },
      { title: 'ConfigMaps, Secrets & HPA Auto-Scaling' }
    ]
  },
  {
    id: 'cicd-automation',
    name: 'CI/CD Automation',
    category: 'Cloud & DevOps',
    icon: 'RotateCcw',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Continuous Integration Pipelines & Automated Gateways' },
      { title: 'GitHub Actions & Pipeline Secrets Security' },
      { title: 'Zero-Downtime Blue-Green & Canary Deployments' }
    ]
  },
  {
    id: 'linux-systems',
    name: 'Linux & Shell Scripting',
    category: 'Systems & Infrastructure',
    icon: 'Terminal',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Bash Automation & Shell Command Pipelines' },
      { title: 'Process Lifecycle, Daemons & Systemd Services' },
      { title: 'Filesystem Permissions, SSH Keys & Sysadmin' }
    ]
  },
  {
    id: 'git-version-control',
    name: 'Git & Version Control',
    category: 'Core Engineering',
    icon: 'FileCode',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Branching Models, Merge & Interactive Rebase' },
      { title: 'Merge Conflict Resolution & Cherry-Picking' },
      { title: 'Git Hooks, Submodules & Clean History Hygiene' }
    ]
  },

  // --- Web & Systems Engineering ---
  {
    id: 'rest-apis',
    name: 'REST APIs & Architecture',
    category: 'Backend Systems',
    icon: 'Server',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'HTTP Methods, Semantic Status Codes & Idempotency' },
      { title: 'Pagination, Query Filtering & Rate Limiting' },
      { title: 'Contract-First Design & OpenAPI / Swagger Specs' }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Core Web & Frontend',
    icon: 'FileCode',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Static Types, Interfaces & Generic Functions' },
      { title: 'Type Narrowing, Discriminated Unions & Guards' },
      { title: 'Advanced Utility Types & Type Inference' }
    ]
  },
  {
    id: 'etl-pipelines',
    name: 'ETL / ELT & Data Pipelines',
    category: 'Data Engineering',
    icon: 'Database',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Batch vs Streaming Data Ingestion Architectures' },
      { title: 'Data Transformation & Schema Evolution' },
      { title: 'Idempotent DAG Orchestration & Backfill Handling' }
    ]
  },
  {
    id: 'data-warehousing',
    name: 'Data Warehousing & Modeling',
    category: 'Data Engineering',
    icon: 'Database',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Dimensional Modeling (Star & Snowflake Schemas)' },
      { title: 'Columnar Storage, Clustering & Partition Keys' },
      { title: 'Slowly Changing Dimensions (SCD Type 1 & 2)' }
    ]
  },
  {
    id: 'qa-testing-fundamentals',
    name: 'Software Testing & TDD',
    category: 'Core Engineering',
    icon: 'CheckCircle2',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Unit, Integration & System Test Pyramid' },
      { title: 'Test-Driven Development (TDD) Workflows' },
      { title: 'Mocking, Spying & Edge Boundary Conditions' }
    ]
  },
  {
    id: 'automation-testing',
    name: 'Automation & API Testing',
    category: 'Core Engineering',
    icon: 'Terminal',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'End-to-End Automation Frameworks' },
      { title: 'REST API Automated Contract Validation' },
      { title: 'Headless CI Test Execution & Flaky Test Triage' }
    ]
  },
  {
    id: 'ui-design-systems',
    name: 'UI Design Systems & Tokens',
    category: 'Design & Product',
    icon: 'Layout',
    benchmarkScore: 78,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Design Tokens, Color Palettes & Typography Scales' },
      { title: 'WCAG 2.1 AA Accessibility Standards' },
      { title: 'Responsive Layout Grids & Micro-Interactions' }
    ]
  },
  {
    id: 'smart-contracts',
    name: 'Smart Contracts & Web3',
    category: 'Decentralized Systems',
    icon: 'CodeXml',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Solidity Syntax, Memory vs Storage & Gas Hygiene' },
      { title: 'Reentrancy Attacks & Defensive Mutex Guards' },
      { title: 'EVM State Machine, Events & ERC Standards' }
    ]
  },
  {
    id: 'embedded-rtos',
    name: 'Embedded Systems & RTOS',
    category: 'Systems & Hardware',
    icon: 'Cpu',
    benchmarkScore: 80,
    hasAssessment: false,
    status: 'Assessment In Development',
    concepts: [
      { title: 'Real-Time Task Scheduling, Mutexes & Semaphores' },
      { title: 'Interrupt Service Routines (ISR) & Timers' },
      { title: 'Memory-Mapped I/O & Low-Level Hardware Protocols' }
    ]
  }
];

export const canonicalExtensionSkills = rawExtensionSkills.map((s) => {
  const meta = extensionSkillMeta[s.id] || {};
  return {
    ...s,
    skillType: meta.skillType || 'domain-competency',
    skillTypeLabel: meta.skillTypeLabel || 'Technical Competency',
    categoryGroup: meta.categoryGroup || 'all',
    isExecutable: meta.isExecutable ?? false,
    editorLanguage: null,
    editorFile: null,
  };
});

// Category Group Definitions for Skill Filtering
export const SKILL_CATEGORIES = [
  { id: 'all', label: 'All Skills' },
  { id: 'programming-languages', label: 'Programming Languages' },
  { id: 'frameworks-stacks', label: 'Frameworks & Stacks' },
  { id: 'query-data', label: 'Query & Data' },
  { id: 'cloud-infrastructure', label: 'Cloud & Infrastructure' },
  { id: 'security-systems', label: 'Security & Systems' },
];

export const getSkillTypeLabel = (skillOrType) => {
  if (!skillOrType) return 'Technical Competency';
  if (typeof skillOrType === 'object' && skillOrType.skillTypeLabel) return skillOrType.skillTypeLabel;
  const type = typeof skillOrType === 'object' ? skillOrType.skillType : skillOrType;
  switch (type) {
    case 'programming-language':
      return 'Programming Language';
    case 'query-language':
      return 'Query Language';
    case 'markup-styling':
      return 'Markup & Styling';
    case 'framework-stack':
      return 'Engineering Stack';
    case 'infrastructure-tools':
      return 'Infrastructure & Tools';
    case 'security-systems':
      return 'Security & Systems';
    case 'domain-competency':
    default:
      return 'Technical Competency';
  }
};

// Central Combined Master Skills Directory
export const masterSkillsCatalogue = [...baseAssessedSkills, ...canonicalExtensionSkills];

// Quick index map for O(1) lookup
export const skillsById = new Map(masterSkillsCatalogue.map((s) => [s.id.toLowerCase(), s]));

export const getSkillById = (skillId) => {
  if (!skillId) return null;
  const clean = String(skillId).toLowerCase().trim();
  return skillsById.get(clean) || masterSkillsCatalogue.find((s) => s.name.toLowerCase() === clean) || null;
};

// =========================================================================
// 3. Domain -> Core Skills Mapping
// =========================================================================
// Maps each canonical Domain to its required technical skills
export const domainSkillsMapping = {
  'cs-software-dev': ['python', 'c', 'cpp', 'java', 'backend', 'git-version-control', 'sql'],
  'ibm-enterprise-tech': ['java', 'backend', 'sql', 'rest-apis', 'docker-containers', 'cloud-fundamentals'],
  'cybersecurity': ['network-security', 'linux-systems', 'cybersecurity-fundamentals', 'web-security', 'python', 'auth-iam', 'cryptography', 'vulnerability-assessment'],
  'data-science': ['python', 'sql', 'statistics', 'pandas', 'numpy', 'dataanalytics', 'machine-learning', 'data-visualization'],
  'ai-ml': ['python', 'machine-learning', 'deep-learning', 'numpy', 'pandas', 'statistics', 'model-evaluation', 'sql'],
  'web-development': ['htmlcss', 'javascript', 'frontend', 'backend', 'typescript', 'sql', 'rest-apis', 'git-version-control'],
  'app-development': ['javascript', 'frontend', 'typescript', 'rest-apis', 'ui-design-systems', 'git-version-control'],
  'cloud-computing': ['cloud-fundamentals', 'docker-containers', 'kubernetes', 'linux-systems', 'backend', 'network-security', 'cicd-automation'],
  'devops': ['cicd-automation', 'docker-containers', 'kubernetes', 'linux-systems', 'git-version-control', 'backend', 'cloud-fundamentals'],
  'data-engineering': ['sql', 'python', 'etl-pipelines', 'data-warehousing', 'backend', 'docker-containers', 'linux-systems'],
  'database-sql': ['sql', 'data-warehousing', 'backend', 'python', 'dataanalytics', 'rest-apis'],
  'networking': ['network-security', 'linux-systems', 'cloud-fundamentals', 'python', 'cybersecurity-fundamentals'],
  'uiux-design': ['ui-design-systems', 'htmlcss', 'frontend', 'javascript'],
  'blockchain-web3': ['smart-contracts', 'javascript', 'backend', 'cryptography', 'git-version-control'],
  'iot-embedded': ['c', 'cpp', 'embedded-rtos', 'linux-systems', 'python', 'network-security'],
  'qa-software-testing': ['qa-testing-fundamentals', 'automation-testing', 'javascript', 'python', 'sql', 'git-version-control'],
  'business-product-mgmt': ['dataanalytics', 'sql', 'ui-design-systems', 'rest-apis', 'qa-testing-fundamentals'],
  'other': ['python', 'javascript', 'sql', 'git-version-control', 'backend']
};

// =========================================================================
// 4. Dynamic Recommendation Algorithm based on Student Persona
// =========================================================================
export const getRecommendedSkillsForStudent = ({
  domainId,
  primaryDomain = 'Computer Science / Software Development',
  secondaryDomains = [],
  targetRoleId,
  targetRole = 'Full Stack Developer',
} = {}) => {
  const resultIds = new Set();
  const orderedSkills = [];

  const addSkill = (skillId, priorityBadge = '') => {
    if (!skillId) return;
    const cleanId = String(skillId).toLowerCase().trim();
    if (resultIds.has(cleanId)) return;

    const skill = getSkillById(cleanId);
    if (skill) {
      resultIds.add(cleanId);
      orderedSkills.push({
        ...skill,
        recommendationReason: priorityBadge || 'Recommended for Your Track',
      });
    }
  };

  // PRIORITY 1: Career Track specific core skills (Authoritative single source of truth from careerRolesData.js)
  const canonicalRole = getCareerRoleByTitle(targetRoleId || targetRole);
  if (canonicalRole && Array.isArray(canonicalRole.requiredSkills)) {
    canonicalRole.requiredSkills.forEach((req) => {
      addSkill(req.id, 'Core Track Skill');
    });
  }

  // PRIORITY 2: Domain-required skills (Resolved via canonical domain ID)
  const canonicalDomain = getDomainByIdOrName(domainId || primaryDomain);
  const matchedDomainKey = canonicalDomain ? canonicalDomain.id : 'cs-software-dev';
  const domainSkills = domainSkillsMapping[matchedDomainKey] || domainSkillsMapping['cs-software-dev'];
  domainSkills.forEach((s) => addSkill(s, 'Domain Requirement'));

  // PRIORITY 3: Secondary Domains skills mapping
  if (Array.isArray(secondaryDomains)) {
    secondaryDomains.forEach((sec) => {
      const cleanSec = String(sec).toLowerCase();
      if (cleanSec.includes('deep learning') || cleanSec.includes('neural')) addSkill('deep-learning', 'Specialization Interest');
      if (cleanSec.includes('generative') || cleanSec.includes('llm')) addSkill('model-evaluation', 'Specialization Interest');
      if (cleanSec.includes('statistics') || cleanSec.includes('probability')) addSkill('statistics', 'Specialization Interest');
      if (cleanSec.includes('docker') || cleanSec.includes('container')) addSkill('docker-containers', 'Specialization Interest');
      if (cleanSec.includes('kubernetes')) addSkill('kubernetes', 'Specialization Interest');
      if (cleanSec.includes('ci/cd') || cleanSec.includes('pipeline')) addSkill('cicd-automation', 'Specialization Interest');
      if (cleanSec.includes('penetration') || cleanSec.includes('hacking')) addSkill('vulnerability-assessment', 'Specialization Interest');
      if (cleanSec.includes('cryptography')) addSkill('cryptography', 'Specialization Interest');
      if (cleanSec.includes('etl') || cleanSec.includes('pipeline')) addSkill('etl-pipelines', 'Specialization Interest');
      if (cleanSec.includes('react') || cleanSec.includes('ui framework')) addSkill('frontend', 'Specialization Interest');
      if (cleanSec.includes('test') || cleanSec.includes('tdd')) addSkill('qa-testing-fundamentals', 'Specialization Interest');
      if (cleanSec.includes('api') || cleanSec.includes('rest')) addSkill('rest-apis', 'Specialization Interest');
    });
  }

  // Fallback guarantee: ensure at least 4-8 relevant skills
  if (orderedSkills.length < 4) {
    ['python', 'sql', 'javascript', 'backend', 'git-version-control'].forEach((s) => addSkill(s, 'Foundation Engineering'));
  }

  return orderedSkills;
};
