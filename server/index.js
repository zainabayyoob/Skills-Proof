import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import { fileURLToPath } from 'url';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch (_) {}

import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import compilerRoutes from './routes/compilerRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import industryRoutes from './routes/industryRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env if present (Node 20+)
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envPath);
  } catch (err) {
    console.warn('[SkillProof] Warning loading .env file:', err.message);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads/resumes directory exists
const RESUMES_DIR = path.join(__dirname, 'uploads', 'resumes');
if (!fs.existsSync(RESUMES_DIR)) {
  fs.mkdirSync(RESUMES_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/faculty', collegeRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SkillProof Backend API',
    timestamp: new Date().toISOString()
  });
});

// Production Static File Serving
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

export { app };

const isMainModule = Boolean(
  process.argv[1] && (
    process.argv[1].replace(/\\/g, '/').endsWith('server/index.js') ||
    process.argv[1].replace(/\\/g, '/').endsWith('server/index') ||
    process.argv[1].replace(/\\/g, '/').endsWith('/server') ||
    process.argv[1].replace(/\\/g, '/').endsWith('\\server') ||
    path.resolve(process.argv[1]) === path.resolve(__filename) ||
    path.resolve(process.argv[1]) === path.resolve(__dirname)
  )
);

if (isMainModule) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkillProof] Backend server running on http://0.0.0.0:${PORT}`);
    console.log(`[SkillProof] Healthcheck available at http://0.0.0.0:${PORT}/api/health`);
  });
}
