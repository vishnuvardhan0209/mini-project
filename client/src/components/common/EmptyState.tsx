import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
      <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-4">
        {icon}
      </div>
      <h4 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h4>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
