import React, { useState, useEffect } from 'react';
import {
  Mic,
  Bot,
  User,
  Sparkles,
  Play,
  CheckCircle2,
  Award,
  AlertTriangle,
  RotateCcw,
  Send,
  HelpCircle,
  ThumbsUp,
  Brain
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { ScoreCircle } from '../components/common/ScoreCircle';
import { ProgressBar } from '../components/common/ProgressBar';
import { api } from '../services/api';
import { InterviewSession } from '../types';

export const InterviewPracticePage: React.FC = () => {
  // Configuration state
  const [role, setRole] = useState('Java Developer');
  const [interviewType, setInterviewType] = useState<'Technical' | 'HR' | 'Behavioral' | 'Mixed'>('Technical');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Active Session state
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ feedback: string; score: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const roles = [
    'Java Developer',
    'Full Stack Developer',
    'Backend Developer',
    'Software Engineer',
    'Data Analyst',
    'Python Developer'
  ];

  const handleStartInterview = async () => {
    setSubmitting(true);
    try {
      const res = await api.startInterview({ role, interviewType, difficulty });
      if (res.success && res.session) {
        setActiveSession(res.session);
        setCurrentQuestion(res.currentQuestion);
        setFeedback(null);
        setIsCompleted(false);
        setEvaluation(null);
        setUserAnswer('');
      }
    } catch (err) {
      console.error('Start interview error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !activeSession || submitting) return;

    setSubmitting(true);
    try {
      const res = await api.submitInterviewAnswer(activeSession.id, userAnswer);
      if (res.success) {
        setFeedback(res.lastTurnEvaluation);
        setUserAnswer('');

        if (res.isFinished || !res.nextQuestion) {
          setIsCompleted(true);
          setEvaluation(res.evaluation);
        } else {
          setCurrentQuestion(res.nextQuestion);
        }
      }
    } catch (err) {
      console.error('Submit answer error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Mic className="w-6 h-6 text-brand-500" />
            <span>AI Interview Practice</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulate realistic turn-by-turn technical and HR interview rounds with interactive AI evaluation.
          </p>
        </div>

        {/* Configuration Setup Card (When not in active session or when completed) */}
        {!activeSession || isCompleted ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Configure Interview Simulation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Role */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interview Type */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Interview Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Technical', 'HR', 'Behavioral', 'Mixed'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setInterviewType(t)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        interviewType === t
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        difficulty === d
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleStartInterview}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all hover:scale-105 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Live Interview Session</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Live Turn-by-Turn Interview Room */}
        {activeSession && !isCompleted && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Live {activeSession.interviewType} Interview • {activeSession.role}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                Question {activeSession.turns.length} of 3
              </span>
            </div>

            {/* AI Interviewer Question Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-brand-500/10 via-indigo-500/5 to-ai-cyan/10 border border-brand-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
                <Bot className="w-4 h-4" />
                <span>Interviewer Question:</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                "{currentQuestion}"
              </h3>
            </div>

            {/* Last Turn Feedback if available */}
            {feedback && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    Interviewer Feedback on Previous Answer:
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    Score: {feedback.score} / 10
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {feedback.feedback}
                </p>
              </div>
            )}

            {/* Candidate Answer Form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Answer (Be structured: introduce concept, explain mechanics, and provide an example)
                </label>
                <textarea
                  rows={6}
                  required
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} words typed
                </span>

                <button
                  type="submit"
                  disabled={!userAnswer.trim() || submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Evaluating Response...' : 'Submit Answer'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Final Evaluation Report (Section 17) */}
        {isCompleted && evaluation && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-500">
                  Interview Session Completed
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Performance Evaluation Scorecard
                </h2>
              </div>

              <button
                onClick={handleStartInterview}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Another Role</span>
              </button>
            </div>

            {/* Scorecard Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400">Overall Rating</span>
                <p className="text-3xl font-black text-brand-600 dark:text-brand-400 mt-1">
                  {evaluation.overallScore} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400">Technical Depth</span>
                <p className="text-3xl font-black text-emerald-500 mt-1">
                  {evaluation.technicalKnowledge} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400">Communication</span>
                <p className="text-3xl font-black text-indigo-500 mt-1">
                  {evaluation.communication} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400">Answer Quality</span>
                <p className="text-3xl font-black text-amber-500 mt-1">
                  {evaluation.answerQuality} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </p>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Interviewer Assessment Summary:
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                "{evaluation.summary}"
              </p>
            </div>

            {/* Detailed Findings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Demonstrated Strengths</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {evaluation.strengths.map((s: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Concepts */}
              <div className="p-5 rounded-2xl bg-rose-500/[0.04] dark:bg-rose-950/20 border border-rose-500/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Missing Concepts</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {evaluation.missingConcepts.map((m: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Topics */}
              <div className="p-5 rounded-2xl bg-indigo-500/[0.04] dark:bg-indigo-950/20 border border-indigo-500/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Recommended Topics</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {evaluation.recommendedTopics.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
