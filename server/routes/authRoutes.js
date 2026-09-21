import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET, requireAuth, optionalAuth } from '../middleware/auth.js';
import { verificationService } from '../services/verificationService.js';
import { validatePhoneNumber } from '../data/countryCodesData.js';
import { validateStrongPassword } from '../utils/passwordPolicy.js';

const router = express.Router();

const sanitizeUser = (user) => {
  if (!user) return null;
  const {
    passwordHash,
    emailVerificationCode,
    phoneVerificationCode,
    resetPasswordToken,
    resetPasswordExpires,
    ...sanitized
  } = user;
  return sanitized;
};

// -----------------------------------------------------------
// POST /api/auth/register (or /signup)
// -----------------------------------------------------------
const handleRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      countryCode = '+91',
      phone,
      college,
      collegeId,
      degree,
      graduationYear,
      academicYear,
      semester,
      gender,
      targetRole,
      targetRoleId,
      role,
      primaryDomain,
      domainId,
      secondaryDomains,
      professionalHeadline,
      location
    } = req.body;

    // 1. Name validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    // 2. Email normalization & format check
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.toLowerCase().trim();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // 3. Strict Phone validation with Country Code
    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ error: 'Mobile phone number is required' });
    }

    const phoneValidation = validatePhoneNumber(countryCode, String(phone));
    if (!phoneValidation.valid) {
      return res.status(400).json({ error: phoneValidation.error });
    }

    // 4. Strict Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const passwordCheck = validateStrongPassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({
        error: passwordCheck.error,
        missingRequirements: passwordCheck.missing
      });
    }

    // 5. Enforce strict Database Uniqueness for Email
    const existingEmailUser = await db.getUserByEmail(cleanEmail);
    if (existingEmailUser) {
      return res.status(409).json({
        error: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    // 6. Enforce strict Database Uniqueness for Phone
    const existingPhoneUser = await db.getUserByPhone(countryCode, phoneValidation.cleanPhone);
    if (existingPhoneUser) {
      return res.status(409).json({
        error: 'An account with this mobile phone number already exists. Please use a different phone number or sign in.'
      });
    }

    // Hash password securely with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate real verification code records (15-min expiration, single-use)
    const emailVerificationRecord = verificationService.createVerificationRecord();
    const phoneVerificationRecord = verificationService.createVerificationRecord();

    const allowedRoles = ['industry', 'recruiter', 'faculty', 'college', 'admin', 'candidate', 'student'];
    let assignedRole = role && allowedRoles.includes(role.toLowerCase().trim()) ? role.toLowerCase().trim() : 'candidate';
    if (assignedRole === 'college') assignedRole = 'faculty';

    const newUser = await db.createUser({
      name: name.trim(),
      email: cleanEmail,
      role: assignedRole,
      countryCode,
      phone: phoneValidation.cleanPhone,
      phoneVerified: false,
      phoneVerificationCode: phoneVerificationRecord,
      emailVerified: false,
      emailVerificationCode: emailVerificationRecord,
      passwordHash,
      college: college ? String(college).trim() : 'ABC Institute of Technology',
      collegeId: collegeId ? String(collegeId).trim() : null,
      degree: degree ? String(degree).trim() : 'B.Tech (Bachelor of Technology)',
      graduationYear: Number(graduationYear) || 2026,
      academicYear: academicYear ? String(academicYear).trim() : '3rd Year',
      semester: semester !== undefined && semester !== null ? String(semester).trim() : '6th Semester',
      gender: gender ? String(gender).trim() : 'Prefer not to say',
      targetRole: targetRole ? String(targetRole).trim() : 'Full Stack Developer',
      targetRoleId: targetRoleId ? String(targetRoleId).trim() : undefined,
      primaryDomain: primaryDomain ? String(primaryDomain).trim() : 'Computer Science / Software Development',
      domainId: domainId ? String(domainId).trim() : undefined,
      secondaryDomains: Array.isArray(secondaryDomains) ? secondaryDomains : [],
      professionalHeadline: professionalHeadline ? String(professionalHeadline).trim() : '',
      location: location ? String(location).trim() : 'India'
    });

    // Dispatch or log email verification code
    const emailDelivery = await verificationService.sendEmailVerification(cleanEmail, emailVerificationRecord.code, name.trim());

    // Dispatch or log phone OTP
    const phoneDelivery = await verificationService.sendPhoneOtp(countryCode || '+91', phoneValidation.cleanPhone, phoneVerificationRecord.code, name.trim());

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Registration successful. Verification codes have been dispatched.',
      token,
      user: sanitizeUser(newUser),
      emailDelivery: { providerConfigured: emailDelivery.providerConfigured, provider: emailDelivery.provider },
      phoneDelivery: { providerConfigured: phoneDelivery.providerConfigured, provider: phoneDelivery.provider }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
};

router.post('/register', handleRegister);
router.post('/signup', handleRegister);

// -----------------------------------------------------------
// POST /api/auth/login
// -----------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await db.getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email address or password' });
    }

    if (user.isDeactivated) {
      return res.status(403).json({ error: 'This account has been deactivated by the system administrator.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// -----------------------------------------------------------
// GET /api/auth/me
// -----------------------------------------------------------
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user || user.isDeactivated) {
      return res.status(404).json({ error: 'User account not found or deactivated' });
    }
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// -----------------------------------------------------------
// POST /api/auth/verify-email
// -----------------------------------------------------------
router.post('/verify-email', optionalAuth, async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!code || !String(code).trim()) {
      return res.status(400).json({ error: 'Verification code is required' });
    }

    let user = null;
    if (req.user?.id) {
      user = await db.getUserById(req.user.id);
    } else if (email) {
      user = await db.getUserByEmail(String(email).trim().toLowerCase());
    }

    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    const validation = verificationService.validateCode(user.emailVerificationCode, code);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: 'Email is already verified',
        emailVerified: true
      });
    }

    // Mark verified and invalidate single-use code
    const updatedUser = await db.updateUser(user.id, {
      emailVerified: true,
      emailVerificationCode: {
        ...user.emailVerificationCode,
        used: true,
        verifiedAt: new Date().toISOString()
      }
    });

    return res.json({
      message: 'Email verified successfully!',
      emailVerified: true,
      user: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error('Email verification error:', err);
    return res.status(500).json({ error: 'Failed to verify email' });
  }
});

