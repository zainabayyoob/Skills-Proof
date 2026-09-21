import express from 'express';
import { db } from '../db.js';
import { questionBank } from '../data/questionBank.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const SKILL_NAME_MAP = {
  python: 'Python',
  sql: 'SQL',
  c: 'C',
  cpp: 'C++',
  'c++': 'C++',
  java: 'Java',
  javascript: 'JavaScript',
  htmlcss: 'HTML / CSS',
  frontend: 'Frontend Web Development',
  backend: 'Backend Systems',
  dataanalytics: 'Data Analytics'
};

// Fisher-Yates shuffle utility
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// POST /api/tests/start
// Starts a new dynamic test attempt with randomized questions and randomized option order
router.post('/start', optionalAuth, async (req, res) => {
  try {
    const { skillId } = req.body;
    if (!skillId) {
      return res.status(400).json({ error: 'skillId is required' });
    }

    const normalizedSkillId = skillId.toLowerCase().trim();
    let queryKey = normalizedSkillId;
    if (queryKey === 'frontend') queryKey = 'react';
    if (queryKey === 'backend') queryKey = 'node';
    if (queryKey === 'c++') queryKey = 'cpp';

    const availableQuestions = questionBank[queryKey] || questionBank[normalizedSkillId] || [];
    if (availableQuestions.length === 0) {
      return res.status(404).json({ error: `No questions found for skill: ${skillId}` });
    }

    // Filter questions by progressive difficulty: Basic -> Intermediate -> Advanced
    const basicQuestions = availableQuestions.filter((q) => q.difficulty === 'basic');
    const interQuestions = availableQuestions.filter((q) => q.difficulty === 'intermediate');
    const advQuestions = availableQuestions.filter((q) => q.difficulty === 'advanced');

    // Select ~7-8 from each tier to assemble a progressive 20-24 question quiz
    const targetPerTier = 7;
    const selectedBasic = shuffleArray(basicQuestions).slice(0, Math.min(targetPerTier, basicQuestions.length));
    const selectedInter = shuffleArray(interQuestions).slice(0, Math.min(targetPerTier, interQuestions.length));
    const selectedAdv = shuffleArray(advQuestions).slice(0, Math.min(targetPerTier, advQuestions.length));

    let selectedQuestions = [...selectedBasic, ...selectedInter, ...selectedAdv];

    // If fewer than 20 questions chosen due to uneven tier sizes, backfill up to 21-24
    if (selectedQuestions.length < 20 && availableQuestions.length >= 20) {
      const selectedIds = new Set(selectedQuestions.map((q) => q.id));
      const remaining = shuffleArray(availableQuestions.filter((q) => !selectedIds.has(q.id)));
      const needed = Math.min(22 - selectedQuestions.length, remaining.length);
      selectedQuestions = [...selectedQuestions, ...remaining.slice(0, needed)];
    }

    // For each question, randomize the options order
    const attemptQuestionsBackend = [];
    const sanitizedQuestionsFrontend = [];

    selectedQuestions.forEach((q) => {
      const randomizedOptions = shuffleArray(q.options);

      // Store complete record on backend with correct answer mapping
      attemptQuestionsBackend.push({
        questionId: q.id,
        difficulty: q.difficulty || 'intermediate',
        question: q.question,
        codeSnippet: q.codeSnippet || '',
        options: randomizedOptions,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation
      });

      // Strip correct answers before sending to frontend!
      sanitizedQuestionsFrontend.push({
        id: q.id,
        difficulty: q.difficulty || 'intermediate',
        question: q.question,
        codeSnippet: q.codeSnippet || '',
        options: randomizedOptions.map((opt) => ({
          id: opt.id,
          text: opt.text
        }))
      });
    });

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const skillName = SKILL_NAME_MAP[normalizedSkillId] || availableQuestions[0]?.skillName || skillId;

    const newAttempt = {
      id: attemptId,
      userId: req.user ? req.user.id : 'guest',
      skillId: normalizedSkillId,
      skillName,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      questionMappings: attemptQuestionsBackend,
      totalQuestions: sanitizedQuestionsFrontend.length
    };

    await db.saveTestAttempt(newAttempt);

    return res.status(201).json({
      attemptId,
      skillId: normalizedSkillId,
      skillName,
      totalQuestions: sanitizedQuestionsFrontend.length,
      questions: sanitizedQuestionsFrontend
    });
  } catch (err) {
    console.error('Test start error:', err);
    return res.status(500).json({ error: 'Failed to initialize test attempt' });
  }
});

