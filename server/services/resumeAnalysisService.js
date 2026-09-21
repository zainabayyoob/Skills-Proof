// server/services/resumeAnalysisService.js
// Intelligent Resume Content Analysis & Career Track Recommendations for SkillProof

import zlib from 'zlib';
import { getCareerRoleByTitle } from '../data/careerRolesData.js';

// Canonical Technical Skills Dictionary
const KNOWN_SKILLS = [
  { id: 'python', name: 'Python', aliases: ['python3', 'py', 'django', 'fastapi', 'flask'] },
  { id: 'javascript', name: 'JavaScript', aliases: ['js', 'es6', 'ecmascript'] },
  { id: 'typescript', name: 'TypeScript', aliases: ['ts'] },
  { id: 'react', name: 'React', aliases: ['reactjs', 'react.js', 'react native', 'redux'] },
  { id: 'node', name: 'Node.js', aliases: ['node', 'nodejs', 'express', 'expressjs', 'nest', 'nestjs'] },
  { id: 'sql', name: 'SQL', aliases: ['postgres', 'postgresql', 'mysql', 'sqlite', 'rdbms', 'oracle', 'mssql'] },
  { id: 'mongodb', name: 'MongoDB', aliases: ['nosql', 'mongoose'] },
  { id: 'htmlcss', name: 'HTML / CSS', aliases: ['html5', 'css3', 'tailwind', 'bootstrap', 'sass', 'responsive design'] },
  { id: 'docker', name: 'Docker', aliases: ['containerization', 'containers'] },
  { id: 'kubernetes', name: 'Kubernetes', aliases: ['k8s'] },
  { id: 'aws', name: 'AWS', aliases: ['amazon web services', 'ec2', 's3', 'lambda'] },
  { id: 'git', name: 'Git', aliases: ['github', 'version control', 'gitlab'] },
  { id: 'java', name: 'Java', aliases: ['spring', 'springboot', 'jvm'] },
  { id: 'cpp', name: 'C++', aliases: ['c/c++', 'cpp'] },
  { id: 'c', name: 'C', aliases: ['embedded c'] },
  { id: 'ml', name: 'Machine Learning', aliases: ['scikit-learn', 'sklearn', 'ml', 'xgboost'] },
  { id: 'deep-learning', name: 'Deep Learning', aliases: ['pytorch', 'tensorflow', 'keras', 'neural networks'] },
  { id: 'nlp', name: 'Natural Language Processing', aliases: ['nlp', 'transformers', 'bert', 'huggingface', 'llm', 'rag'] },
  { id: 'data-analytics', name: 'Data Analytics', aliases: ['pandas', 'numpy', 'matplotlib', 'seaborn', 'tableau', 'power bi'] },
  { id: 'cybersecurity', name: 'Cybersecurity', aliases: ['penetration testing', 'burp suite', 'owasp', 'cryptography', 'firewall'] },
  { id: 'linux', name: 'Linux', aliases: ['bash', 'shell', 'unix', 'ubuntu'] },
  { id: 'graphql', name: 'GraphQL', aliases: ['apollo'] },
  { id: 'cicd', name: 'CI/CD', aliases: ['github actions', 'jenkins', 'devops'] }
];

