import React, { useState } from 'react';
import {
  User as UserIcon,
  GraduationCap,
  Briefcase,
  Mail,
  Edit2,
  Check,
  Award,
  Target,
  FileText,
  Mic,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || 'Alex Kumar');
  const [email, setEmail] = useState(user?.email || 'alex.kumar@example.com');
  const [college, setCollege] = useState(user?.college || 'National Institute of Technology');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech in Computer Science & Engineering');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Java Backend Developer');
  const [skillsStr, setSkillsStr] = useState(
    user?.skills?.join(', ') || 'Java, Spring Boot, SQL, Git, DSA, REST APIs, PostgreSQL, Docker (Basics)'
  );
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArr = skillsStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await updateUserProfile({
        name,
        college,
        degree,
        targetRole,
        skills: skillsArr
      });
      setEditModalOpen(false);
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <UserIcon className="w-6 h-6 text-brand-500" />
              <span>Student Profile</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your academic credentials, target career milestones, and placement skills.
            </p>
          </div>

          <button
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Identity Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-ai-cyan text-white flex items-center justify-center text-3xl font-black shadow-glow-sm shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {user?.name || 'Alex Kumar'}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-brand-500" />
                  {user?.targetRole || 'Java Backend Developer'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  {user?.college || 'National Institute of Technology'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user?.email || 'alex.kumar@example.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Academic & Career Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Degree Program
              </span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.degree || 'B.Tech in Computer Science & Engineering'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Target Specialization
              </span>
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {user?.targetRole || 'Java Backend Developer'}
              </p>
            </div>
          </div>

          {/* Technical Skills Tags */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Technical Skills
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {(user?.skills || [
                'Java',
                'Spring Boot',
                'SQL',
                'Git',
                'DSA',
                'REST APIs',
                'PostgreSQL',
                'Docker (Basics)'
              ]).map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Progress Section (Section 18) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Overall Preparation Progress
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center space-y-1">
              <Target className="w-5 h-5 text-brand-500 mx-auto" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">14</p>
              <p className="text-[11px] text-slate-500">Tests Completed</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center space-y-1">
              <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">76%</p>
              <p className="text-[11px] text-slate-500">Average Score</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center space-y-1">
              <FileText className="w-5 h-5 text-indigo-500 mx-auto" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">8.2 / 10</p>
              <p className="text-[11px] text-slate-500">Resume Score</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center space-y-1">
              <Briefcase className="w-5 h-5 text-ai-cyan mx-auto" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">8.4 / 10</p>
              <p className="text-[11px] text-slate-500">Job Match Avg</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center space-y-1 col-span-2 sm:col-span-1">
              <Mic className="w-5 h-5 text-ai-violet mx-auto" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
              <p className="text-[11px] text-slate-500">Interview Sessions</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Profile Information"
          description="Update your target engineering roles and educational details."
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm"
              >
                {saving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </>
          }
        >
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Degree Program
              </label>
              <input
                type="text"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={skillsStr}
                onChange={e => setSkillsStr(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
