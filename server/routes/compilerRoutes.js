import express from 'express';
import { compilerService } from '../services/compilerService.js';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../db.js';

const router = express.Router();

// POST /api/compiler/run
// Runs candidate's code against sample/visible test cases
router.post('/run', async (req, res) => {
  try {
    const { language = 'python', code, entrypoint = 'solution', testCases = [] } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Source code is required' });
    }

    const report = await compilerService.execute({
      language,
      code,
      entrypoint,
      testCases: testCases.filter(tc => !tc.isHidden) // only run visible cases on sample run
    });

    return res.json(report);
  } catch (err) {
    console.error('Compiler run error:', err);
    return res.status(500).json({ error: 'Internal compiler error during execution' });
  }
});

// POST /api/compiler/submit
// Runs candidate's code against ALL test cases (including hidden) and saves verification
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const {
      language = 'python',
      code,
      entrypoint = 'solution',
      testCases = [],
      skillId,
      skillName,
      roundName = 'BUILD' // 'BUILD' | 'BREAK' | 'ADAPT'
    } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Source code is required' });
    }

    const report = await compilerService.execute({
      language,
      code,
      entrypoint,
      testCases
    });

    // Record submission telemetry
    const submissionRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: req.user.id,
      skillId: (skillId || language).toLowerCase(),
      skillName: skillName || language,
      roundName,
      status: report.status,
      allPassed: report.allPassed,
      score: report.score || 0,
      passedCount: report.passedCount || 0,
      totalCount: report.totalCount || 0,
      submittedAt: new Date().toISOString()
    };

    return res.json({
      ...report,
      submission: submissionRecord
    });
  } catch (err) {
    console.error('Compiler submit error:', err);
    return res.status(500).json({ error: 'Internal compiler error during submission' });
  }
});

export default router;
