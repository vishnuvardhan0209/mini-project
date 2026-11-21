import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Sliders,
  Copy,
  Check,
  Zap,
  Layers
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { ScoreCircle } from '../components/common/ScoreCircle';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';
import { ResumeAnalysis } from '../types';

export const ResumeAnalyzerPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [improveModalOpen, setImproveModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sampleResumeText = `ALEX KUMAR
National Institute of Technology | B.Tech Computer Science | GPA: 8.7/10
Email: alex.kumar@example.com | GitHub: github.com/alexkumar | LinkedIn: linkedin.com/in/alexkumar

TECHNICAL SKILLS
Languages: Java 17, SQL, TypeScript, Python (Basics), HTML/CSS
Frameworks & Tools: Spring Boot, Spring Data JPA, PostgreSQL, Redis, REST APIs, Git, Docker, Maven, JUnit 5

PROJECTS
1. E-Commerce Microservices Platform (Spring Boot, PostgreSQL, Redis, Docker)
- Architected distributed microservices backend with product catalog, order processing, and payment webhooks.
- Implemented Redis caching for product inventory queries, decreasing database query latency by 42%.
- Integrated JWT authentication and role-based access control (RBAC) across endpoints.

2. Real-time Collaborative Code Editor (React, Node.js, WebSockets)
- Engineered real-time collaborative text sync using Operational Transformation and WebSocket events.
- Handled 100+ concurrent connections per document room with sub-50ms synchronization latency.

EDUCATION
National Institute of Technology, B.Tech in CSE, 2022 - 2026
Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks`;

  useEffect(() => {
    async function loadLatest() {
      try {
        setLoading(true);
        const res = await api.getLatestResume();
        if (res.success && res.resume) {
          setAnalysis(res.resume);
        }
      } catch (err) {
        console.warn('Resume load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLatest();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAnalyzing(true);
      try {
        const formData = new FormData();
        formData.append('resume', file);
        const res = await api.uploadResume(formData);
        if (res.success && res.analysis) {
          setAnalysis(res.analysis);
        }
      } catch (err) {
        console.error('Upload resume error:', err);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleAnalyzeSample = async () => {
    setAnalyzing(true);
    try {
      const res = await api.analyzeResumeText(sampleResumeText, 'Alex_Kumar_Software_Engineer_Resume.pdf');
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.error('Analyze sample error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopySnippet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentAnalysis = analysis || {
    id: 'resume-alex-01',
    userId: 'user-alex-kumar',
    resumeName: 'Alex_Kumar_Software_Engineer_Resume.pdf',
    overallScore: 8.2,
    scores: {
      skills: 8.5,
      projects: 9.0,
      education: 8.0,
      experience: 6.0,
      formatting: 8.5,
      atsCompatibility: 7.5,
      keywords: 7.0
    },
    strengths: [
      'Strong core technical stack with Java, Spring Boot, PostgreSQL, and REST APIs',
      'Impressive project: Scalable E-Commerce Microservices platform handling high throughput',
      'Clean, ATS-friendly typography and standard section hierarchy',
      'Active GitHub links and quantifiable technical details'
    ],
    areasToImprove: [
      'Add measurable metrics and quantifiable business outcomes across all bullet points',
      'Improve ATS keyword density for cloud tooling (Docker, AWS ECS/S3, Kubernetes)',
      'Include automated testing frameworks (JUnit 5, Mockito) to signal production readiness',
      'Refine summary to directly match target backend job postings'
    ],
    sectionSuggestions: [
      {
        section: 'Professional Summary',
        currentFeedback: 'Summary states generic interest in software engineering.',
        improvementTip: 'Make it role-focused and keyword rich. Highlight top frameworks and problem-solving impact.',
        exampleSnippet: '"Results-driven Java Backend Developer with solid expertise in Spring Boot, RESTful microservices, and SQL optimization. Proven track record building high-throughput systems."'
      },
      {
        section: 'Projects',
        currentFeedback: 'Good descriptions but lacks business impact percentages in second project.',
        improvementTip: 'Use Google’s XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].',
        exampleSnippet: '"Architected an event-driven inventory service using Spring Boot & Redis, reducing database latency by 42% under concurrent load."'
      },
      {
        section: 'Skills & Tools',
        currentFeedback: 'Missing automated testing and modern deployment skills.',
        improvementTip: 'Add testing frameworks (JUnit 5, Mockito) and DevOps/Cloud competencies.',
        exampleSnippet: 'Languages: Java 17, SQL, TypeScript | Tools: Spring Boot, Docker, Redis, Git, JUnit 5, AWS'
      },
      {
        section: 'Education & Certifications',
        currentFeedback: 'Clear degree notation.',
        improvementTip: 'Add any relevant certifications (e.g. AWS Certified Cloud Practitioner, Oracle Certified Java Associate).'
      }
    ],
    extractedSkills: ['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'Git', 'REST APIs', 'Data Structures', 'Redis'],
    createdAt: new Date().toISOString()
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-brand-500" />
              <span>AI Resume Analyzer</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload your engineering resume to benchmark ATS compatibility, technical keyword depth, and receive section-by-section improvements.
            </p>
          </div>

          <button
            onClick={handleAnalyzeSample}
            disabled={analyzing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Load Sample Alex Kumar Resume</span>
          </button>
        </div>

        {/* Upload Drop Area */}
        <div
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed text-center transition-all bg-white dark:bg-slate-900 ${
            dragOver
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-slate-200 dark:border-slate-800 hover:border-brand-500/50'
          }`}
        >
          <input
            type="file"
            id="resume-file-input"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="resume-file-input"
            className="cursor-pointer flex flex-col items-center justify-center space-y-3"
          >
            <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {analyzing ? 'AI Analyzing Resume...' : 'Drop your resume here, or browse file'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports PDF and DOCX formats (Up to 10MB)
              </p>
            </div>
          </label>
        </div>

        {/* Big Circular Score & Category Grid (Section 12) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Circular Score Ring */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4">
            <ScoreCircle
              score={currentAnalysis.overallScore}
              maxScore={10}
              size={160}
              strokeWidth={12}
              label="Overall ATS Score"
              sublabel="Benchmark: 8.0+ for Top Tier"
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Strong Industry Candidacy
              </span>
            </div>
          </div>

          {/* 7 Category Breakdowns */}
          <div className="md:col-span-8 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Category Score Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <ProgressBar
                  label="Skills"
                  value={currentAnalysis.scores.skills * 10}
                  showValue={false}
                  color="bg-brand-500"
                />
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Core & Frameworks</span>
                  <span>{currentAnalysis.scores.skills} / 10</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <ProgressBar
                  label="Projects"
                  value={currentAnalysis.scores.projects * 10}
                  showValue={false}
                  color="bg-emerald-500"
                />
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Scope & Complexity</span>
                  <span>{currentAnalysis.scores.projects} / 10</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <ProgressBar
                  label="Education"
                  value={currentAnalysis.scores.education * 10}
                  showValue={false}
                  color="bg-indigo-500"
                />
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Degree & Coursework</span>
                  <span>{currentAnalysis.scores.education} / 10</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <ProgressBar
                  label="Experience"
                  value={currentAnalysis.scores.experience * 10}
                  showValue={false}
                  color="bg-amber-500"
                />
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Internships & Roles</span>
                  <span>{currentAnalysis.scores.experience} / 10</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <ProgressBar
                  label="Formatting"
                  value={currentAnalysis.scores.formatting * 10}
                  showValue={false}
                  color="bg-ai-cyan"
                />
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Layout & Readability</span>
                  <span>{currentAnalysis.scores.formatting} / 10</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <ProgressBar
                  label="ATS Compatibility"
                  value={currentAnalysis.scores.atsCompatibility * 10}
                  showValue={false}
                  color="bg-ai-violet"
                />
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Parser Parsing Success</span>
                  <span>{currentAnalysis.scores.atsCompatibility} / 10</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1 sm:col-span-2">
                <ProgressBar
                  label="Keywords Density"
                  value={currentAnalysis.scores.keywords * 10}
                  showValue={false}
                  color="bg-brand-600"
                />
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Industry Keyword Matches</span>
                  <span>{currentAnalysis.scores.keywords} / 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Areas to Improve (Section 13) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Key Strengths
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {currentAnalysis.strengths.map((st, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Areas to Improve
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {currentAnalysis.areasToImprove.map((ai, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">!</span>
                  <span>{ai}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section-by-Section AI Suggestions */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Section-by-Section AI Suggestions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable changes to optimize each segment of your engineering resume
              </p>
            </div>

            <button
              onClick={() => setImproveModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Improve My Resume</span>
            </button>
          </div>

          <div className="space-y-4">
            {currentAnalysis.sectionSuggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {sug.section}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Priority Review
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white">Feedback: </span>
                  {sug.currentFeedback}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Recommendation: </span>
                  {sug.improvementTip}
                </p>

                {sug.exampleSnippet && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <code className="text-[11px] font-mono text-brand-700 dark:text-brand-300 flex-1">
                      {sug.exampleSnippet}
                    </code>
                    <button
                      onClick={() => handleCopySnippet(sug.exampleSnippet!, idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                      title="Copy rewrite"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Improve My Resume Modal */}
        <Modal
          isOpen={improveModalOpen}
          onClose={() => setImproveModalOpen(false)}
          title="Instant Resume Polish Kit"
          description="High-impact bullet rewrites and industry power verbs for Alex Kumar."
          maxWidth="lg"
          footer={
            <button
              onClick={() => setImproveModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
            >
              Done
            </button>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-900 dark:text-brand-200 space-y-1">
              <span className="font-bold">Pro-Tip for ATS Parsers:</span>
              <p>
                Always format bullets using strong active verbs (Architected, Engineered, Optimized, Reduced) accompanied by a verified percentage or throughput figure.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Recommended Summary Rewrite:
                </span>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                  "Results-driven Java Backend Engineer with proven expertise in Spring Boot microservices, high-concurrency Redis caching, and SQL optimization. Passionate about designing resilient distributed systems."
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Recommended Project Bullet Rewrite:
                </span>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                  "Engineered distributed REST microservices with Spring Boot and PostgreSQL, decreasing API latency by 42% through Redis cache-aside patterns under 5,000 requests/minute."
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
