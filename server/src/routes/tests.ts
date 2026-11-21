import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getTests, getTestById, saveTestResult } from '../services/dbService.js';
import { AIService } from '../services/aiService.js';
import { TestResult } from '../types/index.js';

const router = Router();

// Get all tests for user
router.get('/', (req: Request, res: Response): void => {
  const userId = (req.query.userId as string) || 'user-alex-kumar';
  const tests = getTests(userId);
  res.json({ success: true, tests });
});

// Get aggregated areas to improve
router.get('/areas-to-improve', (req: Request, res: Response): void => {
  const userId = (req.query.userId as string) || 'user-alex-kumar';
  const tests = getTests(userId);

  // Aggregate all topics across tests
  const topicStats: Record<string, { total: number; correct: number; subject: string }> = {};

  tests.forEach(test => {
    test.topicBreakdown.forEach(tb => {
      if (!topicStats[tb.topic]) {
        topicStats[tb.topic] = { total: 0, correct: 0, subject: test.subject };
      }
      topicStats[tb.topic].total += tb.total;
      topicStats[tb.topic].correct += tb.correct;
    });
  });

  const highPriority: any[] = [];
  const mediumPriority: any[] = [];
  const strongAreas: any[] = [];

  Object.entries(topicStats).forEach(([topic, stats]) => {
    const percentage = Math.round((stats.correct / stats.total) * 100);
    const item = {
      topic,
      subject: stats.subject,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      percentage,
      recommendation: ''
    };

    if (percentage < 50) {
      item.recommendation = `Revise core principles of ${topic}, solve fundamental MCQs, and review key formulas/diagrams.`;
      highPriority.push(item);
    } else if (percentage <= 75) {
      item.recommendation = `Practice intermediate-level problems and clarify edge-case questions in ${topic}.`;
      mediumPriority.push(item);
    } else {
      item.recommendation = `Maintain high consistency! Continue practicing advanced application-based scenarios.`;
      strongAreas.push(item);
    }
  });

  res.json({
    success: true,
    highPriority: highPriority.sort((a, b) => a.percentage - b.percentage),
    mediumPriority: mediumPriority.sort((a, b) => a.percentage - b.percentage),
    strongAreas: strongAreas.sort((a, b) => b.percentage - a.percentage),
    recommendedNextSteps: [
      'Revise high priority weak topics immediately before attempting new chapters',
      'Take a targeted 5-10 question re-test on low-scoring concepts',
      'Review detailed question explanations in the Question Review section',
      'Track your improvement over 7 days in the Progress Analytics dashboard'
    ]
  });
});

// Get specific test by id
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const test = getTestById(id);
  if (!test) {
    res.status(404).json({ success: false, message: 'Test result not found' });
    return;
  }
  res.json({ success: true, test });
});

// Submit a test
router.post('/submit', (req: Request, res: Response): void => {
  try {
    const {
      title,
      subject,
      questions,
      userAnswers,
      timeTakenSeconds = 300,
      userId = 'user-alex-kumar'
    } = req.body;

    if (!questions || !Array.isArray(questions)) {
      res.status(400).json({ success: false, message: 'Invalid questions payload' });
      return;
    }

    const evaluation = AIService.evaluateTest({
      testTitle: title || `${subject} Test`,
      subject: subject || 'General CS',
      questions,
      userAnswers: userAnswers || {},
      timeTakenSeconds
    });

    const testId = `test-${Date.now()}`;
    const answersWithTestId = evaluation.answers.map(ans => ({ ...ans, testId }));

    const newTest: TestResult = {
      id: testId,
      userId,
      title: title || `${subject} Knowledge Assessment`,
      subject: subject || 'Computer Science',
      score: evaluation.score,
      totalQuestions: evaluation.totalQuestions,
      correctAnswers: evaluation.correctAnswers,
      wrongAnswers: evaluation.wrongAnswers,
      unanswered: evaluation.unanswered,
      timeTaken: evaluation.timeTaken,
      accuracy: evaluation.accuracy,
      topicBreakdown: evaluation.topicBreakdown,
      answers: answersWithTestId,
      createdAt: new Date().toISOString()
    };

    saveTestResult(newTest);
    res.json({ success: true, test: newTest });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting test' });
  }
});

export default router;
