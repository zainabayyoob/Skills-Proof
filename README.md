# SkillProof — SIH 2026 Prototype (PS ID: 26044)

> **"Don't Just Claim a Skill. Prove It."**

**Smart India Hackathon 2026 Problem Statement:**  
**PS ID: 26044** — *"Portal for Academia - Industry collaboration for Skill Mapping, Internships and Placement"*

---

## ⚡ Quickstart (Run Locally)

The project runs completely locally without external cloud dependencies, Docker, Python, MongoDB, or paid AI APIs.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Prototype
```bash
npm run dev
```

Open your browser at:  
👉 **http://localhost:5173** (or `http://127.0.0.1:5173`)

---

## 🎯 Core Concept & Innovation: "BUILD → BREAK → ADAPT"

Resumes list claims: *"Proficient in Python, SQL, React"*. Traditional tests only verify toy code on clean data.

SkillProof tests real-world engineering capability:
1. **BUILD**: Solve baseline business logic on pristine inputs.
2. **BREAK**: The system injects unexpected production mutations (e.g. 20% NULL values, dirty currency strings `$89.90 USD`, duplicate records, zero-division).
3. **ADAPT**: The student adapts their code defensively, handles all edge cases, and writes a technical fix rationale.
4. **VERIFY**: Multi-vector grading computes scores across Technical Application, Problem Solving, Debugging, Understanding, and Adaptability.
5. **PASSPORT**: Verified credentials are added to the digital **SkillProof Passport** with tamper-proof cryptographic audit hashes.
6. **MATCH**: Pure local matching engine aligns verified skills against live industry openings with percentage breakdowns.

---

## 👥 Three Core Modules (1-Click Switcher)

Use the top navigation bar to switch between the 3 personas during judging:

| Persona | Name / Organization | Focus |
| :--- | :--- | :--- |
| **Student** | **Aarav Sharma** (ABC Institute of Technology) | Career Readiness (82%), Verified Skills, Skill Gap Analysis, Learning Roadmaps, Skill Graph, Digital Passport, 1-Click Match Apply |
| **Industry** | **Apex Data Systems** | Post Opportunities, View 91% Matched Candidates, "WHY THIS MATCH?" Analysis, Side-by-Side Code Diff Inspector |
| **College** | **ABC Institute of Technology** (Placement Cell) | Aggregate Cohort Skill Gaps (DSA 42%, Cloud 35%), Institutional Interventions, Industry-College Collaboration Marketplace |

---

## 🏆 SIH 2026 Judge Demonstration Script (18-Step Flow)

Follow this exact flow during your hackathon pitch:

1. **Dashboard:** Open the homepage. Highlight Career Readiness (82%), verified skill cards, and identified skill gaps.
2. **Prove Python:** Click the hero button *"Prove Python (Build → Break → Adapt)"*.
3. **Select Mode:** Choose **"SkillProof Verified"** (show the 3 visually distinct modes: Practice, Verified, AI-Assisted).
4. **BUILD Phase:** Review the Sales Dataset KPI challenge. Click *"Run Baseline Tests"* (see clean batch pass).
5. **BREAK Phase:** Click the red button *"Trigger Production Break Mutation"*. Point out the real-time traceback crash on contaminated dirty data.
6. **ADAPT Phase:** Click *"Adapt Solution Now"*. Show the defensive code handling regex currency and null guards, then enter the fix rationale.
7. **VERIFY:** Click *"Submit Solution for Verification"*. Confetti explodes! Show the 86/100 verified score and 6-vector radar breakdown.
8. **Skill Gap Analysis:** Click *"View Skill Gap Analysis"*. Show the visual progress bars and benchmark delta.
9. **Learning Roadmap:** Click *"Learning Roadmap"*. Show how gaps generate personalized tracks (Advanced SQL, REST APIs, DSA) with Learn/Practice/Reassess loops.
10. **Skill Graph:** Navigate to *"Skill Graph"*. Show visual pipeline connecting Skills → Roles → Gaps → Learning → Opportunities.
11. **SkillProof Passport:** Click *"SkillProof Passport"*. Show Aarav's digital credential card with QR code placeholder, audit hashes, and browser print export.
12. **Internships & Jobs:** Open *"Internships & Jobs"*. Point out the **91% Match** with Apex Data Systems and the *"WHY THIS MATCH?"* explanation.
13. **Apply:** Click *"1-Click Apply"* to attach the SkillProof Passport.
14. **Applications Tracker:** Open *"Applications"*. Demonstrate advancing stages: `Applied` → `Under Review` → `Shortlisted` → `Interview` → `Selected`.
15. **Industry Portal:** Switch to **"Industry"** using the top header. Show candidate search and open the **"Inspect Code Diff"** modal to view before-and-after code.
16. **College Portal:** Switch to **"College"** using the top header. Show aggregate student cohort gaps (DSA 42%, Cloud 35%).
17. **Collaboration Marketplace:** Show industry partners offering live projects, workshops, and guest lectures to universities.
18. **Reset Demo:** Click *"Reset Demo"* in the navbar to cleanly restore state for the next round of judges!

---

## 📁 Clean Structure
```
skillproof/
├── package.json
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data/
    │   ├── mockData.js
    │   ├── assessmentsData.js
    │   ├── opportunitiesData.js
    │   └── collegeData.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Sidebar.jsx
    │   ├── RoleSwitcher.jsx
    │   ├── CodeEditor.jsx
    │   ├── SkillCard.jsx
    │   └── Modal.jsx
    ├── pages/
    │   ├── Dashboard.jsx
    │   ├── SkillAssessment.jsx
    │   ├── BuildBreakAdapt.jsx
    │   ├── SkillGap.jsx
    │   ├── LearningRoadmap.jsx
    │   ├── SkillGraph.jsx
    │   ├── SkillProofPassport.jsx
    │   ├── InternshipsJobs.jsx
    │   ├── Applications.jsx
    │   ├── IndustryDashboard.jsx
    │   ├── CollegeDashboard.jsx
    │   └── Profile.jsx
    ├── services/
    │   └── storageService.js
    ├── utils/
    │   └── matchingAlgorithm.js
    └── styles/
        └── index.css
```
