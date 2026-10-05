// src/utils/streakEngine.ts - Robust Streak Calculation Engine for StudyMate

import { subDays, format, parseISO, differenceInCalendarDays } from 'date-fns';
import type { Streak } from '../types';
import { getTodayDateString } from './dateUtils';

export interface StreakEvaluationResult {
  streak: Streak;
  streakIncremented: boolean;
  graceUsed: boolean;
}

export function evaluateStreakOnCompletion(
  currentStreakData: Streak,
  completionDateStr: string = getTodayDateString(),
  graceDaysAllowed: number = 2
): StreakEvaluationResult {
  const activeDatesSet = new Set(currentStreakData.activeDates || []);
  const todayStr = getTodayDateString();

  // If this date is already recorded in active dates, no streak count increase is needed
  if (activeDatesSet.has(completionDateStr)) {
    return {
      streak: {
        ...currentStreakData,
        lastActiveDate: completionDateStr,
      },
      streakIncremented: false,
      graceUsed: false,
    };
  }

  // Add new active date
  activeDatesSet.add(completionDateStr);
  const sortedDates = Array.from(activeDatesSet).sort();

  const lastActiveDateStr = currentStreakData.lastActiveDate;
  let newCurrentStreak = currentStreakData.currentStreak;
  let graceUsed = false;
  let freezeDaysRemaining = currentStreakData.freezeDaysRemaining ?? graceDaysAllowed;

  if (!lastActiveDateStr) {
    // Brand new streak
    newCurrentStreak = 1;
  } else {
    try {
      const lastDate = parseISO(lastActiveDateStr);
      const currentDate = parseISO(completionDateStr);
      const dayDiff = differenceInCalendarDays(currentDate, lastDate);

      if (dayDiff === 1) {
        // Perfect consecutive day!
        newCurrentStreak += 1;
      } else if (dayDiff === 2 && freezeDaysRemaining > 0) {
        // Missed 1 day, but user has grace day available!
        freezeDaysRemaining -= 1;
        graceUsed = true;
        newCurrentStreak += 1;
      } else if (dayDiff > 1) {
        // Gap too large or no grace days left, restart streak to 1
        newCurrentStreak = 1;
      }
    } catch {
      newCurrentStreak = 1;
    }
  }

  const newBestStreak = Math.max(currentStreakData.bestStreak || 0, newCurrentStreak);

  const updatedStreak: Streak = {
    userId: currentStreakData.userId,
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    lastActiveDate: completionDateStr,
    freezeDaysRemaining,
    graceDaysUsed: (currentStreakData.graceDaysUsed || 0) + (graceUsed ? 1 : 0),
    activeDates: sortedDates,
  };

  return {
    streak: updatedStreak,
    streakIncremented: true,
    graceUsed,
  };
}
