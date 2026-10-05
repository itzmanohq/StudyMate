// src/components/layout/TopBar.tsx
import React, { useState } from 'react';
import {
  Search,
  X,
  Sun,
  Moon,
  Lock,
  Flame,
  UserCheck,
  ChevronDown,
  LogOut,
  WifiOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const TopBar: React.FC = () => {
  const {
    currentUser,
    appSettings,
    updateAppSettings,
    searchQuery,
    setSearchQuery,
    streak,
    lockApp,
    setCurrentTab,
    isOnline,
  } = useApp();

  const { signOutUser, isDemoUser, signInDemoUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const toggleTheme = () => {
    const nextTheme = appSettings.theme === 'dark' ? 'light' : 'dark';
    updateAppSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Offline sync banner if offline */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-1 px-4 text-center flex items-center justify-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Working offline — changes are saved locally and will sync when reconnected.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile Brand & Logo */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              StudyMate
            </span>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reminders, topics, exams..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <div className="flex sm:hidden flex-1 justify-end">
          {showSearchMobile ? (
            <div className="relative w-full flex items-center gap-2">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none ring-2 ring-indigo-500"
              />
              <button
                onClick={() => {
                  setShowSearchMobile(false);
                  setSearchQuery('');
                }}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchMobile(true)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Streak Pill */}
          <button
            onClick={() => setCurrentTab('streak')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 text-xs font-bold transition-colors"
            title="Current Streak"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse-subtle" />
            <span>{streak.currentStreak}d</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {appSettings.theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Pattern Lock Button if enabled */}
          {appSettings.patternLockEnabled && (
            <button
              onClick={lockApp}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Lock StudyMate"
              aria-label="Lock app"
            >
              <Lock className="w-5 h-5" />
            </button>
          )}

          {/* User Profile Avatar & Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="User profile menu"
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-11 z-40 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 text-xs animate-scale-in">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentUser.email || 'Cloud UID: ' + currentUser.id.substring(0, 10) + '...'}
                  </p>
                </div>

                {isDemoUser && (
                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Demo Account Switcher
                    </p>
                    <button
                      onClick={() => {
                        signInDemoUser('owner');
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                        currentUser.id === 'user_1_owner'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>Alex (Owner)</span>
                      {currentUser.id === 'user_1_owner' && <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        signInDemoUser('brother');
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                        currentUser.id === 'user_2_brother'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>Sam (Brother)</span>
                      {currentUser.id === 'user_2_brother' && <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-700 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setCurrentTab('settings');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Settings & Privacy
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOutUser();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
