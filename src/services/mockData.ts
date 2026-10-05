// src/services/mockData.ts - Realistic initial data for StudyMate

import {
  UserProfile,
  Reminder,
  Event,
  StudySession,
  Streak,
  Achievement,
  NotificationSettings,
  AppSettings,
  CompletionRecord
} from '../types';
import { getTodayDateString, addDays, subDays, format } from '../utils/dateUtils';

const today = getTodayDateString();
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
const dayAfterTomorrow = format(addDays(new Date(), 2), 'yyyy-MM-dd');
const inThreeDays = format(addDays(new Date(), 3), 'yyyy-MM-dd');
const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
const threeDaysAgo = format(subDays(new Date(), 3), 'yyyy-MM-dd');

// Generate past 14 days active date strings for streak
const pastActiveDates: string[] = [];
for (let i = 0; i < 12; i++) {
  pastActiveDates.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
}

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_1_owner',
    name: 'Alex Morgan',
    email: 'alex.morgan.study@gmail.com',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'user_2_brother',
    name: 'Sam Morgan',
    email: 'sam.morgan.edu@gmail.com',
    role: 'brother',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T09:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  }
];

// USER 1 (Owner) Dataset
export const USER_1_REMINDERS: Reminder[] = [
  {
    id: 'rem_1',
    userId: 'user_1_owner',
    title: 'Study Electronics',
    description: 'Focus on Op-Amps, feedback topologies, and Bode plots',
    date: today,
    time: '19:00',
    priority: 'urgent',
    repeat: 'daily',
    snoozeMinutes: 10,
    notificationEnabled: true,
    status: 'pending',
    tags: ['Electronics', 'Revision'],
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'rem_2',
    userId: 'user_1_owner',
    title: 'Study Mathematics',
    description: 'Solve 20 problems on 2nd order differential equations',
    date: today,
    time: '21:00',
    priority: 'high',
    repeat: 'weekdays',
    snoozeMinutes: 15,
    notificationEnabled: true,
    status: 'pending',
    tags: ['Math', 'Calculus'],
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'rem_3',
    userId: 'user_1_owner',
    title: 'Review Chemistry Formulae',
    description: 'Thermodynamics enthalpy & Gibbs free energy sheets',
    date: today,
    time: '16:30',
    priority: 'medium',
    repeat: 'none',
    snoozeMinutes: 5,
    notificationEnabled: true,
    status: 'completed',
    completedAt: `${today}T16:45:00.000Z`,
    tags: ['Chemistry'],
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-05T16:45:00.000Z',
  },
  {
    id: 'rem_4',
    userId: 'user_1_owner',
    title: 'Submit Lab Assignment 4',
    description: 'Upload PDF report to portal before midnight',
    date: tomorrow,
    time: '22:00',
    priority: 'urgent',
    repeat: 'none',
    snoozeMinutes: 10,
    notificationEnabled: true,
    status: 'pending',
    tags: ['Assignment'],
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
  {
    id: 'rem_5',
    userId: 'user_1_owner',
    title: 'Weekly Knowledge Self-Quiz',
    description: 'Test active recall on this week’s lecture notes',
    date: inThreeDays,
    time: '10:00',
    priority: 'medium',
    repeat: 'weekly',
    snoozeMinutes: 15,
    notificationEnabled: true,
    status: 'pending',
    tags: ['Quiz', 'Weekly'],
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  }
];

export const USER_1_EVENTS: Event[] = [
  {
    id: 'evt_1',
    userId: 'user_1_owner',
    title: 'Digital Electronics Exam',
    description: 'Midterm Examination in Hall B2 - Bring calculator and student ID',
    date: tomorrow,
    startTime: '09:00',
    endTime: '12:00',
    category: 'exam',
    location: 'Engineering Building, Hall B2',
    reminderMinutesBefore: [60, 15],
    isCompleted: false,
    tags: ['Exam', 'Major'],
    createdAt: '2026-09-20T08:00:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z',
  },
  {
    id: 'evt_2',
    userId: 'user_1_owner',
    title: 'Advanced Calculus Lecture',
    description: 'Professor Davis - Fourier Series & Laplace Transforms',
    date: today,
    startTime: '14:00',
    endTime: '15:30',
    category: 'lecture',
    location: 'Room 304',
    reminderMinutesBefore: [15],
    isCompleted: true,
    tags: ['Lecture', 'Math'],
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-05T15:30:00.000Z',
  },
  {
    id: 'evt_3',
    userId: 'user_1_owner',
    title: 'Robotics Project Group Discussion',
    description: 'Milestone 2 sync with team members',
    date: dayAfterTomorrow,
    startTime: '16:00',
    endTime: '17:30',
    category: 'study_group',
    location: 'Library Group Study Pod 4',
    reminderMinutesBefore: [30],
    isCompleted: false,
    tags: ['Project', 'Robotics'],
    createdAt: '2026-10-02T08:00:00.000Z',
    updatedAt: '2026-10-02T08:00:00.000Z',
  }
];

export const USER_1_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'ses_1',
    userId: 'user_1_owner',
    subject: 'Electronics',
    topic: 'Operational Amplifiers & Filter Design',
    date: today,
    startTime: '19:00',
    plannedDurationMinutes: 60,
    repeat: 'daily',
    goal: 'Complete active problem set 3 and review frequency response',
    status: 'pending',
    notes: 'Key focus: Active low-pass Butterworth filters',
    createdAt: '2026-10-05T07:00:00.000Z',
    updatedAt: '2026-10-05T07:00:00.000Z',
  },
  {
    id: 'ses_2',
    userId: 'user_1_owner',
    subject: 'Mathematics',
    topic: '2nd Order Linear Differential Equations',
    date: today,
    startTime: '21:00',
    plannedDurationMinutes: 90,
    repeat: 'weekdays',
    goal: 'Master undetermined coefficients method',
    status: 'pending',
    notes: 'Formula sheet ready',
    createdAt: '2026-10-05T07:00:00.000Z',
    updatedAt: '2026-10-05T07:00:00.000Z',
  },
  {
    id: 'ses_3',
    userId: 'user_1_owner',
    subject: 'Signals & Systems',
    topic: 'Z-Transforms & ROC Properties',
    date: yesterday,
    startTime: '18:00',
    plannedDurationMinutes: 60,
    actualDurationMinutes: 65,
    repeat: 'none',
    goal: 'Inverse Z-Transform partial fraction expansion',
    status: 'completed',
    notes: 'Successfully finished all 8 textbook exercises',
    completedAt: `${yesterday}T19:05:00.000Z`,
    createdAt: '2026-10-04T07:00:00.000Z',
    updatedAt: '2026-10-04T19:05:00.000Z',
  }
];

