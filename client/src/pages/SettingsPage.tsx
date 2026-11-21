import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Key,
  Database,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { user } = useAuth();

  const [apiKey, setApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem('agy_custom_llm_key', apiKey);
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2500);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('agy_user');
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-brand-500" />
            <span>Platform Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize appearance, configure AI services, and manage local application data.
          </p>
        </div>

        {/* Theme & Display Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-indigo-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance & Interface Theme
            </h2>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred color theme for high-contrast test taking and coding preparation.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                theme === 'dark'
                  ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <div className="text-left text-xs">
                <p className="font-bold">Dark AI SaaS Mode</p>
                <p className="text-[10px] text-slate-400">OLED slate & violet</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                theme === 'light'
                  ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <div className="text-left text-xs">
                <p className="font-bold">Light Clean Mode</p>
                <p className="text-[10px] text-slate-400">Paper white & crisp text</p>
              </div>
            </button>
          </div>
        </div>

        {/* AI Engine Status & LLM Key */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Engine Architecture
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                Active: Built-in Intelligent Domain Engine (Ready & Operational)
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                All 8 AI modules (MCQs, resume scoring, job description matching, question explanations, mock interview feedback, and career chat) are functioning locally without external API billing dependencies.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveKey} className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Optional: Custom Google Gemini / OpenAI API Key
            </label>
            <div className="flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIzaSy... or sk-..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                Save
              </button>
            </div>
            {keySaved && (
              <p className="text-xs text-emerald-500 font-semibold">
                ✓ API key configured securely in client storage.
              </p>
            )}
          </form>
        </div>

        {/* Demo Data Management */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Database className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data & Profile Storage
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Reset Demo Data
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restore the default pre-populated Alex Kumar profile, sample tests, and demo metrics.
              </p>
            </div>

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{resetSuccess ? 'Resetting...' : 'Restore Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
