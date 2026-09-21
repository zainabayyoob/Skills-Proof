// src/data/careerRolesData.js
// Focused Canonical Technology Career Tracks for SkillProof

export const comprehensiveCareerRoles = [
  {
    id: 'track-swe',
    title: 'Software Engineer / Developer',
    category: 'Core Engineering',
    demand: 'Critical',
    avgStipend: '₹50,000 / mo',
    description: 'Design algorithms, clean modular architectures, data structures, and production-grade software applications.',
    requiredSkills: [
      { id: 'python', name: 'Python', minScore: 80 },
      { id: 'cpp', name: 'C++', minScore: 80 },
      { id: 'sql', name: 'SQL', minScore: 75 },
      { id: 'backend', name: 'Backend', minScore: 75 },
      { id: 'javascript', name: 'JavaScript', minScore: 75 },
      { id: 'git-version-control', name: 'Git & Version Control', minScore: 75 }
    ]
  },
  {
    id: 'track-fullstack',
    title: 'Full Stack Developer',
    category: 'Web Engineering',
    demand: 'Very High',
    avgStipend: '₹45,000 / mo',
    description: 'Build complete web platforms with responsive modern frontends, high-throughput REST APIs, and database models.',
    requiredSkills: [
      { id: 'frontend', name: 'Frontend', minScore: 80 },
      { id: 'backend', name: 'Backend', minScore: 80 },
      { id: 'javascript', name: 'JavaScript', minScore: 80 },
      { id: 'htmlcss', name: 'HTML / CSS', minScore: 75 },
      { id: 'sql', name: 'SQL', minScore: 75 },
      { id: 'rest-apis', name: 'REST APIs & Architecture', minScore: 75 },
      { id: 'git-version-control', name: 'Git & Version Control', minScore: 75 }
    ]
  },
  {
    id: 'track-frontend',
    title: 'Frontend Developer',
    category: 'Web Engineering',
    demand: 'High',
    avgStipend: '₹40,000 / mo',
    description: 'Engineer interactive user experiences, accessibility, performance optimization, and modular state workflows.',
    requiredSkills: [
      { id: 'frontend', name: 'Frontend', minScore: 85 },
      { id: 'javascript', name: 'JavaScript', minScore: 85 },
      { id: 'htmlcss', name: 'HTML / CSS', minScore: 80 },
      { id: 'typescript', name: 'TypeScript', minScore: 80 },
      { id: 'ui-design-systems', name: 'UI Design Systems & Tokens', minScore: 75 },
      { id: 'rest-apis', name: 'REST APIs & Architecture', minScore: 75 }
    ]
  },
  {
    id: 'track-backend',
    title: 'Backend Developer',
    category: 'Systems & Cloud',
    demand: 'Critical',
    avgStipend: '₹48,000 / mo',
    description: 'Architect distributed microservices, caching layers, resilient authentication, and high-concurrency database queries.',
    requiredSkills: [
      { id: 'backend', name: 'Backend', minScore: 85 },
      { id: 'sql', name: 'SQL', minScore: 80 },
      { id: 'python', name: 'Python', minScore: 80 },
      { id: 'java', name: 'Java', minScore: 78 },
      { id: 'rest-apis', name: 'REST APIs & Architecture', minScore: 80 },
      { id: 'docker-containers', name: 'Docker & Containerization', minScore: 75 },
      { id: 'auth-iam', name: 'Authentication & Access Control', minScore: 75 }
    ]
  },
  {
    id: 'track-mobile',
    title: 'Mobile App Developer',
    category: 'Mobile Engineering',
    demand: 'High',
    avgStipend: '₹42,000 / mo',
    description: 'Develop performant cross-platform and native mobile applications with smooth gestures, offline caching, and native APIs.',
    requiredSkills: [
      { id: 'frontend', name: 'Frontend', minScore: 80 },
      { id: 'javascript', name: 'JavaScript', minScore: 80 },
      { id: 'typescript', name: 'TypeScript', minScore: 78 },
      { id: 'rest-apis', name: 'REST APIs & Architecture', minScore: 75 },
      { id: 'ui-design-systems', name: 'UI Design Systems & Tokens', minScore: 75 }
    ]
  },
  {
    id: 'track-data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    demand: 'Very High',
    avgStipend: '₹38,000 / mo',
    description: 'Transform complex business datasets into actionable operational intelligence through statistical modeling and SQL analytics.',
    requiredSkills: [
      { id: 'sql', name: 'SQL', minScore: 85 },
      { id: 'dataanalytics', name: 'Data Analytics', minScore: 82 },
      { id: 'python', name: 'Python', minScore: 78 },
      { id: 'pandas', name: 'Pandas', minScore: 78 },
      { id: 'data-visualization', name: 'Data Visualization', minScore: 75 },
      { id: 'statistics', name: 'Statistics & Probability', minScore: 75 }
    ]
  },
  {
    id: 'track-data-scientist',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    demand: 'Very High',
    avgStipend: '₹55,000 / mo',
    description: 'Build predictive statistical models, feature extraction pipelines, exploratory analytics, and machine learning experiments.',
    requiredSkills: [
      { id: 'python', name: 'Python', minScore: 85 },
      { id: 'machine-learning', name: 'Machine Learning', minScore: 82 },
      { id: 'statistics', name: 'Statistics & Probability', minScore: 80 },
      { id: 'pandas', name: 'Pandas', minScore: 80 },
      { id: 'sql', name: 'SQL', minScore: 80 },
      { id: 'numpy', name: 'NumPy', minScore: 78 },
      { id: 'dataanalytics', name: 'Data Analytics', minScore: 75 }
    ]
  },
  {
    id: 'track-data-eng',
    title: 'Data Engineer',
    category: 'Data & Analytics',
    demand: 'Critical',
    avgStipend: '₹52,000 / mo',
    description: 'Design streaming data pipelines, distributed extract-load-transform (ELT) architectures, and real-time data warehouses.',
    requiredSkills: [
      { id: 'sql', name: 'SQL', minScore: 85 },
      { id: 'python', name: 'Python', minScore: 82 },
      { id: 'etl-pipelines', name: 'ETL / ELT & Data Pipelines', minScore: 80 },
      { id: 'data-warehousing', name: 'Data Warehousing & Modeling', minScore: 80 },
      { id: 'backend', name: 'Backend', minScore: 75 },
      { id: 'docker-containers', name: 'Docker & Containerization', minScore: 75 }
    ]
  },
  {
    id: 'track-ai-eng',
    title: 'AI Engineer',
    category: 'Artificial Intelligence',
    demand: 'Critical',
    avgStipend: '₹58,000 / mo',
    description: 'Deploy intelligent neural architectures, model evaluation harnesses, multimodal pipelines, and production inference APIs.',
    requiredSkills: [
      { id: 'python', name: 'Python', minScore: 85 },
      { id: 'machine-learning', name: 'Machine Learning', minScore: 85 },
      { id: 'deep-learning', name: 'Deep Learning & Neural Networks', minScore: 82 },
      { id: 'numpy', name: 'NumPy', minScore: 80 },
      { id: 'model-evaluation', name: 'Model Evaluation & Metrics', minScore: 80 },
      { id: 'backend', name: 'Backend', minScore: 75 },
      { id: 'sql', name: 'SQL', minScore: 75 }
    ]
  },
  {
    id: 'track-ml-eng',
    title: 'Machine Learning Engineer',
    category: 'Artificial Intelligence',
    demand: 'Critical',
    avgStipend: '₹55,000 / mo',
    description: 'Train, fine-tune, optimize, and serve scalable machine learning models with automated MLOps CI/CD pipelines.',
    requiredSkills: [
      { id: 'python', name: 'Python', minScore: 85 },
      { id: 'machine-learning', name: 'Machine Learning', minScore: 85 },
      { id: 'pandas', name: 'Pandas', minScore: 82 },
      { id: 'numpy', name: 'NumPy', minScore: 80 },
      { id: 'statistics', name: 'Statistics & Probability', minScore: 80 },
      { id: 'model-evaluation', name: 'Model Evaluation & Metrics', minScore: 80 },
      { id: 'deep-learning', name: 'Deep Learning & Neural Networks', minScore: 78 }
    ]
  },
  {
    id: 'track-genai',
    title: 'Generative AI Engineer',
    category: 'Artificial Intelligence',
    demand: 'Critical',
    avgStipend: '₹60,000 / mo',
    description: 'Architect retrieval-augmented generation (RAG) systems, vector database search, tool-calling agents, and fine-tuning.',
    requiredSkills: [
      { id: 'python', name: 'Python', minScore: 85 },
      { id: 'deep-learning', name: 'Deep Learning & Neural Networks', minScore: 85 },
      { id: 'machine-learning', name: 'Machine Learning', minScore: 82 },
      { id: 'model-evaluation', name: 'Model Evaluation & Metrics', minScore: 80 },
      { id: 'backend', name: 'Backend', minScore: 78 },
      { id: 'javascript', name: 'JavaScript', minScore: 75 }
    ]
  },
  {
    id: 'track-cybersecurity',
    title: 'Cybersecurity Engineer / Analyst',
    category: 'Security & Compliance',
    demand: 'Critical',
    avgStipend: '₹50,000 / mo',
    description: 'Conduct threat modeling, penetration testing, defensive vulnerability patching, and secure identity infrastructure.',
    requiredSkills: [
      { id: 'network-security', name: 'Network Security', minScore: 82 },
      { id: 'linux-systems', name: 'Linux & Shell Scripting', minScore: 80 },
      { id: 'cybersecurity-fundamentals', name: 'Cybersecurity Fundamentals', minScore: 82 },
      { id: 'web-security', name: 'Web Application Security', minScore: 80 },
      { id: 'auth-iam', name: 'Authentication & Access Control', minScore: 80 },
      { id: 'python', name: 'Python', minScore: 78 },
      { id: 'cryptography', name: 'Cryptography Fundamentals', minScore: 75 },
      { id: 'vulnerability-assessment', name: 'Vulnerability Assessment', minScore: 75 }
    ]
  },
  {
    id: 'track-cloud-eng',
    title: 'Cloud Engineer',
    category: 'Cloud & Infrastructure',
    demand: 'Very High',
    avgStipend: '₹48,000 / mo',
    description: 'Provision automated cloud infrastructure, serverless compute, containerization, VPC networks, and cost monitoring.',
    requiredSkills: [
      { id: 'cloud-fundamentals', name: 'Cloud Architecture', minScore: 82 },
      { id: 'docker-containers', name: 'Docker & Containerization', minScore: 80 },
      { id: 'kubernetes', name: 'Kubernetes Orchestration', minScore: 78 },
      { id: 'linux-systems', name: 'Linux & Shell Scripting', minScore: 80 },
      { id: 'backend', name: 'Backend', minScore: 78 },
      { id: 'network-security', name: 'Network Security', minScore: 75 }
    ]
  },
  {
    id: 'track-devops',
    title: 'DevOps Engineer',
    category: 'Cloud & Infrastructure',
    demand: 'Very High',
    avgStipend: '₹50,000 / mo',
    description: 'Implement zero-downtime CI/CD pipelines, container orchestration, automated testing gates, and telemetry monitors.',
    requiredSkills: [
      { id: 'cicd-automation', name: 'CI/CD Automation', minScore: 82 },
      { id: 'docker-containers', name: 'Docker & Containerization', minScore: 82 },
      { id: 'kubernetes', name: 'Kubernetes Orchestration', minScore: 80 },
      { id: 'linux-systems', name: 'Linux & Shell Scripting', minScore: 80 },
      { id: 'git-version-control', name: 'Git & Version Control', minScore: 80 },
      { id: 'backend', name: 'Backend', minScore: 75 },
      { id: 'cloud-fundamentals', name: 'Cloud Architecture', minScore: 75 }
    ]
  },
  {
    id: 'track-dba',
    title: 'Database Engineer / DBA',
    category: 'Data & Systems',
    demand: 'High',
    avgStipend: '₹46,000 / mo',
    description: 'Optimize complex relational execution plans, indexing strategies, replication, shard clustering, and zero-loss backups.',
    requiredSkills: [
      { id: 'sql', name: 'SQL', minScore: 90 },
      { id: 'data-warehousing', name: 'Data Warehousing & Modeling', minScore: 85 },
      { id: 'backend', name: 'Backend', minScore: 78 },
      { id: 'python', name: 'Python', minScore: 75 },
      { id: 'dataanalytics', name: 'Data Analytics', minScore: 75 }
    ]
  },
  {
    id: 'track-qa',
    title: 'QA / Automation Engineer',
    category: 'Core Engineering',
    demand: 'High',
    avgStipend: '₹38,000 / mo',
    description: 'Develop automated integration, regression, load, and unit test suites across frontend and API boundary contracts.',
    requiredSkills: [
      { id: 'qa-testing-fundamentals', name: 'Software Testing & TDD', minScore: 85 },
      { id: 'automation-testing', name: 'Automation & API Testing', minScore: 82 },
      { id: 'javascript', name: 'JavaScript', minScore: 80 },
      { id: 'python', name: 'Python', minScore: 78 },
      { id: 'sql', name: 'SQL', minScore: 72 },
      { id: 'git-version-control', name: 'Git & Version Control', minScore: 75 }
    ]
  },
  {
    id: 'track-uiux',
    title: 'UI/UX Designer',
    category: 'Design & Product',
    demand: 'High',
    avgStipend: '₹40,000 / mo',
    description: 'Craft intuitive design systems, interactive prototypes, design tokens, micro-interactions, and design-to-code components.',
    requiredSkills: [
      { id: 'ui-design-systems', name: 'UI Design Systems & Tokens', minScore: 85 },
      { id: 'htmlcss', name: 'HTML / CSS', minScore: 80 },
      { id: 'frontend', name: 'Frontend', minScore: 72 },
      { id: 'javascript', name: 'JavaScript', minScore: 70 }
    ]
  },
  {
    id: 'track-pm',
    title: 'Product Manager / Technical Product Manager',
    category: 'Design & Product',
    demand: 'High',
    avgStipend: '₹52,000 / mo',
    description: 'Define technical roadmaps, product requirements, user outcome metrics, and align engineering sprints to market delivery.',
    requiredSkills: [
      { id: 'dataanalytics', name: 'Data Analytics', minScore: 80 },
      { id: 'sql', name: 'SQL', minScore: 75 },
      { id: 'ui-design-systems', name: 'UI Design Systems & Tokens', minScore: 75 },
      { id: 'rest-apis', name: 'REST APIs & Architecture', minScore: 72 },
      { id: 'qa-testing-fundamentals', name: 'Software Testing & TDD', minScore: 70 }
    ]
  },
  {
    id: 'track-ba',
    title: 'Business Analyst',
    category: 'Data & Strategy',
    demand: 'High',
    avgStipend: '₹40,000 / mo',
    description: 'Bridge business requirements with engineering delivery through structured process modeling, SQL queries, and KPI analysis.',
    requiredSkills: [
      { id: 'sql', name: 'SQL', minScore: 82 },
      { id: 'dataanalytics', name: 'Data Analytics', minScore: 82 },
      { id: 'data-visualization', name: 'Data Visualization', minScore: 78 },
      { id: 'python', name: 'Python', minScore: 72 },
      { id: 'statistics', name: 'Statistics & Probability', minScore: 72 }
    ]
  },
  {
    id: 'track-solutions-architect',
    title: 'Solutions Architect',
    category: 'Systems & Cloud',
    demand: 'Critical',
    avgStipend: '₹65,000 / mo',
    description: 'Synthesize complex business requirements into enterprise-wide technical architectures, cloud topology, and SLA governance.',
    requiredSkills: [
      { id: 'cloud-fundamentals', name: 'Cloud Architecture', minScore: 82 },
      { id: 'backend', name: 'Backend', minScore: 82 },
      { id: 'rest-apis', name: 'REST APIs & Architecture', minScore: 82 },
      { id: 'docker-containers', name: 'Docker & Containerization', minScore: 80 },
      { id: 'sql', name: 'SQL', minScore: 80 },
      { id: 'python', name: 'Python', minScore: 78 }
    ]
  },
  {
    id: 'track-iot-embedded',
    title: 'Embedded / IoT Engineer',
    category: 'Systems & Hardware',
    demand: 'High',
    avgStipend: '₹45,000 / mo',
    description: 'Program microcontrollers, real-time operating systems (RTOS), telemetry sensors, firmware security, and IoT cloud protocols.',
    requiredSkills: [
      { id: 'c', name: 'C', minScore: 85 },
      { id: 'cpp', name: 'C++', minScore: 82 },
      { id: 'embedded-rtos', name: 'Embedded Systems & RTOS', minScore: 80 },
      { id: 'linux-systems', name: 'Linux & Shell Scripting', minScore: 78 },
      { id: 'python', name: 'Python', minScore: 75 },
      { id: 'network-security', name: 'Network Security', minScore: 72 }
    ]
  },
  {
    id: 'track-network',
    title: 'Network Engineer',
    category: 'Systems & Cloud',
    demand: 'High',
    avgStipend: '₹42,000 / mo',
    description: 'Manage routing protocols, software-defined networking (SDN), firewall topology, packet inspection, and high-uptime links.',
    requiredSkills: [
      { id: 'network-security', name: 'Network Security', minScore: 85 },
      { id: 'linux-systems', name: 'Linux & Shell Scripting', minScore: 80 },
      { id: 'cloud-fundamentals', name: 'Cloud Architecture', minScore: 75 },
      { id: 'python', name: 'Python', minScore: 75 },
      { id: 'cybersecurity-fundamentals', name: 'Cybersecurity Fundamentals', minScore: 75 }
    ]
  },
  {
    id: 'track-blockchain',
    title: 'Blockchain / Web3 Developer',
    category: 'Systems & Decentralized',
    demand: 'High',
    avgStipend: '₹50,000 / mo',
    description: 'Develop immutable smart contracts, decentralized applications (dApps), cryptography protocols, and EVM integration.',
    requiredSkills: [
      { id: 'smart-contracts', name: 'Smart Contracts & Web3', minScore: 85 },
      { id: 'javascript', name: 'JavaScript', minScore: 82 },
      { id: 'cryptography', name: 'Cryptography Fundamentals', minScore: 80 },
      { id: 'backend', name: 'Backend', minScore: 78 },
      { id: 'frontend', name: 'Frontend', minScore: 75 },
      { id: 'git-version-control', name: 'Git & Version Control', minScore: 75 }
    ]
  }
];

