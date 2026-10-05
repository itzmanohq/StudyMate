// src/components/dashboard/UpcomingSection.tsx
import React from 'react';
import { Calendar, ArrowRight, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, addDays, format, formatDateDisplay } from '../../utils/dateUtils';
import { ReminderCard } from '../cards/ReminderCard';
import { EventCard } from '../cards/EventCard';
import { StudySessionCard } from '../cards/StudySessionCard';
import { Button } from '../common/Button';

export const UpcomingSection: React.FC = () => {
  const { reminders, events, studySessions, setCurrentTab, setSelectedCalendarDate } = useApp();
  const todayStr = getTodayDateString();

  // Find items scheduled after today
  const upcomingReminders = reminders
    .filter((r) => r.date > todayStr)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 3);

  const upcomingEvents = events
    .filter((e) => e.date > todayStr)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 3);

  const upcomingSessions = studySessions
    .filter((s) => s.date > todayStr)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 2);

  const totalUpcoming = upcomingReminders.length + upcomingEvents.length + upcomingSessions.length;

  if (totalUpcoming === 0) return null;

  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Schedule
          </h3>
        </div>

        <button
          onClick={() => setCurrentTab('calendar')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
        >
          <span>Full Calendar</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event) => (
          <EventCard key={event.id} event={event} showDate />
        ))}

        {upcomingReminders.map((reminder) => (
          <ReminderCard key={reminder.id} reminder={reminder} showDate />
        ))}

        {upcomingSessions.map((session) => (
          <StudySessionCard key={session.id} session={session} showDate />
        ))}
      </div>
    </div>
  );
};
