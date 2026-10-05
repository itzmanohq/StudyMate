// src/components/settings/SettingsView.tsx
import React, { useState } from 'react';
import {
  User,
  Sun,
  Moon,
  Monitor,
  Bell,
  Volume2,
  Lock,
  BookOpen,
  Download,
  RotateCcw,
  Shield,
  Info,
  Check,
  Play,
  LogOut,
  Smartphone,
  Key,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { PatternLockDialog } from '../common/PatternLockDialog';
import { soundManager } from '../../utils/soundUtils';
import type { AppTheme, SoundType } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    appSettings,
    updateAppSettings,
    notificationSettings,
    updateNotificationSettings,
    setSecurityPattern,
    removeSecurityPattern,
    exportData,
    resetUserData,
    addToast,
  } = useApp();

  const { signOutUser, isDemoUser, signInDemoUser } = useAuth();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPatternSetup, setShowPatternSetup] = useState(false);

  // Play Sound Test
  const testSound = (type: SoundType) => {
    switch (type) {
      case 'chime':
        soundManager.playChime();
        break;
      case 'gentle':
        soundManager.playGentle();
        break;
      case 'radar':
        soundManager.playRadar();
        break;
      case 'zen':
        soundManager.playZen();
        break;
      case 'bell':
        soundManager.playSuccess();
        break;
    }
  };

  const handlePatternSet = async (pattern: number[]) => {
    await setSecurityPattern(pattern);
    setShowPatternSetup(false);
  };

  const handleExport = async () => {
    const jsonString = await exportData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymate_backup_${currentUser.id}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Backup Exported' });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* ================= ACCOUNT SECTION ================= */}
      <div className="subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Google Account & Cloud Profile
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOutUser}
            leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            Sign Out
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-3.5">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                  {isDemoUser ? 'Demo Profile' : 'Google Account'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentUser.email || 'Cloud UID: ' + currentUser.id}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg">
              UID: {currentUser.id.substring(0, 14)}...
            </span>
          </div>
        </div>

        {isDemoUser && (
          <div className="pt-2 flex items-center gap-2 text-xs">
            <span className="text-slate-500">Switch Demo Account:</span>
            <button
              onClick={() => signInDemoUser('owner')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                currentUser.id === 'user_1_owner'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Alex (Owner)
            </button>
            <button
              onClick={() => signInDemoUser('brother')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                currentUser.id === 'user_2_brother'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Sam (Brother)
            </button>
          </div>
        )}

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Strict Firestore data isolation protects your data. All records are scoped to your Google UID.
        </p>
      </div>

      {/* ================= APPEARANCE SECTION ================= */}
      <div className="subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Sun className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Appearance & Theme
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
            { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
            { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
          ].map((themeOpt) => {
            const isSelected = appSettings.theme === themeOpt.id;

            return (
              <button
                key={themeOpt.id}
                onClick={() => updateAppSettings({ theme: themeOpt.id as AppTheme })}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                {themeOpt.icon}
                <span className="text-xs">{themeOpt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= REMINDERS & SOUNDS ================= */}
      <div className="subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Reminders & Audio Alerts
          </h3>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              Audio Alert & Chimes
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Play gentle synthesizer chimes for reminders and finished study sessions
            </p>
          </div>
          <input
            type="checkbox"
            checked={notificationSettings.soundEnabled}
            onChange={(e) => updateNotificationSettings({ soundEnabled: e.target.checked })}
            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        {/* Sound Type & Test */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alarm Sound Profile
            </label>
            <div className="flex items-center gap-2">
              <select
                value={notificationSettings.soundType}
                onChange={(e) => {
                  const s = e.target.value as SoundType;
                  updateNotificationSettings({ soundType: s });
                  testSound(s);
                }}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium dark:text-white capitalize"
              >
                <option value="chime">Double Chime</option>
                <option value="gentle">Gentle Harmony</option>
                <option value="radar">Rhythmic Pulse</option>
                <option value="zen">Zen Singing Bowl</option>
                <option value="bell">Success Fanfare</option>
              </select>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => testSound(notificationSettings.soundType)}
                leftIcon={<Play className="w-3.5 h-3.5" />}
                title="Preview sound"
              >
                Test
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Default Snooze Duration
            </label>
            <select
              value={notificationSettings.defaultSnoozeMinutes}
              onChange={(e) => updateNotificationSettings({ defaultSnoozeMinutes: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium dark:text-white"
            >
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes (1 Hour)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= SECURITY SECTION ================= */}
      <div className="subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Security & Pattern Lock
          </h3>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              Cryptographic Pattern Protection
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Web Crypto SHA-256 pattern lock for securing study sessions and personal tasks
            </p>
          </div>
          <Button
            variant={appSettings.patternLockEnabled ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setShowPatternSetup(true)}
          >
            {appSettings.patternLockEnabled ? 'Change Pattern' : 'Set Pattern'}
          </Button>
        </div>

        {appSettings.patternLockEnabled && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Shield className="w-4 h-4" /> Pattern Lock is active
            </span>
            <button
              onClick={removeSecurityPattern}
              className="text-xs text-rose-500 hover:underline font-medium"
            >
              Remove Pattern
            </button>
          </div>
        )}
      </div>

      {/* ================= STUDY & STREAK GOALS ================= */}
      <div className="subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Study Goals & Streak Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Daily Study Goal (Minutes)
            </label>
            <input
              type="number"
              min={15}
              max={600}
              step={15}
              value={appSettings.dailyStudyGoalMinutes}
              onChange={(e) => updateAppSettings({ dailyStudyGoalMinutes: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Streak Grace Days
            </label>
            <select
              value={appSettings.graceDaysAllowed}
              onChange={(e) => updateAppSettings({ graceDaysAllowed: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium dark:text-white"
            >
              <option value={1}>1 Grace Day</option>
              <option value={2}>2 Grace Days (Recommended)</option>
              <option value={3}>3 Grace Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= DATA & BACKUP ================= */}
      <div className="subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Data Management & Cloud Sync
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              Export Cloud Backup
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download your complete schedule, streak, and history as JSON
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Backup
          </Button>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400">
              Reset Cloud Data
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear your reminders and sessions
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset Data
          </Button>
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="subtle-card rounded-3xl p-5 sm:p-6 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-1">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>StudyMate v2.0.0</span>
        </div>
        <p>Production Architecture with Firebase Authentication & Firestore Subcollection Isolation.</p>
        <p>Offline-First Persistence with IndexedDB Tab Cache.</p>
      </div>

      {/* Pattern Setup Dialog */}
      <PatternLockDialog
        isOpen={showPatternSetup}
        mode="setup"
        onPatternSet={handlePatternSet}
        onClose={() => setShowPatternSetup(false)}
      />

      {/* Reset Confirmation */}
      <ConfirmationDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={async () => {
          await resetUserData();
          setShowResetConfirm(false);
        }}
        title="Reset Study Data?"
        message="This will remove your reminders and sessions for this profile. Are you sure?"
        confirmText="Reset"
        isDangerous
      />
    </div>
  );
};