export const getCareerRoleByTitle = (titleOrId) => {
  if (!titleOrId) return comprehensiveCareerRoles[0];
  const clean = String(titleOrId).toLowerCase().trim();

  // 1. Direct ID match
  const byId = comprehensiveCareerRoles.find((r) => r.id.toLowerCase() === clean);
  if (byId) return byId;

  // 2. Direct exact Title match
  const byExactTitle = comprehensiveCareerRoles.find((r) => r.title.toLowerCase() === clean);
  if (byExactTitle) return byExactTitle;

  // 3. Substring inclusion
  const bySubstring = comprehensiveCareerRoles.find(
    (r) => clean.includes(r.title.toLowerCase()) || r.title.toLowerCase().includes(clean)
  );
  if (bySubstring) return bySubstring;

  // 4. Industry aliases and composite titles
  if (clean.includes('full stack') || clean.includes('fullstack')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-fullstack') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('frontend') || clean.includes('front end') || clean.includes('ui developer')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-frontend') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('backend') || clean.includes('back end')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-backend') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('mobile') || clean.includes('android') || clean.includes('ios') || clean.includes('flutter')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-mobile') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('genai') || clean.includes('generative ai') || clean.includes('llm')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-genai') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('ml engineer') || clean.includes('machine learning')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-ml-eng') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('ai engineer') || clean.includes('artificial intelligence')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-ai-eng') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('data analyst') || clean.includes('business analyst')) {
    if (clean.includes('business')) return comprehensiveCareerRoles.find((r) => r.id === 'track-ba') || comprehensiveCareerRoles[0];
    return comprehensiveCareerRoles.find((r) => r.id === 'track-data-analyst') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('data scientist')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-data-scientist') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('data engineer')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-data-eng') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('cyber') || clean.includes('security')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-cybersecurity') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('enterprise application') || clean.includes('enterprise developer')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-backend') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('security analyst')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-cybersecurity') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('devops') || clean.includes('sre') || clean.includes('reliability') || clean.includes('site reliability')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-devops') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('architect')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-solutions-architect') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('cloud')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-cloud-eng') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('database') || clean.includes('dba') || clean.includes('sql')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-dba') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('qa') || clean.includes('test') || clean.includes('sdet')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-qa') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('ui') || clean.includes('ux') || clean.includes('product design')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-uiux') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('product manager') || clean.includes('technical product') || clean.includes('pm')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-pm') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('embedded') || clean.includes('iot') || clean.includes('firmware')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-iot-embedded') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('network')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-network') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('blockchain') || clean.includes('web3') || clean.includes('crypto')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-blockchain') || comprehensiveCareerRoles[0];
  }
  if (clean.includes('software') || clean.includes('developer') || clean.includes('engineer') || clean.includes('swe') || clean.includes('sde')) {
    return comprehensiveCareerRoles.find((r) => r.id === 'track-swe') || comprehensiveCareerRoles[0];
  }

  return comprehensiveCareerRoles[0];
};

export const defaultCareerRoleId = comprehensiveCareerRoles[0].id;
export const defaultCareerRoleTitle = comprehensiveCareerRoles[0].title;

export const getCareerRoleById = (id) => {
  if (!id) return comprehensiveCareerRoles[0];
  const clean = String(id).toLowerCase().trim();
  return comprehensiveCareerRoles.find((r) => r.id.toLowerCase() === clean) || null;
};
