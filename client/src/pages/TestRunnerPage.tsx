import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Send,
  HelpCircle
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';
import { Question } from '../types';

export const TestRunnerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state as any;

  // Fallback default test questions if accessed directly
  const defaultQuestions: Question[] = [
    {
      id: 'cn-1',
      question: 'Which OSI layer is responsible for end-to-end communication, flow control, and error recovery?',
      optionA: 'Network Layer',
      optionB: 'Data Link Layer',
      optionC: 'Transport Layer',
      optionD: 'Session Layer',
      correctAnswer: 'C',
      explanation: 'The Transport Layer ensures complete reliable data transfer and flow control using protocols like TCP.',
      topic: 'OSI Model',
      difficulty: 'easy'
    },
    {
      id: 'cn-2',
      question: 'What is the minimum Ethernet frame size required to ensure collision detection over standard IEEE 802.3 networks?',
      optionA: '46 bytes',
      optionB: '64 bytes',
      optionC: '128 bytes',
      optionD: '1518 bytes',
      correctAnswer: 'B',
      explanation: 'The minimum Ethernet frame size is 64 bytes (512 bits) to guarantee collision detection before transmission finishes.',
      topic: 'Ethernet',
      difficulty: 'medium'
    },
    {
      id: 'cn-3',
      question: 'In Selective Repeat ARQ with an m-bit sequence number, what is the maximum sender window size?',
      optionA: '2^m',
      optionB: '2^m - 1',
      optionC: '2^(m-1)',
      optionD: '2^m / 2 + 1',
      correctAnswer: 'C',
      explanation: 'In Selective Repeat, window size must not exceed 2^(m-1) to avoid sequence number overlap.',
      topic: 'Sliding Window',
      difficulty: 'hard'
    },
    {
      id: 'cn-4',
      question: 'If a CRC polynomial generator is G(x) = x^4 + x + 1, how many redundant bits (zeros) are appended to the payload before division?',
      optionA: '3 bits',
      optionB: '4 bits',
      optionC: '5 bits',
      optionD: '1 bit',
      correctAnswer: 'B',
      explanation: 'The degree of polynomial x^4 + x + 1 is 4, hence 4 check bits are appended.',
      topic: 'Error Detection',
      difficulty: 'medium'
    },
    {
      id: 'cn-5',
      question: 'After 3 consecutive packet collisions in Ethernet CSMA/CD, the binary exponential backoff algorithm picks a delay from which range?',
      optionA: '0 to 3 slots',
      optionB: '0 to 7 slots',
      optionC: '0 to 8 slots',
      optionD: '0 to 15 slots',
      correctAnswer: 'B',
      explanation: 'For k = 3 collisions, the range is 0 to 2^k - 1 = 7 slot times.',
      topic: 'Ethernet',
      difficulty: 'hard'
    }
  ];

  const questions: Question[] = stateData?.questions || defaultQuestions;
  const testTitle: string = stateData?.title || 'Computer Networks Knowledge Assessment';
  const subject: string = stateData?.subject || 'Computer Networks';

  // Test Runner State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(questions.length * 60); // 1 minute per question
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Live Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: prev[currentQ.id] === optionKey ? null : optionKey
    }));
  };

  const toggleMarkReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const timeSpent = questions.length * 60 - timeLeft;
      const res = await api.submitTest({
        title: testTitle,
        subject,
        questions,
        userAnswers: answers,
        timeTakenSeconds: Math.max(timeSpent, 15)
      });

      if (res.success && res.test) {
        navigate(`/test-results/${res.test.id}`, { state: { testResult: res.test } });
      }
    } catch (err) {
      console.error('Submit error:', err);
      // Fallback local navigation
      navigate('/test-results/test-cn-01');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Test Header Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            {subject} Assessment
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {testTitle}
          </h2>
        </div>

        {/* Live Timer & Submit */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border ${
              timeLeft < 180
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-brand-500" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* Main Test Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question Box */}
        <div className="lg:col-span-8 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-6">
            {/* Top Question Tracker */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {currentQ.topic}
                </span>
                <button
                  type="button"
                  onClick={toggleMarkReview}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    markedForReview[currentQ.id]
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{markedForReview[currentQ.id] ? 'Marked' : 'Mark for Review'}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {[
                { key: 'A', text: currentQ.optionA },
                { key: 'B', text: currentQ.optionB },
                { key: 'C', text: currentQ.optionC },
                { key: 'D', text: currentQ.optionD }
              ].map(opt => {
                const isSelected = answers[currentQ.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key as any)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-brand-500/10 border-brand-500 text-brand-900 dark:text-brand-200 font-semibold shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-xs sm:text-sm flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Finish & Submit</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Navigation Palette */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Question Palette
            </h4>

            {/* State Legends */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500 shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500 shrink-0" />
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700 shrink-0" />
                <span>Empty ({unansweredCount})</span>
              </div>
            </div>

            {/* Number grid: 1 2 3 4 5... */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 pt-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q.id];
                const isMarked = !!markedForReview[q.id];

                let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
                if (isMarked) {
                  bgClass = 'bg-amber-500 text-white font-bold';
                } else if (isAnswered) {
                  bgClass = 'bg-emerald-500 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${bgClass} ${
                      isCurrent ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Assessment?"
        description="Please confirm your answers before finalizing your test submission."
        footer={
          <>
            <button
              type="button"
              onClick={() => setSubmitModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Return to Test
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinalSubmit}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
            >
              {submitting ? 'Calculating Score...' : 'Yes, Submit Test'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <div>
              <p className="text-xl font-bold text-emerald-500">{answeredCount}</p>
              <p className="text-[11px] text-slate-500">Answered</p>
            </div>
            <div>
              <p className="text-xl font-bold text-amber-500">{markedCount}</p>
              <p className="text-[11px] text-slate-500">Marked for Review</p>
            </div>
            <div>
              <p className="text-xl font-bold text-rose-500">{unansweredCount}</p>
              <p className="text-[11px] text-slate-500">Unanswered</p>
            </div>
          </div>
          {unansweredCount > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>You have {unansweredCount} unanswered questions remaining.</span>
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};
