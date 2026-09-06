import express from 'express';
import { db } from '../db.js';
import { questionBank } from '../data/questionBank.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

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
router.post('/start', requireAuth, (req, res) => {
  try {
    const { skillId } = req.body;
    if (!skillId) {
      return res.status(400).json({ error: 'skillId is required' });
    }

    const availableQuestions = questionBank[skillId.toLowerCase()] || [];
    if (availableQuestions.length === 0) {
      return res.status(404).json({ error: `No questions found for skill: ${skillId}` });
    }

    // Dynamic selection: randomly pick 5 questions (or all if < 5)
    const numQuestions = Math.min(5, availableQuestions.length);
    const shuffledQuestions = shuffleArray(availableQuestions).slice(0, numQuestions);

    // For each question, randomize the options order
    const attemptQuestionsBackend = [];
    const sanitizedQuestionsFrontend = [];

    shuffledQuestions.forEach((q) => {
      const randomizedOptions = shuffleArray(q.options);

      // Store complete record on backend with correct answer mapping
      attemptQuestionsBackend.push({
        questionId: q.id,
        question: q.question,
        codeSnippet: q.codeSnippet || '',
        options: randomizedOptions,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation
      });

      // Strip correct answers before sending to frontend!
      sanitizedQuestionsFrontend.push({
        id: q.id,
        question: q.question,
        codeSnippet: q.codeSnippet || '',
        options: randomizedOptions.map((opt) => ({
          id: opt.id,
          text: opt.text
        }))
      });
    });

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const skillName = availableQuestions[0]?.skillName || skillId;

    const newAttempt = {
      id: attemptId,
      userId: req.user.id,
      skillId: skillId.toLowerCase(),
      skillName,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      questionMappings: attemptQuestionsBackend,
      totalQuestions: sanitizedQuestionsFrontend.length
    };

    db.saveTestAttempt(newAttempt);

    return res.status(201).json({
      attemptId,
      skillId: skillId.toLowerCase(),
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
router.post('/submit', requireAuth, (req, res) => {
  try {
    const { attemptId, answers } = req.body;

    if (!attemptId || !answers) {
      return res.status(400).json({ error: 'attemptId and answers payload are required' });
    }

    const attempt = db.getTestAttemptById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Test attempt record not found' });
    }

    if (attempt.userId !== req.user.id) {
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
    const level = score >= 85 ? 'Advanced' : score >= 70 ? 'Proficient' : 'Intermediate';
    const badge = score >= 85 ? 'Gold' : score >= 70 ? 'Silver' : 'Bronze';

    // Count attempt number for this user and skill
    const previousAttempts = db.getTestAttemptsByUser(req.user.id)
      .filter((a) => a.skillId === attempt.skillId && a.status === 'completed');
    const attemptNumber = previousAttempts.length + 1;

    // Update attempt record
    const updatedAttempt = db.updateTestAttempt(attemptId, {
      status: 'completed',
      score,
      correctCount,
      totalCount,
      attemptNumber,
      userAnswers: answers,
      completedAt: new Date().toISOString()
    });

    // Update user's verified skills in database
    const user = db.getUserById(req.user.id);
    const verifiedList = [...(user.verifiedSkills || [])];
    const existingIndex = verifiedList.findIndex((s) => s.skillId === attempt.skillId);

    const skillRecord = {
      name: attempt.skillName,
      skillId: attempt.skillId,
      score,
      level,
      verifiedAt: new Date().toISOString().split('T')[0],
      badge,
      latestAttemptNumber: attemptNumber
    };

    if (existingIndex >= 0) {
      // Keep highest score or update with recent verified score
      const prevScore = verifiedList[existingIndex].score;
      verifiedList[existingIndex] = {
        ...skillRecord,
        score: Math.max(prevScore, score),
        level: Math.max(prevScore, score) >= 85 ? 'Advanced' : Math.max(prevScore, score) >= 70 ? 'Proficient' : 'Intermediate',
        badge: Math.max(prevScore, score) >= 85 ? 'Gold' : Math.max(prevScore, score) >= 70 ? 'Silver' : 'Bronze'
      };
    } else {
      verifiedList.push(skillRecord);
    }

    const passportHash = `SKP-2026-${attempt.skillId.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;

    const updatedUser = db.updateUser(user.id, {
      verifiedSkills: verifiedList,
      passportHash
    });

    const { passwordHash, ...sanitizedUser } = updatedUser;

    return res.json({
      message: 'Test submitted and graded successfully',
      attemptId,
      attemptNumber,
      score,
      correctCount,
      totalCount,
      level,
      badge,
      review,
      user: sanitizedUser
    });
  } catch (err) {
    console.error('Test submit error:', err);
    return res.status(500).json({ error: 'Failed to process test submission' });
  }
});

// POST /api/tests/verify-code
// For Build -> Break -> Adapt interactive code challenges
router.post('/verify-code', requireAuth, (req, res) => {
  try {
    const { skillId, skillName, overallScore, evidence } = req.body;
    if (!skillId || overallScore === undefined) {
      return res.status(400).json({ error: 'skillId and overallScore are required' });
    }

    const score = Number(overallScore);
    const level = score >= 85 ? 'Advanced' : score >= 70 ? 'Proficient' : 'Intermediate';
    const badge = score >= 85 ? 'Gold' : score >= 70 ? 'Silver' : 'Bronze';

    const user = db.getUserById(req.user.id);
    const verifiedList = [...(user.verifiedSkills || [])];
    const existingIdx = verifiedList.findIndex((s) => s.skillId === skillId.toLowerCase());

    const record = {
      name: skillName || skillId,
      skillId: skillId.toLowerCase(),
      score,
      level,
      verifiedAt: new Date().toISOString().split('T')[0],
      badge,
      type: 'code_challenge'
    };

    if (existingIdx >= 0) {
      verifiedList[existingIdx] = record;
    } else {
      verifiedList.push(record);
    }

    const passportHash = `SKP-2026-${skillId.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;

    // Record attempt in history
    db.saveTestAttempt({
      id: `code_att_${Date.now()}`,
      userId: user.id,
      skillId: skillId.toLowerCase(),
      skillName: skillName || skillId,
      type: 'code_challenge',
      status: 'completed',
      score,
      evidence: evidence || {},
      completedAt: new Date().toISOString()
    });

    const updatedUser = db.updateUser(user.id, {
      verifiedSkills: verifiedList,
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
router.get('/history', requireAuth, (req, res) => {
  try {
    const attempts = db.getTestAttemptsByUser(req.user.id)
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

export default router;
