// src/components/layout/DesktopSidebar.tsx
import React from 'react';
import {
  Home,
  Calendar,
  Flame,
  History,
  Settings,
  Plus,
  WifiOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import type { NavigationTab } from '../../types';
import { Button } from '../common/Button';
import { getTodayDateString } from '../../utils/dateUtils';

export const DesktopSidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    openAddModal,
    streak,
    reminders,
    currentUser,
    isOnline,
  } = useApp();

  const { isDemoUser } = useAuth();
  const todayStr = getTodayDateString();
  const pendingRemindersToday = reminders.filter(
    (r) => r.date === todayStr && r.status === 'pending'
  ).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'home',
      label: 'Home Dashboard',
      icon: <Home className="w-5 h-5" />,
      badge: pendingRemindersToday > 0 ? pendingRemindersToday : undefined,
    },
    {
      id: 'calendar',
      label: 'Calendar & Agenda',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'streak',
      label: 'Streaks & Milestones',
      icon: <Flame className="w-5 h-5" />,
      badge: `${streak.currentStreak}d`,
    },
    {
      id: 'history',
      label: 'Study History',
      icon: <History className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings & Privacy',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 p-5 flex-shrink-0 justify-between select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              StudyMate
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Productivity & Streak
            </p>
          </div>
        </div>

        {/* Offline indicator if disconnected */}
        {!isOnline && (
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <span>Offline mode active</span>
          </div>
        )}

        {/* Create Action Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full shadow-glow"
          onClick={() => openAddModal()}
          leftIcon={<Plus className="w-5 h-5 stroke-[2.5]" />}
        >
          Schedule Task
        </Button>

        {/* Navigation Menu */}
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.id === 'streak'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/80 dark:text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Widget */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setCurrentTab('settings')}
          className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
        >
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {currentUser.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </h4>
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {isDemoUser ? 'Demo Profile' : 'Cloud Account'}
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
