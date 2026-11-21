import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Target,
  BarChart3,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { api } from '../services/api';
import { TestResult, TestAnswerItem } from '../types';

export const TestResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const stateTest = (location.state as any)?.testResult as TestResult | undefined;

  const [test, setTest] = useState<TestResult | null>(stateTest || null);
  const [loading, setLoading] = useState(!stateTest);

  useEffect(() => {
    async function loadTest() {
      if (stateTest) {
        if (stateTest.score >= 70) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
        return;
      }
      try {
        setLoading(true);
        const res = await api.getTestById(id || 'test-cn-01');
        if (res.success && res.test) {
          setTest(res.test);
          if (res.test.score >= 70) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
        }
      } catch (err) {
        console.warn('Load test error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [id, stateTest]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-16">
          <p className="text-sm font-semibold text-slate-500 animate-pulse">
            Analyzing your performance and generating recommendations...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const result = test || {
    id: 'test-cn-01',
    userId: 'user-alex-kumar',
    title: 'Computer Networks: Protocols & Layers',
    subject: 'Computer Networks',
    score: 78,
    totalQuestions: 20,
    correctAnswers: 15,
    wrongAnswers: 4,
    unanswered: 1,
    timeTaken: '14m 20s',
    accuracy: 78.9,
    topicBreakdown: [
      {
        topic: 'OSI Model',
        total: 5,
        correct: 5,
        percentage: 100,
        priority: 'strong' as const,
        recommendation: 'Outstanding mastery. Continue practicing advanced application-based scenarios.'
      },
      {
        topic: 'Sliding Window',
        total: 5,
        correct: 4,
        percentage: 80,
        priority: 'strong' as const,
        recommendation: 'Solid grasp of window size calculation and buffer dynamics.'
      },
      {
        topic: 'Error Detection',
        total: 5,
        correct: 3,
        percentage: 60,
        priority: 'medium' as const,
        recommendation: 'Practice checksum and polynomial generator CRC problems.'
      },
      {
        topic: 'Ethernet',
        total: 5,
        correct: 2,
        percentage: 40,
        priority: 'high' as const,
        recommendation: 'Revise Ethernet frame structure, minimum frame size formula, CSMA/CD, and exponential backoff.'
      }
    ],
    answers: [],
    createdAt: new Date().toISOString()
  };

  const handlePracticeTopicAgain = (topicName: string) => {
    navigate('/mcq-generator', {
      state: {
        subject: result.subject,
        topic: topicName
      }
    });
  };

  const highPriority = result.topicBreakdown.filter(t => t.priority === 'high');
  const mediumPriority = result.topicBreakdown.filter(t => t.priority === 'medium');
  const strongAreas = result.topicBreakdown.filter(t => t.priority === 'strong');

  const chartColors = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e'];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              Assessment Completed
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {result.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/mcq-generator"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Big Score Card Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Score Showcase */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-gradient-to-tr from-brand-500/10 via-indigo-500/5 to-ai-cyan/10 border border-brand-500/20 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-glow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="pt-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                {result.score}
              </span>
              <span className="text-lg font-bold text-slate-400"> / 100</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {result.score >= 80
                ? 'Excellent Mastery'
                : result.score >= 65
                ? 'Competent — Revision Suggested'
                : 'Needs Fundamental Revision'}
            </p>
          </div>

          {/* Key Metrics Breakdown */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Correct</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.correctAnswers}
              </p>
              <p className="text-[11px] text-slate-500">Out of {result.totalQuestions}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                <XCircle className="w-4 h-4" />
                <span>Wrong</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.wrongAnswers}
              </p>
              <p className="text-[11px] text-slate-500">Incorrect choices</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Unanswered</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.unanswered}
              </p>
              <p className="text-[11px] text-slate-500">Skipped items</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Time Taken</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.timeTaken}
              </p>
              <p className="text-[11px] text-slate-500">Total duration</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.accuracy}%
              </p>
              <p className="text-[11px] text-slate-500">On attempted questions</p>
            </div>
          </div>
        </div>

        {/* Performance By Topic Bar Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Topic-Level Performance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Granular accuracy breakdown for each concept tested
              </p>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.topicBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
                <YAxis type="category" dataKey="topic" stroke="#94a3b8" fontSize={12} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Accuracy']}
                />
                <Bar dataKey="percentage" radius={[0, 8, 8, 0]}>
                  {result.topicBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.percentage >= 75
                          ? '#10b981'
                          : entry.percentage >= 50
                          ? '#6366f1'
                          : '#f43f5e'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 10: Dedicated Areas to Improve */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Areas to Improve & AI Recommendations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalized guidance synthesized from your response errors
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* High Priority (Red) */}
            {highPriority.map((hp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      High Priority
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      — {hp.topic} ({hp.percentage}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-4">
                    Recommendation: "{hp.recommendation}"
                  </p>
                </div>

                <button
                  onClick={() => handlePracticeTopicAgain(hp.topic)}
                  className="shrink-0 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice This Topic Again</span>
                </button>
              </div>
            ))}

            {/* Medium Priority (Yellow) */}
            {mediumPriority.map((mp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Medium Priority
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      — {mp.topic} ({mp.percentage}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-4">
                    Recommendation: "{mp.recommendation}"
                  </p>
                </div>

                <button
                  onClick={() => handlePracticeTopicAgain(mp.topic)}
                  className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice This Topic Again</span>
                </button>
              </div>
            ))}

            {/* Strong Areas (Green) */}
            {strongAreas.map((sa, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Strong Area
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    — {sa.topic} ({sa.percentage}%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-4">
                  Recommendation: "{sa.recommendation}"
                </p>
              </div>
            ))}
          </div>

          {/* Recommended Next Steps */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Recommended Next Steps
            </h4>
            <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <li>Revise high priority weak topics immediately</li>
              <li>Take a targeted 5-10 question re-test</li>
              <li>Practice difficult questions on edge cases</li>
              <li>Track improvement on your Progress Analytics page</li>
            </ol>
          </div>
        </div>

        {/* Section 11: Question-by-Question Review */}
        {result.answers && result.answers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Question Review ({result.answers.length} Questions)
            </h3>

            <div className="space-y-4">
              {result.answers.map((ans, index) => (
                <div
                  key={ans.id || index}
                  className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                    ans.isCorrect
                      ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                      : 'bg-rose-500/[0.03] dark:bg-rose-950/20 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          ans.isCorrect
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {ans.questionText}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {ans.topic}
                      </span>
                    </div>
                  </div>

                  {/* Answers Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                        ans.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold">Your Answer: </span>
                        <span>{ans.selectedAnswer ? `${ans.selectedAnswer}` : 'Unanswered'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="font-bold">Correct Answer: </span>
                        <span>{ans.correctAnswer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="ml-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">
                      AI Explanation:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ans.explanation}
                    </p>
                  </div>

                  <div className="pl-8 flex justify-end">
                    <button
                      onClick={() => handlePracticeTopicAgain(ans.topic)}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      Practice {ans.topic} Again <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
