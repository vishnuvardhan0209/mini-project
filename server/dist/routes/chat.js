import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getChatMessages, addChatMessage, clearChat } from '../services/dbService.js';
import { AIService } from '../services/aiService.js';
const router = Router();
// Get chat history
router.get('/history', (req, res) => {
    const userId = req.query.userId || 'user-alex-kumar';
    const conversationId = req.query.conversationId || 'conv-default';
    const history = getChatMessages(userId, conversationId);
    res.json({ success: true, messages: history });
});
// Send message
router.post('/message', (req, res) => {
    try {
        const { message, conversationId = 'conv-default', userId = 'user-alex-kumar' } = req.body;
        if (!message || message.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Message cannot be empty' });
            return;
        }
        const userMsg = {
            id: `msg-${uuidv4().substring(0, 8)}`,
            userId,
            conversationId,
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        addChatMessage(userMsg);
        // AI Career Advisor generates contextual response
        const aiResponseText = AIService.answerCareerQuestion(message);
        const botMsg = {
            id: `msg-${uuidv4().substring(0, 8)}`,
            userId,
            conversationId,
            role: 'assistant',
            content: aiResponseText,
            timestamp: new Date().toISOString()
        };
        addChatMessage(botMsg);
        res.json({
            success: true,
            userMessage: userMsg,
            botMessage: botMsg
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error processing chat message' });
    }
});
// Clear chat
router.post('/clear', (req, res) => {
    const { conversationId = 'conv-default', userId = 'user-alex-kumar' } = req.body;
    clearChat(userId, conversationId);
    res.json({ success: true, message: 'Chat cleared successfully' });
});
export default router;
