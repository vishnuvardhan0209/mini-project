import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  FileText,
  Bot
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, loginDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-ai-cyan flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse-subtle" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-600 to-indigo-600 dark:from-white dark:via-brand-400 dark:to-ai-cyan bg-clip-text text-transparent">
              AI Interview Simulator
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
            }`}
          >
            Home
          </Link>
          <a
            href="/#features"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Features
          </a>
          <a
            href="/#how-it-works"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            How It Works
          </a>
          <Link
            to="/resume-analyzer"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/resume-analyzer' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
            }`}
          >
            Resume Analyzer
          </Link>
          <Link
            to="/career-chat"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/career-chat' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
            }`}
          >
            AI Chatbot
          </Link>
        </nav>

        {/* Right Actions: Theme Toggle, Auth */}
        <div className="flex items-center gap-3">
          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-brand-500/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                  {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                  {(user.fullName || user.name).split(' ')[0]}
                </span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Sign Out"
                className="hidden sm:flex items-center p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={loginDemo}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Quick Demo
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Dashboard
          </Link>
          <Link
            to="/study-material"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Study Material
          </Link>
          <Link
            to="/mcq-generator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            MCQ Generator
          </Link>
          <Link
            to="/resume-analyzer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Resume Analyzer
          </Link>
          <Link
            to="/job-match"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Job Match
          </Link>
          <Link
            to="/career-chat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            AI Career Chat
          </Link>
          <Link
            to="/interview-practice"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Interview Practice
          </Link>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                loginDemo();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400"
            >
              One-Click Demo Login
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="text-xs font-semibold text-rose-500 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
