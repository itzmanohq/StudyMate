// src/services/notificationService.ts - Production Web Notification & Alarm Scheduler
import { soundManager } from '../utils/soundUtils';
import type { Reminder, Event, StudySession } from '../types';
import { isDateInPast, getTodayDateString } from '../utils/dateUtils';

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

class NotificationService {
  private scheduledTimer: ReturnType<typeof setInterval> | null = null;
  private notifiedItemIds: Set<string> = new Set();

  public getPermissionStatus(): NotificationPermissionState {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission as NotificationPermissionState;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
  }

  public async requestPermission(): Promise<NotificationPermissionState> {
    if (!this.isSupported()) {
      return 'unsupported';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission as NotificationPermissionState;
    } catch {
      return 'denied';
    }
  }

  // Show a rich system notification via Service Worker (supports action buttons where available)
  public async showNotification(
    title: string,
    options: {
      body: string;
      tag?: string;
      icon?: string;
      badge?: string;
      data?: {
        itemId: string;
        itemType: 'reminder' | 'event' | 'study_session';
        url?: string;
      };
      requireInteraction?: boolean;
    }
  ): Promise<boolean> {
    const status = this.getPermissionStatus();
    if (status !== 'granted') {
      return false;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && 'showNotification' in registration) {
          await registration.showNotification(title, {
            body: options.body,
            icon: options.icon || '/favicon.svg',
            badge: options.badge || '/favicon.svg',
            tag: options.tag || `studymate_${Date.now()}`,
            data: options.data || { url: '/' },
            requireInteraction: options.requireInteraction ?? true,
            // Action buttons supported on Android/Chromium
            actions: [
              { action: 'complete', title: '✓ Complete' },
              { action: 'snooze', title: '⏱ Snooze 10m' },
            ],
          } as NotificationOptions);
          return true;
        }
      }

      // Fallback to standard Notification API
      new Notification(title, {
        body: options.body,
        icon: options.icon || '/favicon.svg',
        tag: options.tag,
      });
      return true;
    } catch (e) {
      console.warn('Notification delivery fallback triggered:', e);
      return false;
    }
  }

  // Start in-app scheduler to check due tasks every 15 seconds
  public startScheduler(
    getItems: () => {
      reminders: Reminder[];
      events: Event[];
      studySessions: StudySession[];
      soundEnabled: boolean;
      onTriggerReminder: (reminder: Reminder) => void;
      onTriggerEvent: (event: Event) => void;
      onTriggerStudySession: (session: StudySession) => void;
    }
  ) {
    if (this.scheduledTimer) {
      clearInterval(this.scheduledTimer);
    }

    this.scheduledTimer = setInterval(() => {
      const {
        reminders,
        events,
        studySessions,
        soundEnabled,
        onTriggerReminder,
        onTriggerEvent,
        onTriggerStudySession,
      } = getItems();

      const todayStr = getTodayDateString();
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMins = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;

      // 1. Check Reminders
      reminders.forEach((r) => {
        if (r.status === 'pending' && r.date === todayStr) {
          const isDue = r.time <= currentTimeStr;
          const notificationKey = `rem_${r.id}_${r.date}_${r.time}`;

          if (isDue && !this.notifiedItemIds.has(notificationKey)) {
            this.notifiedItemIds.add(notificationKey);
            if (soundEnabled && r.notificationEnabled) {
              soundManager.playChime();
            }
            if (r.notificationEnabled) {
              this.showNotification(`⏰ Study Reminder: ${r.title}`, {
                body: r.description || `Scheduled for ${r.time}. Tap to complete or snooze.`,
                tag: notificationKey,
                data: { itemId: r.id, itemType: 'reminder' },
              });
            }
            onTriggerReminder(r);
          }
        }
      });

      // 2. Check Study Sessions
      studySessions.forEach((s) => {
        if (s.status === 'pending' && s.date === todayStr) {
          const isDue = s.startTime <= currentTimeStr;
          const notificationKey = `ses_${s.id}_${s.date}_${s.startTime}`;

          if (isDue && !this.notifiedItemIds.has(notificationKey)) {
            this.notifiedItemIds.add(notificationKey);
            if (soundEnabled) {
              soundManager.playGentle();
            }
            this.showNotification(`📚 Study Session Starting: ${s.subject}`, {
              body: s.topic || `Scheduled duration: ${s.plannedDurationMinutes} mins. Ready to focus?`,
              tag: notificationKey,
              data: { itemId: s.id, itemType: 'study_session' },
            });
            onTriggerStudySession(s);
          }
        }
      });

      // 3. Check Events
      events.forEach((e) => {
        if (!e.isCompleted && e.date === todayStr) {
          const notificationKey = `evt_${e.id}_${e.date}_${e.startTime}`;
          const isDue = e.startTime <= currentTimeStr;

          if (isDue && !this.notifiedItemIds.has(notificationKey)) {
            this.notifiedItemIds.add(notificationKey);
            if (soundEnabled) {
              soundManager.playRadar();
            }
            this.showNotification(`📅 Event Starting: ${e.title}`, {
              body: `${e.startTime} - ${e.endTime}${e.location ? ` @ ${e.location}` : ''}`,
              tag: notificationKey,
              data: { itemId: e.id, itemType: 'event' },
            });
            onTriggerEvent(e);
          }
        }
      });
    }, 15000); // Check every 15 seconds
  }

  public stopScheduler() {
    if (this.scheduledTimer) {
      clearInterval(this.scheduledTimer);
      this.scheduledTimer = null;
    }
  }
}

export const notificationService = new NotificationService();