export const USER_1_STREAK: Streak = {
  userId: 'user_1_owner',
  currentStreak: 12,
  bestStreak: 27,
  lastActiveDate: today,
  freezeDaysRemaining: 2,
  graceDaysUsed: 0,
  activeDates: pastActiveDates,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    code: 'first_step',
    title: 'First Step',
    description: 'Complete your first scheduled study session',
    icon: '🎯',
    category: 'study_hours',
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'ach_2',
    code: 'streak_7',
    title: '7-Day Fire',
    description: 'Maintain a continuous 7-day study streak',
    icon: '🔥',
    category: 'streak',
    progress: 7,
    maxProgress: 7,
    unlockedAt: '2026-09-28T20:00:00.000Z',
  },
  {
    id: 'ach_3',
    code: 'streak_14',
    title: 'Fortnight Warrior',
    description: 'Reach a 14-day study streak',
    icon: '⚡',
    category: 'streak',
    progress: 12,
    maxProgress: 14,
  },
  {
    id: 'ach_4',
    code: 'streak_30',
    title: 'Consistency Legend',
    description: 'Reach a 30-day continuous study streak',
    icon: '👑',
    category: 'streak',
    progress: 12,
    maxProgress: 30,
  },
  {
    id: 'ach_5',
    code: 'hours_50',
    title: 'Century Cadet',
    description: 'Complete 50 hours of focused study time',
    icon: '📚',
    category: 'study_hours',
    progress: 50,
    maxProgress: 50,
    unlockedAt: '2026-09-25T18:00:00.000Z',
  },
  {
    id: 'ach_6',
    code: 'hours_100',
    title: 'Master Scholar',
    description: 'Log 100 total hours of deep study',
    icon: '🎓',
    category: 'study_hours',
    progress: 76,
    maxProgress: 100,
  },
  {
    id: 'ach_7',
    code: 'punctual_champ',
    title: 'Zero Procrastination',
    description: 'Complete 10 study reminders exactly on time without snoozing',
    icon: '⏰',
    category: 'punctuality',
    progress: 10,
    maxProgress: 10,
    unlockedAt: '2026-09-30T19:00:00.000Z',
  },
  {
    id: 'ach_8',
    code: 'weekend_warrior',
    title: 'Weekend Hustler',
    description: 'Study both Saturday and Sunday 3 weekends in a row',
    icon: '🛡️',
    category: 'mastery',
    progress: 2,
    maxProgress: 3,
  }
];

