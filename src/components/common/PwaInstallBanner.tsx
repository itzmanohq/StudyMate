// src/components/common/PwaInstallBanner.tsx - PWA Install prompt handler
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if not dismissed recently
      const dismissed = localStorage.getItem('studymate_pwa_install_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('studymate_pwa_install_dismissed', 'true');
  };

  if (!isVisible || !deferredPrompt) return null;

  return (
    <div className="subtle-card rounded-2xl p-4 bg-gradient-to-r from-indigo-900/10 to-blue-900/10 dark:from-indigo-950/50 dark:to-blue-950/40 border-indigo-200/80 dark:border-indigo-800/80 shadow-sm mb-6 animate-slide-up relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <button
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        aria-label="Dismiss install banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3.5 pr-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Install StudyMate on your device</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enjoy full offline study timers, home screen launch, and instant notifications.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          Not Now
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleInstall}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Install App
        </Button>
      </div>
    </div>
  );
};
