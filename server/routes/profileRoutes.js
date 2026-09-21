import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validatePhoneNumber } from '../data/countryCodesData.js';
import { resumeAnalysisService } from '../services/resumeAnalysisService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESUMES_DIR = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(RESUMES_DIR)) {
  fs.mkdirSync(RESUMES_DIR, { recursive: true });
}

const PHOTOS_DIR = path.join(__dirname, '..', 'uploads', 'photos');
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

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

// Helper: Magic byte validation for documents
const detectFileType = (buffer) => {
  if (buffer.length < 4) return null;

  // PDF: %PDF (25 50 44 46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { ext: 'pdf', mime: 'application/pdf' };
  }

  // DOCX: PK\x03\x04 (50 4B 03 04)
  if (buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
    return { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  }

  // DOC: \xD0\xCF\x11\xE0 (D0 CF 11 E0)
  if (buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0) {
    return { ext: 'doc', mime: 'application/msword' };
  }

  return null;
};

// Helper: Magic byte validation for images (JPEG, PNG, WebP, GIF)
const detectImageType = (buffer) => {
  if (buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { ext: 'png', mime: 'image/png' };
  }

  // WebP: RIFF ... WEBP (52 49 46 46 ... 57 45 42 50)
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer.length >= 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return { ext: 'webp', mime: 'image/webp' };
  }

  // GIF: GIF87a or GIF89a
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return { ext: 'gif', mime: 'image/gif' };
  }

  return null;
};

// GET /api/profile
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ profile: sanitizeUser(user), user: sanitizeUser(user) });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// PUT /api/profile - Update candidate profile with phone uniqueness
router.put('/', requireAuth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      name,
      college,
      collegeId,
      degree,
      graduationYear,
      academicYear,
      semester,
      gender,
      countryCode,
      phone,
      bio,
      github,
      linkedin,
      targetRole,
      targetRoleId,
      avatarUrl,
      verifiedSkills,
      skills,
      projects,
      certifications,
      experience,
      achievements,
      careerReadiness,
      roadmapProgress,
      primaryDomain,
      domainId,
      secondaryDomains,
      professionalHeadline,
      location,
      softSkills,
      careerPreferences
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (college !== undefined) updates.college = String(college).trim();
    if (collegeId !== undefined) updates.collegeId = collegeId ? String(collegeId).trim() : null;
    if (degree !== undefined) updates.degree = String(degree).trim();
    if (graduationYear !== undefined) updates.graduationYear = Number(graduationYear);
    if (academicYear !== undefined) updates.academicYear = String(academicYear).trim();
    if (semester !== undefined) updates.semester = String(semester).trim();
    if (gender !== undefined) updates.gender = String(gender).trim();
    if (bio !== undefined) updates.bio = String(bio).trim();
    if (github !== undefined) updates.github = String(github).trim();
    if (linkedin !== undefined) updates.linkedin = String(linkedin).trim();
    if (targetRole !== undefined) updates.targetRole = String(targetRole).trim();
    if (targetRoleId !== undefined) updates.targetRoleId = String(targetRoleId).trim();
    if (avatarUrl !== undefined) updates.avatarUrl = String(avatarUrl).trim();
    if (primaryDomain !== undefined) updates.primaryDomain = String(primaryDomain).trim();
    if (domainId !== undefined) updates.domainId = String(domainId).trim();
    if (secondaryDomains !== undefined && Array.isArray(secondaryDomains)) updates.secondaryDomains = secondaryDomains;
    if (professionalHeadline !== undefined) updates.professionalHeadline = String(professionalHeadline).trim();
    if (location !== undefined) updates.location = String(location).trim();
    if (softSkills !== undefined && Array.isArray(softSkills)) updates.softSkills = softSkills;
    if (careerPreferences !== undefined && typeof careerPreferences === 'object') updates.careerPreferences = careerPreferences;
    if (verifiedSkills !== undefined && Array.isArray(verifiedSkills)) updates.verifiedSkills = verifiedSkills;
    if (skills !== undefined && Array.isArray(skills)) updates.skills = skills;
    if (projects !== undefined && Array.isArray(projects)) updates.projects = projects;
    if (certifications !== undefined && Array.isArray(certifications)) updates.certifications = certifications;
    if (experience !== undefined && Array.isArray(experience)) updates.experience = experience;
    if (achievements !== undefined && Array.isArray(achievements)) updates.achievements = achievements;
    if (careerReadiness !== undefined) updates.careerReadiness = Number(careerReadiness);
    if (roadmapProgress !== undefined && typeof roadmapProgress === 'object') updates.roadmapProgress = roadmapProgress;

    // Phone update with validation and uniqueness
    if (phone !== undefined) {
      const activeCountryCode = countryCode || user.countryCode || '+91';
      const cleanPhone = String(phone).trim().replace(/[\s\-()]/g, '');

      if (cleanPhone && cleanPhone !== user.phone) {
        const phoneValidation = validatePhoneNumber(activeCountryCode, cleanPhone);
        if (!phoneValidation.valid) {
          return res.status(400).json({ error: phoneValidation.error });
        }

        // Enforce uniqueness: check if another account already has this phone
        const existingPhoneUser = await db.getUserByPhone(activeCountryCode, phoneValidation.cleanPhone);
        if (existingPhoneUser && existingPhoneUser.id !== user.id) {
          return res.status(409).json({
            error: 'This phone number is already registered to another account. Please use a different phone number.'
          });
        }

        updates.countryCode = activeCountryCode;
        updates.phone = phoneValidation.cleanPhone;
        updates.phoneVerified = false; // Reset verification on phone change
      }
    } else if (countryCode !== undefined) {
      updates.countryCode = countryCode.trim();
    }

    const updatedUser = await db.updateUser(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      profile: sanitizeUser(updatedUser),
      user: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profile/portfolio - Fetch authenticated candidate's verified technical portfolio
router.get('/portfolio', requireAuth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const portfolio = {
      studentId: user.studentId || user.id,
      name: user.name,
      targetRole: user.targetRole,
      careerReadiness: user.careerReadiness || 0,
      verifiedSkills: user.verifiedSkills || [],
      projects: user.projects || [],
      certifications: user.certifications || [],
      experience: user.experience || [],
      achievements: user.achievements || [],
      passportHash: user.passportHash,
      hasResume: Boolean(user.resume && (user.resume.filePath || user.resume.fileName)),
      resume: user.resume ? {
        fileName: user.resume.fileName,
        fileSizeBytes: user.resume.fileSizeBytes,
        fileSizeFormatted: user.resume.fileSizeFormatted,
        uploadedAt: user.resume.uploadedAt
      } : null,
      github: user.github || '',
      linkedin: user.linkedin || ''
    };

    return res.json({ portfolio });
  } catch (err) {
    console.error('Fetch portfolio error:', err);
    return res.status(500).json({ error: 'Failed to retrieve portfolio' });
  }
});

