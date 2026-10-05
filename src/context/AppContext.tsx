// src/context/AppContext.tsx - Core State & Backend Synchronization for StudyMate
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
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
  NavigationTab,
  ItemType,
  ActiveStudySessionState,
  ToastMessage,
} from '../types';
import { getStorageService } from '../services/storageService';
import { getTodayDateString, format } from '../utils/dateUtils';
import { soundManager } from '../utils/soundUtils';
import { fireStreakConfetti, fireAchievementConfetti } from '../utils/confettiUtils';
import { verifyPattern, hashPattern } from '../utils/cryptoUtils';
import { evaluateStreakOnCompletion } from '../utils/streakEngine';
import { calculateNextOccurrence, calculateSnoozedTime } from '../utils/recurrenceEngine';
import { useAuth } from './AuthContext';

interface AppContextType {
  // State
  currentUser: UserProfile;
  currentTab: NavigationTab;
  reminders: Reminder[];
  events: Event[];
  studySessions: StudySession[];
  streak: Streak;
  achievements: Achievement[];
  history: CompletionRecord[];
  notificationSettings: NotificationSettings;
  appSettings: AppSettings;
  isLoading: boolean;
  searchQuery: string;
  selectedCalendarDate: string;
  activeStudySession: ActiveStudySessionState | null;
  isAddModalOpen: boolean;
  addModalInitialType: ItemType;
  editingItem: Reminder | Event | StudySession | null;
  toasts: ToastMessage[];
  isLocked: boolean;
  isOnline: boolean;

  // Setters & Navigation
  setCurrentTab: (tab: NavigationTab) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCalendarDate: (date: string) => void;

