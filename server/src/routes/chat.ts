import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getChatMessages, addChatMessage, clearChat } from '../services/dbService.js';
import { AIService } from '../services/aiService.js';
import { ChatMessage } from '../types/index.js';

const router = Router();

// Get chat history
router.get('/history', (req: Request, res: Response): void => {
  const userId = (req.query.userId as string) || 'user-alex-kumar';
  const conversationId = (req.query.conversationId as string) || 'conv-default';
  const history = getChatMessages(userId, conversationId);
  res.json({ success: true, messages: history });
});

// Send message
router.post('/message', (req: Request, res: Response): void => {
  try {
    const {
      message,
      conversationId = 'conv-default',
      userId = 'user-alex-kumar'
    } = req.body;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Message cannot be empty' });
      return;
    }

    const userMsg: ChatMessage = {
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

    const botMsg: ChatMessage = {
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error processing chat message' });
  }
});

// Clear chat
router.post('/clear', (req: Request, res: Response): void => {
  const { conversationId = 'conv-default', userId = 'user-alex-kumar' } = req.body;
  clearChat(userId, conversationId);
  res.json({ success: true, message: 'Chat cleared successfully' });
});

export default router;