export const resumeAnalysisService = {
  /**
   * Extracts text content from resume binary buffer
   */
  extractText(buffer, ext = 'pdf') {
    if (!buffer || buffer.length === 0) return '';

    try {
      if (ext === 'docx') {
        // DOCX is a ZIP archive containing word/document.xml
        // Simple search for XML text streams
        const str = buffer.toString('binary');
        const textMatches = [];
        const regex = /<w:t[^>]*>(.*?)<\/w:t>/g;
        let match;
        while ((match = regex.exec(str)) !== null) {
          if (match[1]) textMatches.push(match[1]);
        }
        if (textMatches.length > 0) return textMatches.join(' ');
      }

      // PDF / Text / Generic buffer extraction
      const raw = buffer.toString('utf8');
      // Filter printable characters and common words
      const cleaned = raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      return cleaned;
    } catch (err) {
      console.warn('Text extraction warning:', err.message);
      return buffer.toString('ascii');
    }
  },

  /**
   * Performs structured analysis of the resume against target role
   */
  async analyzeResume(buffer, ext, targetRole = 'Full Stack Developer') {
    const rawText = this.extractText(buffer, ext).toLowerCase();
    const roleConfig = getCareerRoleByTitle(targetRole);

    // 1. Detect actual skills present in the resume text
    const detected = [];
    for (const skill of KNOWN_SKILLS) {
      const matchFound =
        rawText.includes(skill.name.toLowerCase()) ||
        skill.aliases.some((alias) => {
          const wordRegex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          return wordRegex.test(rawText);
        });

      if (matchFound) {
        detected.push(skill.name);
      }
    }

    // 2. Identify missing skills required for target career track
    const requiredSkills = roleConfig.requiredSkills || [];
    const missing = [];
    const matchedRequired = [];

    for (const req of requiredSkills) {
      const isPresent = detected.some(
        (ds) => ds.toLowerCase() === req.name.toLowerCase() || req.name.toLowerCase().includes(ds.toLowerCase())
      );
      if (isPresent) {
        matchedRequired.push(req.name);
      } else {
        missing.push(req.name);
      }
    }

    // 3. Compute career alignment score
    const totalRequired = requiredSkills.length;
    const matchedCount = matchedRequired.length;
    const roleFitScore = totalRequired > 0 ? Math.min(95, Math.max(30, Math.round((matchedCount / totalRequired) * 100))) : 65;

    // 4. Generate targeted learning suggestions
    const recommendedLearning = missing.map((skillName) => ({
      skill: skillName,
      reason: `Required core capability for ${roleConfig.title}`,
      learningPath: `Review ${skillName} fundamentals, concurrency patterns, and real-world implementation projects.`
    }));

    // 5. Generate project suggestions tailored to missing competencies
    const projectSuggestions = [];
    if (missing.includes('SQL')) {
      projectSuggestions.push('Build a Relational E-Commerce or Analytics Database with complex indexed joins and transaction ACID guarantees.');
    }
    if (missing.includes('Backend') || missing.includes('Node')) {
      projectSuggestions.push('Develop a production REST / GraphQL API with JWT authentication, rate limiting, and automated unit testing.');
    }
    if (missing.includes('Frontend') || missing.includes('React')) {
      projectSuggestions.push('Build a high-performance single page application with optimistic UI updates and state management.');
    }
    if (missing.includes('Python')) {
      projectSuggestions.push('Create a Python automated data pipeline or service using asynchronous requests and statistical visualization.');
    }
    if (projectSuggestions.length === 0) {
      projectSuggestions.push(`Develop an end-to-end portfolio project showcasing ${matchedRequired.slice(0, 3).join(', ')} in a production container.`);
    }

    // 6. Resume improvement tips based on real text attributes
    const resumeTips = [];
    if (!rawText.includes('github') && !rawText.includes('git')) {
      resumeTips.push('Add a direct link to your active GitHub profile or open-source contributions.');
    }
    if (!rawText.includes('%') && !rawText.includes('increased') && !rawText.includes('reduced') && !rawText.includes('improved')) {
      resumeTips.push('Quantify your project outcomes using measurable metrics (e.g. "reduced latency by 35%", "handled 1,000+ requests").');
    }
    if (missing.length > 0) {
      resumeTips.push(`Highlight any coursework or proof-of-work demonstrating ${missing.slice(0, 2).join(' and ')}.`);
    }
    resumeTips.push('Ensure your target role headline clearly states your focus area.');

    return {
      analyzedAt: new Date().toISOString(),
      targetRole: roleConfig.title,
      roleFitScore,
      matchScore: roleFitScore,
      detectedSkills: detected,
      skillsDetected: detected,
      matchedRequiredSkills: matchedRequired,
      missingSkills: missing,
      recommendedLearning,
      projectSuggestions,
      recommendedProjects: projectSuggestions.map((p) =>
        typeof p === 'string'
          ? { title: p.slice(0, 40) + '...', description: p, skills: matchedRequired }
          : p
      ),
      resumeTips,
      summary: `Resume parsed successfully. Detected ${detected.length} technical skills with ${roleFitScore}% alignment to ${roleConfig.title}.`
    };
  }
};