  // Reminder CRUD
  createReminder: (data: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateReminder: (reminder: Reminder) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  completeReminder: (id: string) => Promise<void>;
  snoozeReminder: (id: string, minutes: number) => Promise<void>;

  // Event CRUD
  createEvent: (data: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  completeEvent: (id: string) => Promise<void>;

  // Study Session CRUD
  createStudySession: (data: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateStudySession: (session: StudySession) => Promise<void>;
  deleteStudySession: (id: string) => Promise<void>;
  completeStudySession: (id: string, durationMinutes?: number) => Promise<void>;

  // Live Timer
  startLiveStudySession: (session: StudySession) => void;
  pauseLiveStudySession: () => void;
  resumeLiveStudySession: () => void;
  finishLiveStudySession: (notes?: string) => Promise<void>;
  cancelLiveStudySession: () => void;

  // Settings & Security
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  updateAppSettings: (settings: Partial<AppSettings>) => Promise<void>;
  unlockApp: (pattern: number[]) => Promise<boolean>;
  lockApp: () => void;
  setSecurityPattern: (pattern: number[]) => Promise<void>;
  removeSecurityPattern: () => Promise<void>;
  checkInStreak: () => Promise<void>;
  exportData: () => Promise<string>;
  resetUserData: () => Promise<void>;

  // Modals & Toasts
  openAddModal: (initialType?: ItemType) => void;
  closeAddModal: () => void;
  openEditModal: (item: Reminder | Event | StudySession) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isDemoUser, isOnline } = useAuth();
  const storage = getStorageService(!isDemoUser);

  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [streak, setStreak] = useState<Streak>({
    userId: user?.id || 'guest',
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: getTodayDateString(),
    freezeDaysRemaining: 2,
    graceDaysUsed: 0,
    activeDates: [],
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [history, setHistory] = useState<CompletionRecord[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    soundEnabled: true,
    soundType: 'chime',
    vibrationEnabled: true,
    defaultSnoozeMinutes: 10,
    advanceWarningMinutes: 15,
    quietHoursEnabled: false,
    quietHoursStart: '23:00',
    quietHoursEnd: '07:00',
  });
  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'system',
    patternLockEnabled: false,
    dailyStudyGoalMinutes: 120,
    graceDaysAllowed: 2,
    autoStartNextSession: false,
    hapticFeedback: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(getTodayDateString());
  
  // Live Timer State
  const [activeStudySession, setActiveStudySession] = useState<ActiveStudySessionState | null>(null);

  // Modals & Security
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addModalInitialType, setAddModalInitialType] = useState<ItemType>('reminder');
  const [editingItem, setEditingItem] = useState<Reminder | Event | StudySession | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.durationMs || 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Theme Handling
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      if (appSettings.theme === 'dark') {
        root.classList.add('dark');
      } else if (appSettings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (appSettings.theme === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [appSettings.theme]);

  // Live Timer Interval
  useEffect(() => {
    if (!activeStudySession || activeStudySession.isPaused) return;

    const timer = setInterval(() => {
      setActiveStudySession((prev) => {
        if (!prev || prev.isPaused) return prev;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeStudySession?.isPaused]);

  // Load User Data when authenticated user changes
  const loadUserData = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const [r, e, s, stk, ach, hist, nSet, aSet] = await Promise.all([
        storage.getReminders(userId),
        storage.getEvents(userId),
        storage.getStudySessions(userId),
        storage.getStreak(userId),
        storage.getAchievements(userId),
        storage.getHistory(userId),
        storage.getNotificationSettings(userId),
        storage.getAppSettings(userId),
      ]);

      setReminders(r);
      setEvents(e);
      setStudySessions(s);
      setStreak(stk);
      setAchievements(ach);
      setHistory(hist);
      setNotificationSettings(nSet);
      setAppSettings(aSet);

      if (aSet.patternLockEnabled && aSet.patternHash) {
        setIsLocked(true);
      }
    } catch (err) {
      console.error('Failed to load user data from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, [storage]);

  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    }
  }, [user?.id, loadUserData]);

  // Reminder Actions
  const createReminder = async (data: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    if (!user) return;
    const newReminder: Reminder = {
      ...data,
      id: `rem_${Date.now()}`,
      userId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await storage.saveReminder(newReminder);
    setReminders((prev) => [newReminder, ...prev]);
    addToast({ type: 'success', title: 'Reminder Created', message: newReminder.title });
  };

  const updateReminder = async (reminder: Reminder) => {
    await storage.saveReminder(reminder);
    setReminders((prev) => prev.map((r) => (r.id === reminder.id ? reminder : r)));
    addToast({ type: 'info', title: 'Reminder Updated' });
  };

  const deleteReminder = async (id: string) => {
    if (!user) return;
    await storage.deleteReminder(id, user.id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
    addToast({ type: 'info', title: 'Reminder Deleted' });
  };

  const completeReminder = async (id: string) => {
    if (!user) return;
    const target = reminders.find((r) => r.id === id);
    if (!target) return;

    const completedReminder: Reminder = {
      ...target,
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.saveReminder(completedReminder);

    // If recurring, generate next occurrence automatically
    if (target.repeat && target.repeat !== 'none') {
      const nextDate = calculateNextOccurrence(target.date, target.repeat);
      if (nextDate) {
        const nextOccurrence: Reminder = {
          ...target,
          id: `rem_${Date.now()}_next`,
          date: nextDate,
          status: 'pending',
          completedAt: undefined,
          snoozedUntil: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await storage.saveReminder(nextOccurrence);
        setReminders((prev) => [nextOccurrence, ...prev.map((r) => (r.id === id ? completedReminder : r))]);
      } else {
        setReminders((prev) => prev.map((r) => (r.id === id ? completedReminder : r)));
      }
    } else {
      setReminders((prev) => prev.map((r) => (r.id === id ? completedReminder : r)));
    }

    // Record in History
    const historyItem: CompletionRecord = {
      id: `hist_${Date.now()}`,
      userId: user.id,
      itemId: id,
      itemType: 'reminder',
      title: target.title,
      categoryOrSubject: target.tags?.[0] || 'Reminder',
      scheduledDate: target.date,
      scheduledTime: target.time,
      completedAt: new Date().toISOString(),
      status: 'completed',
      durationMinutes: 15,
      notes: target.description,
    };
    await storage.addHistoryRecord(historyItem);
    setHistory((prev) => [historyItem, ...prev]);

    // Sound & Streak
    if (notificationSettings.soundEnabled) {
      soundManager.playSuccess();
    }
    await checkInStreak();
    addToast({ type: 'success', title: 'Completed! 🎉', message: target.title });
  };

  const snoozeReminder = async (id: string, minutes: number) => {
    const target = reminders.find((r) => r.id === id);
    if (!target) return;

    const { snoozedIso, displayTime } = calculateSnoozedTime(target.date, target.time, minutes);
    const snoozedReminder: Reminder = {
      ...target,
      status: 'snoozed',
      snoozedUntil: snoozedIso,
      updatedAt: new Date().toISOString(),
    };

    await storage.saveReminder(snoozedReminder);
    setReminders((prev) => prev.map((r) => (r.id === id ? snoozedReminder : r)));

    if (notificationSettings.soundEnabled) {
      soundManager.playChime();
    }
    addToast({
      type: 'warning',
      title: 'Reminder Snoozed',
      message: `Snoozed for ${minutes} minutes (alarm at ${displayTime})`,
    });
  };

  // Event Actions
  const createEvent = async (data: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => {
    if (!user) return;
    const newEvent: Event = {
      ...data,
      id: `evt_${Date.now()}`,
      userId: user.id,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await storage.saveEvent(newEvent);
    setEvents((prev) => [newEvent, ...prev]);
    addToast({ type: 'success', title: 'Event Added', message: newEvent.title });
  };

  const updateEvent = async (event: Event) => {
    await storage.saveEvent(event);
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    addToast({ type: 'info', title: 'Event Updated' });
  };

  const deleteEvent = async (id: string) => {
    if (!user) return;
    await storage.deleteEvent(id, user.id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addToast({ type: 'info', title: 'Event Deleted' });
  };

  const completeEvent = async (id: string) => {
    if (!user) return;
    const target = events.find((e) => e.id === id);
    if (!target) return;

    const updatedEvent: Event = {
      ...target,
      isCompleted: !target.isCompleted,
      updatedAt: new Date().toISOString(),
    };

    await storage.saveEvent(updatedEvent);
    setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));

    if (updatedEvent.isCompleted) {
      const historyItem: CompletionRecord = {
        id: `hist_${Date.now()}`,
        userId: user.id,
        itemId: id,
        itemType: 'event',
        title: target.title,
        categoryOrSubject: target.category,
        scheduledDate: target.date,
        scheduledTime: target.startTime,
        completedAt: new Date().toISOString(),
        status: 'completed',
        durationMinutes: 60,
      };
      await storage.addHistoryRecord(historyItem);
      setHistory((prev) => [historyItem, ...prev]);

      if (notificationSettings.soundEnabled) soundManager.playSuccess();
      addToast({ type: 'success', title: 'Event Completed', message: target.title });
    }
  };

  // Study Session Actions
  const createStudySession = async (data: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>) => {
    if (!user) return;
    const newSession: StudySession = {
      ...data,
      id: `ses_${Date.now()}`,
      userId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await storage.saveStudySession(newSession);
    setStudySessions((prev) => [newSession, ...prev]);
    addToast({ type: 'success', title: 'Study Session Scheduled', message: newSession.subject });
  };

  const updateStudySession = async (session: StudySession) => {
    await storage.saveStudySession(session);
    setStudySessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
    addToast({ type: 'info', title: 'Study Session Updated' });
  };

  const deleteStudySession = async (id: string) => {
    if (!user) return;
    await storage.deleteStudySession(id, user.id);
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
    addToast({ type: 'info', title: 'Study Session Deleted' });
  };

  const completeStudySession = async (id: string, durationMinutes?: number) => {
    if (!user) return;
    const target = studySessions.find((s) => s.id === id);
    if (!target) return;

    const actualMins = durationMinutes || target.plannedDurationMinutes;
    const completedSession: StudySession = {
      ...target,
      status: 'completed',
      actualDurationMinutes: actualMins,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.saveStudySession(completedSession);

    // If recurring, generate next occurrence
    if (target.repeat && target.repeat !== 'none') {
      const nextDate = calculateNextOccurrence(target.date, target.repeat);
      if (nextDate) {
        const nextOccurrence: StudySession = {
          ...target,
          id: `ses_${Date.now()}_next`,
          date: nextDate,
          status: 'pending',
          actualDurationMinutes: undefined,
          completedAt: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await storage.saveStudySession(nextOccurrence);
        setStudySessions((prev) => [nextOccurrence, ...prev.map((s) => (s.id === id ? completedSession : s))]);
      } else {
        setStudySessions((prev) => prev.map((s) => (s.id === id ? completedSession : s)));
      }
    } else {
      setStudySessions((prev) => prev.map((s) => (s.id === id ? completedSession : s)));
    }

    const historyItem: CompletionRecord = {
      id: `hist_${Date.now()}`,
      userId: user.id,
      itemId: id,
      itemType: 'study_session',
      title: `${target.subject} Study`,
      categoryOrSubject: target.subject,
      scheduledDate: target.date,
      scheduledTime: target.startTime,
      completedAt: new Date().toISOString(),
      status: 'completed',
      durationMinutes: actualMins,
      notes: target.goal,
    };
    await storage.addHistoryRecord(historyItem);
    setHistory((prev) => [historyItem, ...prev]);

    if (notificationSettings.soundEnabled) soundManager.playSuccess();
    fireStreakConfetti();
    await checkInStreak();
    addToast({
      type: 'success',
      title: 'Study Session Completed! 🎓',
      message: `${target.subject} (${actualMins} mins logged)`,
    });
  };

  // Live Timer
  const startLiveStudySession = (session: StudySession) => {
    setActiveStudySession({
      sessionId: session.id,
      subject: session.subject,
      topic: session.topic || session.goal,
      startTime: Date.now(),
      elapsedSeconds: 0,
      isPaused: false,
      targetDurationMinutes: session.plannedDurationMinutes,
    });
    addToast({
      type: 'info',
      title: 'Focus Mode Active ⏱️',
      message: `${session.subject} timer running`,
    });
  };

  const pauseLiveStudySession = () => {
    if (!activeStudySession) return;
    setActiveStudySession((prev) => (prev ? { ...prev, isPaused: true } : null));
  };

  const resumeLiveStudySession = () => {
    if (!activeStudySession) return;
    setActiveStudySession((prev) => (prev ? { ...prev, isPaused: false } : null));
  };

  const finishLiveStudySession = async (notes?: string) => {
    if (!activeStudySession) return;
    const durationMinutes = Math.max(1, Math.round(activeStudySession.elapsedSeconds / 60));
    await completeStudySession(activeStudySession.sessionId, durationMinutes);
    setActiveStudySession(null);
  };

  const cancelLiveStudySession = () => {
    setActiveStudySession(null);
    addToast({ type: 'warning', title: 'Focus Session Cancelled' });
  };

  // Streak Engine Calculation
  const checkInStreak = async () => {
    if (!user) return;
    const todayStr = getTodayDateString();

    const { streak: updatedStreak, streakIncremented, graceUsed } = evaluateStreakOnCompletion(
      streak,
      todayStr,
      appSettings.graceDaysAllowed
    );

    await storage.saveStreak(updatedStreak);
    setStreak(updatedStreak);

    if (graceUsed) {
      addToast({
        type: 'warning',
        title: 'Streak Grace Day Used 🛡️',
        message: 'Your streak was preserved using an automatic grace day!',
      });
    }

    // Update Streak Achievements
    let achievementUnlocked = false;
    const updatedAchievements = achievements.map((ach) => {
      if (ach.category === 'streak') {
        const newProgress = Math.min(ach.maxProgress, updatedStreak.currentStreak);
        const wasUnlocked = !!ach.unlockedAt;
        const nowUnlocked = newProgress >= ach.maxProgress;
        if (!wasUnlocked && nowUnlocked) {
          achievementUnlocked = true;
          return {
            ...ach,
            progress: newProgress,
            unlockedAt: new Date().toISOString(),
          };
        }
        return { ...ach, progress: newProgress };
      }
      return ach;
    });

    if (achievementUnlocked) {
      fireAchievementConfetti();
      addToast({
        type: 'success',
        title: 'New Achievement Unlocked! 🏆',
        message: 'Check your Streak Dashboard to see your new badge!',
      });
      setAchievements(updatedAchievements);
    }
  };

  // Settings & Security
  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    if (!user) return;
    const updated = { ...notificationSettings, ...settings };
    await storage.saveNotificationSettings(user.id, updated);
    setNotificationSettings(updated);
    addToast({ type: 'success', title: 'Notification Settings Saved' });
  };

  const updateAppSettings = async (settings: Partial<AppSettings>) => {
    if (!user) return;
    const updated = { ...appSettings, ...settings };
    await storage.saveAppSettings(user.id, updated);
    setAppSettings(updated);
    addToast({ type: 'success', title: 'Preferences Saved' });
  };

  const setSecurityPattern = async (pattern: number[]) => {
    if (!user) return;
    const hash = await hashPattern(pattern);
    await updateAppSettings({ patternLockEnabled: true, patternHash: hash });
    addToast({ type: 'success', title: 'Pattern Protection Enabled 🔒' });
  };

  const removeSecurityPattern = async () => {
    if (!user) return;
    await updateAppSettings({ patternLockEnabled: false, patternHash: undefined });
    addToast({ type: 'info', title: 'Pattern Protection Removed' });
  };

  const unlockApp = async (pattern: number[]): Promise<boolean> => {
    const isValid = await verifyPattern(pattern, appSettings.patternHash);
    if (isValid) {
      setIsLocked(false);
      addToast({ type: 'success', title: 'Unlocked', message: 'Welcome back to StudyMate' });
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (appSettings.patternLockEnabled) {
      setIsLocked(true);
    }
  };

  const exportData = async () => {
    if (!user) return '';
    return await storage.exportUserData(user.id);
  };

  const resetUserData = async () => {
    if (!user) return;
    await storage.resetUserData(user.id);
    await loadUserData(user.id);
    addToast({ type: 'warning', title: 'Data Reset', message: 'Restored to fresh state' });
  };

  // Modal Controls
  const openAddModal = (initialType: ItemType = 'reminder') => {
    setAddModalInitialType(initialType);
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const openEditModal = (item: Reminder | Event | StudySession) => {
    setEditingItem(item);
    if ('priority' in item) {
      setAddModalInitialType('reminder');
    } else if ('category' in item) {
      setAddModalInitialType('event');
    } else {
      setAddModalInitialType('study_session');
    }
    setIsAddModalOpen(true);
  };

  const currentUser = user || {
    id: 'guest',
    name: 'StudyMate User',
    email: '',
    role: 'owner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentTab,
        reminders,
        events,
        studySessions,
        streak,
        achievements,
        history,
        notificationSettings,
        appSettings,
        isLoading,
        searchQuery,
        selectedCalendarDate,
        activeStudySession,
        isAddModalOpen,
        addModalInitialType,
        editingItem,
        toasts,
        isLocked,
        isOnline,

        setCurrentTab,
        setSearchQuery,
        setSelectedCalendarDate,

        createReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
        snoozeReminder,

        createEvent,
        updateEvent,
        deleteEvent,
        completeEvent,

        createStudySession,
        updateStudySession,
        deleteStudySession,
        completeStudySession,

        startLiveStudySession,
        pauseLiveStudySession,
        resumeLiveStudySession,
        finishLiveStudySession,
        cancelLiveStudySession,

        updateNotificationSettings,
        updateAppSettings,
        setSecurityPattern,
        removeSecurityPattern,
        unlockApp,
        lockApp,
        checkInStreak,
        exportData,
        resetUserData,

        openAddModal,
        closeAddModal,
        openEditModal,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
