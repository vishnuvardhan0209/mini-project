import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Target,
  Award,
  BookOpen,
  FileQuestion,
  FileText,
  Briefcase,
  Bot,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TestResult } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    testsTaken: 3,
    averageScore: 77,
    bestScore: 85,
    questionsAttempted: 50,
    resumeScore: 8.2,
    jobMatches: 2
  });

  const [performanceData, setPerformanceData] = useState<any[]>([
    { date: 'Sep 17', score: 68, title: 'DBMS Indexing' },
    { date: 'Sep 20', score: 85, title: 'Java Collections' },
    { date: 'Sep 21', score: 78, title: 'Computer Networks' }
  ]);

  const [recentTests, setRecentTests] = useState<TestResult[]>([]);
  const [weakAreas, setWeakAreas] = useState<any[]>([
    { subject: 'DBMS Indexing & B+ Trees', score: 48, priority: 'high' },
    { subject: 'Operating Systems Virtual Memory', score: 55, priority: 'high' },
    { subject: 'Computer Networks Ethernet CSMA/CD', score: 62, priority: 'medium' },
    { subject: 'Java Multithreading & Metaspace', score: 71, priority: 'medium' }
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const res = await api.getAnalytics('all');
        if (res.success) {
          if (res.stats) setStats(res.stats);
          if (res.performanceTimeline && res.performanceTimeline.length > 0) {
            setPerformanceData(res.performanceTimeline);
          }
          if (res.recentTests) setRecentTests(res.recentTests);
        }
      } catch (err) {
        console.warn('Using local fallback state for dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const userName = user?.name || 'Alex Kumar';

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900/40 via-indigo-900/20 to-slate-900 border border-brand-500/20 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 blur-3xl pointer-events-none rounded-full" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>Target Role: {user?.targetRole || 'Java Backend Developer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {userName} 👋
            </h1>
            <p className="text-sm text-slate-300 font-normal">
              Continue your interview preparation. You are on track to achieve an 85%+ readiness benchmark.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Link
              to="/mcq-generator"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md hover:scale-105"
            >
              <Target className="w-4 h-4" />
              <span>Start New Test</span>
            </Link>
          </div>
        </div>

        {/* 6 Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Tests Taken"
            value={stats.testsTaken}
            subtitle="Assessments completed"
            icon={<Target className="w-4 h-4" />}
          />
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            subtitle="Across all subjects"
            trend={{ value: '4.2%', isPositive: true }}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            title="Best Score"
            value={`${stats.bestScore}%`}
            subtitle="Core Java Test"
            icon={<Award className="w-4 h-4 text-amber-500" />}
          />
          <StatCard
            title="Questions Attempted"
            value={stats.questionsAttempted}
            subtitle="Practice MCQs"
            icon={<FileQuestion className="w-4 h-4" />}
          />
          <StatCard
            title="Resume Score"
            value={`${stats.resumeScore}/10`}
            subtitle="ATS optimized"
            trend={{ value: '0.6', isPositive: true }}
            icon={<FileText className="w-4 h-4 text-emerald-500" />}
          />
          <StatCard
            title="Job Matches"
            value={stats.jobMatches}
            subtitle="Evaluated positions"
            icon={<Briefcase className="w-4 h-4 text-ai-cyan" />}
          />
        </div>

        {/* Quick Actions Bar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              to="/study-material"
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Upload Notes</span>
            </Link>

            <Link
              to="/mcq-generator"
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform mb-2">
                <FileQuestion className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Generate MCQs</span>
            </Link>

            <Link
              to="/mcq-generator"
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform mb-2">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Start Test</span>
            </Link>

            <Link
              to="/resume-analyzer"
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Analyze Resume</span>
            </Link>

            <Link
              to="/job-match"
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform mb-2">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Check Job Match</span>
            </Link>

            <Link
              to="/career-chat"
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex flex-col items-center text-center group"
            >
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform mb-2">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Ask AI Career Bot</span>
            </Link>
          </div>
        </div>

        {/* Charts & Weak Areas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Performance Trend Chart */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Test Performance Over Time
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track your scores and trajectory across recent topic assessments
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                +17% Gain
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weak Areas Panel */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Areas to Improve
                </h3>
                <Link
                  to="/areas-to-improve"
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Prioritized topics based on recent test error rates
              </p>

              <div className="space-y-4">
                {weakAreas.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <ProgressBar
                      label={item.subject}
                      value={item.score}
                      statusBadge={item.score < 50 ? 'High Priority' : 'Medium Priority'}
                      color={item.score < 50 ? 'bg-rose-500' : 'bg-amber-500'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>2 topics require urgent revision before next mock</span>
              </div>
              <Link
                to="/areas-to-improve"
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Review
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Tests Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Tests
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review your recent assessments, accuracy breakdown, and question rationales
              </p>
            </div>
            <Link
              to="/tests"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              See all tests <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Test Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentTests.length > 0 ? (
                  recentTests.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {t.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400">
                          {t.subject}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <span className={t.score >= 75 ? 'text-emerald-500' : 'text-amber-500'}>
                          {t.score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        {t.accuracy || t.score}%
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/test-results/${t.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          Review <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-slate-500">
                      Loading recent tests...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