// -----------------------------------------------------------
// POST /api/auth/resend-email-verification
// -----------------------------------------------------------
router.post('/resend-email-verification', optionalAuth, async (req, res) => {
  try {
    const { email } = req.body;

    let user = null;
    if (req.user?.id) {
      user = await db.getUserById(req.user.id);
    } else if (email) {
      user = await db.getUserByEmail(String(email).trim().toLowerCase());
    }

    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    if (user.emailVerified) {
      return res.json({ message: 'Email is already verified' });
    }

    const newCodeRecord = verificationService.createVerificationRecord();
    await db.updateUser(user.id, {
      emailVerificationCode: newCodeRecord
    });

    const delivery = await verificationService.sendEmailVerification(user.email, newCodeRecord.code, user.name);

    return res.json({
      message: 'Verification code resent. Check your email or console logs.',
      delivery: { providerConfigured: delivery.providerConfigured, provider: delivery.provider }
    });
  } catch (err) {
    console.error('Resend email error:', err);
    return res.status(500).json({ error: 'Failed to resend verification code' });
  }
});

// -----------------------------------------------------------
// POST /api/auth/send-phone-otp
// -----------------------------------------------------------
router.post('/send-phone-otp', optionalAuth, async (req, res) => {
  try {
    const { countryCode, phone } = req.body;

    let user = null;
    if (req.user?.id) {
      user = await db.getUserById(req.user.id);
    } else if (phone) {
      const clean = String(phone).trim().replace(/[\s\-()]/g, '');
      user = await db.getUserByPhone(countryCode, clean);
    }

    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    const targetCountryCode = countryCode || user.countryCode || '+91';
    const targetPhone = phone ? String(phone).trim().replace(/[\s\-()]/g, '') : user.phone;

    const phoneValidation = validatePhoneNumber(targetCountryCode, targetPhone);
    if (!phoneValidation.valid) {
      return res.status(400).json({ error: phoneValidation.error });
    }

    const newOtpRecord = verificationService.createVerificationRecord();
    await db.updateUser(user.id, {
      countryCode: targetCountryCode,
      phone: phoneValidation.cleanPhone,
      phoneVerified: false,
      phoneVerificationCode: newOtpRecord
    });

    const delivery = await verificationService.sendPhoneOtp(targetCountryCode, phoneValidation.cleanPhone, newOtpRecord.code, user.name);

    return res.json({
      message: 'OTP sent to mobile phone. Check SMS or console logs.',
      delivery: { providerConfigured: delivery.providerConfigured, provider: delivery.provider }
    });
  } catch (err) {
    console.error('Send phone OTP error:', err);
    return res.status(500).json({ error: 'Failed to send phone OTP' });
  }
});

