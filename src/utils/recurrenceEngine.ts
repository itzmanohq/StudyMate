// src/utils/recurrenceEngine.ts - Advanced Recurrence and Snooze Engine

import { addDays, addWeeks, addMonths, parse, format, getDay } from 'date-fns';
import type { RepeatFrequency } from '../types';

export function calculateNextOccurrence(
  currentDateStr: string,
  repeat: RepeatFrequency,
  customWeekdays?: number[] // 0 for Sun, 1 for Mon, ... 6 for Sat
): string | null {
  if (repeat === 'none') return null;

  const date = parse(currentDateStr, 'yyyy-MM-dd', new Date());

  switch (repeat) {
    case 'daily':
      return format(addDays(date, 1), 'yyyy-MM-dd');

    case 'weekdays': {
      let nextDate = addDays(date, 1);
      const day = getDay(nextDate);
      if (day === 6) nextDate = addDays(nextDate, 2); // Sat -> Mon
      else if (day === 0) nextDate = addDays(nextDate, 1); // Sun -> Mon
      return format(nextDate, 'yyyy-MM-dd');
    }

    case 'weekends': {
      let nextDate = addDays(date, 1);
      while (getDay(nextDate) !== 0 && getDay(nextDate) !== 6) {
        nextDate = addDays(nextDate, 1);
      }
      return format(nextDate, 'yyyy-MM-dd');
    }

    case 'weekly':
      return format(addWeeks(date, 1), 'yyyy-MM-dd');

    case 'monthly':
      return format(addMonths(date, 1), 'yyyy-MM-dd');

    default:
      return format(addDays(date, 1), 'yyyy-MM-dd');
  }
}

export function calculateSnoozedTime(
  baseDate: string,
  baseTime: string,
  snoozeMinutes: number
): { snoozedIso: string; displayTime: string } {
  const [hours, minutes] = baseTime.split(':').map(Number);
  const now = new Date();
  
  // Set date & time
  const targetDate = new Date();
  targetDate.setMinutes(targetDate.getMinutes() + snoozeMinutes);

  return {
    snoozedIso: targetDate.toISOString(),
    displayTime: format(targetDate, 'h:mm a'),
  };
}
