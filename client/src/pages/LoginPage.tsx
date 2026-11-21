import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, GraduationCap, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';

export const LoginPage: React.FC = () => {
  const { login, loginDemo, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('alex.kumar@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech in Computer Science');
  const [targetRole, setTargetRole] = useState('Java Backend Developer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else if (mode === 'register') {
        await register({ name, email, college, degree, targetRole });
        navigate('/dashboard');
      } else {
        // Forgot password
        setSuccessMsg('Password reset instructions have been sent to your college email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setSubmitting(true);
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-ai-cyan text-white flex items-center justify-center mx-auto shadow-glow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'register' && 'Create Your Student Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === 'login' && 'Continue your AI-powered interview preparation'}
                {mode === 'register' && 'Join thousands of students cracking top engineering jobs'}
                {mode === 'forgot' && 'Enter your registered email to receive reset link'}
              </p>
            </div>

            {/* Quick Demo Button */}
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-xs font-bold transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>1-Click Instant Demo Login (Alex Kumar)</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Mode switch pills */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Alex Kumar"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      College / University
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={e => setCollege(e.target.value)}
                        placeholder="National Institute of Technology"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Target Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={targetRole}
                        onChange={e => setTargetRole(e.target.value)}
                        placeholder="Java Backend Developer"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {mode === 'login' && 'Sign In to Dashboard'}
                  {mode === 'register' && 'Complete Registration'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {mode === 'forgot' && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-medium text-slate-500 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
