import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  Sparkles,
  Play,
  CheckCircle2,
  HelpCircle,
  Sliders,
  Settings2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { api } from '../services/api';
import { Question, DocumentItem } from '../types';

export const MCQGeneratorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state as any;

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>(stateData?.documentId || '');
  const [subject, setSubject] = useState<string>(stateData?.subject || 'Computer Networks');
  const [topic, setTopic] = useState<string>(stateData?.topic || 'OSI Model & Protocols');
  const [count, setCount] = useState<number>(10);
  const [customCount, setCustomCount] = useState<string>('15');
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [questionType, setQuestionType] = useState<'mcq' | 'true-false'>('mcq');

  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [previewAnswers, setPreviewAnswers] = useState(false);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await api.getDocuments();
        if (res.success) {
          setDocuments(res.documents);
        }
      } catch (err) {
        console.warn('Documents load error:', err);
      }
    }
    loadDocs();
  }, []);

  const handleDocChange = (docId: string) => {
    setSelectedDocId(docId);
    const found = documents.find(d => d.id === docId);
    if (found) {
      setSubject(found.subject);
      if (found.topic) setTopic(found.topic);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const qCount = isCustomCount ? parseInt(customCount) || 10 : count;
      const res = await api.generateMCQs({
        documentId: selectedDocId || undefined,
        subject,
        topic,
        count: qCount,
        difficulty,
        questionType
      });

      if (res.success && res.questions) {
        setGeneratedQuestions(res.questions);
      }
    } catch (err) {
      console.error('MCQ generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleStartTest = () => {
    if (generatedQuestions.length === 0) return;
    navigate('/test-runner', {
      state: {
        title: `${subject} Assessment: ${topic}`,
        subject,
        questions: generatedQuestions
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <FileQuestion className="w-6 h-6 text-brand-500" />
              <span>AI MCQ Generator</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your study material or target curriculum to synthesize customized technical questions.
            </p>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-brand-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Assessment Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Document Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Study Document (Optional)
              </label>
              <select
                value={selectedDocId}
                onChange={e => handleDocChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">-- No specific document (Use general syllabus) --</option>
                {documents.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.subject})
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Computer Networks">Computer Networks</option>
                <option value="Java">Core Java & OOP</option>
                <option value="DBMS">Database Management (DBMS)</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="DSA">Data Structures & Algorithms</option>
              </select>
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Number of Questions
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {[5, 10, 20, 30].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setCount(n);
                    setIsCustomCount(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    !isCustomCount && count === n
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {n} Questions
                </button>
              ))}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomCount(true)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isCustomCount
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Custom
                </button>
                {isCustomCount && (
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={customCount}
                    onChange={e => setCustomCount(e.target.value)}
                    className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Difficulty & Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Difficulty */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['easy', 'medium', 'hard', 'mixed'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      difficulty === diff
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Question Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionType('mcq')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    questionType === 'mcq'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionType('true-false')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    questionType === 'true-false'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  True / False
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all hover:scale-105 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'AI Generating MCQs...' : 'Generate MCQs'}</span>
            </button>
          </div>
        </div>

        {/* Generated Questions Preview & Test Launcher */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-brand-500/10 border border-brand-500/20">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {generatedQuestions.length} Questions Generated
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ready for live timed simulation with real-time scoring and weak area detection.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewAnswers(!previewAnswers)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  {previewAnswers ? 'Hide Answers' : 'Preview Answers'}
                </button>

                <button
                  type="button"
                  onClick={handleStartTest}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Online Test</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {q.question}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {q.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500">
                        {q.topic}
                      </span>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-8">
                    {[
                      { key: 'A', text: q.optionA },
                      { key: 'B', text: q.optionB },
                      { key: 'C', text: q.optionC },
                      { key: 'D', text: q.optionD }
                    ].map(opt => {
                      const isCorrect = previewAnswers && q.correctAnswer === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {opt.key}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation if previewing */}
                  {previewAnswers && (
                    <div className="mt-2 ml-8 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