export const USER_1_HISTORY: CompletionRecord[] = [
  {
    id: 'hist_1',
    userId: 'user_1_owner',
    itemId: 'rem_3',
    itemType: 'reminder',
    title: 'Review Chemistry Formulae',
    categoryOrSubject: 'Chemistry',
    scheduledDate: today,
    scheduledTime: '16:30',
    completedAt: `${today}T16:45:00.000Z`,
    status: 'completed',
    durationMinutes: 25,
    notes: 'Covered Gibbs free energy and chemical equilibria',
  },
  {
    id: 'hist_2',
    userId: 'user_1_owner',
    itemId: 'evt_2',
    itemType: 'event',
    title: 'Advanced Calculus Lecture',
    categoryOrSubject: 'Lecture',
    scheduledDate: today,
    scheduledTime: '14:00',
    completedAt: `${today}T15:30:00.000Z`,
    status: 'completed',
    durationMinutes: 90,
  },
  {
    id: 'hist_3',
    userId: 'user_1_owner',
    itemId: 'ses_3',
    itemType: 'study_session',
    title: 'Signals & Systems',
    categoryOrSubject: 'Signals & Systems',
    scheduledDate: yesterday,
    scheduledTime: '18:00',
    completedAt: `${yesterday}T19:05:00.000Z`,
    status: 'completed',
    durationMinutes: 65,
    notes: 'Completed ROC analysis problems 1-8',
  },
  {
    id: 'hist_4',
    userId: 'user_1_owner',
    itemId: 'ses_old_1',
    itemType: 'study_session',
    title: 'Electronics Circuit Simulation',
    categoryOrSubject: 'Electronics',
    scheduledDate: twoDaysAgo,
    scheduledTime: '20:00',
    completedAt: `${twoDaysAgo}T21:15:00.000Z`,
    status: 'completed',
    durationMinutes: 75,
    notes: 'LTSpice simulation of op-amp bandpass filter',
  },
  {
    id: 'hist_5',
    userId: 'user_1_owner',
    itemId: 'rem_old_2',
    itemType: 'reminder',
    title: 'Flashcards Revision',
    categoryOrSubject: 'General',
    scheduledDate: threeDaysAgo,
    scheduledTime: '11:00',
    completedAt: `${threeDaysAgo}T11:40:00.000Z`,
    status: 'completed',
    durationMinutes: 40,
  },
  {
    id: 'hist_6',
    userId: 'user_1_owner',
    itemId: 'ses_old_missed',
    itemType: 'study_session',
    title: 'Physics Mechanics Review',
    categoryOrSubject: 'Physics',
    scheduledDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    scheduledTime: '17:00',
    completedAt: `${format(subDays(new Date(), 5), 'yyyy-MM-dd')}T17:00:00.000Z`,
    status: 'missed',
    durationMinutes: 0,
    notes: 'Missed due to dental appointment',
  }
];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  soundEnabled: true,
  soundType: 'chime',
  vibrationEnabled: true,
  defaultSnoozeMinutes: 10,
  advanceWarningMinutes: 15,
  quietHoursEnabled: false,
  quietHoursStart: '23:00',
  quietHoursEnd: '07:00',
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'system',
  patternLockEnabled: false,
  patternHash: undefined,
  dailyStudyGoalMinutes: 120, // 2 hours
  graceDaysAllowed: 2,
  autoStartNextSession: false,
  hapticFeedback: true,
};

// USER 2 (Brother) Isolated Dataset
export const USER_2_REMINDERS: Reminder[] = [
  {
    id: 'rem_b1',
    userId: 'user_2_brother',
    title: 'Physics Homework Chapter 6',
    description: 'Electromagnetism problem sheet 1-15',
    date: today,
    time: '18:00',
    priority: 'high',
    repeat: 'weekdays',
    snoozeMinutes: 10,
    notificationEnabled: true,
    status: 'pending',
    tags: ['Physics'],
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'rem_b2',
    userId: 'user_2_brother',
    title: 'Biology Cell Biology Flashcards',
    description: 'Mitochondrial respiration and Krebs cycle',
    date: today,
    time: '20:30',
    priority: 'medium',
    repeat: 'daily',
    snoozeMinutes: 10,
    notificationEnabled: true,
    status: 'pending',
    tags: ['Biology'],
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  }
];

export const USER_2_EVENTS: Event[] = [
  {
    id: 'evt_b1',
    userId: 'user_2_brother',
    title: 'Physics Midterm Exam',
    description: 'Kinematics and Electromagnetism',
    date: dayAfterTomorrow,
    startTime: '10:00',
    endTime: '12:00',
    category: 'exam',
    location: 'Science Hall 101',
    reminderMinutesBefore: [60],
    isCompleted: false,
    tags: ['Exam'],
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  }
];

export const USER_2_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'ses_b1',
    userId: 'user_2_brother',
    subject: 'Physics',
    topic: 'Electromagnetic Induction',
    date: today,
    startTime: '18:00',
    plannedDurationMinutes: 60,
    repeat: 'daily',
    goal: 'Understand Faraday and Lenz laws with numericals',
    status: 'pending',
    createdAt: '2026-10-05T07:00:00.000Z',
    updatedAt: '2026-10-05T07:00:00.000Z',
  }
];

export const USER_2_STREAK: Streak = {
  userId: 'user_2_brother',
  currentStreak: 5,
  bestStreak: 14,
  lastActiveDate: today,
  freezeDaysRemaining: 1,
  graceDaysUsed: 1,
  activeDates: [
    today,
    yesterday,
    twoDaysAgo,
    threeDaysAgo,
    format(subDays(new Date(), 4), 'yyyy-MM-dd')
  ],
};

export const USER_2_HISTORY: CompletionRecord[] = [
  {
    id: 'hist_b1',
    userId: 'user_2_brother',
    itemId: 'ses_b_past',
    itemType: 'study_session',
    title: 'Biology Genetics',
    categoryOrSubject: 'Biology',
    scheduledDate: yesterday,
    scheduledTime: '17:00',
    completedAt: `${yesterday}T18:00:00.000Z`,
    status: 'completed',
    durationMinutes: 60,
  }
];
