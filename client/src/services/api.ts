const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers: options.body instanceof FormData ? undefined : headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email?: string, password?: string) =>
    fetchApi<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  register: (data: any) =>
    fetchApi<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getMe: () => fetchApi<any>('/auth/me'),

  // Documents
  getDocuments: (userId?: string) =>
    fetchApi<{ success: boolean; documents: any[] }>(`/documents${userId ? `?userId=${userId}` : ''}`),
  uploadDocument: (formData: FormData) =>
    fetchApi<{ success: boolean; document: any }>('/documents/upload', {
      method: 'POST',
      body: formData
    }),
  pasteDocument: (data: { title: string; subject: string; chapter?: string; topic?: string; content: string }) =>
    fetchApi<{ success: boolean; document: any }>('/documents/paste', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  deleteDocument: (id: string) =>
    fetchApi<{ success: boolean }>(`/documents/${id}`, {
      method: 'DELETE'
    }),

  // MCQ
  generateMCQs: (config: {
    documentId?: string;
    subject: string;
    chapter?: string;
    topic?: string;
    count: number;
    difficulty: string;
    questionType: string;
  }) =>
    fetchApi<{ success: boolean; subject: string; topic: string; totalQuestions: number; questions: any[] }>(
      '/mcq/generate',
      {
        method: 'POST',
        body: JSON.stringify(config)
      }
    ),

  // Tests
  getTests: (userId?: string) =>
    fetchApi<{ success: boolean; tests: any[] }>(`/tests${userId ? `?userId=${userId}` : ''}`),
  getTestById: (id: string) =>
    fetchApi<{ success: boolean; test: any }>(`/tests/${id}`),
  submitTest: (data: {
    title: string;
    subject: string;
    questions: any[];
    userAnswers: Record<string, string | null>;
    timeTakenSeconds: number;
  }) =>
    fetchApi<{ success: boolean; test: any }>('/tests/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getAreasToImprove: (userId?: string) =>
    fetchApi<{
      success: boolean;
      highPriority: any[];
      mediumPriority: any[];
      strongAreas: any[];
      recommendedNextSteps: string[];
    }>(`/tests/areas-to-improve${userId ? `?userId=${userId}` : ''}`),

  // Resume
  getLatestResume: (userId?: string) =>
    fetchApi<{ success: boolean; resume: any }>(`/resume/latest${userId ? `?userId=${userId}` : ''}`),
  getResumes: (userId?: string) =>
    fetchApi<{ success: boolean; resumes: any[] }>(`/resume${userId ? `?userId=${userId}` : ''}`),
  uploadResume: (formData: FormData) =>
    fetchApi<{ success: boolean; analysis: any }>('/resume/upload', {
      method: 'POST',
      body: formData
    }),
  analyzeResumeText: (resumeText: string, resumeName?: string) =>
    fetchApi<{ success: boolean; analysis: any }>('/resume/analyze-text', {
      method: 'POST',
      body: JSON.stringify({ resumeText, resumeName })
    }),

  // Job Match
  getJobMatches: (userId?: string) =>
    fetchApi<{ success: boolean; jobMatches: any[] }>(`/job-match${userId ? `?userId=${userId}` : ''}`),
  getJobMatchById: (id: string) =>
    fetchApi<{ success: boolean; jobMatch: any }>(`/job-match/${id}`),
  analyzeJobMatch: (data: { jobTitle: string; company?: string; jobDescription: string; resumeText?: string }) =>
    fetchApi<{ success: boolean; jobMatch: any }>('/job-match/analyze', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Career Chat
  getChatHistory: (conversationId?: string) =>
    fetchApi<{ success: boolean; messages: any[] }>(`/chat/history${conversationId ? `?conversationId=${conversationId}` : ''}`),
  sendChatMessage: (message: string, conversationId?: string) =>
    fetchApi<{ success: boolean; userMessage: any; botMessage: any }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId })
    }),
  clearChat: (conversationId?: string) =>
    fetchApi<{ success: boolean; message: string }>('/chat/clear', {
      method: 'POST',
      body: JSON.stringify({ conversationId })
    }),

  // Interview Simulator
  getInterviewSessions: () =>
    fetchApi<{ success: boolean; sessions: any[] }>('/interview/sessions'),
  getInterviewSessionById: (id: string) =>
    fetchApi<{ success: boolean; session: any }>(`/interview/sessions/${id}`),
  startInterview: (params: { role: string; interviewType: string; difficulty: string }) =>
    fetchApi<{
      success: boolean;
      session: any;
      currentQuestion: string;
      questionIndex: number;
      totalQuestions: number;
    }>('/interview/start', {
      method: 'POST',
      body: JSON.stringify(params)
    }),
  submitInterviewAnswer: (sessionId: string, answer: string) =>
    fetchApi<{
      success: boolean;
      session: any;
      lastTurnEvaluation: { feedback: string; score: number };
      nextQuestion: string | null;
      isFinished: boolean;
      evaluation?: any;
    }>('/interview/answer', {
      method: 'POST',
      body: JSON.stringify({ sessionId, answer })
    }),

  // Analytics & Profile
  getAnalytics: (filter = 'all') =>
    fetchApi<{
      success: boolean;
      stats: any;
      performanceTimeline: any[];
      subjectPerformance: any[];
      weakAreas: any[];
      recentTests: any[];
    }>(`/analytics?filter=${filter}`),
  getProfile: () => fetchApi<{ success: boolean; user: any }>('/profile'),
  updateProfile: (profile: any) =>
    fetchApi<{ success: boolean; user: any }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    })
};
