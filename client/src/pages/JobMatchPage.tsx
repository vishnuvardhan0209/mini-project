import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { ScoreCircle } from '../components/common/ScoreCircle';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';
import { JobMatch } from '../types';

export const JobMatchPage: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('Java Backend Developer');
  const [company, setCompany] = useState('FinTech Global Inc.');
  const [jobDescription, setJobDescription] = useState(
    'We are seeking a proactive Java Backend Developer to build mission-critical payment gateways and financial ledger microservices. The candidate must have solid hands-on experience in Java 17+, Spring Boot, PostgreSQL, Docker, REST APIs, and AWS cloud deployment. Familiarity with Kafka is a plus.'
  );

  const [analyzing, setAnalyzing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<JobMatch | null>(null);
  const [history, setHistory] = useState<JobMatch[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedHistoryModal, setSelectedHistoryModal] = useState<JobMatch | null>(null);

  useEffect(() => {
    loadJobHistory();
  }, []);

  const loadJobHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.getJobMatches();
      if (res.success && res.jobMatches) {
        setHistory(res.jobMatches);
        if (res.jobMatches.length > 0 && !currentMatch) {
          setCurrentMatch(res.jobMatches[0]);
        }
      }
    } catch (err) {
      console.warn('Load job match history error:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription) return;

    setAnalyzing(true);
    try {
      const res = await api.analyzeJobMatch({
        jobTitle,
        company,
        jobDescription
      });

      if (res.success && res.jobMatch) {
        setCurrentMatch(res.jobMatch);
        loadJobHistory();
      }
    } catch (err) {
      console.error('Analyze job match error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-brand-500" />
            <span>Resume → Job Match</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Evaluate your resume against live job descriptions to measure ATS alignment and skill gap percentages.
          </p>
        </div>

        {/* Input Form Card (Section 14) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Target Role & Requirements
          </h2>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Java Backend Developer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. FinTech Global Inc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Description & Tech Stack
              </label>
              <textarea
                rows={4}
                required
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the target job description requirements, prerequisites, and qualifications..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={analyzing}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all hover:scale-105 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{analyzing ? 'Matching Skills...' : 'Analyze Match'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Current Match Results (Section 14) */}
        {currentMatch && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  Target Alignment Analysis
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentMatch.jobTitle} • {currentMatch.company}
                </h3>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-3xl font-black text-brand-600 dark:text-brand-400">
                    {currentMatch.matchScore}
                  </span>
                  <span className="text-xs font-bold text-slate-400"> / 10</span>
                  <p className="text-[10px] font-semibold text-slate-400">Match Score</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-black text-emerald-500">
                    {currentMatch.keywordMatchPercentage}%
                  </span>
                  <p className="text-[10px] font-semibold text-slate-400">Keyword Match</p>
                </div>
              </div>
            </div>

            {/* Matching vs Missing Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Matching Skills */}
              <div className="p-5 rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Matching Skills ({currentMatch.matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                    >
                      ✅ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-5 rounded-2xl bg-rose-500/[0.04] dark:bg-rose-950/20 border border-rose-500/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>Missing Skills ({currentMatch.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                    >
                      ❌ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations & Recommended Changes */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                AI Strategic Recommendation:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                "{currentMatch.recommendations}"
              </p>

              {currentMatch.resumeChanges && currentMatch.resumeChanges.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Resume Changes Recommended for This Job:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {currentMatch.resumeChanges.map((change, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-500 font-bold shrink-0">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 15: Job Description History */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Job Description History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track and compare previously matched job profiles
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4 text-right">Match Score</th>
                  <th className="py-3 px-4 text-right">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {h.jobTitle}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                      {h.company}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-brand-600 dark:text-brand-400">
                      {h.matchScore} / 10
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 text-xs">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedHistoryModal(h)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        View Analysis <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* History Modal */}
        {selectedHistoryModal && (
          <Modal
            isOpen={!!selectedHistoryModal}
            onClose={() => setSelectedHistoryModal(null)}
            title={`${selectedHistoryModal.jobTitle} • ${selectedHistoryModal.company}`}
            description={`Analyzed on ${new Date(selectedHistoryModal.createdAt).toLocaleDateString()}`}
            maxWidth="lg"
            footer={
              <button
                onClick={() => setSelectedHistoryModal(null)}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Close
              </button>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <span className="text-xs text-slate-400">Match Score</span>
                  <p className="text-xl font-black text-brand-600">{selectedHistoryModal.matchScore} / 10</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Keyword Match</span>
                  <p className="text-xl font-black text-emerald-500">{selectedHistoryModal.keywordMatchPercentage}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Matching Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHistoryModal.matchedSkills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-600">
                      ✅ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Missing Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHistoryModal.missingSkills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-xs bg-rose-500/10 text-rose-600">
                      ❌ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold">Recommendation: </span>
                {selectedHistoryModal.recommendations}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};
