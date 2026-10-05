// src/components/layout/AppShell.tsx - Complete Responsive Shell & Service Worker Listener
import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TopBar } from './TopBar';
import { MobileBottomNav } from './MobileBottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { ToastContainer } from '../common/Toast';
import { PatternLockDialog } from '../common/PatternLockDialog';
import { AddEditItemModal } from '../modals/AddEditItemModal';
import { ActiveStudyTimerModal } from '../modals/ActiveStudyTimerModal';
import { LoadingState } from '../common/LoadingState';
import { LoginScreen } from '../auth/LoginScreen';
import { NotificationPermissionBanner } from '../common/NotificationPermissionBanner';
import { PwaInstallBanner } from '../common/PwaInstallBanner';
import { MissedTasksAlert } from '../dashboard/MissedTasksAlert';

import { notificationService } from '../../services/notificationService';

// View Components
import { GreetingHeader } from '../dashboard/GreetingHeader';
import { QuickStatsCard } from '../dashboard/QuickStatsCard';
import { TodayOverview } from '../dashboard/TodayOverview';
import { UpcomingSection } from '../dashboard/UpcomingSection';
import { CalendarView } from '../calendar/CalendarView';
import { StreakDashboard } from '../streak/StreakDashboard';
import { HistoryView } from '../history/HistoryView';
import { SettingsView } from '../settings/SettingsView';

export const AppShell: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    currentTab,
    isLoading,
    reminders,
    events,
    studySessions,
    notificationSettings,
    completeReminder,
    snoozeReminder,
    startLiveStudySession,
    toasts,
    removeToast,
    isLocked,
    unlockApp,
    addToast,
  } = useApp();

  // Start in-app notification scheduler
  useEffect(() => {
    if (!user) return;

    notificationService.startScheduler(() => ({
      reminders,
      events,
      studySessions,
      soundEnabled: notificationSettings.soundEnabled,
      onTriggerReminder: (r) => {
        addToast({
          type: 'warning',
          title: `Alarm: ${r.title}`,
          message: r.description || `Scheduled for ${r.time}`,
          durationMs: 6000,
        });
      },
      onTriggerEvent: (e) => {
        addToast({
          type: 'info',
          title: `Event: ${e.title}`,
          message: `${e.startTime} - ${e.endTime}`,
          durationMs: 6000,
        });
      },
      onTriggerStudySession: (s) => {
        addToast({
          type: 'info',
          title: `Study Session: ${s.subject}`,
          message: s.goal || 'Time for focused study',
          durationMs: 6000,
        });
      },
    }));

    return () => notificationService.stopScheduler();
  }, [user, reminders, events, studySessions, notificationSettings.soundEnabled, addToast]);

  // Service Worker PostMessage Action Listener
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NOTIFICATION_ACTION') {
        const { action, data } = event.data;
        if (data?.itemId && data?.itemType === 'reminder') {
          if (action === 'complete') {
            completeReminder(data.itemId);
          } else if (action === 'snooze') {
            snoozeReminder(data.itemId, 10);
          }
        }
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, [completeReminder, snoozeReminder]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <LoadingState message="Verifying session & synchronizing study data..." />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Sticky Top Bar */}
        <TopBar />

        {/* Dynamic Screen View */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
          {/* PWA Install & Notification Permission Banners */}
          <PwaInstallBanner />
          <NotificationPermissionBanner />

          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {currentTab === 'home' && (
                <div className="space-y-6">
                  <MissedTasksAlert />
                  <GreetingHeader />
                  <QuickStatsCard />
                  <TodayOverview />
                  <UpcomingSection />
                </div>
              )}

              {currentTab === 'calendar' && <CalendarView />}

              {currentTab === 'streak' && <StreakDashboard />}

              {currentTab === 'history' && <HistoryView />}

              {currentTab === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Modals & Notifications */}
      <AddEditItemModal />
      <ActiveStudyTimerModal />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Security Pattern Screen if app is locked */}
      <PatternLockDialog
        isOpen={isLocked}
        mode="unlock"
        onUnlock={unlockApp}
      />
    </div>
  );
};
