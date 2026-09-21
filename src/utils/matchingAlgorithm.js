/**
 * SkillProof Smart Matching Engine
 * Pure local deterministic JavaScript calculation with canonical skillId support
 */
export function calculateOpportunityMatch(opportunity, student) {
  if (!opportunity || !student) return { matchPercentage: 0, matchingSkills: [], missingSkills: [], rationale: "" };

  // If student has no verified skills yet, matching is locked/pending verification
  if (!student.verifiedSkills || student.verifiedSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchingSkills: [],
      missingSkills: (opportunity.requiredSkills || []).map((req) => ({
        skillId: req.skillId || null,
        name: req.name,
        studentScore: 0,
        minRequired: req.minScore,
        gap: req.minScore,
        status: "Unverified"
      })),
      rationale: "Profile not verified yet. Complete a Build → Break → Adapt assessment to calculate your authentic match percentage and unlock 1-click apply."
    };
  }

  const studentSkillsMap = new Map();
  student.verifiedSkills.forEach((s) => {
    if (s.skillId) {
      studentSkillsMap.set(s.skillId.toLowerCase().trim(), s.score);
    }
    const nameLower = (s.name || '').toLowerCase().trim();
    if (nameLower) {
      studentSkillsMap.set(nameLower, s.score);
    }
  });

  let totalWeight = 0;
  let earnedScore = 0;
  const matchingSkills = [];
  const missingSkills = [];

  (opportunity.requiredSkills || []).forEach((req) => {
    const weight = typeof req.weight === 'number' && !isNaN(req.weight) ? req.weight : 1;
    totalWeight += weight;

    const reqSkillIdLower = (req.skillId || req.id || '').toLowerCase().trim();
    const reqNameLower = (req.name || '').toLowerCase().trim();

    // Primary: canonical skillId match
    let studentScore = reqSkillIdLower ? studentSkillsMap.get(reqSkillIdLower) : undefined;

    // Safe fallback: exact name match
    if (studentScore === undefined && reqNameLower) {
      studentScore = studentSkillsMap.get(reqNameLower);
    }

    if (studentScore !== undefined && studentScore >= req.minScore) {
      earnedScore += weight * Math.min(100, studentScore);
      matchingSkills.push({
        skillId: reqSkillIdLower || null,
        name: req.name,
        studentScore,
        minRequired: req.minScore,
        status: "Passed Benchmark"
      });
    } else if (studentScore !== undefined) {
      earnedScore += weight * (studentScore * 0.75);
      missingSkills.push({
        skillId: reqSkillIdLower || null,
        name: req.name,
        studentScore,
        minRequired: req.minScore,
        gap: req.minScore - studentScore,
        status: "Below Benchmark"
      });
    } else {
      missingSkills.push({
        skillId: reqSkillIdLower || null,
        name: req.name,
        studentScore: 0,
        minRequired: req.minScore,
        gap: req.minScore,
        status: "Unverified Claim"
      });
    }
  });

  // Factor in overall career readiness index (weighted 10% if there is at least some skill match)
  const baseSkillMatch = totalWeight > 0 ? earnedScore / totalWeight : 0;
  const readinessBonus = (student.careerReadiness || 0) * 0.1;
  
  let finalMatchPercentage = 0;
  if (matchingSkills.length > 0 || earnedScore > 0) {
    const rawPct = Math.round(baseSkillMatch * 0.9 + readinessBonus);
    finalMatchPercentage = Math.min(98, Math.max(0, isNaN(rawPct) ? 0 : rawPct));
  } else {
    finalMatchPercentage = 0;
  }

  let rationale = "";
  if (matchingSkills.length === 0) {
    rationale = `Zero Skill Alignment: No verified skills currently match the mandatory requirements (${opportunity.requiredSkills.map(s => s.name).join(', ')}). Complete relevant assessments to qualify.`;
  } else if (finalMatchPercentage >= 85) {
    rationale = `Exceptional Match: Candidate has demonstrated verified proficiency in ${matchingSkills.map(s => s.name).join(', ')} meeting or exceeding industry hiring thresholds.`;
  } else if (finalMatchPercentage >= 65) {
    rationale = `Strong Match: Core competencies verified in ${matchingSkills.map(s => s.name).join(', ')}. Target improvement in ${missingSkills.map(s => s.name).join(', ')}.`;
  } else {
    rationale = `Developing Match: Candidate verified in ${matchingSkills.map(s => s.name).join(', ')}, but requires demonstration in ${missingSkills.map(s => s.name).join(', ')} to meet minimum hiring bar.`;
  }

  return {
    matchPercentage: finalMatchPercentage,
    matchingSkills,
    missingSkills,
    rationale
  };
}
