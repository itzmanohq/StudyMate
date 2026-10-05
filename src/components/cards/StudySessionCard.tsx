// src/components/cards/StudySessionCard.tsx
import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Target,
  MoreVertical,
  Pencil,
  Trash2,
  Repeat,
} from 'lucide-react';
import type { StudySession } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatTimeDisplay, formatDateDisplay, formatDuration } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { ConfirmationDialog } from '../common/ConfirmationDialog';

interface StudySessionCardProps {
  session: StudySession;
  showDate?: boolean;
}

export const StudySessionCard: React.FC<StudySessionCardProps> = ({ session, showDate = false }) => {
  const { startLiveStudySession, completeStudySession, deleteStudySession, openEditModal } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCompleted = session.status === 'completed';

  return (
    <>
      <div
        className={`subtle-card rounded-2xl p-4 transition-all duration-200 ${
          isCompleted
            ? 'opacity-65 bg-slate-50 dark:bg-slate-900/40'
            : 'border-l-4 border-l-indigo-500 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Icon & Subject */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h4
                  className={`text-sm font-bold leading-tight ${
                    isCompleted
                      ? 'line-through text-slate-500 dark:text-slate-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {session.subject}
                </h4>
                <Badge variant="outline" className="text-[11px]">
                  {formatDuration(session.plannedDurationMinutes)}
                </Badge>
              </div>

              {session.topic && (
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 line-clamp-1">
                  {session.topic}
                </p>
              )}

              {session.goal && (
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-1">
                  <Target className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span>{session.goal}</span>
                </div>
              )}

              {/* Time & Meta */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  {showDate && `${formatDateDisplay(session.date)}, `}
                  {formatTimeDisplay(session.startTime)}
                </span>

                {session.repeat !== 'none' && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md capitalize">
                    <Repeat className="w-3 h-3 text-slate-400" />
                    {session.repeat}
                  </span>
                )}

                {isCompleted && session.actualDurationMinutes && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    ✓ Logged {session.actualDurationMinutes}m
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
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
                    openEditModal(session);
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

        {/* Quick Start / Complete Footer for pending sessions */}
        {!isCompleted && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => completeStudySession(session.id)}
            >
              Mark Done
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => startLiveStudySession(session)}
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              Start Focus Session
            </Button>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteStudySession(session.id);
          setShowDeleteConfirm(false);
        }}
        title="Delete Study Session"
        message={`Are you sure you want to remove study session for "${session.subject}"?`}
        confirmText="Delete"
        isDangerous
      />
    </>
  );
};
