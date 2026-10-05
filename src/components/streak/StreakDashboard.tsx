// src/components/streak/StreakDashboard.tsx
import React from 'react';
import {
  Flame,
  Trophy,
  Award,
  Calendar,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, subDays, format } from '../../utils/dateUtils';
import { Button } from '../common/Button';
import { fireStreakConfetti } from '../../utils/confettiUtils';

export const StreakDashboard: React.FC = () => {
  const { streak, achievements, checkInStreak, currentUser } = useApp();
  const todayStr = getTodayDateString();

  const isCheckedInToday = streak.activeDates.includes(todayStr);

  // Generate last 7 days for weekly completion visual
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isCompleted = streak.activeDates.includes(dateStr);
    return {
      dayName: format(date, 'EEE'),
      dateStr,
      isCompleted,
    };
  });

  const weeklyCompletionRate = Math.round(
    (last7Days.filter((d) => d.isCompleted).length / 7) * 100
  );

  // Generate last 28 days activity heatmap
  const last28Days = Array.from({ length: 28 }).map((_, i) => {
    const date = subDays(new Date(), 27 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isCompleted = streak.activeDates.includes(dateStr);
    return {
      dateStr,
      isCompleted,
    };
  });

  const handleCheckIn = async () => {
    await checkInStreak();
    fireStreakConfetti();
  };

  return (
    <div className="space-y-6">
      {/* ================= HERO STREAK BANNER ================= */}
      <div className="subtle-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-indigo-900/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-slate-900/90 border-amber-200/80 dark:border-amber-900/50 shadow-streak relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0 animate-pulse-subtle">
              <Flame className="w-12 h-12 sm:w-14 sm:h-14 fill-white" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Active Study Momentum
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {streak.currentStreak} Days Streak 🔥
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
                {isCheckedInToday
                  ? "Great dedication! You've successfully logged today's study activity."
                  : 'Complete a study session or check in today to keep your fire burning!'}
              </p>
            </div>
          </div>

          {/* Quick Check-in Button */}
          <div className="flex items-center gap-3">
            <Button
              variant={isCheckedInToday ? 'secondary' : 'amber'}
              size="lg"
              onClick={handleCheckIn}
              disabled={isCheckedInToday}
              leftIcon={
                isCheckedInToday ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Zap className="w-5 h-5 fill-current" />
                )
              }
            >
              {isCheckedInToday ? 'Checked In Today' : 'Daily Check-In'}
            </Button>
          </div>
        </div>
      </div>

      {/* ================= STATS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Best Streak */}
        <div className="subtle-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Best All-Time Streak
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {streak.bestStreak} Days
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Personal record milestone
            </div>
          </div>
        </div>

        {/* Weekly Completion */}
        <div className="subtle-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              This Week Consistency
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {weeklyCompletionRate}%
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${weeklyCompletionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak Protections */}
        <div className="subtle-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Streak Freezes
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {streak.freezeDaysRemaining} Days Available
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Auto-grace for emergency rest
            </div>
          </div>
        </div>
      </div>

      {/* ================= WEEKLY & MONTHLY HEATMAP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Breakdown */}
        <div className="lg:col-span-5 subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Rhythm
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily goal consistency across the past 7 days
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {weeklyCompletionRate}% Met
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {last7Days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {d.dayName}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    d.isCompleted
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {d.isCompleted ? <Flame className="w-5 h-5 fill-white" /> : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 28-Day Activity Grid */}
        <div className="lg:col-span-7 subtle-card rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                4-Week Activity Heatmap
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consistency visualization over 28 days
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-700" />
                <span>Rest</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span>Studied</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {last28Days.map((d, i) => (
              <div
                key={i}
                title={d.dateStr}
                className={`h-7 rounded-lg transition-all ${
                  d.isCompleted
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= ACHIEVEMENTS GALLERY ================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Achievements & Milestones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unlock productivity badges as you study and build streaks
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            {achievements.filter((a) => a.unlockedAt).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`subtle-card rounded-2xl p-4 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/30 to-white dark:from-slate-900 dark:to-indigo-950/30'
                    : 'opacity-70 bg-slate-50/60 dark:bg-slate-900/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {ach.icon}
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span>
                      {ach.progress} / {ach.maxProgress}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
