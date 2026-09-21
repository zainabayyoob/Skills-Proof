import express from 'express';
import { compilerService } from '../services/compilerService.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { getExecutableSpec } from '../data/assessmentTestCases.js';
import { db } from '../db.js';

const router = express.Router();

// POST /api/compiler/run
// Runs candidate's code against sample/visible test cases
router.post('/run', async (req, res) => {
  try {
    const {
      language = 'python',
      code,
      entrypoint = 'solution',
      conceptId,
      testCases = []
    } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Source code is required' });
    }

    let casesToRun = testCases;
    let actualEntrypoint = entrypoint;

    // Sourced from server-side spec if conceptId is provided
    if (conceptId) {
      const spec = getExecutableSpec(conceptId, language, code);
      if (spec) {
        actualEntrypoint = spec.entrypoint || entrypoint;
        if (!testCases || testCases.length === 0) {
          casesToRun = [...(spec.sampleTestCases || [])];
        }
      }
    }

    // Only run visible cases on sample run
    const visibleCases = (casesToRun || []).filter((tc) => !tc.isHidden);

    const report = await compilerService.execute({
      language,
      code,
      entrypoint: actualEntrypoint,
      testCases: visibleCases
    });

    return res.json(report);
  } catch (err) {
    console.error('Compiler run error:', err);
    return res.status(500).json({ error: 'Internal compiler error during execution' });
  }
});

// POST /api/compiler/submit
// Runs candidate's code against ALL test cases (including hidden test cases) securely evaluated on the server
router.post('/submit', optionalAuth, async (req, res) => {
  try {
    const {
      language = 'python',
      code,
      entrypoint = 'solution',
      conceptId,
      testCases = [],
      skillId,
      skillName,
      roundName = 'ADAPT'
    } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Source code is required' });
    }

    let actualEntrypoint = entrypoint;
    let fullSuite = [];

    // Always source full test suite including hidden test cases from server-side secure spec
    if (conceptId) {
      const spec = getExecutableSpec(conceptId, language, code);
      if (spec) {
        actualEntrypoint = spec.entrypoint || entrypoint;
        fullSuite = [
          ...(spec.sampleTestCases || []),
          ...(spec.mutationTestCases || []),
          ...(spec.hiddenTestCases || [])
        ];
      }
    }

    if (fullSuite.length === 0) {
      fullSuite = testCases;
    }

    const report = await compilerService.execute({
      language,
      code,
      entrypoint: actualEntrypoint,
      testCases: fullSuite
    });

    // Sanitize results for all hidden test cases: NEVER expose input, expected answer, or diff
    const sanitizedResults = (report.results || []).map((r, idx) => {
      const matchedCase = fullSuite[idx] || {};
      const isHidden = Boolean(r.input === 'Hidden Test Case' || matchedCase.isHidden);
      if (isHidden) {
        return {
          id: r.id || idx + 1,
          title: matchedCase.title || `Hidden Validation Test ${idx + 1}`,
          input: 'Hidden Test Case',
          expected: 'Hidden',
          actual: r.passed ? 'Passed' : 'Hidden',
          passed: Boolean(r.passed),
          elapsedMs: r.elapsedMs || 0,
          error: r.passed ? null : 'AssertionError: Hidden test case failed'
        };
      }
      return {
        ...r,
        title: r.title || matchedCase.title || `Test Case ${idx + 1}`
      };
    });

    const sanitizedReport = {
      ...report,
      results: sanitizedResults
    };

    // Record submission telemetry if user is authenticated
    let submissionRecord = null;
    if (req.user) {
      submissionRecord = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: req.user.id,
        skillId: (skillId || language).toLowerCase(),
        skillName: skillName || language,
        roundName,
        status: sanitizedReport.status,
        allPassed: sanitizedReport.allPassed,
        score: sanitizedReport.score || 0,
        passedCount: sanitizedReport.passedCount || 0,
        totalCount: sanitizedReport.totalCount || 0,
        submittedAt: new Date().toISOString()
      };
    }

    return res.json({
      ...sanitizedReport,
      submission: submissionRecord
    });
  } catch (err) {
    console.error('Compiler submit error:', err);
    return res.status(500).json({ error: 'Internal compiler error during submission' });
  }
});

export default router;