// -----------------------------------------------------------
// POST /api/auth/verify-phone
// -----------------------------------------------------------
router.post('/verify-phone', optionalAuth, async (req, res) => {
  try {
    const { countryCode, phone, code } = req.body;

    if (!code || !String(code).trim()) {
      return res.status(400).json({ error: 'OTP code is required' });
    }

    let user = null;
    if (req.user?.id) {
      user = await db.getUserById(req.user.id);
    } else if (phone) {
      const clean = String(phone).trim().replace(/[\s\-()]/g, '');
      user = await db.getUserByPhone(countryCode, clean);
    }

    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    const validation = verificationService.validateCode(user.phoneVerificationCode, code);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    if (user.phoneVerified) {
      return res.status(400).json({
        error: 'Phone number is already verified',
        phoneVerified: true
      });
    }

    const updatedUser = await db.updateUser(user.id, {
      phoneVerified: true,
      phoneVerificationCode: {
        ...user.phoneVerificationCode,
        used: true,
        verifiedAt: new Date().toISOString()
      }
    });

    return res.json({
      message: 'Phone number verified successfully!',
      phoneVerified: true,
      user: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error('Phone verification error:', err);
    return res.status(500).json({ error: 'Failed to verify phone' });
  }
});

// -----------------------------------------------------------
// POST /api/auth/forgot-password
// -----------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !String(email).trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await db.getUserByEmail(cleanEmail);

    // Prevent account enumeration by always returning success message
    if (user) {
      const resetToken = verificationService.generateSecureToken();
      await db.updateUser(user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 15 * 60 * 1000 // 15 mins
      });

      const delivery = await verificationService.sendPasswordReset(cleanEmail, resetToken, user.name);
      return res.json({
        message: 'If an account exists with that email, a password reset link has been dispatched.',
        devToken: !delivery.providerConfigured ? resetToken : undefined
      });
    }

    return res.json({
      message: 'If an account exists with that email, a password reset link has been dispatched.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// -----------------------------------------------------------
// POST /api/auth/reset-password
// -----------------------------------------------------------
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }

    // Validate strong password policy
    const policyCheck = validateStrongPassword(newPassword);
    if (!policyCheck.valid) {
      return res.status(400).json({
        error: policyCheck.error,
        missingRequirements: policyCheck.missing
      });
    }

    const user = await db.getUserByResetToken(token);
    if (!user) {
      return res.status(400).json({
        error: 'Password reset link is invalid or has expired. Please request a new one.'
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.updateUser(user.id, {
      passwordHash: newHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return res.json({
      message: 'Your password has been reset successfully. You may now sign in.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

// -----------------------------------------------------------
// POST /api/auth/change-password (Authenticated)
// -----------------------------------------------------------
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match.' });
    }

    const policyCheck = validateStrongPassword(newPassword);
    if (!policyCheck.valid) {
      return res.status(400).json({
        error: policyCheck.error,
        missingRequirements: policyCheck.missing
      });
    }

    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password does not match our records.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.updateUser(user.id, { passwordHash: newHash });

    return res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Failed to change password' });
  }
});

// -----------------------------------------------------------
// Real OAuth / Social Login Endpoints
// Providers: Google, GitHub, LinkedIn
// -----------------------------------------------------------
router.get('/oauth/:provider', (req, res) => {
  const provider = (req.params.provider || '').toLowerCase();
  const state = crypto.randomBytes(16).toString('hex');
  const redirectOrigin = process.env.PUBLIC_URL || 'http://localhost:3001';

  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(503).json({
        error: 'Google OAuth is not configured. Missing GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server environment.',
        providerConfigured: false
      });
    }

    let clientOrigin = req.query.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
      const parsed = new URL(clientOrigin);
      clientOrigin = parsed.origin;
    } catch {
      clientOrigin = 'http://localhost:5173';
    }

    const statePayload = {
      nonce: crypto.randomBytes(16).toString('hex'),
      origin: clientOrigin
    };
    const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url');

    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${redirectOrigin}/api/auth/oauth/google/callback`;
    const scope = encodeURIComponent('openid email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&prompt=consent&access_type=offline`;
    return res.json({ url: authUrl, providerConfigured: true });
  }

  if (provider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({
        error: 'GitHub OAuth is not configured. Missing GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.',
        providerConfigured: false
      });
    }
    const redirectUri = `${redirectOrigin}/api/auth/oauth/github/callback`;
    const scope = encodeURIComponent('read:user user:email');
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    return res.json({ url: authUrl, providerConfigured: true });
  }

  if (provider === 'linkedin') {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({
        error: 'LinkedIn OAuth is not configured. Missing LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET.',
        providerConfigured: false
      });
    }
    const redirectUri = `${redirectOrigin}/api/auth/oauth/linkedin/callback`;
    const scope = encodeURIComponent('openid profile email');
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;
    return res.json({ url: authUrl, providerConfigured: true });
  }

  return res.status(400).json({ error: `Unsupported OAuth provider: ${provider}` });
});

