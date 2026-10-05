// src/utils/dateUtils.ts - Date helpers and calculations

import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addDays,
  subDays,
  differenceInMinutes,
  parse,
} from 'date-fns';

export function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEE, MMM d');
  } catch {
    return dateStr;
  }
}

export function formatFullDate(dateStr: string): string {
  try {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(date, 'EEEE, MMMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return format(date, 'h:mm a');
  } catch {
    return timeStr;
  }
}

export function getTimeGreeting(userName: string): { greeting: string; subtitle: string } {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  let subtitle = "Let's make today productive and conquer your goals!";

  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    subtitle = 'Keep up the momentum in your study sessions!';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good evening';
    subtitle = 'Wind down with your evening revision and review.';
  } else if (hour >= 22 || hour < 5) {
    greeting = 'Good night';
    subtitle = 'Great work today. Remember sleep enhances memory!';
  }

  return { greeting: `${greeting}, ${userName}`, subtitle };
}

export function getMonthDays(currentDate: Date) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: startDate, end: endDate });
}

export function getWeekDays(currentDate: Date) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: startDate, end: endDate });
}

export function isDateInPast(dateStr: string, timeStr?: string): boolean {
  try {
    const todayStr = getTodayDateString();
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;
    
    // Same day, check time
    if (timeStr) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [h, m] = timeStr.split(':').map(Number);
      return (h * 60 + m) < currentMinutes;
    }
    return false;
  } catch {
    return false;
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function formatSecondsToTimer(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export {
  isToday,
  isTomorrow,
  isYesterday,
  isSameDay,
  isSameMonth,
  addDays,
  subDays,
  format,
  parseISO,
};
