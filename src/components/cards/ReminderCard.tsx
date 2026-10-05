// src/components/cards/ReminderCard.tsx
import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Repeat,
  MoreVertical,
  Bell,
  BellOff,
  AlarmClock,
  Pencil,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import type { Reminder } from '../../types';
import { getPriorityBadge } from '../common/Badge';
import { formatTimeDisplay, formatDateDisplay } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { PatternLockDialog } from '../common/PatternLockDialog';

interface ReminderCardProps {
  reminder: Reminder;
  showDate?: boolean;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, showDate = false }) => {
  const {
    completeReminder,
    snoozeReminder,
    deleteReminder,
    openEditModal,
    appSettings,
    unlockApp,
    addToast,
  } = useApp();

  const [showMenu, setShowMenu] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPatternPrompt, setShowPatternPrompt] = useState(false);

  const isCompleted = reminder.status === 'completed';
  const isSnoozed = reminder.status === 'snoozed';

  const handlePermanentDismiss = () => {
    setShowMenu(false);
    if (appSettings.patternLockEnabled) {
      setShowPatternPrompt(true);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handlePatternVerifiedDismiss = async (pattern: number[]): Promise<boolean> => {
    const success = await unlockApp(pattern);
    if (success) {
      setShowPatternPrompt(false);
      await deleteReminder(reminder.id);
      addToast({
        type: 'info',
        title: 'Permanently Dismissed',
        message: `"${reminder.title}" was verified and removed.`,
      });
      return true;
    }
    return false;
  };

  return (
    <>
      <div
        className={`subtle-card rounded-2xl p-4 transition-all duration-200 ${
          isCompleted
            ? 'opacity-65 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
            : 'hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-3.5">
          {/* Complete Checkbox Button */}
          <button
            onClick={() => completeReminder(reminder.id)}
            disabled={isCompleted}
            className={`mt-0.5 p-1 rounded-full transition-colors flex-shrink-0 ${
              isCompleted
                ? 'text-emerald-500 cursor-default'
                : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
            }`}
            aria-label={isCompleted ? 'Reminder completed' : 'Mark reminder completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950/60" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h4
                className={`text-sm font-semibold leading-tight ${
                  isCompleted
                    ? 'line-through text-slate-500 dark:text-slate-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {reminder.title}
              </h4>
              {getPriorityBadge(reminder.priority)}
            </div>

            {reminder.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2.5 line-clamp-2">
                {reminder.description}
              </p>
            )}

            {/* Time & Meta Row */}
            <div className="flex items-center flex-wrap gap-2.5 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                {showDate && `${formatDateDisplay(reminder.date)}, `}
                {formatTimeDisplay(reminder.time)}
              </span>

              {reminder.repeat !== 'none' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md capitalize">
                  <Repeat className="w-3 h-3 text-slate-400" />
                  {reminder.repeat}
                </span>
              )}

              {reminder.notificationEnabled ? (
                <span title="Notifications active" className="text-slate-400">
                  <Bell className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span title="Notifications disabled" className="text-slate-300 dark:text-slate-600">
                  <BellOff className="w-3.5 h-3.5" />
                </span>
              )}

              {isSnoozed && (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md text-[11px] font-medium">
                  <AlarmClock className="w-3 h-3" />
                  Snoozed
                </span>
              )}
            </div>
          </div>

          {/* Action Menu Button */}
          <div className="relative flex-shrink-0 flex items-center gap-1">
            {/* Quick Snooze Button */}
            {!isCompleted && (
              <div className="relative">
                <button
                  onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
                  className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Snooze reminder"
                  aria-label="Snooze"
                >
                  <AlarmClock className="w-4 h-4" />
                </button>

                {/* Snooze Popup */}
                {showSnoozeMenu && (
                  <div className="absolute right-0 top-8 z-30 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs animate-scale-in">
                    <p className="px-3 py-1 font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-700 text-[10px] uppercase tracking-wider">
                      Snooze For
                    </p>
                    {[5, 10, 15, 30, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => {
                          snoozeReminder(reminder.id, mins);
                          setShowSnoozeMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                      >
                        +{mins >= 60 ? '1 hour' : `${mins} mins`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Overflow Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs animate-scale-in">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      openEditModal(reminder);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5 text-indigo-500" />
                    Edit
                  </button>

                  <button
                    onClick={handlePermanentDismiss}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                  >
                    {appSettings.patternLockEnabled ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Dismiss Permanently</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Confirmation if enabled */}
      <PatternLockDialog
        isOpen={showPatternPrompt}
        mode="unlock"
        onUnlock={handlePatternVerifiedDismiss}
        onClose={() => setShowPatternPrompt(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteReminder(reminder.id);
          setShowDeleteConfirm(false);
        }}
        title="Delete Reminder"
        message={`Are you sure you want to delete "${reminder.title}"?`}
        confirmText="Delete"
        isDangerous
      />
    </>
  );
};
