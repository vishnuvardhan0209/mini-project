import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { optionalAuth } from '../middleware/auth.js';
const router = Router();
function serializeUser(user) {
    return {
        id: user.id,
        fullName: user.fullName,
        name: user.fullName,
        email: user.email,
        college: user.college || '',
        degree: user.degree || '',
        targetRole: user.targetRole || '',
        skills: user.skills || [],
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
        updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt
    };
}
// GET /api/profile
router.get('/', optionalAuth, async (req, res) => {
    try {
        const targetUserId = req.user?.userId || req.query.userId || 'user-alex-kumar';
        let user = await prisma.user.findUnique({
            where: { id: targetUserId }
        });
        if (!user && targetUserId !== 'user-alex-kumar') {
            // Try finding by email if passed
            user = await prisma.user.findUnique({
                where: { email: targetUserId }
            });
        }
        if (!user) {
            // Fallback to first user in database
            user = await prisma.user.findFirst();
        }
        if (!user) {
            res.status(404).json({ success: false, message: 'User profile not found.' });
            return;
        }
        res.json({ success: true, user: serializeUser(user) });
    }
    catch (error) {
        console.error('Error retrieving profile:', error);
        res.status(500).json({ success: false, message: error.message || 'Error retrieving profile' });
    }
});
// PUT /api/profile
router.put('/', optionalAuth, async (req, res) => {
    try {
        const targetUserId = req.user?.userId || req.body.id || 'user-alex-kumar';
        const { name, fullName, college, degree, targetRole, skills } = req.body;
        const resolvedName = (fullName || name || '').trim();
        const existingUser = await prisma.user.findUnique({
            where: { id: targetUserId }
        });
        if (!existingUser) {
            res.status(404).json({ success: false, message: 'User not found.' });
            return;
        }
        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: {
                fullName: resolvedName ? resolvedName : undefined,
                college: college !== undefined ? String(college).trim() : undefined,
                degree: degree !== undefined ? String(degree).trim() : undefined,
                targetRole: targetRole !== undefined ? String(targetRole).trim() : undefined,
                skills: Array.isArray(skills) ? skills : undefined
            }
        });
        res.json({ success: true, user: serializeUser(updatedUser) });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
    }
});
export default router;
