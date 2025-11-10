
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const progress = Math.min((current / total) * 100, 100);

  return (
    <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-sky-600">Progress</span>
            <span className="text-sm font-bold text-slate-500">{Math.min(current, total)} / {total}</span>
        </div>
      <div className="w-full bg-sky-200 rounded-full h-4 shadow-inner">
        <div
          className="bg-green-400 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
