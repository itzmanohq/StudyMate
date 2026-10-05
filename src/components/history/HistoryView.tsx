// src/components/history/HistoryView.tsx
import React, { useState } from 'react';
import {
  History,
  BookOpen,
  Bell,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateDisplay, formatDuration, formatFullDate } from '../../utils/dateUtils';
import { EmptyState } from '../common/EmptyState';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const HistoryView: React.FC = () => {
  const { history, exportData } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'study_session' | 'reminder' | 'event'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'missed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items
  const filteredHistory = history.filter((item) => {
    const matchesType = filterType === 'all' || item.itemType === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      !searchTerm.trim() ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryOrSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  // Analytics
  const totalCompleted = history.filter((h) => h.status === 'completed').length;
  const totalStudyMinutes = history
    .filter((h) => h.itemType === 'study_session' && h.status === 'completed')
    .reduce((acc, h) => acc + (h.durationMinutes || 0), 0);
  const completionRate = history.length > 0 ? Math.round((totalCompleted / history.length) * 100) : 100;

  const handleExport = async () => {
    const jsonString = await exportData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymate_history_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ================= SUMMARY STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="subtle-card rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Completed
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {totalCompleted} Items
            </div>
          </div>
        </div>

        <div className="subtle-card rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Logged Study Time
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {formatDuration(totalStudyMinutes)}
            </div>
          </div>
        </div>

        <div className="subtle-card rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Completion
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {completionRate}% Success
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTROLS & FILTER BAR ================= */}
      <div className="subtle-card rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history by topic, title, or notes..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Log
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500">Filter:</span>
          </div>

          {(['all', 'study_session', 'reminder', 'event'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all capitalize ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type === 'study_session' ? 'Study' : type}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {(['all', 'completed', 'missed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all capitalize ${
                filterStatus === status
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TIMELINE LIST ================= */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          icon={<History className="w-6 h-6 text-indigo-500" />}
          title="No history records found"
          description="Complete reminders or study sessions to build up your productivity record."
        />
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isSuccess = item.status === 'completed';

            const typeIcons = {
              study_session: <BookOpen className="w-4 h-4 text-indigo-500" />,
              reminder: <Bell className="w-4 h-4 text-amber-500" />,
              event: <CalendarIcon className="w-4 h-4 text-blue-500" />,
            };

            return (
              <div
                key={item.id}
                className="subtle-card rounded-2xl p-4 flex items-start gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-600"
              >
                {/* Status Indicator Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSuccess
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                  }`}
                >
                  {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {item.itemType.replace('_', ' ')}
                      </Badge>
                    </div>

                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
                      {formatDateDisplay(item.scheduledDate)}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      {item.notes}
                    </p>
                  )}

                  {/* Meta details */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                    <span className="inline-flex items-center gap-1">
                      {typeIcons[item.itemType]}
                      <span>{item.categoryOrSubject}</span>
                    </span>

                    {item.durationMinutes && item.durationMinutes > 0 && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatDuration(item.durationMinutes)} focus
                      </span>
                    )}

                    <span className="capitalize text-[11px] text-slate-400">
                      Status: {item.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
