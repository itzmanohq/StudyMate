// src/components/cards/EventCard.tsx
import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Bell,
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Event } from '../../types';
import { getCategoryBadge } from '../common/Badge';
import { formatTimeDisplay, formatDateDisplay } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { ConfirmationDialog } from '../common/ConfirmationDialog';

interface EventCardProps {
  event: Event;
  showDate?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, showDate = false }) => {
  const { completeEvent, deleteEvent, openEditModal } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div
        className={`subtle-card rounded-2xl p-4 transition-all duration-200 ${
          event.isCompleted
            ? 'opacity-65 bg-slate-50 dark:bg-slate-900/40'
            : 'hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-3.5">
          {/* Status Checkbox */}
          <button
            onClick={() => completeEvent(event.id)}
            className={`mt-0.5 p-1 rounded-full transition-colors flex-shrink-0 ${
              event.isCompleted
                ? 'text-emerald-500'
                : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
            }`}
            aria-label={event.isCompleted ? 'Mark event incomplete' : 'Mark event completed'}
          >
            {event.isCompleted ? (
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
                  event.isCompleted
                    ? 'line-through text-slate-500 dark:text-slate-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {event.title}
              </h4>
              {getCategoryBadge(event.category)}
            </div>

            {event.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2.5 line-clamp-2">
                {event.description}
              </p>
            )}

            {/* Time & Meta Row */}
            <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              {showDate && (
                <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {formatDateDisplay(event.date)}
                </span>
              )}

              <span className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                {formatTimeDisplay(event.startTime)} – {formatTimeDisplay(event.endTime)}
              </span>

              {event.location && (
                <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[140px]">{event.location}</span>
                </span>
              )}

              {event.reminderMinutesBefore.length > 0 && (
                <span className="inline-flex items-center gap-1 text-slate-400" title={`Alarm ${event.reminderMinutesBefore.join(', ')}m before`}>
                  <Bell className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px]">{event.reminderMinutesBefore[0]}m</span>
                </span>
              )}
            </div>
          </div>

          {/* Overflow Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 z-30 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs animate-scale-in">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    openEditModal(event);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <Pencil className="w-3.5 h-3.5 text-indigo-500" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteEvent(event.id);
          setShowDeleteConfirm(false);
        }}
        title="Delete Event"
        message={`Are you sure you want to delete event "${event.title}"?`}
        confirmText="Delete"
        isDangerous
      />
    </>
  );
};
