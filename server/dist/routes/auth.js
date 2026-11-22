import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { optionalAuth } from '../middleware/auth.js';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'interview_simulator_jwt_secret_key_secure_2026_x87!@';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
/**
 * Helper to serialize User model for client consumption
 */
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
// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { fullName, name, email, password, confirmPassword, college, degree, targetRole } = req.body;
        const resolvedFullName = (fullName || name || '').trim();
        // 1. Validation
        if (!resolvedFullName) {
            res.status(400).json({ success: false, message: 'Full name is required.' });
            return;
        }
        if (!email || typeof email !== 'string') {
            res.status(400).json({ success: false, message: 'Email address is required.' });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
            return;
        }
        if (!password || typeof password !== 'string') {
            res.status(400).json({ success: false, message: 'Password is required.' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
            return;
        }
        if (confirmPassword !== undefined && password !== confirmPassword) {
            res.status(400).json({ success: false, message: 'Passwords do not match.' });
            return;
        }
        // 2. Prevent duplicate email registration
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'An account with this email address already exists. Please sign in instead.'
            });
            return;
        }
        // 3. Hash password using bcrypt
        const passwordHash = await bcrypt.hash(password, 10);
        // 4. Save registered user details in PostgreSQL
        const newUser = await prisma.user.create({
            data: {
                fullName: resolvedFullName,
                email: normalizedEmail,
                passwordHash,
                college: college ? String(college).trim() : '',
                degree: degree ? String(degree).trim() : '',
                targetRole: targetRole ? String(targetRole).trim() : '',
                skills: ['Java', 'SQL', 'Git']
            }
        });
        // 5. Generate JWT token
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            message: 'Account registered successfully!',
            token,
            user: serializeUser(newUser)
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed due to a server error.'
        });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !String(email).trim()) {
            res.status(400).json({ success: false, message: 'Email address is required.' });
            return;
        }
        if (!password) {
            res.status(400).json({ success: false, message: 'Password is required.' });
            return;
        }
        const normalizedEmail = String(email).toLowerCase().trim();
        // Query user by email in PostgreSQL
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
            return;
        }
        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
            return;
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: serializeUser(user)
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Login failed due to a server error.'
        });
    }
});
// GET /api/auth/me (Get current authenticated user)
router.get('/me', optionalAuth, async (req, res) => {
    try {
        if (req.user?.userId) {
            const user = await prisma.user.findUnique({
                where: { id: req.user.userId }
            });
            if (user) {
                res.json({ success: true, user: serializeUser(user) });
                return;
            }
        }
        // Fallback: check if demo user exists for smooth experience
        const demoUser = await prisma.user.findUnique({
            where: { email: 'alex.kumar@example.com' }
        });
        if (demoUser) {
            res.json({ success: true, user: serializeUser(demoUser) });
            return;
        }
        res.status(401).json({
            success: false,
            message: 'Not authenticated.'
        });
    }
    catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving user session.' });
    }
});
// POST /api/auth/logout
router.post('/logout', (_req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully.'
    });
});
export default router;
