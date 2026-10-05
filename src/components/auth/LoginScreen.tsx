// src/components/auth/LoginScreen.tsx - Modern Google Sign-In & Onboarding
import React from 'react';
import {
  Flame,
  ShieldCheck,
  Zap,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { isFirebaseConfigured } from '../../config/firebase';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInDemoUser, loading, authError, clearAuthError, isOnline } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Offline Alert Badge if disconnected */}
      {!isOnline && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold animate-pulse">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode: Local cached session will be used</span>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 flex flex-col items-center text-center animate-scale-in">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
          <Flame className="w-9 h-9 fill-amber-400 text-amber-400" />
        </div>

        {/* Brand Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          StudyMate
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-xs">
          Personal study productivity, reminders, calendar, and streak application
        </p>

        {/* Auth Error Banner */}
        {authError && (
          <div className="w-full mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-left flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
            <button onClick={clearAuthError} className="font-bold hover:underline">
              ✕
            </button>
          </div>
        )}

        {/* Primary Action: Continue with Google */}
        <button
          onClick={() => signInWithGoogle()}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {/* Google Color G Vector Icon */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
        </button>

        {/* Feature Highlights */}
        <div className="w-full mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-left">
          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Strict Data Isolation:</strong> Each Google account has completely isolated cloud documents based on Firebase UID.
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Offline-First Engine:</strong> All tasks, focus timers, and schedules function seamlessly even with intermittent internet.
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Pattern Lock Protection:</strong> Secure your daily study goals and habits with on-device cryptographic pattern protection.
            </div>
          </div>
        </div>

        {/* Quick Demo Mode Selection */}
        <div className="w-full mt-6 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Local Multi-User Demo Switcher
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => signInDemoUser('owner')}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Alex (Owner)
            </button>
            <button
              onClick={() => signInDemoUser('brother')}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Sam (Brother)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