// PUT /api/profile/portfolio - Update candidate's technical portfolio items
router.put('/portfolio', requireAuth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { projects, certifications, experience, achievements, skills } = req.body;
    const updates = {};
    if (projects !== undefined && Array.isArray(projects)) updates.projects = projects;
    if (certifications !== undefined && Array.isArray(certifications)) updates.certifications = certifications;
    if (experience !== undefined && Array.isArray(experience)) updates.experience = experience;
    if (achievements !== undefined && Array.isArray(achievements)) updates.achievements = achievements;
    if (skills !== undefined && Array.isArray(skills)) updates.skills = skills;

    const updatedUser = await db.updateUser(user.id, updates);
    return res.json({
      message: 'Portfolio updated successfully',
      portfolio: {
        studentId: updatedUser.studentId || updatedUser.id,
        projects: updatedUser.projects,
        certifications: updatedUser.certifications,
        experience: updatedUser.experience,
        achievements: updatedUser.achievements,
        verifiedSkills: updatedUser.verifiedSkills
      }
    });
  } catch (err) {
    console.error('Update portfolio error:', err);
    return res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// POST /api/profile/photo - Upload and change profile photo
router.post('/photo', requireAuth, async (req, res) => {
  try {
    const { fileName, fileType, fileDataBase64 } = req.body;

    if (!fileDataBase64) {
      return res.status(400).json({ error: 'No photo data received.' });
    }

    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Strip data URI prefix if present
    const base64Clean = fileDataBase64.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({
        error: `Photo exceeds the 5MB size limit. Uploaded size: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB.`
      });
    }

    // Magic byte validation for image
    const detected = detectImageType(buffer);
    if (!detected) {
      return res.status(400).json({
        error: 'Invalid image format. Only valid JPEG, PNG, WebP, or GIF image files are permitted.'
      });
    }

    // Remove previous photo from disk if one exists
    if (user.photoFilePath && fs.existsSync(user.photoFilePath)) {
      try {
        fs.unlinkSync(user.photoFilePath);
      } catch (e) {
        console.warn('Could not remove previous photo:', e.message);
      }
    }

    // Save to server storage (local cache)
    const storageFileName = `${user.id}_${Date.now()}.${detected.ext}`;
    const storageFilePath = path.join(PHOTOS_DIR, storageFileName);
    try {
      fs.writeFileSync(storageFilePath, buffer);
    } catch (e) {
      console.warn('Could not write photo to disk storage:', e.message);
    }

    // Save persistently to PostgreSQL stored_files
    await db.saveStoredFile(user.id, 'photo', `${user.id}_photo.${detected.ext}`, detected.mime, buffer);

    const avatarUrl = `/api/profile/photo/${user.id}?t=${Date.now()}`;
    const updatedUser = await db.updateUser(user.id, {
      avatarUrl,
      photoFilePath: storageFilePath,
      photoMimeType: detected.mime
    });

    return res.json({
      message: 'Profile photo updated successfully',
      avatarUrl,
      user: sanitizeUser(updatedUser),
      profile: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error('Photo upload error:', err);
    return res.status(500).json({ error: 'Failed to process photo upload.' });
  }
});

// GET /api/profile/photo/:userId - Serve profile photo binary
router.get('/photo/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Check persistent PostgreSQL stored_files
    const stored = await db.getStoredFile(userId, 'photo');
    if (stored && stored.file_data) {
      const mimeType = stored.mime_type || 'image/jpeg';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(stored.file_data);
    }

    // 2. Check local disk fallback if exists
    const user = await db.getUserById(userId);
    if (user && user.photoFilePath && fs.existsSync(user.photoFilePath)) {
      const mimeType = user.photoMimeType || 'image/jpeg';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(path.resolve(user.photoFilePath));
    }

    // Fallback: redirect to default avatar
    return res.redirect('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
  } catch (err) {
    console.error('Fetch photo error:', err);
    return res.redirect('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
  }
});

// POST /api/profile/resume - Upload Resume with magic bytes & real content analysis
router.post('/resume', requireAuth, async (req, res) => {
  try {
    const { fileName, fileType, fileDataBase64 } = req.body;

    if (!fileDataBase64) {
      return res.status(400).json({ error: 'No file data received' });
    }

    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' });
    }

    // Strip base64 data URL header if present
    const base64Clean = fileDataBase64.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // 5MB Limit Check
    const MAX_SIZE = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({
        error: `File exceeds the 5MB size limit. Uploaded size: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB.`
      });
    }

    // Magic byte / signature check
    const detected = detectFileType(buffer);
    if (!detected) {
      return res.status(400).json({
        error: 'Invalid file format. Only valid PDF, DOC, and DOCX files are allowed (verified by file signature).'
      });
    }

    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Clean up old resume file if exists
    if (user.resume && user.resume.filePath && fs.existsSync(user.resume.filePath)) {
      try {
        fs.unlinkSync(user.resume.filePath);
      } catch (e) {
        console.warn('Could not delete old resume file:', e.message);
      }
    }

    // Save to server storage (local cache)
    const sanitizedExt = detected.ext;
    const safeBaseName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageFileName = `${user.id}_${Date.now()}.${sanitizedExt}`;
    const storageFilePath = path.join(RESUMES_DIR, storageFileName);
    try {
      fs.writeFileSync(storageFilePath, buffer);
    } catch (e) {
      console.warn('Could not write resume to disk storage:', e.message);
    }

    // Save persistently to PostgreSQL stored_files
    await db.saveStoredFile(user.id, 'resume', safeBaseName, detected.mime, buffer);

    const resumeMetadata = {
      fileName: safeBaseName,
      fileType: detected.mime,
      fileExt: sanitizedExt,
      fileSizeBytes: buffer.length,
      fileSizeFormatted: `${(buffer.length / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      filePath: storageFilePath,
      downloadUrl: '/api/profile/resume/download'
    };

    // Analyze resume content using the resumeAnalysisService
    const analysis = await resumeAnalysisService.analyzeResume(buffer, sanitizedExt, user.targetRole);

    const updatedUser = await db.updateUser(user.id, {
      resume: resumeMetadata,
      resumeAnalysis: analysis
    });

    return res.status(200).json({
      message: 'Resume uploaded, verified, and analyzed successfully',
      resume: resumeMetadata,
      resumeAnalysis: analysis,
      user: sanitizeUser(updatedUser),
      profile: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    return res.status(500).json({ error: 'Failed to process resume upload' });
  }
});

// GET /api/profile/resume/download - Download authenticated user's own resume
router.get('/resume/download', requireAuth, async (req, res) => {
  try {
    // 1. Check persistent PostgreSQL stored_files
    const stored = await db.getStoredFile(req.user.id, 'resume');
    if (stored && stored.file_data) {
      const mimeType = stored.mime_type || 'application/pdf';
      const downloadName = stored.original_filename || 'resume.pdf';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
      return res.send(stored.file_data);
    }

    // 2. Check disk file fallback if present
    const user = await db.getUserById(req.user.id);
    if (!user || !user.resume || !user.resume.filePath) {
      return res.status(404).json({ error: 'No resume uploaded for this account' });
    }

    if (!fs.existsSync(user.resume.filePath)) {
      return res.status(404).json({ error: 'Resume file not found on server' });
    }

    const mimeType = user.resume.fileType || 'application/octet-stream';
    const downloadName = user.resume.fileName || 'resume.pdf';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    return res.sendFile(path.resolve(user.resume.filePath));
  } catch (err) {
    console.error('Resume download error:', err);
    return res.status(500).json({ error: 'Failed to download resume' });
  }
});

// DELETE /api/profile/resume - Delete user's resume
router.delete('/resume', requireAuth, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.resume && user.resume.filePath && fs.existsSync(user.resume.filePath)) {
      try {
        fs.unlinkSync(user.resume.filePath);
      } catch (e) {
        console.warn('Failed to delete resume file from disk:', e.message);
      }
    }

    await db.deleteStoredFile(user.id, 'resume');
    const updatedUser = await db.updateUser(user.id, { resume: null, resumeAnalysis: null });

    return res.json({
      message: 'Resume removed successfully',
      resume: null,
      resumeAnalysis: null,
      user: sanitizeUser(updatedUser),
      profile: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error('Delete resume error:', err);
    return res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;
