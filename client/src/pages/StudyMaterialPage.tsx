import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Plus,
  FolderTree,
  FileUp,
  Clock,
  ArrowRight,
  Layers
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { api } from '../services/api';
import { DocumentItem } from '../types';

export const StudyMaterialPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadTab, setUploadTab] = useState<'upload' | 'paste'>('upload');

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Networks');
  const [chapter, setChapter] = useState('Data Link Layer');
  const [topic, setTopic] = useState('Frame Structure & Protocols');
  const [pastedContent, setPastedContent] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.getDocuments();
      if (res.success) {
        setDocuments(res.documents);
      }
    } catch (err) {
      console.warn('Failed to load documents from API:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (!title) setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setUploading(true);

    try {
      if (uploadTab === 'upload') {
        if (!file) {
          setMessage({ type: 'error', text: 'Please select a file to upload.' });
          setUploading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title || file.name);
        formData.append('subject', subject);
        formData.append('chapter', chapter);
        formData.append('topic', topic);

        const res = await api.uploadDocument(formData);
        if (res.success) {
          setMessage({ type: 'success', text: 'Study material uploaded successfully!' });
          setFile(null);
          setTitle('');
          loadDocuments();
        }
      } else {
        if (!pastedContent.trim()) {
          setMessage({ type: 'error', text: 'Please paste your notes content.' });
          setUploading(false);
          return;
        }
        const res = await api.pasteDocument({
          title: title || 'Pasted Notes',
          subject,
          chapter,
          topic,
          content: pastedContent
        });
        if (res.success) {
          setMessage({ type: 'success', text: 'Notes saved successfully!' });
          setPastedContent('');
          setTitle('');
          loadDocuments();
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error processing material.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleGenerateMCQ = (doc: DocumentItem) => {
    navigate('/mcq-generator', {
      state: {
        documentId: doc.id,
        subject: doc.subject,
        chapter: doc.chapter,
        topic: doc.topic,
        title: doc.title
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-brand-500" />
              <span>Study Material</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload your documents, lecture slides, and notes to automatically generate customized MCQs.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
            <Layers className="w-4 h-4" />
            <span>Organize by Subject & Chapter</span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Upload Your Study Material
            </h2>

            {/* Toggle Tab */}
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUploadTab('upload')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  uploadTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                File Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('paste')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  uploadTab === 'paste'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Paste Notes
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            {/* Subject, Chapter, Topic Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Java">Core Java</option>
                  <option value="DBMS">Database Management (DBMS)</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="DSA">Data Structures & Algorithms</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chapter
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={e => setChapter(e.target.value)}
                  placeholder="e.g. Data Link Layer"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Ethernet & Sliding Window"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Document Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document / Notes Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Chapter 3 - CSMA/CD Protocol & Error Correction"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Drag & Drop File Area or Text Paste */}
            {uploadTab === 'upload' ? (
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragOver
                    ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-800 hover:border-brand-500/50 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                <input
                  type="file"
                  id="study-file-input"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <label
                  htmlFor="study-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {file ? file.name : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Supports PDF, DOCX, and TXT (Max 10MB)
                    </p>
                  </div>
                  {file && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10">
                      File Ready ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Paste Study Notes / Textbook Text
                </label>
                <textarea
                  rows={6}
                  value={pastedContent}
                  onChange={e => setPastedContent(e.target.value)}
                  placeholder="Paste lecture notes, definitions, formulas, or summaries here..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{uploading ? 'Processing Notes...' : 'Save & Prepare Questions'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Documents List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Your Uploaded Study Material ({documents.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 transition-all shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      {doc.fileType || 'PDF'}
                    </span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {doc.title}
                  </h4>

                  {/* Hierarchy display */}
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="font-semibold text-brand-600 dark:text-brand-400">
                      {doc.subject}
                    </div>
                    {doc.chapter && <div>→ {doc.chapter}</div>}
                    {doc.topic && <div className="text-slate-500 dark:text-slate-400">↳ {doc.topic}</div>}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleGenerateMCQ(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate MCQs</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
