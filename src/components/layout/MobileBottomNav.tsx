// src/components/layout/MobileBottomNav.tsx
import React from 'react';
import {
  Home,
  Calendar,
  Flame,
  History,
  Settings,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { NavigationTab } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, openAddModal, streak } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    // Center FAB placeholder
    { id: 'streak', label: 'Streak', icon: <Flame className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around px-2 h-16 relative max-w-lg mx-auto">
        {/* Nav item 1: Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'home'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* Nav item 2: Calendar */}
        <button
          onClick={() => setCurrentTab('calendar')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'calendar'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Calendar"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Calendar</span>
        </button>

        {/* Center Floating Action Button (FAB) */}
        <div className="relative -top-5 flex flex-col items-center justify-center flex-1">
          <button
            onClick={() => openAddModal()}
            className="w-13 h-13 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 ring-4 ring-white dark:ring-slate-900 active:scale-95 transition-all duration-150"
            aria-label="Add reminder, event or study session"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1">
            Add
          </span>
        </div>

        {/* Nav item 3: Streak */}
        <button
          onClick={() => setCurrentTab('streak')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            currentTab === 'streak'
              ? 'text-amber-500 dark:text-amber-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Streak"
        >
          <div className="relative">
            <Flame className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 text-[9px] font-black px-1 rounded-full bg-amber-500 text-white leading-tight">
              {streak.currentStreak}
            </span>
          </div>
          <span className="text-[10px] mt-1">Streak</span>
        </button>

        {/* Nav item 4: History */}
        <button
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'history'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="History"
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] mt-1">History</span>
        </button>

        {/* Nav item 5: Settings */}
        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'settings'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
};
