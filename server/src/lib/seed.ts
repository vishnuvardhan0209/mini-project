import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_JSON_PATH = path.resolve(__dirname, '../data/db.json');

export async function seedInitialData(): Promise<void> {
  try {
    // 1. Ensure Demo User Alex Kumar exists in PostgreSQL
    const demoEmail = 'alex.kumar@example.com';
    const existingDemo = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    let demoUserId = 'user-alex-kumar';

    if (!existingDemo) {
      const passwordHash = await bcrypt.hash('password123', 10);
      const createdUser = await prisma.user.create({
        data: {
          id: 'user-alex-kumar',
          fullName: 'Alex Kumar',
          email: demoEmail,
          passwordHash,
          college: 'National Institute of Technology',
          degree: 'B.Tech in Computer Science & Engineering',
          targetRole: 'Java Backend Developer',
          skills: [
            'Java',
            'Spring Boot',
            'SQL',
            'Git',
            'DSA',
            'REST APIs',
            'PostgreSQL',
            'Docker (Basics)',
          ],
        },
      });
      demoUserId = createdUser.id;
      console.log('✅ Demo user Alex Kumar initialized in PostgreSQL.');
    } else {
      demoUserId = existingDemo.id;
    }

    // 2. Read existing db.json to migrate documents, tests, resume analyses, job matches, chat, etc.
    if (fs.existsSync(DB_JSON_PATH)) {
      const raw = fs.readFileSync(DB_JSON_PATH, 'utf-8');
      const data = JSON.parse(raw);

      // Documents
      if (Array.isArray(data.documents)) {
        for (const doc of data.documents) {
          const exists = await prisma.documentItem.findUnique({ where: { id: doc.id } });
          if (!exists) {
            await prisma.documentItem.create({
              data: {
                id: doc.id,
                userId: demoUserId,
                title: doc.title,
                subject: doc.subject,
                chapter: doc.chapter || null,
                topic: doc.topic || null,
                content: doc.content || '',
                fileUrl: doc.fileUrl || null,
                fileType: doc.fileType || 'PDF',
                uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt) : new Date(),
              },
            });
          }
        }
      }

      // Tests
      if (Array.isArray(data.tests)) {
        for (const test of data.tests) {
          const exists = await prisma.testResult.findUnique({ where: { id: test.id } });
          if (!exists) {
            await prisma.testResult.create({
              data: {
                id: test.id,
                userId: demoUserId,
                title: test.title,
                subject: test.subject,
                score: Number(test.score) || 0,
                totalQuestions: Number(test.totalQuestions) || 0,
                correctAnswers: Number(test.correctAnswers) || 0,
                wrongAnswers: Number(test.wrongAnswers) || 0,
                unanswered: Number(test.unanswered) || 0,
                timeTaken: String(test.timeTaken || '10:00'),
                accuracy: Number(test.accuracy) || 0,
                topicBreakdown: test.topicBreakdown || [],
                answers: test.answers || [],
                createdAt: test.createdAt ? new Date(test.createdAt) : new Date(),
              },
            });
          }
        }
      }

      // Resume Analyses
      if (Array.isArray(data.resumeAnalyses)) {
        for (const res of data.resumeAnalyses) {
          const exists = await prisma.resumeAnalysis.findUnique({ where: { id: res.id } });
          if (!exists) {
            await prisma.resumeAnalysis.create({
              data: {
                id: res.id,
                userId: demoUserId,
                resumeName: res.resumeName || 'Resume.pdf',
                overallScore: Number(res.overallScore) || 0,
                scores: res.scores || {},
                strengths: Array.isArray(res.strengths) ? res.strengths : [],
                areasToImprove: Array.isArray(res.areasToImprove) ? res.areasToImprove : [],
                sectionSuggestions: res.sectionSuggestions || [],
                extractedSkills: Array.isArray(res.extractedSkills) ? res.extractedSkills : [],
                createdAt: res.createdAt ? new Date(res.createdAt) : new Date(),
              },
            });
          }
        }
      }

      // Job Matches
      if (Array.isArray(data.jobMatches)) {
        for (const jm of data.jobMatches) {
          const exists = await prisma.jobMatch.findUnique({ where: { id: jm.id } });
          if (!exists) {
            await prisma.jobMatch.create({
              data: {
                id: jm.id,
                userId: demoUserId,
                jobTitle: jm.jobTitle,
                company: jm.company,
                jobDescription: jm.jobDescription,
                matchScore: Number(jm.matchScore) || 0,
                keywordMatchPercentage: Number(jm.keywordMatchPercentage) || 0,
                matchedSkills: Array.isArray(jm.matchedSkills) ? jm.matchedSkills : [],
                missingSkills: Array.isArray(jm.missingSkills) ? jm.missingSkills : [],
                recommendations: jm.recommendations || '',
                resumeChanges: Array.isArray(jm.resumeChanges) ? jm.resumeChanges : [],
                createdAt: jm.createdAt ? new Date(jm.createdAt) : new Date(),
              },
            });
          }
        }
      }

      // Chat History
      if (Array.isArray(data.chatHistory)) {
        for (const msg of data.chatHistory) {
          const exists = await prisma.chatMessage.findUnique({ where: { id: msg.id } });
          if (!exists) {
            await prisma.chatMessage.create({
              data: {
                id: msg.id,
                userId: demoUserId,
                conversationId: msg.conversationId || 'conv-default',
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
              },
            });
          }
        }
      }

      // Interview Sessions
      if (Array.isArray(data.interviewSessions)) {
        for (const session of data.interviewSessions) {
          const exists = await prisma.interviewSession.findUnique({ where: { id: session.id } });
          if (!exists) {
            await prisma.interviewSession.create({
              data: {
                id: session.id,
                userId: demoUserId,
                role: session.role,
                interviewType: session.interviewType,
                difficulty: session.difficulty,
                status: session.status || 'in-progress',
                turns: session.turns || [],
                evaluation: session.evaluation || null,
                createdAt: session.createdAt ? new Date(session.createdAt) : new Date(),
              },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error during database seed / initialization:', error);
  }
}