// Dedicated Google OAuth Callback Handler
router.get('/oauth/google/callback', async (req, res) => {
  const { code, state, error } = req.query;

  // 1. Resolve frontend origin from state parameter (with safe validation)
  let clientOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'));
      if (decoded && decoded.origin && typeof decoded.origin === 'string') {
        const parsed = new URL(decoded.origin);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          clientOrigin = parsed.origin;
        }
      }
    } catch (e) {
      console.warn('[Google OAuth] Could not parse state parameter:', e.message);
    }
  }
  const cleanOrigin = clientOrigin.replace(/\/+$/, '');

  // 2. Handle Google cancellation or errors returned from consent dialog
  if (error) {
    console.warn('[Google OAuth] Authorization error received from Google:', error);
    return res.redirect(`${cleanOrigin}/#/?auth_error=${encodeURIComponent(error)}&auth_provider=google`);
  }

  if (!code) {
    return res.redirect(`${cleanOrigin}/#/?auth_error=missing_code&auth_provider=google`);
  }

  // 3. Verify server credentials configured
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('[Google OAuth] Server missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
    return res.redirect(`${cleanOrigin}/#/?auth_error=provider_credentials_required&auth_provider=google`);
  }

  const redirectOrigin = process.env.PUBLIC_URL || 'http://localhost:3001';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${redirectOrigin}/api/auth/oauth/google/callback`;

  try {
    // 4. Exchange authorization code with Google Token Endpoint
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: tokenParams.toString()
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error('[Google OAuth] Token exchange error from Google:', tokenResponse.status, errBody);
      return res.redirect(`${cleanOrigin}/#/?auth_error=token_exchange_failed&auth_provider=google`);
    }

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error('[Google OAuth] Token endpoint did not return access_token:', tokenData);
      return res.redirect(`${cleanOrigin}/#/?auth_error=token_exchange_failed&auth_provider=google`);
    }

    // 5. Fetch user profile from Google UserInfo endpoint
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    if (!userinfoResponse.ok) {
      const errBody = await userinfoResponse.text();
      console.error('[Google OAuth] UserInfo fetch error from Google:', userinfoResponse.status, errBody);
      return res.redirect(`${cleanOrigin}/#/?auth_error=userinfo_failed&auth_provider=google`);
    }

    const userInfo = await userinfoResponse.json();
    const googleSub = userInfo.sub;
    const googleEmail = (userInfo.email || '').trim().toLowerCase();
    const googleName = userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || 'Google User';
    const googleAvatar = userInfo.picture || null;
    const emailVerified = userInfo.email_verified === true || userInfo.email_verified === 'true';

    if (!googleEmail || !googleSub) {
      console.error('[Google OAuth] UserInfo missing email or sub:', userInfo);
      return res.redirect(`${cleanOrigin}/#/?auth_error=userinfo_failed&auth_provider=google`);
    }

    // 6. User account resolution & persistence in db
    // First, check if already linked with this Google sub
    let user = await db.getUserByOAuth('google', googleSub);

    if (!user) {
      // Check if user already exists with this email address
      const existingByEmail = await db.getUserByEmail(googleEmail);
      if (existingByEmail) {
        // Link Google OAuth to the existing account - KEEP SAME USER ID
        const oauthProviders = { ...(existingByEmail.oauthProviders || {}), google: googleSub };
        const updates = { oauthProviders };
        if (emailVerified && !existingByEmail.emailVerified) {
          updates.emailVerified = true;
        }
        if ((!existingByEmail.avatarUrl || existingByEmail.avatarUrl.includes('images.unsplash.com')) && googleAvatar) {
          updates.avatarUrl = googleAvatar;
        }
        user = await db.updateUser(existingByEmail.id, updates);
      } else {
        // Create new persistent user account with unique usr_... ID
        user = await db.createUser({
          name: googleName,
          email: googleEmail,
          avatarUrl: googleAvatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
          emailVerified,
          oauthProviders: { google: googleSub },
          needsProfileCompletion: true,
          role: 'candidate'
        });
      }
    } else {
      // Existing linked user signing in
      const updates = {};
      if (emailVerified && !user.emailVerified) {
        updates.emailVerified = true;
      }
      if ((!user.avatarUrl || user.avatarUrl.includes('images.unsplash.com')) && googleAvatar) {
        updates.avatarUrl = googleAvatar;
      }
      if (Object.keys(updates).length > 0) {
        user = await db.updateUser(user.id, updates);
      }
    }

    // 7. Issue standard JWT session token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 8. Redirect user back to frontend with session token
    return res.redirect(`${cleanOrigin}/#/?auth_token=${encodeURIComponent(token)}&auth_provider=google`);
  } catch (err) {
    console.error('[Google OAuth] Unexpected error during authentication flow:', err);
    return res.redirect(`${cleanOrigin}/#/?auth_error=oauth_failed&auth_provider=google`);
  }
});

// OAuth Callback for other providers (GitHub, LinkedIn)
router.get('/oauth/:provider/callback', async (req, res) => {
  const provider = (req.params.provider || '').toLowerCase();
  const { code } = req.query;

  if (!code) {
    return res.redirect('/#/?authError=missing_code');
  }

  return res.redirect('/#/?authError=provider_credentials_required');
});

// -----------------------------------------------------------
// POST /api/auth/demo-preset (Permanently Disabled)
// -----------------------------------------------------------
router.post('/demo-preset', (req, res) => {
  return res.status(403).json({
    error: 'Demo preset auto-creation is permanently disabled. Live candidate profiles must be created through real registration.'
  });
});

export default router;
