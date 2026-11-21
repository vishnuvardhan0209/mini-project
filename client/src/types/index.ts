export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  targetRole: string;
  skills: string[];
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  title: string;
  subject: string;
  chapter?: string;
  topic?: string;
  content: string;
  fileType: string;
  uploadedAt: string;
}

export interface Question {
  id: string;
  documentId?: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestAnswerItem {
  id: string;
  testId: string;
  questionId: string;
  questionText: string;
  options: { A: string; B: string; C: string; D: string };
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  topic: string;
  difficulty: string;
  explanation: string;
}

export interface TopicScore {
  topic: string;
  total: number;
  correct: number;
  percentage: number;
  priority: 'high' | 'medium' | 'strong';
  recommendation: string;
}

export interface TestResult {
  id: string;
  userId: string;
  title: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  timeTaken: string;
  accuracy: number;
  topicBreakdown: TopicScore[];
  answers: TestAnswerItem[];
  createdAt: string;
}

export interface ResumeSectionSuggestion {
  section: string;
  currentFeedback: string;
  improvementTip: string;
  exampleSnippet?: string;
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  resumeName: string;
  overallScore: number;
  scores: {
    skills: number;
    projects: number;
    education: number;
    experience: number;
    formatting: number;
    atsCompatibility: number;
    keywords: number;
  };
  strengths: string[];
  areasToImprove: string[];
  sectionSuggestions: ResumeSectionSuggestion[];
  extractedSkills: string[];
  createdAt: string;
}

export interface JobMatch {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  matchScore: number;
  keywordMatchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string;
  resumeChanges: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface InterviewTurn {
  id: string;
  questionIndex: number;
  question: string;
  userAnswer?: string;
  feedback?: string;
  score?: number;
  timestamp: string;
}

export interface InterviewEvaluation {
  overallScore: number;
  technicalKnowledge: number;
  communication: number;
  answerQuality: number;
  summary: string;
  strengths: string[];
  missingConcepts: string[];
  recommendedTopics: string[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  interviewType: 'Technical' | 'HR' | 'Behavioral' | 'Mixed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'in-progress' | 'completed';
  turns: InterviewTurn[];
  evaluation?: InterviewEvaluation;
  createdAt: string;
}
