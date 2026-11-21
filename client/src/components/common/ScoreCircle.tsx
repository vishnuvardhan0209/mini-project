import React from 'react';

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  maxScore = 10,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  color
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(Math.max(score, 0), maxScore);
  const percentage = (normalizedScore / maxScore) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage if not explicitly passed
  const strokeColor =
    color ||
    (percentage >= 80
      ? '#10b981' // emerald
      : percentage >= 60
      ? '#6366f1' // indigo
      : percentage >= 45
      ? '#f59e0b' // amber
      : '#f43f5e'); // rose

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
            fill="transparent"
          />
          {/* Animated score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {score.toFixed(1)}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            / {maxScore}
          </span>
        </div>
      </div>
      {(label || sublabel) && (
        <div className="mt-2 text-center">
          {label && <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>}
          {sublabel && <p className="text-xs text-slate-500 dark:text-slate-400">{sublabel}</p>}
        </div>
      )}
    </div>
  );
};
