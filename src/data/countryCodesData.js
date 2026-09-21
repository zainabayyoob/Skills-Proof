export const countryCodes = [
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳', minDigits: 10, maxDigits: 10 },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸', minDigits: 10, maxDigits: 10 },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦', minDigits: 10, maxDigits: 10 },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧', minDigits: 10, maxDigits: 11 },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', flag: '🇦🇪', minDigits: 9, maxDigits: 9 },
  { code: 'SG', dialCode: '+65', name: 'Singapore', flag: '🇸🇬', minDigits: 8, maxDigits: 8 },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺', minDigits: 9, maxDigits: 10 },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪', minDigits: 10, maxDigits: 11 },
  { code: 'JP', dialCode: '+81', name: 'Japan', flag: '🇯🇵', minDigits: 10, maxDigits: 10 },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷', minDigits: 9, maxDigits: 10 },
  { code: 'MY', dialCode: '+60', name: 'Malaysia', flag: '🇲🇾', minDigits: 9, maxDigits: 10 },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦', minDigits: 9, maxDigits: 9 },
  { code: 'QA', dialCode: '+974', name: 'Qatar', flag: '🇶🇦', minDigits: 8, maxDigits: 8 },
  { code: 'NL', dialCode: '+31', name: 'Netherlands', flag: '🇳🇱', minDigits: 9, maxDigits: 9 },
  { code: 'IE', dialCode: '+353', name: 'Ireland', flag: '🇮🇪', minDigits: 9, maxDigits: 9 },
  { code: 'NZ', dialCode: '+64', name: 'New Zealand', flag: '🇳🇿', minDigits: 9, maxDigits: 10 }
];

export const defaultCountryCode = countryCodes[0]; // India (+91)

export const validatePhoneNumber = (countryCode, phone) => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required.' };
  }

  const cleanPhone = phone.trim().replace(/[\s\-()]/g, '');

  if (!/^[0-9]+$/.test(cleanPhone)) {
    return { valid: false, error: 'Phone number must contain digits only.' };
  }

  if (countryCode === '+91' || countryCode === 'IN') {
    if (cleanPhone.length !== 10) {
      return {
        valid: false,
        error: `Indian (+91) phone numbers must be exactly 10 digits. Entered ${cleanPhone.length} digits.`
      };
    }
    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      return {
        valid: false,
        error: 'Indian mobile number must start with 6, 7, 8, or 9.'
      };
    }
    return { valid: true, cleanPhone };
  }

  const country = countryCodes.find((c) => c.dialCode === countryCode || c.code === countryCode);
  const minDigits = country ? country.minDigits : 7;
  const maxDigits = country ? country.maxDigits : 15;

  if (cleanPhone.length < minDigits || cleanPhone.length > maxDigits) {
    return {
      valid: false,
      error: `Phone number for ${country ? country.name : countryCode} must be between ${minDigits} and ${maxDigits} digits. Entered ${cleanPhone.length} digits.`
    };
  }

  return { valid: true, cleanPhone };
};
