import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [filter, setFilter] = useState<'7d' | '30d' | '3m' | 'all'>('30d');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    testsTaken: 14,
    averageScore: 76,
    bestScore: 92,
    questionsAttempted: 280,
    resumeScore: 8.2,
    jobMatches: 5
  });

  const [timeline, setTimeline] = useState([
    { date: 'Aug 25', score: 60, subject: 'DBMS' },
    { date: 'Sep 02', score: 65, subject: 'OS' },
    { date: 'Sep 08', score: 72, subject: 'DSA' },
    { date: 'Sep 14', score: 70, subject: 'Networks' },
    { date: 'Sep 17', score: 68, subject: 'DBMS' },
    { date: 'Sep 20', score: 85, subject: 'Java' },
    { date: 'Sep 21', score: 78, subject: 'Networks' }
  ]);

  const [subjectPerformance, setSubjectPerformance] = useState([
    { subject: 'Java & OOP', score: 85, color: '#6366f1' },
    { subject: 'Networks', score: 78, color: '#8b5cf6' },
    { subject: 'DSA', score: 74, color: '#10b981' },
    { subject: 'DBMS', score: 68, color: '#06b6d4' },
    { subject: 'Operating Sys', score: 55, color: '#f59e0b' }
  ]);

  const [weakTopics, setWeakTopics] = useState([
    { topic: 'Ethernet & CSMA/CD', accuracy: 42, color: '#f43f5e' },
    { topic: 'B+ Tree Indexing', accuracy: 40, color: '#f43f5e' },
    { topic: 'Virtual Memory Thrashing', accuracy: 55, color: '#f59e0b' },
    { topic: 'Error Detection & CRC', accuracy: 61, color: '#f59e0b' },
    { topic: 'Sliding Window', accuracy: 80, color: '#10b981' },
    { topic: 'OSI Reference Model', accuracy: 91, color: '#10b981' }
  ]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.getAnalytics(filter);
        if (res.success) {
          if (res.stats) setStats(res.stats);
          if (res.performanceTimeline && res.performanceTimeline.length > 0) {
            setTimeline(res.performanceTimeline);
          }
          if (res.subjectPerformance) setSubjectPerformance(res.subjectPerformance);
        }
      } catch (err) {
        console.warn('Analytics API error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [filter]);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header with Time Filters (Section 19) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-brand-500" />
              <span>Progress Analytics</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Deep historical insights into your test scores, subject-wise trends, and knowledge retention.
            </p>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-sm">
            {[
              { key: '7d', label: 'Last 7 Days' },
              { key: '30d', label: 'Last 30 Days' },
              { key: '3m', label: 'Last 3 Months' },
              { key: 'all', label: 'All Time' }
            ].map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === f.key
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Scores Over Time */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Score Trajectory Over Time
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Progression across chronological test attempts
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-500">+18% Avg Gain</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
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
                    dot={{ fill: '#6366f1', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject-Wise Performance */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Subject Mastery Comparison
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Average score by engineering curriculum domain
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val}%`, 'Mastery']}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {subjectPerformance.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color || '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Topic Retention & Weak Topic Ranking */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Granular Topic Accuracy Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked from lowest accuracy (urgent attention required) to strongest mastery
            </p>
          </div>

          <div className="space-y-4">
            {weakTopics.map((topic, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        topic.accuracy < 50
                          ? 'bg-rose-500'
                          : topic.accuracy < 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {topic.topic}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {topic.accuracy}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${topic.accuracy}%`,
                      backgroundColor: topic.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
