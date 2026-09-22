import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  School,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Phone,
  Search,
  Calendar,
  Check,
  KeyRound,
  ExternalLink,
  ChevronLeft,
  Layers,
  Compass,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { countryCodes, defaultCountryCode, validatePhoneNumber } from '../data/countryCodesData';
import { standardDegrees, academicYears, standardSemesters, genders, getSemestersForDegree } from '../data/degreesData';
import { collegesDirectory, searchColleges } from '../data/collegesData';
import { comprehensiveCareerRoles, getCareerRoleById, getCareerRoleByTitle } from '../data/careerRolesData';
import { technologyDomains, defaultPrimaryDomain, getDomainByIdOrName, getSuggestedRolesForDomain, getSecondaryInterestsForDomain } from '../data/domainsData';
import { checkPasswordRequirements, validateStrongPassword } from '../utils/passwordPolicy';
import { api } from '../services/api';

export const AuthModal = () => {
  const {
    authModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    loadDemoPreset,
    user,
    setUser,
    oauthError,
    clearOauthError,
  } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCountryCode, setRegCountryCode] = useState(defaultCountryCode.dialCode);
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // College autocomplete state
  const [collegeQuery, setCollegeQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('iit-bombay');
  const [customCollege, setCustomCollege] = useState('');
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const collegeRef = useRef(null);

  // Academic fields
  const [regDegree, setRegDegree] = useState(standardDegrees[0].name);
  const [customDegree, setCustomDegree] = useState('');
  const [regAcademicYear, setRegAcademicYear] = useState('3rd Year');
  const [regSemester, setRegSemester] = useState('6th Semester');
  const [regGender, setRegGender] = useState('Prefer not to say');
  const [regTargetRole, setRegTargetRole] = useState(comprehensiveCareerRoles[0].title);
  const [regPrimaryDomain, setRegPrimaryDomain] = useState(defaultPrimaryDomain);
  const [regSecondaryDomains, setRegSecondaryDomains] = useState([]);

  const handlePrimaryDomainChange = (domainName) => {
    setRegPrimaryDomain(domainName);
    const suggestedRoles = getSuggestedRolesForDomain(domainName);
    if (suggestedRoles && suggestedRoles.length > 0) {
      const resolved = getCareerRoleById(suggestedRoles[0]) || getCareerRoleByTitle(suggestedRoles[0]);
      setRegTargetRole(resolved.title);
    }
  };

  const handleToggleSecondaryDomain = (interest) => {
    setRegSecondaryDomains((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Forgot / Reset Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState('request'); // 'request' | 'reset'

  // Status & error states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOauthGuide, setShowOauthGuide] = useState(false);

  // Post-registration Verification Step
  const [showVerifyStep, setShowVerifyStep] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailVerifiedDone, setEmailVerifiedDone] = useState(false);
  const [phoneVerifiedDone, setPhoneVerifiedDone] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isResendingPhone, setIsResendingPhone] = useState(false);
  const [emailDeliveryInfo, setEmailDeliveryInfo] = useState(null);
  const [phoneDeliveryInfo, setPhoneDeliveryInfo] = useState(null);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  // Cooldown countdown interval
  useEffect(() => {
    if (!showVerifyStep) return;
    const interval = setInterval(() => {
      setEmailCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setPhoneCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showVerifyStep]);

  // Close college dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (collegeRef.current && !collegeRef.current.contains(e.target)) {
        setCollegeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync OAuth errors into modal error state
  useEffect(() => {
    if (oauthError) {
      setErrorMsg(oauthError);
    }
  }, [oauthError]);

  if (!authModalOpen) return null;

  const filteredColleges = searchColleges(collegeQuery);

  const handleSelectCollege = (college) => {
    if (college.id === 'other') {
      setSelectedCollegeId('other');
      setCollegeQuery('Other / Not Listed');
    } else {
      setSelectedCollegeId(college.id);
      setCollegeQuery(college.name);
      setCustomCollege('');
    }
    setCollegeDropdownOpen(false);
  };

  const handlePhoneInputChange = (e) => {
    const raw = e.target.value;
    if (regCountryCode === '+91') {
      const cleanDigits = raw.replace(/\D/g, '').slice(0, 10);
      setRegPhone(cleanDigits);
    } else {
      const cleanChars = raw.replace(/[^\d\s\-+]/g, '').slice(0, 15);
      setRegPhone(cleanChars);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login({ email: loginEmail, password: loginPassword });
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict Phone Validation
    const phoneValidation = validatePhoneNumber(regCountryCode, regPhone);
    if (!phoneValidation.valid) {
      setErrorMsg(phoneValidation.error);
      return;
    }

    // Strong Password Policy Validation
    const passwordValidation = validateStrongPassword(regPassword);
    if (!passwordValidation.valid) {
      setErrorMsg(passwordValidation.error);
      return;
    }

    const finalCollegeName =
      selectedCollegeId === 'other'
        ? customCollege.trim() || 'Other College'
        : collegeQuery.trim() || 'Indian Institute of Technology Bombay (IIT Bombay)';

    const finalDegreeName =
      regDegree.includes('Other')
        ? customDegree.trim() || 'Other Degree'
        : regDegree;

    setIsSubmitting(true);

    try {
      const regRes = await register({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        countryCode: regCountryCode,
        phone: phoneValidation.cleanPhone,
        password: regPassword,
        college: finalCollegeName,
        collegeId: selectedCollegeId,
        degree: finalDegreeName,
        academicYear: regAcademicYear,
        semester: regSemester,
        gender: regGender,
        domainId: getDomainByIdOrName(regPrimaryDomain).id,
        primaryDomain: getDomainByIdOrName(regPrimaryDomain).name,
        secondaryDomains: regSecondaryDomains,
        targetRoleId: getCareerRoleByTitle(regTargetRole).id,
        targetRole: getCareerRoleByTitle(regTargetRole).title,
      });

      // If verification is bypassed or user is already verified, finish registration immediately
      if (regRes?.requireVerification === false || (regRes?.user?.emailVerified && regRes?.user?.phoneVerified)) {
        setSuccessMsg('Account created successfully! Welcome to SkillProof.');
        closeAuthModal();
        return;
      }

      if (regRes?.emailDelivery) {
        setEmailDeliveryInfo(regRes.emailDelivery);
        if (regRes.emailDelivery.devCode) {
          setEmailOtp(regRes.emailDelivery.devCode);
        }
      }
      if (regRes?.phoneDelivery) {
        setPhoneDeliveryInfo(regRes.phoneDelivery);
        if (regRes.phoneDelivery.devCode) {
          setPhoneOtp(regRes.phoneDelivery.devCode);
        }
      }

      // Switch to Verification Step & Initialize 45s Cooldown (when verification is required)
      setShowVerifyStep(true);
      setEmailCooldown(45);
      setPhoneCooldown(45);
      setSuccessMsg('Account created successfully! Verification codes dispatched.');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Email or phone may already be registered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailOtp.trim()) return;
    setIsVerifyingEmail(true);
    setErrorMsg('');
    try {
      const res = await api.auth.verifyEmail({
        code: emailOtp.trim(),
        email: regEmail.trim().toLowerCase(),
      });
      setEmailVerifiedDone(true);
      if (res.user && setUser) setUser(res.user);
      setSuccessMsg('Email verified successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email verification code.');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneOtp.trim()) return;
    setIsVerifyingPhone(true);
    setErrorMsg('');
    try {
      const res = await api.auth.verifyPhone({
        code: phoneOtp.trim(),
        countryCode: regCountryCode,
        phone: regPhone.trim(),
      });
      setPhoneVerifiedDone(true);
      if (res.user && setUser) setUser(res.user);
      setSuccessMsg('Mobile phone verified successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid mobile phone OTP.');
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  const handleResendEmail = async () => {
    if (emailCooldown > 0 || isResendingEmail || emailVerifiedDone) return;
    setIsResendingEmail(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.auth.resendEmailVerification({ email: regEmail.trim().toLowerCase() });
      if (res.delivery) {
        setEmailDeliveryInfo(res.delivery);
        if (res.delivery.devCode) {
          setEmailOtp(res.delivery.devCode);
        } else {
          setEmailOtp('');
        }
      }
      setEmailCooldown(res.cooldownSeconds || 45);
      setSuccessMsg(res.message || 'New verification code sent. Check your email inbox.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend email verification code.');
      if (err.data?.cooldownRemaining) {
        setEmailCooldown(err.data.cooldownRemaining);
      }
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleResendPhone = async () => {
    if (phoneCooldown > 0 || isResendingPhone || phoneVerifiedDone) return;
    setIsResendingPhone(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.auth.sendPhoneOtp({
        countryCode: regCountryCode,
        phone: regPhone.trim(),
      });
      if (res.delivery) {
        setPhoneDeliveryInfo(res.delivery);
        if (res.delivery.devCode) {
          setPhoneOtp(res.delivery.devCode);
        } else {
          setPhoneOtp('');
        }
      }
      setPhoneCooldown(res.cooldownSeconds || 45);
      setSuccessMsg(res.message || 'New mobile OTP sent. Check your SMS messages.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend mobile OTP.');
      if (err.data?.cooldownRemaining) {
        setPhoneCooldown(err.data.cooldownRemaining);
      }
    } finally {
      setIsResendingPhone(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (clearOauthError) clearOauthError();
    try {
      const data = await api.auth.getOAuthUrl(provider, { origin: window.location.origin });
      if (data && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setErrorMsg(
        err.message ||
          `${provider.toUpperCase()} OAuth requires client credentials configured in the server environment (.env).`
      );
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await api.auth.forgotPassword(forgotEmail.trim().toLowerCase());
      setSuccessMsg(res.message || 'If an account exists, a password reset token has been dispatched.');
      if (res.devToken) {
        setResetToken(res.devToken);
      }
      setResetStep('reset');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch password reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (resetNewPassword !== resetConfirmPassword) {
      setErrorMsg('New password and confirmation password do not match.');
      return;
    }

    const passVal = validateStrongPassword(resetNewPassword);
    if (!passVal.valid) {
      setErrorMsg(passVal.error);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.auth.resetPassword({
        token: resetToken.trim(),
        newPassword: resetNewPassword,
      });
      setSuccessMsg(res.message || 'Password reset successful! You can now sign in.');
      setTimeout(() => {
        setAuthModalTab('login');
        setResetStep('request');
        setResetToken('');
        setResetNewPassword('');
        setResetConfirmPassword('');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneDigitsCount = regPhone.replace(/\D/g, '').length;
  const regPasswordRequirements = checkPasswordRequirements(regPassword);
  const resetPasswordRequirements = checkPasswordRequirements(resetNewPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-brand-500/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight">
                SkillProof Candidate Account
              </h3>
              <p className="text-[11px] text-slate-400">
                Permanent unique user ID & verified technical portfolio
              </p>
            </div>
          </div>
          {(!showVerifyStep || (emailVerifiedDone && phoneVerifiedDone)) && (
            <button
              onClick={closeAuthModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Switcher (hide during verify step or forgot-password) */}
        {!showVerifyStep && authModalTab !== 'forgot-password' && (
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1 m-4 mb-2 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authModalTab === 'login'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authModalTab === 'register'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Banners */}
        {errorMsg && (
          <div className="mx-4 mt-2 space-y-2">
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold leading-relaxed">{errorMsg}</p>
                {errorMsg.includes('Google OAuth is not configured') && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowOauthGuide((prev) => !prev)}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {showOauthGuide ? '▲ Hide Quick Setup Guide' : '▼ What is OAuth & How to configure in 2 minutes'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {showOauthGuide && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 text-xs space-y-2.5">
                <div className="space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> What is OAuth?
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    OAuth (Open Authorization) is the secure standard that allows signing into apps using your Google account without sharing your password.
                  </p>
                </div>
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <p className="font-bold text-white">How to enable official Google Sign-In:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-brand-400 underline">Google Cloud Console Credentials</a>.</li>
                    <li>Create an <strong>OAuth client ID</strong> (Web Application).</li>
                    <li>Add Authorized redirect URI: <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">http://localhost:3001/api/auth/oauth/google/callback</code></li>
                    <li>Paste your Client ID & Secret in <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">.env</code> in the project root.</li>
                  </ol>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                  💡 <strong>Immediate Access:</strong> You can already sign in using your Email & Password above (or click <strong>Quick Demo Login</strong> below) without configuring Google Cloud!
                </div>
              </div>
            )}
          </div>
        )}
        {successMsg && !errorMsg && (
          <div className="mx-4 mt-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 pt-3 overflow-y-auto max-h-[72vh] space-y-4">
          {showVerifyStep ? (
            /* Post-Registration Verification Screen */
            <div className="space-y-4">
              <div className="p-4 bg-brand-950/40 border border-brand-800/60 rounded-2xl space-y-1.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Verify Email & Mobile Phone
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Verification codes (6 digits, valid for 15 mins) have been generated. Enter each code below to activate your candidate profile.
                </p>
              </div>

              {/* Email Verification Form */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Verification Code
                  </label>
                  {emailVerifiedDone ? (
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-semibold">Pending Verification</span>
                  )}
                </div>
                {!emailVerifiedDone ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength="6"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={isVerifyingEmail || emailOtp.length < 6}
                        className="px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        {isVerifyingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>Didn't receive the code?</span>
                        {emailCooldown > 0 ? (
                          <span className="text-slate-500 font-medium">
                            Resend available in {emailCooldown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendEmail}
                            disabled={isResendingEmail || emailVerifiedDone}
                            className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                          >
                            {isResendingEmail ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <span>Resend code</span>
                            )}
                          </button>
                        )}
                      </div>
                      {emailDeliveryInfo?.devCode && (
                        <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Dev Code: {emailDeliveryInfo.devCode}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">Email address {regEmail} has been verified.</p>
                )}
              </div>

              {/* Phone Verification Form */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Mobile OTP Code
                  </label>
                  {phoneVerifiedDone ? (
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-semibold">Pending Verification</span>
                  )}
                </div>
                {!phoneVerifiedDone ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength="6"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhone}
                        disabled={isVerifyingPhone || phoneOtp.length < 6}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        {isVerifyingPhone ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>Didn't receive the code?</span>
                        {phoneCooldown > 0 ? (
                          <span className="text-slate-500 font-medium">
                            Resend available in {phoneCooldown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendPhone}
                            disabled={isResendingPhone || phoneVerifiedDone}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                          >
                            {isResendingPhone ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <span>Resend code</span>
                            )}
                          </button>
                        )}
                      </div>
                      {phoneDeliveryInfo?.devCode && (
                        <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Dev Code: {phoneDeliveryInfo.devCode}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">Phone {regCountryCode} {regPhone} has been verified.</p>
                )}
              </div>

              <button
                type="button"
                onClick={closeAuthModal}
                disabled={!emailVerifiedDone || !phoneVerifiedDone}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{emailVerifiedDone && phoneVerifiedDone ? 'Enter SkillProof Portal' : 'Verify Email & Phone to Proceed'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : authModalTab === 'forgot-password' ? (
            /* Forgot Password / Reset Password Screen */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Sign In
                </button>
                <span className="text-xs font-bold text-brand-400 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> Password Recovery
                </span>
              </div>

              {resetStep === 'request' ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                  <p className="text-xs text-slate-300">
                    Enter your registered email address. We will generate and dispatch a secure 15-minute password reset token.
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-400" /> Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. yourname@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !forgotEmail.trim()}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Send Password Reset Token</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                  <div className="p-3 bg-brand-950/40 border border-brand-800/50 rounded-xl text-xs text-slate-300">
                    A reset token has been dispatched. Enter the token below to establish your new password.
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-brand-400" /> Reset Token *
                    </label>
                    <input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Paste 64-character token"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-brand-400" /> New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-600"
                    />
                    {/* Live Password Checklist for Reset */}
                    {resetNewPassword.length > 0 && (
                      <div className="p-2.5 mt-1.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-[11px]">
                        {resetPasswordRequirements.map((r) => (
                          <div
                            key={r.id}
                            className={`flex items-center gap-1.5 ${
                              r.met ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                            }`}
                          >
                            {r.met ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                            <span>{r.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-brand-400" /> Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !resetToken || !resetNewPassword}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Reset Password & Proceed</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : authModalTab === 'login' ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your.email@university.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-400" /> Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('forgot-password');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Social Login Separator */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-3 text-slate-500 text-[10px] tracking-wider font-semibold">
                    Or Continue With OAuth
                  </span>
                </div>
              </div>

              {/* Real OAuth Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  className="py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:text-white"
                  title="Sign in with Google OAuth"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('github')}
                  className="py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:text-white"
                  title="Sign in with GitHub OAuth"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('linkedin')}
                  className="py-2.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:text-white"
                  title="Sign in with LinkedIn OAuth"
                >
                  <svg className="w-3.5 h-3.5 fill-[#0A66C2] shrink-0" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                </button>
              </div>
            </form>
          ) : (
            /* Create Account Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-400" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Zainab Ayoob"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Phone with Country Code Selector & Strict 10-Digit Validation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-400" /> Mobile Number *
                  </label>
                  {regCountryCode === '+91' && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        phoneDigitsCount === 10
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      India (+91): {phoneDigitsCount}/10 digits {phoneDigitsCount === 10 ? '✓' : '(Strict 10)'}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <select
                    value={regCountryCode}
                    onChange={(e) => setRegCountryCode(e.target.value)}
                    className="w-32 px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.dialCode}>
                        {c.flag} {c.dialCode} ({c.code})
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    required
                    maxLength={regCountryCode === '+91' ? 10 : 15}
                    value={regPhone}
                    onChange={handlePhoneInputChange}
                    placeholder={regCountryCode === '+91' ? '9876543210 (10 digits)' : 'Mobile number'}
                    className={`flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 ${
                      regCountryCode === '+91' && phoneDigitsCount > 0 && phoneDigitsCount !== 10
                        ? 'border-amber-500/50 focus:ring-amber-500'
                        : 'border-slate-800 focus:ring-brand-500'
                    }`}
                  />
                </div>
              </div>

              {/* Password with Live Policy Checklist */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-400" /> Password * (Strong Policy)
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-600"
                />

                {/* Password Criteria Checklist */}
                {regPassword.length > 0 && (
                  <div className="p-2.5 mt-1.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-[11px]">
                    {regPasswordRequirements.map((r) => (
                      <div
                        key={r.id}
                        className={`flex items-center gap-1.5 ${
                          r.met ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                        }`}
                      >
                        {r.met ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                        <span>{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* College Autocomplete (250+ Accredited Indian Universities/Colleges) */}
              <div className="space-y-1 relative" ref={collegeRef}>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-brand-400" /> College / University * (250+ Institutions)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={collegeQuery}
                    onFocus={() => setCollegeDropdownOpen(true)}
                    onChange={(e) => {
                      setCollegeQuery(e.target.value);
                      setSelectedCollegeId('');
                      setCollegeDropdownOpen(true);
                    }}
                    placeholder="Search institution (e.g. IIT, NIT, BITS, Amity, SRM, VIT...)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none pr-8"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
                </div>

                {/* College Suggestions Dropdown */}
                {collegeDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-xl space-y-0.5 p-1">
                    {filteredColleges.slice(0, 15).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCollege(c)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.city}, {c.state} • {c.tier}</p>
                        </div>
                        {selectedCollegeId === c.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    ))}
                    {filteredColleges.length === 0 && (
                      <button
                        type="button"
                        onClick={() => handleSelectCollege({ id: 'other', name: collegeQuery })}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-brand-300 font-semibold"
                      >
                        + Use custom: "{collegeQuery}"
                      </button>
                    )}
                  </div>
                )}

                {/* Custom College Input if Other */}
                {selectedCollegeId === 'other' && (
                  <input
                    type="text"
                    required
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    placeholder="Enter your college / university name"
                    className="w-full mt-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-brand-500/50 text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Degree, Academic Year, Semester, Gender Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Degree Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-400" /> Degree
                  </label>
                  <select
                    value={regDegree}
                    onChange={(e) => setRegDegree(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {standardDegrees.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Year */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Academic Year
                  </label>
                  <select
                    value={regAcademicYear}
                    onChange={(e) => setRegAcademicYear(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {academicYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Semester */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Current Semester
                  </label>
                  <select
                    value={regSemester}
                    onChange={(e) => setRegSemester(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {getSemestersForDegree(regDegree).map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Technology Domain (Mandatory) */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-brand-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-400" /> Primary Domain * (Career Focus)
                  </label>
                  <span className="text-[10px] text-brand-300 font-mono bg-brand-500/20 px-2 py-0.5 rounded border border-brand-500/30">
                    Required
                  </span>
                </div>
                <select
                  value={regPrimaryDomain}
                  onChange={(e) => handlePrimaryDomainChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {technologyDomains.map((dom) => (
                    <option key={dom.id} value={dom.name}>
                      {dom.name} ({dom.category})
                    </option>
                  ))}
                </select>
                {(() => {
                  const currentDom = technologyDomains.find((d) => d.name === regPrimaryDomain) || technologyDomains[0];
                  return (
                    <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
                      {currentDom.description}
                    </p>
                  );
                })()}

                {/* Secondary Areas of Interest (Optional Multi-Select Pills) */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-300 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-400" /> Secondary Areas of Interest:
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {regSecondaryDomains.length} selected (Optional)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {getSecondaryInterestsForDomain(regPrimaryDomain).map((interest) => {
                      const isSelected = regSecondaryDomains.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleToggleSecondaryDomain(interest)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 font-semibold shadow-sm'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-brand-400" />}
                          <span>{interest}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Target Career Track Selector (23 Canonical Technology Tracks) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" /> Target Career Track
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                    Auto-Linked to Domain
                  </span>
                </div>
                <select
                  value={regTargetRole}
                  onChange={(e) => setRegTargetRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {comprehensiveCareerRoles.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account & Start</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
