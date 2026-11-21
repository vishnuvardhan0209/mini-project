import React from 'react';

interface ProgressBarProps {
  label?: string;
  value: number;
  max?: number;
  showValue?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  statusBadge?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  showValue = true,
  color,
  size = 'md',
  statusBadge
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3.5' : 'h-2.5';

  const defaultColor =
    percentage >= 75
      ? 'bg-emerald-500'
      : percentage >= 50
      ? 'bg-indigo-500'
      : percentage >= 40
      ? 'bg-amber-500'
      : 'bg-rose-500';

  const barColor = color || defaultColor;

  return (
    <div className="w-full">
      {(label || showValue || statusBadge) && (
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <div className="flex items-center gap-2">
            {label && <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>}
            {statusBadge && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {statusBadge}
              </span>
            )}
          </div>
          {showValue && (
            <span className="font-semibold text-slate-900 dark:text-slate-100">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${barColor} ${heightClass} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
