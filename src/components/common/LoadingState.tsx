// src/components/common/LoadingState.tsx
import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading your study space...' }) => {
  return (
    <div className="w-full space-y-4 p-4">
      {/* Header skeleton */}
      <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-shimmer" />
      
      {/* Quick stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer" />
      </div>

      {/* Cards skeleton */}
      <div className="space-y-3 pt-2">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-shimmer" />
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-shimmer" />
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-shimmer" />
      </div>

      <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-2 animate-pulse">
        {message}
      </p>
    </div>
  );
};
