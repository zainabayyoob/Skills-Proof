export const standardDegrees = [
  { id: 'btech', name: 'B.Tech (Bachelor of Technology)', durationYears: 4, totalSemesters: 8 },
  { id: 'be', name: 'B.E. (Bachelor of Engineering)', durationYears: 4, totalSemesters: 8 },
  { id: 'bca', name: 'BCA (Bachelor of Computer Applications)', durationYears: 3, totalSemesters: 6 },
  { id: 'bsc', name: 'B.Sc (Computer Science / IT / Data Science)', durationYears: 3, totalSemesters: 6 },
  { id: 'mtech', name: 'M.Tech (Master of Technology)', durationYears: 2, totalSemesters: 4 },
  { id: 'me', name: 'M.E. (Master of Engineering)', durationYears: 2, totalSemesters: 4 },
  { id: 'mca', name: 'MCA (Master of Computer Applications)', durationYears: 2, totalSemesters: 4 },
  { id: 'msc', name: 'M.Sc (Computer Science / IT)', durationYears: 2, totalSemesters: 4 },
  { id: 'mba', name: 'MBA (Tech Management / IT)', durationYears: 2, totalSemesters: 4 },
  { id: 'phd', name: 'PhD (Computer Science / Engineering)', durationYears: 5, totalSemesters: 10 },
  { id: 'dual', name: 'Dual Degree (B.Tech + M.Tech - 5 Year)', durationYears: 5, totalSemesters: 10 },
  { id: 'diploma', name: 'Diploma in Engineering / Polytechnic', durationYears: 3, totalSemesters: 6 },
  { id: 'other', name: 'Other (Specify Degree)', durationYears: 4, totalSemesters: 8 }
];

export const academicYears = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year (Dual Degree)',
  'Graduated / Alum'
];

export const standardSemesters = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
  '9th Semester (Dual Degree)',
  '10th Semester (Dual Degree)',
  'Completed / Alum'
];

export const genders = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say'
];

export const getSemestersForDegree = (degreeName) => {
  const matched = standardDegrees.find((d) =>
    degreeName && (d.name.toLowerCase().includes(degreeName.toLowerCase()) || d.id === degreeName.toLowerCase())
  );
  const maxSem = matched ? matched.totalSemesters : 8;
  return standardSemesters.slice(0, maxSem);
};
