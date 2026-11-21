import { Router, Request, Response } from 'express';
import { getUserById, updateUser } from '../services/dbService.js';

const router = Router();

// Get profile
router.get('/', (req: Request, res: Response): void => {
  const userId = (req.query.userId as string) || 'user-alex-kumar';
  const user = getUserById(userId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, user });
});

// Update profile
router.put('/', (req: Request, res: Response): void => {
  try {
    const userId = req.body.id || 'user-alex-kumar';
    const { name, college, degree, targetRole, skills } = req.body;

    const updated = updateUser(userId, {
      name,
      college,
      degree,
      targetRole,
      skills: Array.isArray(skills) ? skills : undefined
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
  }
});

export default router;
