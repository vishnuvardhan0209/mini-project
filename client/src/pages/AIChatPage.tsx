import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  Trash2,
  User,
  Copy,
  Check,
  Code2,
  Terminal,
  MessageSquare
} from 'lucide-react';
import { DashboardLayout } from '../components/common/DashboardLayout';
import { api } from '../services/api';
import { ChatMessage } from '../types';

export const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Give me a Java interview roadmap.',
    'Explain REST API for an interview.',
    'What DSA topics should I learn for placements?',
    'Give me 5 essential DBMS interview questions.',
    'How should I prepare for behavioral HR rounds?'
  ];

  useEffect(() => {
    loadChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const loadChat = async () => {
    try {
      const res = await api.getChatHistory();
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.warn('Chat load error:', err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || sending) return;

    setInput('');
    setSending(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      userId: 'user-alex-kumar',
      conversationId: 'conv-default',
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await api.sendChatMessage(text);
      if (res.success && res.botMessage) {
        setMessages(prev => [...prev, res.botMessage]);
      }
    } catch (err) {
      console.error('Chat send error:', err);
      // Fallback local bot response
      const fallbackMsg: ChatMessage = {
        id: `fb-${Date.now()}`,
        userId: 'user-alex-kumar',
        conversationId: 'conv-default',
        role: 'assistant',
        content: `### 🚀 Career Advisor Response\n\nTo prepare effectively for **${text}**, structure your review into:\n1. Core engineering foundations (Data Structures, JVM/OS, ACID transactions)\n2. High-throughput system design principles\n3. Mock interview problem practice.\n\nFeel free to ask for specific code snippets, question lists, or roadmap breakdowns!`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    try {
      await api.clearChat();
      setMessages([]);
    } catch (err) {
      console.error('Clear chat error:', err);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple Markdown-like renderer for code blocks and bold headings
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].match(/^[a-z]+/i) ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            {language && (
              <div className="px-3.5 py-1.5 bg-slate-800/80 border-b border-slate-700/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>{language}</span>
                <Terminal className="w-3 h-3 text-slate-400" />
              </div>
            )}
            <pre className="p-3 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
              {code}
            </pre>
          </div>
        );
      }

      // Format markdown headers, lists, and bold text
      return (
        <div key={index} className="space-y-2 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
          {part}
        </div>
      );
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Top Chat Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-ai-cyan text-white flex items-center justify-center shadow-glow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Career Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Specialized in DSA, Core Java, System Architecture, Resume Tuning, and HR Prep
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSend('Give me a quick 3-minute career prep tip!')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Quick Tip</span>
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ask Your Career & Interview Questions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Get personalized roadmap guidance, technical interview concept explanations, and DSA strategy.
                </p>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg pt-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-brand-500/50 hover:bg-slate-100 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all text-left"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`relative p-4 rounded-2xl max-w-[85%] ${
                      isUser
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    }`}
                  >
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute right-2.5 top-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {sending && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-500 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips Above Input */}
        {messages.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400">Suggestions:</span>
            {suggestedQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about interviews, DSA, Spring Boot, resume tips..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="p-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-sm disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
