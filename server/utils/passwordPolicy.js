// server/utils/passwordPolicy.js
// Standardized Password Policy Validation for SkillProof

export const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters long', regex: /.{8,}/ },
  { id: 'uppercase', label: 'At least one uppercase letter (A-Z)', regex: /[A-Z]/ },
  { id: 'lowercase', label: 'At least one lowercase letter (a-z)', regex: /[a-z]/ },
  { id: 'number', label: 'At least one number (0-9)', regex: /[0-9]/ },
  { id: 'special', label: 'At least one special character (!@#$%^&*...)', regex: /[@$!%*?&#^()_\-+={}\[\]|:;"'<>,.?/~`\\]/ },
];

export function validateStrongPassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      error: 'Password is required and must be a string.',
      missing: PASSWORD_REQUIREMENTS.map((r) => r.label)
    };
  }

  const missing = [];
  for (const req of PASSWORD_REQUIREMENTS) {
    if (!req.regex.test(password)) {
      missing.push(req.label);
    }
  }

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Password must satisfy all security requirements. Missing: ${missing.join(', ')}`,
      missing
    };
  }

  return { valid: true, missing: [] };
}
