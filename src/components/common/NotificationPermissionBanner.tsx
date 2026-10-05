// src/components/common/NotificationPermissionBanner.tsx
import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, X, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { notificationService, type NotificationPermissionState } from '../../services/notificationService';
import { useApp } from '../../context/AppContext';

export const NotificationPermissionBanner: React.FC = () => {
  const { addToast } = useApp();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionState>('default');
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  useEffect(() => {
    const status = notificationService.getPermissionStatus();
    setPermissionStatus(status);
    const dismissed = localStorage.getItem('studymate_notif_prompt_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (permissionStatus === 'granted' || permissionStatus === 'unsupported' || isDismissed) {
    return null;
  }

  const handleEnable = async () => {
    setIsRequesting(true);
    try {
      const result = await notificationService.requestPermission();
      setPermissionStatus(result);
      if (result === 'granted') {
        addToast({
          type: 'success',
          title: 'Notifications Active 🔔',
          message: 'StudyMate will now alert you for upcoming sessions and reminders.',
        });
        notificationService.showNotification('StudyMate Notifications Enabled!', {
          body: 'You will receive study alarms, exam countdowns, and streak reminders.',
        });
      } else if (result === 'denied') {
        addToast({
          type: 'warning',
          title: 'Permission Denied',
          message: 'You can enable notifications anytime in your browser site settings.',
        });
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('studymate_notif_prompt_dismissed', 'true');
  };

  return (
    <div className="subtle-card rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-900/10 via-slate-900/5 to-purple-900/10 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-purple-950/40 border-indigo-200/80 dark:border-indigo-900/60 shadow-sm mb-6 animate-fade-in relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Dismiss notification banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20 mt-0.5">
            <Bell className="w-5 h-5 animate-pulse-subtle" />
          </div>

          <div className="space-y-1 max-w-xl">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              <span>Enable Timely Study Reminders</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              StudyMate sends reminders for scheduled study sessions, urgent exam events, and streak milestones with quick Complete & Snooze actions.
            </p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>No spam or promotional notifications — only your study schedule.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Maybe Later
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleEnable}
            isLoading={isRequesting}
            leftIcon={<Bell className="w-3.5 h-3.5" />}
          >
            Enable Notifications
          </Button>
        </div>
      </div>
    </div>
  );
};
