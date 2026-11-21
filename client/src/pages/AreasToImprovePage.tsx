import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Target,
  BookOpen,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { ProgressBar } from '../components/common/ProgressBar';
import { api } from '../services/api';

export const AreasToImprovePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [highPriority, setHighPriority] = useState<any[]>([
    {
      topic: 'Ethernet & CSMA/CD',
      subject: 'Computer Networks',
      percentage: 42,
      recommendation: 'Revise Ethernet frame structure, slot time calculation, CSMA/CD collision handling, and exponential backoff.'
    },
    {
      topic: 'B+ Tree Leaf Indexing',
      subject: 'DBMS',
      percentage: 40,
      recommendation: 'Study clustered vs secondary index leaf nodes, record pointers, and doubly linked list range scans.'
    }
  ]);
  const [mediumPriority, setMediumPriority] = useState<any[]>([
    {
      topic: 'Error Detection & CRC',
      subject: 'Computer Networks',
      percentage: 61,
      recommendation: 'Practice checksum calculations and polynomial division for Cyclic Redundancy Checks.'
    },
    {
      topic: 'Virtual Memory & Thrashing',
      subject: 'Operating Systems',
      percentage: 55,
      recommendation: 'Review page replacement algorithms (LRU, FIFO) and working set model.'
    },
    {
      topic: 'JVM Metaspace & GC Tuning',
      subject: 'Java',
      percentage: 60,
      recommendation: 'Deepen knowledge on G1GC garbage collection phases and off-heap Metaspace memory.'
    }
  ]);
  const [strongAreas, setStrongAreas] = useState<any[]>([
    {
      topic: 'OSI Reference Model',
      subject: 'Computer Networks',
      percentage: 91,
      recommendation: 'Continue practicing advanced application-based questions and cross-layer scenarios.'
    },
    {
      topic: 'Java Collections Framework',
      subject: 'Java',
      percentage: 88,
      recommendation: 'Great grasp of HashMap treeify threshold and thread-safe collections.'
    }
  ]);

  const [nextSteps, setNextSteps] = useState<string[]>([
    'Revise high priority weak topics immediately before attempting new chapters',
    'Take a targeted 5-10 question re-test on low-scoring concepts',
    'Practice difficult questions to master subtle edge cases',
    'Track overall improvement on your Progress Analytics page'
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getAreasToImprove();
        if (res.success) {
          if (res.highPriority && res.highPriority.length > 0) setHighPriority(res.highPriority);
          if (res.mediumPriority && res.mediumPriority.length > 0) setMediumPriority(res.mediumPriority);
          if (res.strongAreas && res.strongAreas.length > 0) setStrongAreas(res.strongAreas);
          if (res.recommendedNextSteps) setNextSteps(res.recommendedNextSteps);
        }
      } catch (err) {
        console.warn('Using local fallback state for weak areas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStartTargetedTest = (topic: string, subject: string) => {
    navigate('/mcq-generator', {
      state: { topic, subject }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Lightbulb className="w-6 h-6 text-brand-500" />
            <span>Areas to Improve</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            AI-driven diagnostic analysis identifying your knowledge gaps and providing targeted remediation paths.
          </p>
        </div>

        {/* Priority Groups */}
        <div className="space-y-6">
          {/* 🔴 High Priority */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                High Priority Weak Topics ({highPriority.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scoring below 50%. These concepts have a high probability of appearing in campus placement screenings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {highPriority.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-rose-500/[0.04] dark:bg-rose-950/20 border border-rose-500/20 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                        {item.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        {item.percentage}% Accuracy
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      🔴 {item.topic}
                    </h4>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-white">Recommendation: </span>
                      "{item.recommendation}"
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartTargetedTest(item.topic, item.subject)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Practice {item.topic} Again</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 🟡 Medium Priority */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Medium Priority Topics ({mediumPriority.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scoring between 50% - 75%. Good conceptual foundation, but occasional mistakes on trick questions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {mediumPriority.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-950/20 border border-amber-500/20 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                        {item.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {item.percentage}% Accuracy
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      🟡 {item.topic}
                    </h4>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-white">Recommendation: </span>
                      "{item.recommendation}"
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartTargetedTest(item.topic, item.subject)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Practice {item.topic} Again</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 🟢 Strong Areas */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Strong Areas ({strongAreas.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scoring above 75%. You exhibit confident mastery of these subjects.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {strongAreas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-950/20 border border-emerald-500/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.subject}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {item.percentage}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    🟢 {item.topic}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    "{item.recommendation}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-brand-900/30 to-indigo-950/20 border border-brand-500/20 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-500" />
              <span>Recommended Next Steps</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <span className="text-xs font-black text-brand-600 dark:text-brand-400">
                    Step {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
