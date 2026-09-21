// src/data/domainsData.js
// Canonical CSE & Technology Domains Directory for SkillProof

import { getCareerRoleById, getCareerRoleByTitle } from './careerRolesData.js';

export const technologyDomains = [
  {
    id: 'cs-software-dev',
    name: 'Computer Science / Software Development',
    category: 'Core Engineering',
    description: 'Design algorithms, clean modular architectures, data structures, and production-grade software applications.',
    primaryRoleId: 'track-swe',
    primaryRole: 'Software Engineer / Developer',
    suggestedRoleIds: [
      'track-swe',
      'track-fullstack',
      'track-backend'
    ],
    suggestedRoles: [
      'track-swe',
      'track-fullstack',
      'track-backend'
    ],
    suggestedRoleTitles: [
      'Software Engineer / Developer',
      'Full Stack Developer',
      'Backend Developer'
    ],
    suggestedSecondaryInterests: [
      'Data Structures & Algorithms',
      'System Design',
      'Object-Oriented Architecture',
      'API Engineering',
      'Concurrent & Async Programming'
    ]
  },
  {
    id: 'ibm-enterprise-tech',
    name: 'IBM / Enterprise Technology',
    category: 'Enterprise Systems',
    description: 'Mission-critical enterprise software, distributed architectures, mainframe integration, and hybrid cloud solutions.',
    primaryRoleId: 'track-solutions-architect',
    primaryRole: 'Solutions Architect',
    suggestedRoleIds: [
      'track-solutions-architect',
      'track-backend',
      'track-dba'
    ],
    suggestedRoles: [
      'track-solutions-architect',
      'track-backend',
      'track-dba'
    ],
    suggestedRoleTitles: [
      'Solutions Architect',
      'Backend Developer',
      'Database Engineer / DBA'
    ],
    suggestedSecondaryInterests: [
      'Enterprise Architecture',
      'Distributed Systems',
      'Middleware Integration',
      'SOA & Event-Driven Architecture',
      'Legacy Modernization'
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Security & Compliance',
    description: 'Threat modeling, offensive penetration testing, defensive vulnerability mitigation, and secure cryptographic protocols.',
    primaryRoleId: 'track-cybersecurity',
    primaryRole: 'Cybersecurity Engineer / Analyst',
    suggestedRoleIds: [
      'track-cybersecurity',
      'track-network',
      'track-devops'
    ],
    suggestedRoles: [
      'track-cybersecurity',
      'track-network',
      'track-devops'
    ],
    suggestedRoleTitles: [
      'Cybersecurity Engineer / Analyst',
      'Network Engineer',
      'DevOps Engineer'
    ],
    suggestedSecondaryInterests: [
      'Ethical Hacking & Pen Testing',
      'Network Security & Firewalls',
      'SOC & Threat Hunting',
      'Cryptography & PKI',
      'Identity & Access Management (IAM)'
    ]
  },
  {
    id: 'data-science',
    name: 'Data Science',
    category: 'Data & Analytics',
    description: 'Transform complex business datasets into predictive statistical models, exploratory insights, and quantitative intelligence.',
    primaryRoleId: 'track-data-scientist',
    primaryRole: 'Data Scientist',
    suggestedRoleIds: [
      'track-data-scientist',
      'track-data-analyst',
      'track-ml-eng'
    ],
    suggestedRoles: [
      'track-data-scientist',
      'track-data-analyst',
      'track-ml-eng'
    ],
    suggestedRoleTitles: [
      'Data Scientist',
      'Data Analyst',
      'Machine Learning Engineer'
    ],
    suggestedSecondaryInterests: [
      'Statistical Analysis',
      'Data Visualization',
      'Feature Engineering',
      'Predictive Modeling',
      'Hypothesis Testing & Experimentation'
    ]
  },
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & Machine Learning',
    category: 'Artificial Intelligence',
    description: 'Train neural architectures, optimize deep learning pipelines, generative models, and deploy scalable inference services.',
    primaryRoleId: 'track-ai-eng',
    primaryRole: 'AI Engineer',
    suggestedRoleIds: [
      'track-ai-eng',
      'track-ml-eng',
      'track-genai'
    ],
    suggestedRoles: [
      'track-ai-eng',
      'track-ml-eng',
      'track-genai'
    ],
    suggestedRoleTitles: [
      'AI Engineer',
      'Machine Learning Engineer',
      'Generative AI Engineer'
    ],
    suggestedSecondaryInterests: [
      'Deep Learning & Neural Networks',
      'Generative AI & LLMs',
      'Computer Vision',
      'Natural Language Processing (NLP)',
      'MLOps & Model Deployment'
    ]
  },
  {
    id: 'web-development',
    name: 'Web Development',
    category: 'Web Engineering',
    description: 'Build responsive interactive frontends, accessible client interfaces, and high-throughput server backends.',
    primaryRoleId: 'track-fullstack',
    primaryRole: 'Full Stack Developer',
    suggestedRoleIds: [
      'track-fullstack',
      'track-frontend',
      'track-backend'
    ],
    suggestedRoles: [
      'track-fullstack',
      'track-frontend',
      'track-backend'
    ],
    suggestedRoleTitles: [
      'Full Stack Developer',
      'Frontend Developer',
      'Backend Developer'
    ],
    suggestedSecondaryInterests: [
      'React & Modern UI Frameworks',
      'Node.js & RESTful APIs',
      'Web Performance & SEO',
      'GraphQL & State Management',
      'Progressive Web Apps (PWA)'
    ]
  },
  {
    id: 'app-development',
    name: 'App Development',
    category: 'Mobile Engineering',
    description: 'Engineer cross-platform and native mobile apps with smooth tactile interfaces, offline sync, and device sensors.',
    primaryRoleId: 'track-mobile',
    primaryRole: 'Mobile App Developer',
    suggestedRoleIds: [
      'track-mobile',
      'track-frontend',
      'track-fullstack'
    ],
    suggestedRoles: [
      'track-mobile',
      'track-frontend',
      'track-fullstack'
    ],
    suggestedRoleTitles: [
      'Mobile App Developer',
      'Frontend Developer',
      'Full Stack Developer'
    ],
    suggestedSecondaryInterests: [
      'React Native & Flutter',
      'iOS Swift & Android Kotlin',
      'Offline-First Architecture',
      'Mobile UI/UX Design',
      'App Store Optimization & Deployment'
    ]
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    category: 'Cloud & Infrastructure',
    description: 'Provision resilient multi-region cloud infrastructures, serverless compute, container topology, and VPC networks.',
    primaryRoleId: 'track-cloud-eng',
    primaryRole: 'Cloud Engineer',
    suggestedRoleIds: [
      'track-cloud-eng',
      'track-devops',
      'track-solutions-architect'
    ],
    suggestedRoles: [
      'track-cloud-eng',
      'track-devops',
      'track-solutions-architect'
    ],
    suggestedRoleTitles: [
      'Cloud Engineer',
      'DevOps Engineer',
      'Solutions Architect'
    ],
    suggestedSecondaryInterests: [
      'AWS / Azure / GCP Platforms',
      'Serverless Architectures',
      'Cloud Infrastructure as Code (IaC)',
      'Containerization & VPC Networks',
      'Cost Optimization & FinOps'
    ]
  },
  {
    id: 'devops',
    name: 'DevOps',
    category: 'Cloud & Infrastructure',
    description: 'Implement zero-downtime CI/CD automation pipelines, telemetry observability, container orchestration, and reliability.',
    primaryRoleId: 'track-devops',
    primaryRole: 'DevOps Engineer',
    suggestedRoleIds: [
      'track-devops',
      'track-cloud-eng',
      'track-qa'
    ],
    suggestedRoles: [
      'track-devops',
      'track-cloud-eng',
      'track-qa'
    ],
    suggestedRoleTitles: [
      'DevOps Engineer',
      'Cloud Engineer',
      'QA / Automation Engineer'
    ],
    suggestedSecondaryInterests: [
      'Docker & Kubernetes Orchestration',
      'CI/CD Pipeline Automation',
      'Terraform & Infrastructure Code',
      'Prometheus & Grafana Observability',
      'Site Reliability Engineering (SRE)'
    ]
  },
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    category: 'Data & Systems',
    description: 'Design robust streaming data pipelines, distributed extract-load-transform (ELT) jobs, and warehouse lakes.',
    primaryRoleId: 'track-data-eng',
    primaryRole: 'Data Engineer',
    suggestedRoleIds: [
      'track-data-eng',
      'track-dba',
      'track-data-analyst'
    ],
    suggestedRoles: [
      'track-data-eng',
      'track-dba',
      'track-data-analyst'
    ],
    suggestedRoleTitles: [
      'Data Engineer',
      'Database Engineer / DBA',
      'Data Analyst'
    ],
    suggestedSecondaryInterests: [
      'ETL / ELT Pipeline Architecture',
      'Apache Spark & Kafka',
      'Data Warehousing (Snowflake / BigQuery)',
      'Data Lake Storage & Governance',
      'Stream Processing'
    ]
  },
  {
    id: 'database-sql',
    name: 'Database / SQL',
    category: 'Data & Systems',
    description: 'Optimize high-concurrency relational queries, indexing schemes, distributed sharding, replication, and transaction safety.',
    primaryRoleId: 'track-dba',
    primaryRole: 'Database Engineer / DBA',
    suggestedRoleIds: [
      'track-dba',
      'track-data-analyst',
      'track-backend'
    ],
    suggestedRoles: [
      'track-dba',
      'track-data-analyst',
      'track-backend'
    ],
    suggestedRoleTitles: [
      'Database Engineer / DBA',
      'Data Analyst',
      'Backend Developer'
    ],
    suggestedSecondaryInterests: [
      'Advanced SQL & Query Optimization',
      'PostgreSQL & MySQL Administration',
      'NoSQL & Document Databases',
      'Database Sharding & Clustering',
      'ACID & Distributed Consistency'
    ]
  },
  {
    id: 'networking',
    name: 'Networking',
    category: 'Systems & Infrastructure',
    description: 'Manage routing topologies, software-defined networking, firewall packet inspection, subnets, and high-uptime connectivity.',
    primaryRoleId: 'track-network',
    primaryRole: 'Network Engineer',
    suggestedRoleIds: [
      'track-network',
      'track-cybersecurity',
      'track-cloud-eng'
    ],
    suggestedRoles: [
      'track-network',
      'track-cybersecurity',
      'track-cloud-eng'
    ],
    suggestedRoleTitles: [
      'Network Engineer',
      'Cybersecurity Engineer / Analyst',
      'Cloud Engineer'
    ],
    suggestedSecondaryInterests: [
      'TCP/IP Routing & Switching',
      'Software-Defined Networking (SDN)',
      'Network Protocols & Packet Analysis',
      'Firewalls, VPNs & BGP Routing',
      'DNS & CDN Edge Routing'
    ]
  },
  {
    id: 'uiux-design',
    name: 'UI/UX & Product Design',
    category: 'Design & Product',
    description: 'Craft intuitive human-centered design systems, responsive wireframes, design tokens, micro-interactions, and design-to-code.',
    primaryRoleId: 'track-uiux',
    primaryRole: 'UI/UX Designer',
    suggestedRoleIds: [
      'track-uiux',
      'track-frontend',
      'track-pm'
    ],
    suggestedRoles: [
      'track-uiux',
      'track-frontend',
      'track-pm'
    ],
    suggestedRoleTitles: [
      'UI/UX Designer',
      'Frontend Developer',
      'Product Manager / Technical Product Manager'
    ],
    suggestedSecondaryInterests: [
      'Design Systems & Tokens',
      'Interactive Prototyping (Figma)',
      'User Research & Usability Testing',
      'Accessibility (WCAG 2.1)',
      'Information Architecture'
    ]
  },
  {
    id: 'blockchain-web3',
    name: 'Blockchain / Web3',
    category: 'Systems & Decentralized',
    description: 'Develop immutable smart contracts, decentralized applications (dApps), cryptographic zero-knowledge protocols, and DeFi.',
    primaryRoleId: 'track-blockchain',
    primaryRole: 'Blockchain / Web3 Developer',
    suggestedRoleIds: [
      'track-blockchain',
      'track-swe',
      'track-fullstack'
    ],
    suggestedRoles: [
      'track-blockchain',
      'track-swe',
      'track-fullstack'
    ],
    suggestedRoleTitles: [
      'Blockchain / Web3 Developer',
      'Software Engineer / Developer',
      'Full Stack Developer'
    ],
    suggestedSecondaryInterests: [
      'Solidity & EVM Smart Contracts',
      'dApp Frontend Web3 Integration',
      'Zero-Knowledge Proofs',
      'DeFi & Consensus Mechanisms',
      'Web3 Smart Contract Auditing'
    ]
  },
  {
    id: 'iot-embedded',
    name: 'IoT / Embedded Systems',
    category: 'Systems & Hardware',
    description: 'Program real-time operating systems (RTOS), telemetry sensors, microcontrollers, low-power edge compute, and firmware.',
    primaryRoleId: 'track-iot-embedded',
    primaryRole: 'Embedded / IoT Engineer',
    suggestedRoleIds: [
      'track-iot-embedded',
      'track-network',
      'track-swe'
    ],
    suggestedRoles: [
      'track-iot-embedded',
      'track-network',
      'track-swe'
    ],
    suggestedRoleTitles: [
      'Embedded / IoT Engineer',
      'Network Engineer',
      'Software Engineer / Developer'
    ],
    suggestedSecondaryInterests: [
      'Microcontroller Programming (ARM, ESP32)',
      'Real-Time Operating Systems (RTOS)',
      'MQTT & Low-Power IoT Protocols',
      'Edge AI & Hardware Interfaces',
      'Firmware Security'
    ]
  },
  {
    id: 'qa-software-testing',
    name: 'Software Testing / QA',
    category: 'Core Engineering',
    description: 'Develop automated integration, regression, load, and unit test suites across frontend and API boundary contracts.',
    primaryRoleId: 'track-qa',
    primaryRole: 'QA / Automation Engineer',
    suggestedRoleIds: [
      'track-qa',
      'track-swe',
      'track-devops'
    ],
    suggestedRoles: [
      'track-qa',
      'track-swe',
      'track-devops'
    ],
    suggestedRoleTitles: [
      'QA / Automation Engineer',
      'Software Engineer / Developer',
      'DevOps Engineer'
    ],
    suggestedSecondaryInterests: [
      'End-to-End Test Automation (Cypress, Playwright)',
      'API Testing & Contract Validation',
      'Performance, Load & Stress Testing',
      'Test-Driven Development (TDD)',
      'Continuous Quality Assurance'
    ]
  },
  {
    id: 'business-product-mgmt',
    name: 'Business / Product / Technology Management',
    category: 'Design & Strategy',
    description: 'Define technical roadmaps, product requirements, user outcome metrics, and align engineering sprints to market delivery.',
    primaryRoleId: 'track-pm',
    primaryRole: 'Product Manager / Technical Product Manager',
    suggestedRoleIds: [
      'track-pm',
      'track-ba',
      'track-solutions-architect'
    ],
    suggestedRoles: [
      'track-pm',
      'track-ba',
      'track-solutions-architect'
    ],
    suggestedRoleTitles: [
      'Product Manager / Technical Product Manager',
      'Business Analyst',
      'Solutions Architect'
    ],
    suggestedSecondaryInterests: [
      'Product Roadmapping & PRD Creation',
      'Agile / Scrum Product Ownership',
      'User Metrics & Growth Analytics',
      'Market & Competitive Research',
      'Stakeholder Communication'
    ]
  },
  {
    id: 'other',
    name: 'Other',
    category: 'General Technology',
    description: 'Emerging technology fields, interdisciplinary engineering, open-source development, and specialized technical domains.',
    primaryRoleId: 'track-swe',
    primaryRole: 'Software Engineer / Developer',
    suggestedRoleIds: [
      'track-swe',
      'track-fullstack'
    ],
    suggestedRoles: [
      'track-swe',
      'track-fullstack'
    ],
    suggestedRoleTitles: [
      'Software Engineer / Developer',
      'Full Stack Developer'
    ],
    suggestedSecondaryInterests: [
      'Open Source Contribution',
      'Emerging Technologies',
      'Computational Research',
      'Developer Tooling',
      'Technical Communication'
    ]
  }
];

