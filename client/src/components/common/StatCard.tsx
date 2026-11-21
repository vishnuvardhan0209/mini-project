import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'brand',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-brand-500/40' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-brand-600 dark:text-brand-400">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
