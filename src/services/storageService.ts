// src/services/storageService.ts - Decoupled data persistence layer

import {
  UserProfile,
  Reminder,
  Event,
  StudySession,
  Streak,
  Achievement,
  NotificationSettings,
  AppSettings,
  CompletionRecord,
} from '../types';
import {
  INITIAL_USERS,
  USER_1_REMINDERS,
  USER_1_EVENTS,
  USER_1_STUDY_SESSIONS,
  USER_1_STREAK,
  INITIAL_ACHIEVEMENTS,
  USER_1_HISTORY,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_APP_SETTINGS,
  USER_2_REMINDERS,
  USER_2_EVENTS,
  USER_2_STUDY_SESSIONS,
  USER_2_STREAK,
  USER_2_HISTORY,
} from './mockData';
import { isFirebaseConfigured } from '../config/firebase';
import { FirestoreRepository } from './firestoreService';

export interface IStorageService {
  getUsers(): Promise<UserProfile[]>;
  getUser(id: string): Promise<UserProfile | null>;
  getReminders(userId: string): Promise<Reminder[]>;
  saveReminder(reminder: Reminder): Promise<Reminder>;
  deleteReminder(id: string, userId: string): Promise<void>;
  getEvents(userId: string): Promise<Event[]>;
  saveEvent(event: Event): Promise<Event>;
  deleteEvent(id: string, userId: string): Promise<void>;
  getStudySessions(userId: string): Promise<StudySession[]>;
  saveStudySession(session: StudySession): Promise<StudySession>;
  deleteStudySession(id: string, userId: string): Promise<void>;
  getStreak(userId: string): Promise<Streak>;
  saveStreak(streak: Streak): Promise<Streak>;
  getAchievements(userId: string): Promise<Achievement[]>;
  saveAchievement(achievement: Achievement, userId: string): Promise<Achievement>;
  getHistory(userId: string): Promise<CompletionRecord[]>;
  addHistoryRecord(record: CompletionRecord): Promise<CompletionRecord>;
  getNotificationSettings(userId: string): Promise<NotificationSettings>;
  saveNotificationSettings(userId: string, settings: NotificationSettings): Promise<NotificationSettings>;
  getAppSettings(userId: string): Promise<AppSettings>;
  saveAppSettings(userId: string, settings: AppSettings): Promise<AppSettings>;
  exportUserData(userId: string): Promise<string>;
  resetUserData(userId: string): Promise<void>;
}

export class LocalStorageRepository implements IStorageService {
  private getStorageKey(userId: string, entity: string): string {
    return `studymate_${userId}_${entity}`;
  }

