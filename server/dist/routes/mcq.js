import { Router } from 'express';
import { AIService } from '../services/aiService.js';
import { getDocumentById } from '../services/dbService.js';
const router = Router();
// Generate MCQs
router.post('/generate', (req, res) => {
    try {
        const { documentId, subject = 'Computer Networks', chapter, topic, count = 10, difficulty = 'medium', questionType = 'mcq' } = req.body;
        let content = '';
        let selectedSubject = subject;
        let selectedTopic = topic;
        if (documentId) {
            const doc = getDocumentById(documentId);
            if (doc) {
                content = doc.content;
                selectedSubject = doc.subject || subject;
                selectedTopic = doc.topic || topic;
            }
        }
        const questions = AIService.generateMCQs({
            content,
            subject: selectedSubject,
            chapter,
            topic: selectedTopic,
            count: Number(count) || 10,
            difficulty,
            questionType
        });
        res.json({
            success: true,
            subject: selectedSubject,
            topic: selectedTopic,
            totalQuestions: questions.length,
            questions
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error generating MCQs' });
    }
});
export default router;
