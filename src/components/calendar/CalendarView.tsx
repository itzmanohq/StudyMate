// src/components/calendar/CalendarView.tsx
import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  BookOpen,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getMonthDays,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  subDays,
  formatFullDate,
  formatDateDisplay,
  getTodayDateString,
} from '../../utils/dateUtils';
import { ReminderCard } from '../cards/ReminderCard';
import { EventCard } from '../cards/EventCard';
import { StudySessionCard } from '../cards/StudySessionCard';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export const CalendarView: React.FC = () => {
  const {
    reminders,
    events,
    studySessions,
    selectedCalendarDate,
    setSelectedCalendarDate,
    openAddModal,
  } = useApp();

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const monthDays = getMonthDays(currentMonthDate);

  const selectedDateObj = new Date(selectedCalendarDate + 'T00:00:00');

  const handlePrevMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonthDate(today);
    setSelectedCalendarDate(getTodayDateString());
  };

  // Get items for selected day
  const dayReminders = reminders.filter((r) => r.date === selectedCalendarDate);
  const dayEvents = events.filter((e) => e.date === selectedCalendarDate);
  const daySessions = studySessions.filter((s) => s.date === selectedCalendarDate);
  const totalDayItems = dayReminders.length + dayEvents.length + daySessions.length;

  return (
    <div className="space-y-6">
      {/* Calendar & Agenda Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= CALENDAR GRID (7 Cols on LG) ================= */}
        <div className="lg:col-span-7 subtle-card rounded-3xl p-4 sm:p-6 space-y-4">
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {format(currentMonthDate, 'MMMM yyyy')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any day to view or add items
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <Button variant="secondary" size="sm" onClick={handleTodayClick}>
                Today
              </Button>
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Matrix */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {monthDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isSelected = dateStr === selectedCalendarDate;
              const isCurrentMonth = isSameMonth(day, currentMonthDate);
              const isDayToday = isToday(day);

              // Check items for dot indicators
              const hasReminders = reminders.some((r) => r.date === dateStr);
              const hasEvents = events.some((e) => e.date === dateStr);
              const hasStudy = studySessions.some((s) => s.date === dateStr);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedCalendarDate(dateStr)}
                  className={`min-h-[54px] sm:min-h-[68px] p-1.5 rounded-2xl flex flex-col items-center justify-between transition-all duration-150 relative ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-glow ring-2 ring-indigo-500/50 scale-[1.02] z-10'
                      : isDayToday
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : isCurrentMonth
                      ? 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                      : 'text-slate-300 dark:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                  aria-label={format(day, 'MMMM d, yyyy')}
                >
                  <span
                    className={`text-xs sm:text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                      isSelected
                        ? 'text-white'
                        : isDayToday
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Dot Indicators */}
                  <div className="flex items-center gap-1 mt-1">
                    {hasStudy && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-emerald-500'
                        }`}
                        title="Study Session"
                      />
                    )}
                    {hasReminders && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-amber-300' : 'bg-amber-500'
                        }`}
                        title="Reminder"
                      />
                    )}
                    {hasEvents && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-blue-300' : 'bg-blue-500'
                        }`}
                        title="Event"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-center flex-wrap gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Study Session</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Reminder</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Event / Exam</span>
            </span>
          </div>
        </div>

        {/* ================= DAY AGENDA (5 Cols on LG) ================= */}
        <div className="lg:col-span-5 subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Day Agenda
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {formatFullDate(selectedCalendarDate)}
              </h3>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => openAddModal()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          {/* Agenda Items */}
          {totalDayItems === 0 ? (
            <EmptyState
              icon={<CalendarIcon className="w-6 h-6 text-indigo-500" />}
              title="No items for this date"
              description={`You have nothing scheduled on ${formatDateDisplay(selectedCalendarDate)}.`}
              actionText="Schedule for this day"
              onAction={() => openAddModal()}
            />
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {daySessions.map((session) => (
                <StudySessionCard key={session.id} session={session} />
              ))}

              {dayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}

              {dayReminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
