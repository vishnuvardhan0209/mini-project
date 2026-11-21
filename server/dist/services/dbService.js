import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../data/db.json');
function readDb() {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const initial = {
                users: [],
                documents: [],
                tests: [],
                resumeAnalyses: [],
                jobMatches: [],
                chatHistory: [],
                interviewSessions: []
            };
            fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
            return initial;
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading database file:', error);
        return {
            users: [],
            documents: [],
            tests: [],
            resumeAnalyses: [],
            jobMatches: [],
            chatHistory: [],
            interviewSessions: []
        };
    }
}
function writeDb(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    }
    catch (error) {
        console.error('Error writing to database file:', error);
    }
}
// User CRUD
export function getUserById(id) {
    const db = readDb();
    return db.users.find(u => u.id === id);
}
export function getUserByEmail(email) {
    const db = readDb();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}
export function updateUser(id, updates) {
    const db = readDb();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1)
        return null;
    db.users[index] = { ...db.users[index], ...updates };
    writeDb(db);
    return db.users[index];
}
// Documents CRUD
export function getDocuments(userId) {
    const db = readDb();
    return db.documents.filter(d => d.userId === userId);
}
export function getDocumentById(id) {
    const db = readDb();
    return db.documents.find(d => d.id === id);
}
export function addDocument(doc) {
    const db = readDb();
    db.documents.unshift(doc);
    writeDb(db);
    return doc;
}
export function deleteDocument(id, userId) {
    const db = readDb();
    const initialLen = db.documents.length;
    db.documents = db.documents.filter(d => !(d.id === id && d.userId === userId));
    if (db.documents.length !== initialLen) {
        writeDb(db);
        return true;
    }
    return false;
}
// Tests CRUD
export function getTests(userId) {
    const db = readDb();
    return db.tests.filter(t => t.userId === userId);
}
export function getTestById(id) {
    const db = readDb();
    return db.tests.find(t => t.id === id);
}
export function saveTestResult(test) {
    const db = readDb();
    db.tests.unshift(test);
    writeDb(db);
    return test;
}
// Resume CRUD
export function getResumeAnalyses(userId) {
    const db = readDb();
    return db.resumeAnalyses.filter(r => r.userId === userId);
}
export function getLatestResume(userId) {
    const list = getResumeAnalyses(userId);
    return list[0];
}
export function saveResumeAnalysis(analysis) {
    const db = readDb();
    db.resumeAnalyses.unshift(analysis);
    writeDb(db);
    return analysis;
}
// Job Matches CRUD
export function getJobMatches(userId) {
    const db = readDb();
    return db.jobMatches.filter(j => j.userId === userId);
}
export function getJobMatchById(id) {
    const db = readDb();
    return db.jobMatches.find(j => j.id === id);
}
export function saveJobMatch(match) {
    const db = readDb();
    db.jobMatches.unshift(match);
    writeDb(db);
    return match;
}
// Chat History CRUD
export function getChatMessages(userId, conversationId = 'conv-default') {
    const db = readDb();
    return db.chatHistory.filter(c => c.userId === userId && c.conversationId === conversationId);
}
export function addChatMessage(msg) {
    const db = readDb();
    db.chatHistory.push(msg);
    writeDb(db);
    return msg;
}
export function clearChat(userId, conversationId = 'conv-default') {
    const db = readDb();
    db.chatHistory = db.chatHistory.filter(c => !(c.userId === userId && c.conversationId === conversationId));
    writeDb(db);
}
// Interview Sessions CRUD
export function getInterviewSessions(userId) {
    const db = readDb();
    return db.interviewSessions.filter(s => s.userId === userId);
}
export function getInterviewSessionById(id) {
    const db = readDb();
    return db.interviewSessions.find(s => s.id === id);
}
export function saveInterviewSession(session) {
    const db = readDb();
    db.interviewSessions.unshift(session);
    writeDb(db);
    return session;
}
export function updateInterviewSession(id, updates) {
    const db = readDb();
    const index = db.interviewSessions.findIndex(s => s.id === id);
    if (index === -1)
        return null;
    db.interviewSessions[index] = { ...db.interviewSessions[index], ...updates };
    writeDb(db);
    return db.interviewSessions[index];
}
