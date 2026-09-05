export const collegeStats = {
  institutionName: "ABC Institute of Technology",
  campus: "Department of Computer Science & Engineering",
  tier: "Tier 1 Academic Partner",
  totalStudents: 1250,
  placementReadiness: 78,
  verifiedSkillsCount: 3420,
  activeInternships: 480,
  placedStudents: 840,
  
  skillGapAnalytics: [
    { domain: "Data Structures & Algorithms (DSA)", percentageNeedingImprovement: 42, severity: "High", impactedStudents: 525, actionRecommended: "DSA Weekend Sprint Workshop" },
    { domain: "Cloud Architecture & DevOps", percentageNeedingImprovement: 35, severity: "Medium-High", impactedStudents: 437, actionRecommended: "Cloud Certification Boot Camp" },
    { domain: "Communication & Technical Rationale", percentageNeedingImprovement: 31, severity: "Medium", impactedStudents: 388, actionRecommended: "Engineering Architecture Defense Labs" },
    { domain: "AI/ML Model Deployment & Sanity", percentageNeedingImprovement: 28, severity: "Medium", impactedStudents: 350, actionRecommended: "Industry Guest Lecture Series" },
    { domain: "Cybersecurity & Defensive Coding", percentageNeedingImprovement: 18, severity: "Low-Medium", impactedStudents: 225, actionRecommended: "Secure Code Audit Sandbox" },
  ],

  recommendedCollegeActions: [
    {
      id: "act-1",
      title: "DSA Sprint Workshop & Code Mutation Sandbox",
      category: "Workshops",
      targetStudents: "42% junior batch",
      impact: "+14% projected readiness increase",
      status: "Scheduled for Sept 2026",
      industryPartner: "Apex Data Systems"
    },
    {
      id: "act-2",
      title: "Cloud & DevOps Certification Track",
      category: "Certifications",
      targetStudents: "35% pre-final year batch",
      impact: "+18% cloud placement eligibility",
      status: "Enrollment Open",
      industryPartner: "StratoCorp Systems"
    },
    {
      id: "act-3",
      title: "Industry Guest Lecture on Resilient Microservices",
      category: "Guest Lectures",
      targetStudents: "All CS students",
      impact: "Exposure to production incident handling",
      status: "Confirmed",
      industryPartner: "FinTech Infrastructure Ltd"
    },
    {
      id: "act-4",
      title: "Faculty Development Program on Live Testing Mutations",
      category: "Faculty Training",
      targetStudents: "45 CS Professors",
      impact: "Syllabus upgrade to include defensive edge cases",
      status: "In Planning",
      industryPartner: "SkillProof Academic Advisory"
    },
    {
      id: "act-5",
      title: "Live Industry Capstone Hackathon",
      category: "Live Projects",
      targetStudents: "Final year students",
      impact: "Direct interview fast-tracking for winners",
      status: "Sponsorship Approved",
      industryPartner: "Nexus Insights Group"
    }
  ],

  collaborationOffers: [
    {
      id: "collab-1",
      company: "Apex Data Systems",
      type: "Live Projects & Internships",
      title: "Sponsored ETL Pipeline Data Sandbox",
      description: "Apex provides anonymized dirty datasets for CS302 lab work, plus fast-track interview vouchers for top scorers.",
      slots: 25,
      status: "Active"
    },
    {
      id: "collab-2",
      company: "Nexus Insights Group",
      type: "Workshops & Hackathons",
      title: "National SQL Analytics & Zero-Divisor Challenge",
      description: "College hackathon with monetary prizes and pre-placement offers (PPOs) for resilient query architects.",
      slots: 50,
      status: "Active"
    },
    {
      id: "collab-3",
      company: "StratoCorp Systems",
      type: "Faculty Training",
      title: "Faculty Cloud Systems Fellowship",
      description: "Summer sabbatical opportunities for professors to embed inside StratoCorp cloud reliability teams.",
      slots: 5,
      status: "Reviewing Agreement"
    }
  ]
};
