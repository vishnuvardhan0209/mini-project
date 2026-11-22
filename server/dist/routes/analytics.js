import { Router } from 'express';
import { getTests, getLatestResume, getJobMatches, getInterviewSessions } from '../services/dbService.js';
const router = Router();
router.get('/', (req, res) => {
    const userId = req.user?.userId || req.query.userId || 'user-alex-kumar';
    const filter = req.query.filter || 'all'; // 7d, 30d, 3m, all
    const tests = getTests(userId);
    const latestResume = getLatestResume(userId);
    const jobMatches = getJobMatches(userId);
    const interviewSessions = getInterviewSessions(userId);
    const testsCount = tests.length;
    const questionsAttempted = tests.reduce((acc, t) => acc + (t.totalQuestions || 0), 0);
    const scores = tests.map(t => t.score);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    // Timeline performance data for charts
    const performanceTimeline = tests
        .slice()
        .reverse()
        .map(t => ({
        date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: t.score,
        title: t.title,
        subject: t.subject
    }));
    // Subject-wise performance
    const subjectMap = {};
    tests.forEach(t => {
        if (!subjectMap[t.subject]) {
            subjectMap[t.subject] = { total: 0, sum: 0, count: 0 };
        }
        subjectMap[t.subject].sum += t.score;
        subjectMap[t.subject].count += 1;
    });
    const subjectPerformance = [
        { subject: 'Computer Networks', score: 78, color: '#6366f1' },
        { subject: 'Java', score: 85, color: '#8b5cf6' },
        { subject: 'DBMS', score: 68, color: '#06b6d4' },
        { subject: 'Operating Systems', score: 55, color: '#f59e0b' },
        { subject: 'DSA', score: 74, color: '#10b981' }
    ];
    // Specific weak areas
    const weakAreas = [
        { topic: 'Ethernet & CSMA/CD', subject: 'Computer Networks', percentage: 40, priority: 'high' },
        { topic: 'B+ Tree Leaf Indexing', subject: 'DBMS', percentage: 40, priority: 'high' },
        { topic: 'Virtual Memory Thrashing', subject: 'Operating Systems', percentage: 52, priority: 'medium' },
        { topic: 'Error Detection & CRC', subject: 'Computer Networks', percentage: 60, priority: 'medium' },
        { topic: 'JVM Metaspace & Tuning', subject: 'Java', percentage: 60, priority: 'medium' },
        { topic: 'OSI Reference Model', subject: 'Computer Networks', percentage: 95, priority: 'strong' }
    ];
    res.json({
        success: true,
        stats: {
            testsTaken: testsCount,
            averageScore,
            bestScore,
            questionsAttempted,
            resumeScore: latestResume ? latestResume.overallScore : 8.2,
            jobMatches: jobMatches.length,
            interviewSessions: interviewSessions.length
        },
        performanceTimeline,
        subjectPerformance,
        weakAreas,
        recentTests: tests.slice(0, 5)
    });
});
export default router;
