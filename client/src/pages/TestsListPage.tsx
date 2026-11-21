import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { api } from '../services/api';
import { TestResult } from '../types';

export const TestsListPage: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const res = await api.getTests();
        if (res.success && res.tests) {
          setTests(res.tests);
        }
      } catch (err) {
        console.warn('Load tests error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, []);

  const subjects = ['All', 'Computer Networks', 'Java', 'DBMS', 'Operating Systems', 'DSA'];

  const filteredTests = tests.filter(t => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject === 'All' || t.subject === selectedSubject;
    return matchSearch && matchSubject;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Target className="w-6 h-6 text-brand-500" />
              <span>Assessment History</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review all completed topic evaluations, score records, and performance breakdowns.
            </p>
          </div>

          <Link
            to="/mcq-generator"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Test</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by test name or topic..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedSubject === sub
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Tests List */}
        <div className="space-y-4">
          {filteredTests.length > 0 ? (
            filteredTests.map(t => (
              <div
                key={t.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-brand-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      {t.subject}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>{t.totalQuestions} Questions</span>
                    <span>•</span>
                    <span>{t.correctAnswers} Correct</span>
                    <span>•</span>
                    <span>Time: {t.timeTaken || '12m 30s'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 sm:justify-end">
                  <div className="text-right">
                    <span
                      className={`text-2xl font-black ${
                        t.score >= 75
                          ? 'text-emerald-500'
                          : t.score >= 50
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {t.score}%
                    </span>
                    <p className="text-[10px] font-semibold text-slate-400">Final Score</p>
                  </div>

                  <Link
                    to={`/test-results/${t.id}`}
                    state={{ testResult: t }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
              <Target className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No tests match your filter
              </p>
              <p className="text-xs text-slate-500">
                Generate customized MCQs from your notes to take your first test.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
