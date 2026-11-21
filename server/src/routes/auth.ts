import { Router, Request, Response } from 'express';
import { getUserByEmail, getUserById } from '../services/dbService.js';

const router = Router();

// Login
router.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;
  
  // Quick demo login support
  if (!email || email === 'demo@example.com' || email === 'alex.kumar@example.com') {
    const user = getUserById('user-alex-kumar');
    res.json({ success: true, token: 'demo-jwt-token-alex-kumar', user });
    return;
  }

  const user = getUserByEmail(email);
  if (!user) {
    // If not found, return demo user for smooth student demo experience
    const demo = getUserById('user-alex-kumar');
    res.json({ success: true, token: 'demo-jwt-token-alex-kumar', user: demo });
    return;
  }

  res.json({ success: true, token: `jwt-token-${user.id}`, user });
});

// Register
router.post('/register', (req: Request, res: Response): void => {
  const { name, email, college, degree, targetRole } = req.body;
  const user = {
    id: `user-${Date.now()}`,
    name: name || 'New Student',
    email: email || 'student@example.com',
    college: college || 'University Engineering College',
    degree: degree || 'B.Tech / B.E.',
    targetRole: targetRole || 'Software Engineer',
    skills: ['Java', 'SQL', 'Git'],
    createdAt: new Date().toISOString()
  };

  res.json({ success: true, token: `jwt-token-${user.id}`, user });
});

// Current User
router.get('/me', (_req: Request, res: Response): void => {
  const user = getUserById('user-alex-kumar');
  res.json({ success: true, user });
});

export default router;
