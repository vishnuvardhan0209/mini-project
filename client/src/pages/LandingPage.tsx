import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Brain,
  FileQuestion,
  Target,
  BarChart3,
  FileText,
  Briefcase,
  Bot,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartPracticing = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <FileQuestion className="w-6 h-6 text-brand-500" />,
      title: 'AI MCQ Generator',
      description: 'Generate questions automatically from your uploaded lecture notes, syllabus chapters, and PDFs.'
    },
    {
      icon: <Target className="w-6 h-6 text-ai-cyan" />,
      title: 'Smart Test System',
      description: 'Take topic-based timed assessments with a live question palette, instant scoring, and deep explanations.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-ai-rose" />,
      title: 'Weak Area Detection',
      description: 'Pinpoint exact subjects and granular concepts where you struggle, categorized by High, Medium, and Strong priorities.'
    },
    {
      icon: <FileText className="w-6 h-6 text-ai-violet" />,
      title: 'AI Resume Analyzer',
      description: 'Receive an instant ATS compatibility score out of 10 with actionable suggestions across all resume sections.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-ai-amber" />,
      title: 'Job Match Score',
      description: 'Compare your resume directly against target job descriptions to identify missing technical keywords and skill gaps.'
    },
    {
      icon: <Bot className="w-6 h-6 text-ai-emerald" />,
      title: 'AI Career Chatbot',
      description: 'Ask deep technical questions about Java, Python, DBMS, DSA, system architecture, or behavioral HR rounds.'
    }
  ];

  const steps = [
    { number: '01', title: 'Upload Notes', desc: 'Upload PDF, DOCX, TXT, or paste study chapters manually.' },
    { number: '02', title: 'Generate Questions', desc: 'AI creates customized MCQs tailored to your selected difficulty.' },
    { number: '03', title: 'Take Test', desc: 'Answer questions in an interactive exam environment with real-time countdown.' },
    { number: '04', title: 'Analyze Performance', desc: 'Inspect topic-level accuracy, time per question, and correct answer rationales.' },
    { number: '05', title: 'Improve Weak Areas', desc: 'Target flagged knowledge gaps with tailored revision paths and retake tests.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-ai-cyan/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Next-Gen Engineering Career Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Prepare Smarter.{' '}
                <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-ai-cyan bg-clip-text text-transparent">
                  Interview Better.
                </span>{' '}
                Get Hired.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                An AI-powered platform to test your knowledge, analyze your resume, identify skill gaps, and prepare for real-world job interviews.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={handleStartPracticing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-glow-md hover:shadow-glow-lg transition-all"
                >
                  <span>Start Practicing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/resume-analyzer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm"
                >
                  <FileText className="w-4 h-4 text-brand-500" />
                  <span>Analyze Resume</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>ATS Resume Scoring</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Turn-by-turn Mock AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>College Curriculum Ready</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-brand-500/20 to-slate-800/10 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-xl">
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 space-y-4">
                  {/* Top Mock Window Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      ai-assessment-engine.v2
                    </span>
                  </div>

                  {/* Sample Card 1: Live MCQ Generator */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                        Computer Networks • Question 4 of 20
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        18:32 remaining
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      What is the minimum Ethernet frame size required for proper collision detection using CSMA/CD?
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        A. 46 bytes
                      </div>
                      <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500 text-brand-600 dark:text-brand-300 font-semibold">
                        B. 64 bytes ✓
                      </div>
                    </div>
                  </div>

                  {/* Sample Card 2: Resume ATS Match */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-ai-cyan/10 border border-indigo-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        FinTech Global Match Score
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Java Backend Developer
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                        8.4
                      </span>
                      <span className="text-xs font-bold text-slate-400"> / 10</span>
                    </div>
                  </div>

                  {/* Sample Card 3: AI Career Advisor Snippet */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-ai-cyan shrink-0" />
                    <span className="truncate">
                      "Revise Ethernet frame structure and exponential backoff to reach 90% in Networks."
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Core Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Complete Interview Readiness
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              From study material comprehension to real-world technical interview simulations, every tool is designed to elevate your engineering career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 transition-all hover:-translate-y-1 group shadow-sm hover:shadow-md"
              >
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 inline-block shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {f.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Methodology
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              5-Step Systematic Learning Loop
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Our proven loop ensures you don't just practice, but systematically eliminate every knowledge blindspot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-brand-600/30 dark:text-brand-400/30">
                    {s.number}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Callout */}
      <section className="py-16 bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Ace Your Next Technical Interview?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Start with our preloaded Java, Networks, and DBMS preparation datasets or upload your own notes right now.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartPracticing}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-white text-brand-900 hover:bg-slate-100 transition-all shadow-xl hover:scale-105"
            >
              <span>Explore Student Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AI Interview Simulator. Designed for Engineering & College Placements.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