export const defaultPrimaryDomainId = technologyDomains[0].id;
export const defaultPrimaryDomain = technologyDomains[0].name;

export const getDomainById = (domainId) => {
  if (!domainId) return technologyDomains[0];
  const clean = String(domainId).toLowerCase().trim();
  return technologyDomains.find((d) => d.id.toLowerCase() === clean) || null;
};

export const getDomainByIdOrName = (identifier) => {
  if (!identifier) return technologyDomains[0];
  const clean = String(identifier).toLowerCase().trim();
  return (
    technologyDomains.find((d) => d.id.toLowerCase() === clean) ||
    technologyDomains.find((d) => d.name.toLowerCase() === clean) ||
    technologyDomains.find((d) => clean.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(clean)) ||
    technologyDomains[0]
  );
};

export const getDomainByName = (domainName) => {
  return getDomainByIdOrName(domainName);
};

export const getSuggestedRolesForDomain = (domainIdentifier) => {
  const domain = getDomainByIdOrName(domainIdentifier);
  return domain ? domain.suggestedRoles : [technologyDomains[0].primaryRoleId];
};

export const getSuggestedRoleIdsForDomain = (domainIdentifier) => {
  const domain = getDomainByIdOrName(domainIdentifier);
  return domain ? (domain.suggestedRoleIds || domain.suggestedRoles) : [technologyDomains[0].primaryRoleId];
};

export const getSuggestedRoleTitlesForDomain = (domainIdentifier) => {
  const domain = getDomainByIdOrName(domainIdentifier);
  if (!domain) return [technologyDomains[0].primaryRole];
  if (domain.suggestedRoleTitles) return domain.suggestedRoleTitles;
  const ids = domain.suggestedRoleIds || domain.suggestedRoles;
  return ids.map((id) => (getCareerRoleById(id) || getCareerRoleByTitle(id))?.title).filter(Boolean);
};

export const getSuggestedCareerTracksForDomain = (domainIdentifier) => {
  const domain = getDomainByIdOrName(domainIdentifier);
  if (!domain) return [getCareerRoleById(technologyDomains[0].primaryRoleId)];
  const ids = domain.suggestedRoleIds || domain.suggestedRoles;
  return ids.map((id) => getCareerRoleById(id) || getCareerRoleByTitle(id)).filter(Boolean);
};

export const getSecondaryInterestsForDomain = (domainIdentifier) => {
  const domain = getDomainByIdOrName(domainIdentifier);
  return domain ? domain.suggestedSecondaryInterests : technologyDomains[0].suggestedSecondaryInterests;
};
