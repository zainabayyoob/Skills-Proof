/**
 * SkillProof Smart Matching Engine
 * Pure local deterministic JavaScript calculation
 */
export function calculateOpportunityMatch(opportunity, student) {
  if (!opportunity || !student) return { matchPercentage: 0, matchingSkills: [], missingSkills: [], rationale: "" };

  // If student has no verified skills yet, matching is locked/pending verification
  if (!student.verifiedSkills || student.verifiedSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchingSkills: [],
      missingSkills: opportunity.requiredSkills.map((req) => ({
        name: req.name,
        studentScore: 0,
        minRequired: req.minScore,
        gap: req.minScore,
        status: "Unverified"
      })),
      rationale: "Profile not verified yet. Complete a Build → Break → Adapt assessment to calculate your authentic match percentage and unlock 1-click apply."
    };
  }

  const normalizeStr = (str) => (str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '');

  const studentSkillsMap = new Map();
  student.verifiedSkills.forEach((s) => {
    const nameLower = (s.name || '').toLowerCase().trim();
    studentSkillsMap.set(nameLower, s.score);
    if (s.skillId) {
      studentSkillsMap.set(s.skillId.toLowerCase().trim(), s.score);
    }
    studentSkillsMap.set(normalizeStr(s.name), s.score);
  });

  let totalWeight = 0;
  let earnedScore = 0;
  const matchingSkills = [];
  const missingSkills = [];

  opportunity.requiredSkills.forEach((req) => {
    const weight = typeof req.weight === 'number' && !isNaN(req.weight) ? req.weight : 1;
    totalWeight += weight;

    const reqNameLower = (req.name || '').toLowerCase().trim();
    const reqIdLower = (req.id || '').toLowerCase().trim();
    const reqNormalized = normalizeStr(req.name);

    let studentScore = studentSkillsMap.get(reqNameLower);
    if (studentScore === undefined && reqIdLower) {
      studentScore = studentSkillsMap.get(reqIdLower);
    }
    if (studentScore === undefined) {
      studentScore = studentSkillsMap.get(reqNormalized);
    }
    if (studentScore === undefined) {
      // Substring fallback (e.g. "React" inside "Frontend (React)")
      for (const [k, score] of studentSkillsMap.entries()) {
        if (k.length > 2 && (reqNameLower.includes(k) || k.includes(reqNameLower))) {
          studentScore = score;
          break;
        }
      }
    }

    if (studentScore !== undefined && studentScore >= req.minScore) {
      earnedScore += weight * Math.min(100, studentScore);
      matchingSkills.push({
        name: req.name,
        studentScore,
        minRequired: req.minScore,
        status: "Passed Benchmark"
      });
    } else if (studentScore !== undefined) {
      earnedScore += weight * (studentScore * 0.75);
      missingSkills.push({
        name: req.name,
        studentScore,
        minRequired: req.minScore,
        gap: req.minScore - studentScore,
        status: "Below Benchmark"
      });
    } else {
      missingSkills.push({
        name: req.name,
        studentScore: 0,
        minRequired: req.minScore,
        gap: req.minScore,
        status: "Unverified Claim"
      });
    }
  });

  // Factor in overall career readiness index (10% influence)
  const baseSkillMatch = totalWeight > 0 ? earnedScore / totalWeight : 0;
  const readinessBonus = (student.careerReadiness || 0) * 0.1;
  const rawPct = Math.round(baseSkillMatch * 0.9 + readinessBonus);
  const finalMatchPercentage = Math.min(98, Math.max(10, isNaN(rawPct) ? 15 : rawPct));

  let rationale = "";
  if (finalMatchPercentage >= 85) {
    rationale = `Exceptional Match: Candidate has demonstrated verified proficiency in ${matchingSkills.map(s => s.name).join(', ')} meeting industry benchmarks.`;
  } else if (finalMatchPercentage >= 65) {
    rationale = `Strong Match: Core competencies verified. Secondary gap identified in ${missingSkills.map(s => s.name).join(', ')}.`;
  } else {
    rationale = `Developing Match: Candidate requires verified demonstration in ${missingSkills.map(s => s.name).join(', ')} before benchmark alignment.`;
  }

  return {
    matchPercentage: finalMatchPercentage,
    matchingSkills,
    missingSkills,
    rationale
  };
}
