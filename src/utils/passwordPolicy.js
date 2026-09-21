// src/utils/passwordPolicy.js
// Standardized Password Policy Validation for SkillProof UI

export const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters long', regex: /.{8,}/ },
  { id: 'uppercase', label: 'At least one uppercase letter (A-Z)', regex: /[A-Z]/ },
  { id: 'lowercase', label: 'At least one lowercase letter (a-z)', regex: /[a-z]/ },
  { id: 'number', label: 'At least one number (0-9)', regex: /[0-9]/ },
  { id: 'special', label: 'At least one special character (!@#$%^&*...)', regex: /[@$!%*?&#^()_\-+={}\[\]|:;"'<>,.?/~`\\]/ },
];

export function checkPasswordRequirements(password = '') {
  return PASSWORD_REQUIREMENTS.map((req) => ({
    id: req.id,
    label: req.label,
    met: req.regex.test(password || '')
  }));
}

export function isPasswordStrong(password = '') {
  return PASSWORD_REQUIREMENTS.every((req) => req.regex.test(password || ''));
}

export function validateStrongPassword(password = '') {
  const results = checkPasswordRequirements(password);
  const unmet = results.filter((r) => !r.met);
  if (unmet.length > 0) {
    return {
      valid: false,
      error: `Password does not meet security requirements: ${unmet.map((u) => u.label).join(', ')}.`,
      missing: unmet.map((u) => u.id),
      requirements: results
    };
  }
  return { valid: true, requirements: results };
}
