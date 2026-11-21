import { Router } from 'express';
import { getJobMatches, getJobMatchById, saveJobMatch, getLatestResume } from '../services/dbService.js';
import { AIService } from '../services/aiService.js';
const router = Router();
// Get job match history
router.get('/', (req, res) => {
    const userId = req.query.userId || 'user-alex-kumar';
    const matches = getJobMatches(userId);
    res.json({ success: true, jobMatches: matches });
});
// Get specific job match
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const match = getJobMatchById(id);
    if (!match) {
        res.status(404).json({ success: false, message: 'Job match record not found' });
        return;
    }
    res.json({ success: true, jobMatch: match });
});
// Analyze Job Match
router.post('/analyze', (req, res) => {
    try {
        const { jobTitle, company = 'Target Tech Company', jobDescription, resumeText, userId = 'user-alex-kumar' } = req.body;
        if (!jobTitle || !jobDescription) {
            res.status(400).json({ success: false, message: 'Job title and job description are required' });
            return;
        }
        // Use provided resume text or fall back to user's saved resume
        let effectiveResume = resumeText;
        if (!effectiveResume) {
            const latest = getLatestResume(userId);
            if (latest && latest.extractedSkills) {
                effectiveResume = `Skills: ${latest.extractedSkills.join(', ')}. Experience in software engineering, backend services, and database management.`;
            }
            else {
                effectiveResume = 'Alex Kumar - Java, Spring Boot, SQL, PostgreSQL, REST APIs, Git, Data Structures & Algorithms';
            }
        }
        const match = AIService.matchJobDescription({
            resumeText: effectiveResume,
            jobTitle,
            company,
            jobDescription
        });
        match.userId = userId;
        saveJobMatch(match);
        res.json({ success: true, jobMatch: match });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error analyzing job match' });
    }
});
export default router;
