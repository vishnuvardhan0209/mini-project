import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getResumeAnalyses, getLatestResume, saveResumeAnalysis } from '../services/dbService.js';
import { AIService } from '../services/aiService.js';
import { parseFileContent } from '../services/fileParser.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');
const upload = multer({
    dest: uploadDir,
    limits: { fileSize: 10 * 1024 * 1024 }
});
const router = Router();
// Get latest resume analysis
router.get('/latest', (req, res) => {
    const userId = req.user?.userId || req.query.userId || 'user-alex-kumar';
    const latest = getLatestResume(userId);
    res.json({ success: true, resume: latest || null });
});
// Get all resume analyses
router.get('/', (req, res) => {
    const userId = req.user?.userId || req.query.userId || 'user-alex-kumar';
    const list = getResumeAnalyses(userId);
    res.json({ success: true, resumes: list });
});
// Upload and analyze resume
router.post('/upload', upload.single('resume'), (req, res) => {
    try {
        const file = req.file;
        const userId = req.user?.userId || req.body.userId || 'user-alex-kumar';
        if (!file) {
            res.status(400).json({ success: false, message: 'No resume file uploaded' });
            return;
        }
        const text = parseFileContent(file.path, file.originalname, file.mimetype);
        const analysis = AIService.analyzeResume(text, file.originalname);
        analysis.userId = userId;
        saveResumeAnalysis(analysis);
        res.json({ success: true, analysis });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error analyzing resume' });
    }
});
// Analyze direct resume text (or sample resume)
router.post('/analyze-text', (req, res) => {
    try {
        const { resumeText, resumeName = 'Alex_Kumar_Resume.pdf', userId = req.user?.userId || 'user-alex-kumar' } = req.body;
        if (!resumeText || resumeText.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Resume text is required' });
            return;
        }
        const analysis = AIService.analyzeResume(resumeText, resumeName);
        analysis.userId = userId;
        saveResumeAnalysis(analysis);
        res.json({ success: true, analysis });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error analyzing resume' });
    }
});
export default router;
