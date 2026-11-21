import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Target,
  BarChart3,
  Lightbulb,
  FileText,
  Briefcase,
  Bot,
  Mic,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Study Material', path: '/study-material', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'MCQ Generator', path: '/mcq-generator', icon: <FileQuestion className="w-4 h-4" /> },
    { name: 'Tests', path: '/tests', icon: <Target className="w-4 h-4" /> },
    { name: 'Performance', path: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Areas to Improve', path: '/areas-to-improve', icon: <Lightbulb className="w-4 h-4" /> },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: <FileText className="w-4 h-4" /> },
    { name: 'Job Match', path: '/job-match', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'AI Career Chat', path: '/career-chat', icon: <Bot className="w-4 h-4" /> },
    { name: 'Interview Practice', path: '/interview-practice', icon: <Mic className="w-4 h-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 min-h-[calc(100vh-4rem)] p-4 justify-between">
      {/* Navigation items */}
      <div className="space-y-1">
        <div className="px-3 py-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Preparation Modules
          </p>
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border-l-2 border-brand-500 pl-3'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* User profile widget at bottom of sidebar */}
      {user && (
        <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-ai-cyan text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user.targetRole}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
