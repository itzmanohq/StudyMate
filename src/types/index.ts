// src/types/index.ts - Core Data Models for StudyMate

export type UserRole = 'owner' | 'brother' | 'custom';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  googleId?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type ReminderPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RepeatFrequency = 'none' | 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly';

export type ItemStatus = 'pending' | 'completed' | 'snoozed' | 'missed' | 'in_progress';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priority: ReminderPriority;
  repeat: RepeatFrequency;
  snoozeMinutes: number; // e.g. 5, 10, 15, 30
  notificationEnabled: boolean;
  status: ItemStatus;
  completedAt?: string;
  snoozedUntil?: string; // ISO string
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 'exam' | 'lecture' | 'assignment' | 'study_group' | 'personal' | 'deadline';

export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: EventCategory;
  location?: string;
  reminderMinutesBefore: number[]; // e.g. [15, 60]
  isCompleted: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  topic?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  plannedDurationMinutes: number; // e.g., 45, 60, 90
  actualDurationMinutes?: number;
  repeat: RepeatFrequency;
  goal?: string;
  status: ItemStatus;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Streak {
  userId: string;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  freezeDaysRemaining: number;
  graceDaysUsed: number;
  activeDates: string[]; // List of YYYY-MM-DD where user completed goals
}

export type AchievementCategory = 'streak' | 'study_hours' | 'punctuality' | 'mastery';

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export type SoundType = 'chime' | 'gentle' | 'radar' | 'zen' | 'bell';

export interface NotificationSettings {
  soundEnabled: boolean;
  soundType: SoundType;
  vibrationEnabled: boolean;
  defaultSnoozeMinutes: number;
  advanceWarningMinutes: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
}

export type AppTheme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: AppTheme;
  patternLockEnabled: boolean;
  patternHash?: string; // stored hashed dot indices
  dailyStudyGoalMinutes: number; // e.g. 120 (2 hrs)
  graceDaysAllowed: number; // e.g. 2 per month
  autoStartNextSession: boolean;
  hapticFeedback: boolean;
}

export type CompletionItemType = 'reminder' | 'event' | 'study_session';

export interface CompletionRecord {
  id: string;
  userId: string;
  itemId: string;
  itemType: CompletionItemType;
  title: string;
  categoryOrSubject: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  completedAt: string; // ISO string
  status: 'completed' | 'missed' | 'skipped';
  durationMinutes?: number;
  notes?: string;
}

export type NavigationTab = 'home' | 'calendar' | 'streak' | 'history' | 'settings';

export type ItemType = 'reminder' | 'event' | 'study_session';

export interface ActiveStudySessionState {
  sessionId: string;
  subject: string;
  topic?: string;
  startTime: number; // timestamp ms
  elapsedSeconds: number;
  isPaused: boolean;
  targetDurationMinutes: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  durationMs?: number;
}
