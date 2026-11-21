import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import documentsRouter from './routes/documents.js';
import mcqRouter from './routes/mcq.js';
import testsRouter from './routes/tests.js';
import resumeRouter from './routes/resume.js';
import jobMatchRouter from './routes/jobMatch.js';
import chatRouter from './routes/chat.js';
import interviewRouter from './routes/interview.js';
import analyticsRouter from './routes/analytics.js';
import profileRouter from './routes/profile.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/mcq', mcqRouter);
app.use('/api/tests', testsRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/job-match', jobMatchRouter);
app.use('/api/chat', chatRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/profile', profileRouter);

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'AI Interview Simulator API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'An internal server error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Interview Simulator Server running on http://localhost:${PORT}`);
});

export default app;