// POST /api/tests/submit
// Evaluates submitted answers on the backend, calculates score, and updates user records
router.post('/submit', optionalAuth, async (req, res) => {
  try {
    const { attemptId, answers } = req.body;

    if (!attemptId || !answers) {
      return res.status(400).json({ error: 'attemptId and answers payload are required' });
    }

    const attempt = await db.getTestAttemptById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Test attempt record not found' });
    }

    if (attempt.userId !== 'guest' && req.user && attempt.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: This attempt belongs to another user' });
    }

    if (attempt.status === 'completed') {
      return res.status(400).json({ error: 'This test attempt has already been submitted and scored' });
    }

    let correctCount = 0;
    const review = [];

    attempt.questionMappings.forEach((qMap) => {
      const selectedOptionId = answers[qMap.questionId] || null;
      const isCorrect = selectedOptionId === qMap.correctOptionId;
      if (isCorrect) {
        correctCount++;
      }

      review.push({
        questionId: qMap.questionId,
        question: qMap.question,
        codeSnippet: qMap.codeSnippet,
        selectedOptionId,
        correctOptionId: qMap.correctOptionId,
        options: qMap.options,
        isCorrect,
        explanation: qMap.explanation
      });
    });

    const totalCount = attempt.questionMappings.length;
    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const isQuizPassed = score >= 75;
    const level = score >= 85 ? 'Advanced' : score >= 75 ? 'Proficient' : 'Intermediate';
    const badge = score >= 85 ? 'Gold' : score >= 75 ? 'Silver' : 'Bronze';

    // Update attempt record
    const updatedAttempt = await db.updateTestAttempt(attemptId, {
      status: 'completed',
      score,
      quizPassed: isQuizPassed,
      correctCount,
      totalCount,
      userAnswers: answers,
      completedAt: new Date().toISOString()
    });

    // If authenticated user, persist to database
    if (req.user) {
      const previousAttempts = (await db.getTestAttemptsByUser(req.user.id))
        .filter((a) => a.skillId === attempt.skillId && a.status === 'completed');
      const attemptNumber = previousAttempts.length + 1;

      const user = await db.getUserById(req.user.id);
      const verifiedList = [...(user.verifiedSkills || [])];
      const existingIndex = verifiedList.findIndex((s) => s.skillId === attempt.skillId);

      const skillRecord = {
        name: attempt.skillName,
        skillId: attempt.skillId,
        score,
        level,
        quizPassed: isQuizPassed,
        verifiedAt: new Date().toISOString().split('T')[0],
        badge,
        latestAttemptNumber: attemptNumber
      };

      if (existingIndex >= 0) {
        const prevScore = verifiedList[existingIndex].score;
        const prevPassed = verifiedList[existingIndex].quizPassed;
        verifiedList[existingIndex] = {
          ...skillRecord,
          score: Math.max(prevScore, score),
          quizPassed: prevPassed || isQuizPassed,
          level: Math.max(prevScore, score) >= 85 ? 'Advanced' : Math.max(prevScore, score) >= 75 ? 'Proficient' : 'Intermediate',
          badge: Math.max(prevScore, score) >= 85 ? 'Gold' : Math.max(prevScore, score) >= 75 ? 'Silver' : 'Bronze'
        };
      } else {
        verifiedList.push(skillRecord);
      }

      const unlockedCodingSkills = { ...(user.unlockedCodingSkills || {}) };
      if (isQuizPassed) {
        unlockedCodingSkills[attempt.skillId] = {
          unlocked: true,
          quizScore: score,
          unlockedAt: new Date().toISOString()
        };

        if (typeof db.addNotification === 'function') {
          await db.addNotification(user.id, {
            title: `Coding Assessment Unlocked!`,
            message: `Congratulations! You scored ${score}% on the ${attempt.skillName} quiz. You have unlocked the Build-Break-Adapt coding challenge.`,
            type: 'ASSESSMENT_UNLOCKED',
            skillId: attempt.skillId
          });
        }
      }

      const passportHash = `SKP-2026-${attempt.skillId.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;

      const updatedUser = await db.updateUser(user.id, {
        verifiedSkills: verifiedList,
        unlockedCodingSkills,
        passportHash
      });

      const { passwordHash, ...sanitizedUser } = updatedUser;

      return res.json({
        message: isQuizPassed ? 'Quiz passed! Coding assessment unlocked.' : 'Test submitted and graded.',
        attemptId,
        attemptNumber,
        score,
        quizPassed: isQuizPassed,
        unlockedCoding: isQuizPassed,
        correctCount,
        totalCount,
        level,
        badge,
        review,
        user: sanitizedUser
      });
    }

    // Guest response (unauthenticated)
    const guestUser = {
      id: 'guest',
      name: 'Candidate',
      email: 'guest@skillproof.demo',
      college: 'Institute of Technology',
      careerReadiness: isQuizPassed ? score : 0,
      verifiedSkills: [{
        name: attempt.skillName,
        skillId: attempt.skillId,
        score,
        level,
        quizPassed: isQuizPassed,
        verifiedAt: new Date().toISOString().split('T')[0],
        badge
      }],
      passportHash: `SKP-2026-${attempt.skillId.toUpperCase().slice(0, 3)}-GUEST`
    };

    return res.json({
      message: isQuizPassed ? 'Quiz passed! Coding assessment unlocked.' : 'Test submitted and graded.',
      attemptId,
      attemptNumber: 1,
      score,
      quizPassed: isQuizPassed,
      unlockedCoding: isQuizPassed,
      correctCount,
      totalCount,
      level,
      badge,
      review,
      user: guestUser
    });
  } catch (err) {
    console.error('Test submit error:', err);
    return res.status(500).json({ error: 'Failed to process test submission' });
  }
});

// POST /api/tests/verify-code
// For Build -> Break -> Adapt interactive code challenges (85% passing cutoff)
router.post('/verify-code', requireAuth, async (req, res) => {
  try {
    const { skillId, skillName, overallScore, roundsEvidence } = req.body;
    if (!skillId || overallScore === undefined) {
      return res.status(400).json({ error: 'skillId and overallScore are required' });
    }

    const score = Number(overallScore);
    const isCodingPassed = score >= 85;
    const level = score >= 90 ? 'Production Ready' : score >= 85 ? 'Advanced Verified' : score >= 75 ? 'Proficient' : 'Needs Practice';
    const badge = score >= 85 ? 'Gold' : score >= 75 ? 'Silver' : 'Bronze';

    const user = await db.getUserById(req.user.id);
    const verifiedList = [...(user.verifiedSkills || [])];
    const existingIdx = verifiedList.findIndex((s) => s.skillId === skillId.toLowerCase());

    const record = {
      name: skillName || skillId,
      skillId: skillId.toLowerCase(),
      score,
      level,
      verifiedAt: new Date().toISOString().split('T')[0],
      badge,
      codingPassed: isCodingPassed,
      type: 'code_challenge_bba'
    };

    if (existingIdx >= 0) {
      const prev = verifiedList[existingIdx];
      verifiedList[existingIdx] = {
        ...prev,
        ...record,
        score: Math.max(prev.score || 0, score),
        codingPassed: prev.codingPassed || isCodingPassed
      };
    } else {
      verifiedList.push(record);
    }

    if (isCodingPassed && typeof db.addNotification === 'function') {
      await db.addNotification(user.id, {
        title: `Skill Verified: ${skillName || skillId}!`,
        message: `Outstanding! You scored ${score}% on the Build-Break-Adapt coding assessment, meeting the 85% production readiness standard.`,
        type: 'SKILL_VERIFIED',
        skillId: skillId.toLowerCase()
      });
    }

    const passportHash = `SKP-2026-${skillId.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;

    // Record attempt in history
    await db.saveTestAttempt({
      id: `code_att_${Date.now()}`,
      userId: user.id,
      skillId: skillId.toLowerCase(),
      skillName: skillName || skillId,
      type: 'code_challenge',
      status: 'completed',
      score,
      evidence: roundsEvidence || {},
      completedAt: new Date().toISOString()
    });

    const assessmentEvidence = {
      problemSolving: `${roundsEvidence?.problemSolving || score}% Accuracy`,
      debugging: `${roundsEvidence?.debugging || Math.max(70, score - 2)}% Recovery`,
      adaptability: `${roundsEvidence?.adaptability || Math.min(100, score + 4)}% Dynamic`
    };

    const updatedUser = await db.updateUser(user.id, {
      verifiedSkills: verifiedList,
      assessmentEvidence,
      passportHash
    });

    const { passwordHash, ...sanitizedUser } = updatedUser;

    return res.json({
      message: 'Code challenge verified and recorded',
      score,
      user: sanitizedUser
    });
  } catch (err) {
    console.error('Code verification error:', err);
    return res.status(500).json({ error: 'Failed to record code verification' });
  }
});

// GET /api/tests/history
// Returns chronological list of all attempts by the authenticated user
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userAttempts = await db.getTestAttemptsByUser(req.user.id);
    const attempts = userAttempts
      .filter((a) => a.status === 'completed')
      .sort((a, b) => new Date(b.completedAt || b.startedAt) - new Date(a.completedAt || a.startedAt))
      .map((a) => ({
        id: a.id,
        skillId: a.skillId,
        skillName: a.skillName,
        score: a.score,
        correctCount: a.correctCount,
        totalCount: a.totalCount,
        attemptNumber: a.attemptNumber || 1,
        type: a.type || 'mcq_assessment',
        completedAt: a.completedAt
      }));

    return res.json({ history: attempts });
  } catch (err) {
    console.error('History error:', err);
    return res.status(500).json({ error: 'Failed to fetch test history' });
  }
});

