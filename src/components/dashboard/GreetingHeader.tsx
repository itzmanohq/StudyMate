// src/components/dashboard/GreetingHeader.tsx
import React from 'react';
import { Flame, Sparkles, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTimeGreeting, formatFullDate, getTodayDateString } from '../../utils/dateUtils';
import { Button } from '../common/Button';

export const GreetingHeader: React.FC = () => {
  const { currentUser, streak, studySessions, reminders, openAddModal, setCurrentTab } = useApp();
  const todayStr = getTodayDateString();
  const { greeting, subtitle } = getTimeGreeting(currentUser.name.split(' ')[0]);

  // Calculate today's stats
  const todayReminders = reminders.filter((r) => r.date === todayStr);
  const completedReminders = todayReminders.filter((r) => r.status === 'completed');
  
  const todaySessions = studySessions.filter((s) => s.date === todayStr);
  const completedSessions = todaySessions.filter((s) => s.status === 'completed');

  const totalToday = todayReminders.length + todaySessions.length;
  const totalCompleted = completedReminders.length + completedSessions.length;
  const progressPercent = totalToday > 0 ? Math.round((totalCompleted / totalToday) * 100) : 100;

  return (
    <div className="subtle-card rounded-3xl p-5 sm:p-7 relative overflow-hidden bg-gradient-to-br from-indigo-900/10 via-slate-900/5 to-purple-900/10 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-purple-950/40 border-slate-200/80 dark:border-slate-800">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {formatFullDate(todayStr)}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {greeting}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg">
            {subtitle}
          </p>
        </div>

        {/* Streak & Quick Action */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Interactive Streak Pill */}
          <button
            onClick={() => setCurrentTab('streak')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 hover:border-amber-400 transition-all shadow-sm group text-left"
            title="View Streak Details"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse-subtle" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200 leading-none">
                {streak.currentStreak} Day Streak
              </div>
              <div className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-0.5 font-medium">
                Best: {streak.bestStreak} days
              </div>
            </div>
          </button>

          {/* Quick Add Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => openAddModal()}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-glow"
          >
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Today's Goal Progress Bar */}
      <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Today's Progress: {totalCompleted} of {totalToday} completed ({progressPercent}%)
          </span>
        </div>

        <div className="w-full sm:w-64 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
