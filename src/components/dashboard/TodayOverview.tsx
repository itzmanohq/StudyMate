// src/components/dashboard/TodayOverview.tsx
import React, { useState } from 'react';
import {
  Bell,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  Plus,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/dateUtils';
import { ReminderCard } from '../cards/ReminderCard';
import { EventCard } from '../cards/EventCard';
import { StudySessionCard } from '../cards/StudySessionCard';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';

export const TodayOverview: React.FC = () => {
  const { reminders, events, studySessions, openAddModal, searchQuery } = useApp();
  const [filter, setFilter] = useState<'all' | 'reminders' | 'study' | 'events'>('all');
  const todayStr = getTodayDateString();

  // Filter Today's items
  let todayReminders = reminders.filter((r) => r.date === todayStr);
  let todayEvents = events.filter((e) => e.date === todayStr);
  let todaySessions = studySessions.filter((s) => s.date === todayStr);

  // Apply search query if typed
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    todayReminders = todayReminders.filter(
      (r) => r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
    );
    todayEvents = todayEvents.filter(
      (e) => e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)
    );
    todaySessions = todaySessions.filter(
      (s) => s.subject.toLowerCase().includes(q) || s.topic?.toLowerCase().includes(q)
    );
  }

  const totalItems = todayReminders.length + todayEvents.length + todaySessions.length;

  return (
    <div className="space-y-4">
      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Today's Schedule
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {totalItems}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({totalItems})
          </button>
          <button
            onClick={() => setFilter('reminders')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
              filter === 'reminders'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-indigo-600'
            }`}
          >
            <Bell className="w-3 h-3" />
            Reminders ({todayReminders.length})
          </button>
          <button
            onClick={() => setFilter('study')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
              filter === 'study'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-indigo-600'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            Study ({todaySessions.length})
          </button>
          <button
            onClick={() => setFilter('events')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 ${
              filter === 'events'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-indigo-600'
            }`}
          >
            <CalendarIcon className="w-3 h-3" />
            Events ({todayEvents.length})
          </button>
        </div>
      </div>

      {/* Item List */}
      {totalItems === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />}
          title="Nothing scheduled for today!"
          description="You are all caught up for today. Plan a study session or set a reminder to stay ahead."
          actionText="Add Study Session"
          onAction={() => openAddModal('study_session')}
        />
      ) : (
        <div className="space-y-3">
          {/* Study Sessions */}
          {(filter === 'all' || filter === 'study') && todaySessions.length > 0 && (
            <div className="space-y-2.5">
              {filter === 'all' && (
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Study Sessions</span>
                </div>
              )}
              {todaySessions.map((session) => (
                <StudySessionCard key={session.id} session={session} />
              ))}
            </div>
          )}

          {/* Reminders */}
          {(filter === 'all' || filter === 'reminders') && todayReminders.length > 0 && (
            <div className="space-y-2.5">
              {filter === 'all' && (
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-2">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Reminders</span>
                </div>
              )}
              {todayReminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          )}

          {/* Events */}
          {(filter === 'all' || filter === 'events') && todayEvents.length > 0 && (
            <div className="space-y-2.5">
              {filter === 'all' && (
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-2">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Events & Lectures</span>
                </div>
              )}
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