  // Load from local storage or fallback to mock data
  private getOrInit<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to write to localStorage key ${key}`, e);
    }
  }

  async getUsers(): Promise<UserProfile[]> {
    return this.getOrInit('studymate_global_users', INITIAL_USERS);
  }

  async getUser(id: string): Promise<UserProfile | null> {
    const users = await this.getUsers();
    return users.find((u) => u.id === id) || null;
  }

  async getReminders(userId: string): Promise<Reminder[]> {
    const fallback = userId === 'user_2_brother' ? USER_2_REMINDERS : USER_1_REMINDERS;
    return this.getOrInit(this.getStorageKey(userId, 'reminders'), fallback);
  }

  async saveReminder(reminder: Reminder): Promise<Reminder> {
    const reminders = await this.getReminders(reminder.userId);
    const index = reminders.findIndex((r) => r.id === reminder.id);
    let updated: Reminder[];
    if (index >= 0) {
      updated = [...reminders];
      updated[index] = { ...reminder, updatedAt: new Date().toISOString() };
    } else {
      updated = [reminder, ...reminders];
    }
    this.set(this.getStorageKey(reminder.userId, 'reminders'), updated);
    return reminder;
  }

  async deleteReminder(id: string, userId: string): Promise<void> {
    const reminders = await this.getReminders(userId);
    const filtered = reminders.filter((r) => r.id !== id);
    this.set(this.getStorageKey(userId, 'reminders'), filtered);
  }

  async getEvents(userId: string): Promise<Event[]> {
    const fallback = userId === 'user_2_brother' ? USER_2_EVENTS : USER_1_EVENTS;
    return this.getOrInit(this.getStorageKey(userId, 'events'), fallback);
  }

  async saveEvent(event: Event): Promise<Event> {
    const events = await this.getEvents(event.userId);
    const index = events.findIndex((e) => e.id === event.id);
    let updated: Event[];
    if (index >= 0) {
      updated = [...events];
      updated[index] = { ...event, updatedAt: new Date().toISOString() };
    } else {
      updated = [event, ...events];
    }
    this.set(this.getStorageKey(event.userId, 'events'), updated);
    return event;
  }

  async deleteEvent(id: string, userId: string): Promise<void> {
    const events = await this.getEvents(userId);
    const filtered = events.filter((e) => e.id !== id);
    this.set(this.getStorageKey(userId, 'events'), filtered);
  }

  async getStudySessions(userId: string): Promise<StudySession[]> {
    const fallback = userId === 'user_2_brother' ? USER_2_STUDY_SESSIONS : USER_1_STUDY_SESSIONS;
    return this.getOrInit(this.getStorageKey(userId, 'study_sessions'), fallback);
  }

  async saveStudySession(session: StudySession): Promise<StudySession> {
    const sessions = await this.getStudySessions(session.userId);
    const index = sessions.findIndex((s) => s.id === session.id);
    let updated: StudySession[];
    if (index >= 0) {
      updated = [...sessions];
      updated[index] = { ...session, updatedAt: new Date().toISOString() };
    } else {
      updated = [session, ...sessions];
    }
    this.set(this.getStorageKey(session.userId, 'study_sessions'), updated);
    return session;
  }

  async deleteStudySession(id: string, userId: string): Promise<void> {
    const sessions = await this.getStudySessions(userId);
    const filtered = sessions.filter((s) => s.id !== id);
    this.set(this.getStorageKey(userId, 'study_sessions'), filtered);
  }

  async getStreak(userId: string): Promise<Streak> {
    const fallback = userId === 'user_2_brother' ? USER_2_STREAK : USER_1_STREAK;
    return this.getOrInit(this.getStorageKey(userId, 'streak'), fallback);
  }

  async saveStreak(streak: Streak): Promise<Streak> {
    this.set(this.getStorageKey(streak.userId, 'streak'), streak);
    return streak;
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    return this.getOrInit(this.getStorageKey(userId, 'achievements'), INITIAL_ACHIEVEMENTS);
  }

  async saveAchievement(achievement: Achievement, userId: string): Promise<Achievement> {
    const achievements = await this.getAchievements(userId);
    const index = achievements.findIndex((a) => a.id === achievement.id);
    let updated: Achievement[];
    if (index >= 0) {
      updated = [...achievements];
      updated[index] = achievement;
    } else {
      updated = [...achievements, achievement];
    }
    this.set(this.getStorageKey(userId, 'achievements'), updated);
    return achievement;
  }

  async getHistory(userId: string): Promise<CompletionRecord[]> {
    const fallback = userId === 'user_2_brother' ? USER_2_HISTORY : USER_1_HISTORY;
    return this.getOrInit(this.getStorageKey(userId, 'history'), fallback);
  }

  async addHistoryRecord(record: CompletionRecord): Promise<CompletionRecord> {
    const history = await this.getHistory(record.userId);
    const updated = [record, ...history];
    this.set(this.getStorageKey(record.userId, 'history'), updated);
    return record;
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    return this.getOrInit(this.getStorageKey(userId, 'notif_settings'), DEFAULT_NOTIFICATION_SETTINGS);
  }

  async saveNotificationSettings(userId: string, settings: NotificationSettings): Promise<NotificationSettings> {
    this.set(this.getStorageKey(userId, 'notif_settings'), settings);
    return settings;
  }

  async getAppSettings(userId: string): Promise<AppSettings> {
    return this.getOrInit(this.getStorageKey(userId, 'app_settings'), DEFAULT_APP_SETTINGS);
  }

  async saveAppSettings(userId: string, settings: AppSettings): Promise<AppSettings> {
    this.set(this.getStorageKey(userId, 'app_settings'), settings);
    return settings;
  }

  async exportUserData(userId: string): Promise<string> {
    const reminders = await this.getReminders(userId);
    const events = await this.getEvents(userId);
    const studySessions = await this.getStudySessions(userId);
    const streak = await this.getStreak(userId);
    const achievements = await this.getAchievements(userId);
    const history = await this.getHistory(userId);
    const notifSettings = await this.getNotificationSettings(userId);
    const appSettings = await this.getAppSettings(userId);

    const payload = {
      exportDate: new Date().toISOString(),
      app: 'StudyMate',
      version: '2.0.0',
      userId,
      data: {
        reminders,
        events,
        studySessions,
        streak,
        achievements,
        history,
        notifSettings,
        appSettings,
      },
    };
    return JSON.stringify(payload, null, 2);
  }

  async resetUserData(userId: string): Promise<void> {
    const keys = [
      'reminders',
      'events',
      'study_sessions',
      'streak',
      'achievements',
      'history',
      'notif_settings',
      'app_settings',
    ];
    keys.forEach((key) => {
      localStorage.removeItem(this.getStorageKey(userId, key));
    });
  }
}

const localRepo = new LocalStorageRepository();
const firestoreRepo = new FirestoreRepository();

export function getStorageService(useFirestore = true): IStorageService {
  if (useFirestore && isFirebaseConfigured) {
    return firestoreRepo;
  }
  return localRepo;
}

export const storageService = getStorageService();