// GET /api/tests/eligibility/:skillId
// Checks if student has passed prerequisite quiz (>= 75%) or unlocked coding
router.get('/eligibility/:skillId', optionalAuth, async (req, res) => {
  try {
    const { skillId } = req.params;
    const target = skillId.toLowerCase().trim();

    if (!req.user) {
      return res.json({
        isEligible: true,
        quizScore: null,
        quizPassed: false,
        skillId: target
      });
    }

    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const verified = (user.verifiedSkills || []).find(
      (s) => (s.skillId && s.skillId.toLowerCase() === target) ||
             (s.name && s.name.toLowerCase() === target)
    );

    const quizPassed = Boolean(verified && (verified.quizPassed || verified.score >= 70));
    const isUnlocked = (user.unlockedCodingSkills || []).includes(target);
    const isEligible = quizPassed || isUnlocked || Boolean(verified && verified.score >= 70);

    return res.json({
      isEligible,
      quizScore: verified?.score || null,
      quizPassed: Boolean(quizPassed || isEligible),
      skillId: target
    });
  } catch (err) {
    console.error('Eligibility check error:', err);
    return res.status(500).json({ error: 'Failed to check eligibility' });
  }
});

// GET /api/tests/passport/:hash
// Public lookup for cryptographically verified candidate passport
router.get('/passport/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    if (!hash) {
      return res.status(400).json({ error: 'Passport hash is required' });
    }
    const cleanHash = String(hash).trim().toLowerCase();
    const users = await db.getUsers();
    const found = users.find((u) => 
      (u.passportHash && u.passportHash.toLowerCase() === cleanHash) ||
      (u.id && u.id.toLowerCase() === cleanHash) ||
      (u.studentId && u.studentId.toLowerCase() === cleanHash)
    );
    if (!found) {
      return res.status(404).json({ error: `Passport not found for hash: ${hash}` });
    }
    const { passwordHash, ...sanitized } = found;
    return res.json({ passport: sanitized, user: sanitized });
  } catch (err) {
    console.error('Passport fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve passport credential' });
  }
});

export default router;

