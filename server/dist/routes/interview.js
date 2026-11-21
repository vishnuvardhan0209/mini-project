import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getInterviewSessions, getInterviewSessionById, saveInterviewSession, updateInterviewSession } from '../services/dbService.js';
import { AIService } from '../services/aiService.js';
const router = Router();
// Get sessions
router.get('/sessions', (req, res) => {
    const userId = req.query.userId || 'user-alex-kumar';
    const sessions = getInterviewSessions(userId);
    res.json({ success: true, sessions });
});
// Get session by id
router.get('/sessions/:id', (req, res) => {
    const { id } = req.params;
    const session = getInterviewSessionById(id);
    if (!session) {
        res.status(404).json({ success: false, message: 'Interview session not found' });
        return;
    }
    res.json({ success: true, session });
});
// Start new interview session
router.post('/start', (req, res) => {
    try {
        const { role = 'Java Developer', interviewType = 'Technical', difficulty = 'Intermediate', userId = 'user-alex-kumar' } = req.body;
        const questions = AIService.getInterviewQuestionsForRole(role, interviewType);
        const initialTurn = {
            id: `turn-1`,
            questionIndex: 1,
            question: questions[0] || 'Tell me about your primary technical stack and a challenging project you built.',
            timestamp: new Date().toISOString()
        };
        const newSession = {
            id: `session-${uuidv4().substring(0, 8)}`,
            userId,
            role,
            interviewType,
            difficulty,
            status: 'in-progress',
            turns: [initialTurn],
            createdAt: new Date().toISOString()
        };
        saveInterviewSession(newSession);
        res.json({
            success: true,
            session: newSession,
            currentQuestion: initialTurn.question,
            questionIndex: 1,
            totalQuestions: Math.min(questions.length, 4)
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error starting interview' });
    }
});
// Submit answer for current turn and get feedback / next question
router.post('/answer', (req, res) => {
    try {
        const { sessionId, answer } = req.body;
        if (!sessionId || !answer) {
            res.status(400).json({ success: false, message: 'sessionId and answer are required' });
            return;
        }
        const session = getInterviewSessionById(sessionId);
        if (!session) {
            res.status(404).json({ success: false, message: 'Session not found' });
            return;
        }
        const currentTurn = session.turns[session.turns.length - 1];
        const evaluation = AIService.evaluateAnswer(currentTurn.question, answer);
        currentTurn.userAnswer = answer;
        currentTurn.feedback = evaluation.feedback;
        currentTurn.score = evaluation.score;
        // Check if there are more questions
        const allQuestions = AIService.getInterviewQuestionsForRole(session.role, session.interviewType);
        const nextIndex = session.turns.length + 1;
        let nextQuestion = null;
        let isFinished = false;
        if (nextIndex <= Math.min(allQuestions.length, 3)) {
            nextQuestion = allQuestions[nextIndex - 1];
            const nextTurn = {
                id: `turn-${nextIndex}`,
                questionIndex: nextIndex,
                question: nextQuestion,
                timestamp: new Date().toISOString()
            };
            session.turns.push(nextTurn);
        }
        else {
            isFinished = true;
            session.status = 'completed';
            session.evaluation = AIService.generateInterviewReport(session.role, session.turns);
        }
        updateInterviewSession(sessionId, session);
        res.json({
            success: true,
            session,
            lastTurnEvaluation: {
                feedback: evaluation.feedback,
                score: evaluation.score
            },
            nextQuestion,
            isFinished,
            evaluation: session.evaluation
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error processing interview answer' });
    }
});
export default router;
