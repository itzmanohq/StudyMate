// src/components/dashboard/MissedTasksAlert.tsx - Catch-up UI for missed reminders and sessions
import React from 'react';
import { AlertCircle, CheckCircle2, FastForward, Clock, BookOpen, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/dateUtils';
import { Button } from '../common/Button';

export const MissedTasksAlert: React.FC = () => {
  const { reminders, studySessions, completeReminder, completeStudySession, addToast } = useApp();
  const todayStr = getTodayDateString();

  const now = new Date();
  const currentHours = now.getHours().toString().padStart(2, '0');
  const currentMins = now.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMins}`;

  // Find missed reminders scheduled before current time that are still pending
  const missedReminders = reminders.filter(
    (r) => r.date === todayStr && r.status === 'pending' && r.time < currentTimeStr
  );

  const missedSessions = studySessions.filter(
    (s) => s.date === todayStr && s.status === 'pending' && s.startTime < currentTimeStr
  );

  const totalMissed = missedReminders.length + missedSessions.length;

  if (totalMissed === 0) return null;

  return (
    <div className="subtle-card rounded-2xl p-4 sm:p-5 bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3 animate-fade-in mb-6">
      <div className="flex items-center justify-between pb-2 border-b border-rose-200/60 dark:border-rose-900/40">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <h4 className="text-sm font-bold leading-tight">
            Catch-Up: You have {totalMissed} past scheduled item{totalMissed > 1 ? 's' : ''} today
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
          Missed time slot
        </span>
      </div>

      <div className="space-y-2.5">
        {missedReminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-rose-100 dark:border-rose-900/40"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {reminder.title}
                </h5>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Scheduled for {reminder.time}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  completeReminder(reminder.id);
                  addToast({ type: 'info', title: 'Marked Completed' });
                }}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              >
                Complete
              </Button>
            </div>
          </div>
        ))}

        {missedSessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-rose-100 dark:border-rose-900/40"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {session.subject} Study Session
                </h5>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Scheduled for {session.startTime} ({session.plannedDurationMinutes}m)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  completeStudySession(session.id);
                }}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              >
                Log as Done
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
