// src/components/modals/ActiveStudyTimerModal.tsx
import React, { useState } from 'react';
import {
  Pause,
  Play,
  CheckCircle2,
  X,
  Target,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { formatSecondsToTimer } from '../../utils/dateUtils';

export const ActiveStudyTimerModal: React.FC = () => {
  const {
    activeStudySession,
    pauseLiveStudySession,
    resumeLiveStudySession,
    finishLiveStudySession,
    cancelLiveStudySession,
  } = useApp();

  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  if (!activeStudySession) return null;

  const targetSeconds = activeStudySession.targetDurationMinutes * 60;
  const progressPercent = Math.min(100, Math.round((activeStudySession.elapsedSeconds / targetSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative flex flex-col items-center animate-scale-in">
        {/* Minimize / Cancel */}
        <button
          onClick={cancelLiveStudySession}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Cancel Study Session"
          aria-label="Cancel session"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Subject Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{activeStudySession.subject}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {activeStudySession.topic || 'Deep Focus Session'}
        </h3>

        {activeStudySession.topic && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5 text-indigo-500" />
            <span>Target: {activeStudySession.targetDurationMinutes} mins</span>
          </p>
        )}

        {/* Circular Timer Display */}
        <div className="relative w-48 h-48 my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-indigo-600 dark:text-indigo-500 transition-all duration-500 ease-linear"
              strokeWidth="7"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
              {formatSecondsToTimer(activeStudySession.elapsedSeconds)}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {progressPercent}% of target
            </span>
          </div>
        </div>

        {/* Notes Toggle */}
        {showNotes ? (
          <div className="w-full mt-4 mb-2 animate-fade-in text-left">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Session Summary Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn / accomplish?"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowNotes(true)}
            className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            + Add session summary notes
          </button>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 w-full mt-6">
          {activeStudySession.isPaused ? (
            <Button
              variant="amber"
              size="lg"
              className="flex-1"
              onClick={resumeLiveStudySession}
              leftIcon={<Play className="w-5 h-5 fill-current" />}
            >
              Resume
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={pauseLiveStudySession}
              leftIcon={<Pause className="w-5 h-5" />}
            >
              Pause
            </Button>
          )}

          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => finishLiveStudySession(notes)}
            leftIcon={<CheckCircle2 className="w-5 h-5" />}
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};
