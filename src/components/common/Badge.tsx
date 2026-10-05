// src/components/common/Badge.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReminderPriority, EventCategory } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'urgent' | 'high' | 'medium' | 'low' | 'exam' | 'lecture' | 'assignment' | 'study_group' | 'streak' | 'success' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const baseStyles = 'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md';

  const variants: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900',
    high: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900',
    medium: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
    low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    exam: 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300 font-bold',
    lecture: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300',
    assignment: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300',
    study_group: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
    streak: 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))}>
      {children}
    </span>
  );
};

export function getPriorityBadge(priority: ReminderPriority) {
  switch (priority) {
    case 'urgent':
      return <Badge variant="urgent">Urgent</Badge>;
    case 'high':
      return <Badge variant="high">High</Badge>;
    case 'medium':
      return <Badge variant="medium">Medium</Badge>;
    case 'low':
      return <Badge variant="low">Low</Badge>;
  }
}

export function getCategoryBadge(category: EventCategory) {
  const names: Record<EventCategory, string> = {
    exam: 'Exam',
    lecture: 'Lecture',
    assignment: 'Assignment',
    study_group: 'Group Study',
    personal: 'Personal',
    deadline: 'Deadline',
  };

  return <Badge variant={category as any}>{names[category] || category}</Badge>;
}
