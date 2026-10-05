// src/components/dashboard/QuickStatsCard.tsx
import React from 'react';
import { CheckCircle2, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, formatDuration } from '../../utils/dateUtils';

export const QuickStatsCard: React.FC = () => {
  const { reminders, events, studySessions } = useApp();
  const todayStr = getTodayDateString();

  const todayReminders = reminders.filter((r) => r.date === todayStr);
  const completedReminders = todayReminders.filter((r) => r.status === 'completed');
  const pendingReminders = todayReminders.filter((r) => r.status === 'pending');

  const todaySessions = studySessions.filter((s) => s.date === todayStr);
  const completedSessions = todaySessions.filter((s) => s.status === 'completed');
  
  // Total planned study time today
  const totalStudyMinutes = todaySessions.reduce((acc, s) => acc + (s.actualDurationMinutes || s.plannedDurationMinutes), 0);

  const stats = [
    {
      label: 'Completed Tasks',
      value: `${completedReminders.length + completedSessions.length}`,
      subtext: `of ${todayReminders.length + todaySessions.length} total`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    },
    {
      label: 'Pending Tasks',
      value: `${pendingReminders.length}`,
      subtext: 'reminders today',
      icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
    },
    {
      label: 'Study Time Today',
      value: formatDuration(totalStudyMinutes),
      subtext: `${todaySessions.length} session${todaySessions.length === 1 ? '' : 's'}`,
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
    },
    {
      label: "Today's Events",
      value: `${events.filter((e) => e.date === todayStr).length}`,
      subtext: 'lectures & exams',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="subtle-card rounded-2xl p-3.5 flex flex-col justify-between hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              {stat.label}
            </span>
            <div className={`p-1.5 rounded-lg ${stat.bg} flex-shrink-0`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {stat.subtext}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
