// src/services/firestoreService.ts - Real Cloud Firestore storage repository
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import type { IStorageService } from './storageService';
import type {
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
  DEFAULT_APP_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  INITIAL_ACHIEVEMENTS,
} from './mockData';
import { getTodayDateString } from '../utils/dateUtils';

export class FirestoreRepository implements IStorageService {
  private getDb() {
    if (!db || !isFirebaseConfigured) {
      throw new Error('Firestore is not configured or initialized.');
    }
    return db;
  }

  async getUsers(): Promise<UserProfile[]> {
    // In multi-user / isolated mode, returns current logged in user profiles
    return [];
  }

  async getUser(id: string): Promise<UserProfile | null> {
    const firestore = this.getDb();
    const userDoc = await getDoc(doc(firestore, 'users', id));
    if (!userDoc.exists()) return null;
    return userDoc.data() as UserProfile;
  }

  async saveUserProfile(user: UserProfile): Promise<UserProfile> {
    const firestore = this.getDb();
    await setDoc(doc(firestore, 'users', user.id), user, { merge: true });
    return user;
  }

  async getReminders(userId: string): Promise<Reminder[]> {
    const firestore = this.getDb();
    const colRef = collection(firestore, 'users', userId, 'reminders');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => d.data() as Reminder);
  }

  async saveReminder(reminder: Reminder): Promise<Reminder> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', reminder.userId, 'reminders', reminder.id);
    await setDoc(docRef, reminder, { merge: true });
    return reminder;
  }

  async deleteReminder(id: string, userId: string): Promise<void> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'reminders', id);
    await deleteDoc(docRef);
  }

  async getEvents(userId: string): Promise<Event[]> {
    const firestore = this.getDb();
    const colRef = collection(firestore, 'users', userId, 'events');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => d.data() as Event);
  }

  async saveEvent(event: Event): Promise<Event> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', event.userId, 'events', event.id);
    await setDoc(docRef, event, { merge: true });
    return event;
  }

  async deleteEvent(id: string, userId: string): Promise<void> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'events', id);
    await deleteDoc(docRef);
  }

  async getStudySessions(userId: string): Promise<StudySession[]> {
    const firestore = this.getDb();
    const colRef = collection(firestore, 'users', userId, 'studySessions');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => d.data() as StudySession);
  }

  async saveStudySession(session: StudySession): Promise<StudySession> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', session.userId, 'studySessions', session.id);
    await setDoc(docRef, session, { merge: true });
    return session;
  }

  async deleteStudySession(id: string, userId: string): Promise<void> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'studySessions', id);
    await deleteDoc(docRef);
  }

  async getStreak(userId: string): Promise<Streak> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'streak', 'current');
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      const defaultStreak: Streak = {
        userId,
        currentStreak: 0,
        bestStreak: 0,
        lastActiveDate: getTodayDateString(),
        freezeDaysRemaining: 2,
        graceDaysUsed: 0,
        activeDates: [],
      };
      await setDoc(docRef, defaultStreak);
      return defaultStreak;
    }
    return snapshot.data() as Streak;
  }

  async saveStreak(streak: Streak): Promise<Streak> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', streak.userId, 'streak', 'current');
    await setDoc(docRef, streak, { merge: true });
    return streak;
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    const firestore = this.getDb();
    const colRef = collection(firestore, 'users', userId, 'achievements');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Seed initial achievements for user in Firestore
      const batch = writeBatch(firestore);
      INITIAL_ACHIEVEMENTS.forEach((ach) => {
        const docRef = doc(firestore, 'users', userId, 'achievements', ach.id);
        batch.set(docRef, ach);
      });
      await batch.commit();
      return INITIAL_ACHIEVEMENTS;
    }
    return snapshot.docs.map((d) => d.data() as Achievement);
  }

  async saveAchievement(achievement: Achievement, userId: string): Promise<Achievement> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'achievements', achievement.id);
    await setDoc(docRef, achievement, { merge: true });
    return achievement;
  }

  async getHistory(userId: string): Promise<CompletionRecord[]> {
    const firestore = this.getDb();
    const colRef = collection(firestore, 'users', userId, 'completionRecords');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => d.data() as CompletionRecord);
  }

  async addHistoryRecord(record: CompletionRecord): Promise<CompletionRecord> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', record.userId, 'completionRecords', record.id);
    await setDoc(docRef, record);
    return record;
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'settings', 'notifications');
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      await setDoc(docRef, DEFAULT_NOTIFICATION_SETTINGS);
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
    return snapshot.data() as NotificationSettings;
  }

  async saveNotificationSettings(
    userId: string,
    settings: NotificationSettings
  ): Promise<NotificationSettings> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'settings', 'notifications');
    await setDoc(docRef, settings, { merge: true });
    return settings;
  }

  async getAppSettings(userId: string): Promise<AppSettings> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'settings', 'preferences');
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      await setDoc(docRef, DEFAULT_APP_SETTINGS);
      return DEFAULT_APP_SETTINGS;
    }
    return snapshot.data() as AppSettings;
  }

  async saveAppSettings(userId: string, settings: AppSettings): Promise<AppSettings> {
    const firestore = this.getDb();
    const docRef = doc(firestore, 'users', userId, 'settings', 'preferences');
    await setDoc(docRef, settings, { merge: true });
    return settings;
  }

  async exportUserData(userId: string): Promise<string> {
    const [reminders, events, studySessions, streak, achievements, history, notifSettings, appSettings] =
      await Promise.all([
        this.getReminders(userId),
        this.getEvents(userId),
        this.getStudySessions(userId),
        this.getStreak(userId),
        this.getAchievements(userId),
        this.getHistory(userId),
        this.getNotificationSettings(userId),
        this.getAppSettings(userId),
      ]);

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
    // Firestore subcollection clean-up
    const firestore = this.getDb();
    const subcollections = ['reminders', 'events', 'studySessions', 'completionRecords'];
    for (const sub of subcollections) {
      const colRef = collection(firestore, 'users', userId, sub);
      const snapshot = await getDocs(colRef);
      const batch = writeBatch(firestore);
      snapshot.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }
}
