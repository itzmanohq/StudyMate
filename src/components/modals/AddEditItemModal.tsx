// src/components/modals/AddEditItemModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar as CalendarIcon,
  BookOpen,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import type {
  ItemType,
  ReminderPriority,
  RepeatFrequency,
  EventCategory,
  Reminder,
  Event,
  StudySession,
} from '../../types';
import { getTodayDateString } from '../../utils/dateUtils';
import {
  validateReminderInput,
  validateEventInput,
  validateStudySessionInput,
} from '../../utils/validationUtils';

export const AddEditItemModal: React.FC = () => {
  const {
    isAddModalOpen,
    closeAddModal,
    addModalInitialType,
    editingItem,
    createReminder,
    updateReminder,
    createEvent,
    updateEvent,
    createStudySession,
    updateStudySession,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ItemType>(addModalInitialType);
  const isEditing = !!editingItem;
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reminder Fields
  const [remTitle, setRemTitle] = useState('');
  const [remDesc, setRemDesc] = useState('');
  const [remDate, setRemDate] = useState(getTodayDateString());
  const [remTime, setRemTime] = useState('19:00');
  const [remPriority, setRemPriority] = useState<ReminderPriority>('high');
  const [remRepeat, setRemRepeat] = useState<RepeatFrequency>('daily');
  const [remSnooze, setRemSnooze] = useState<number>(10);
  const [remNotif, setRemNotif] = useState<boolean>(true);
  const [remTags, setRemTags] = useState<string>('Electronics');

  // Event Fields
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtDate, setEvtDate] = useState(getTodayDateString());
  const [evtStartTime, setEvtStartTime] = useState('09:00');
  const [evtEndTime, setEvtEndTime] = useState('11:00');
  const [evtCategory, setEvtCategory] = useState<EventCategory>('exam');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtReminders, setEvtReminders] = useState<number[]>([30]);

  // Study Session Fields
  const [sesSubject, setSesSubject] = useState('');
  const [sesTopic, setSesTopic] = useState('');
  const [sesDate, setSesDate] = useState(getTodayDateString());
  const [sesStartTime, setSesStartTime] = useState('19:00');
  const [sesDuration, setSesDuration] = useState<number>(60);
  const [sesRepeat, setSesRepeat] = useState<RepeatFrequency>('none');
  const [sesGoal, setSesGoal] = useState('');

  // Populate form if editing
  useEffect(() => {
    setFormErrors({});
    if (editingItem) {
      if ('priority' in editingItem) {
        setActiveTab('reminder');
        const r = editingItem as Reminder;
        setRemTitle(r.title);
        setRemDesc(r.description || '');
        setRemDate(r.date);
        setRemTime(r.time);
        setRemPriority(r.priority);
        setRemRepeat(r.repeat);
        setRemSnooze(r.snoozeMinutes);
        setRemNotif(r.notificationEnabled);
        setRemTags(r.tags?.join(', ') || '');
      } else if ('category' in editingItem) {
        setActiveTab('event');
        const e = editingItem as Event;
        setEvtTitle(e.title);
        setEvtDesc(e.description || '');
        setEvtDate(e.date);
        setEvtStartTime(e.startTime);
        setEvtEndTime(e.endTime);
        setEvtCategory(e.category);
        setEvtLocation(e.location || '');
        setEvtReminders(e.reminderMinutesBefore || [30]);
      } else {
        setActiveTab('study_session');
        const s = editingItem as StudySession;
        setSesSubject(s.subject);
        setSesTopic(s.topic || '');
        setSesDate(s.date);
        setSesStartTime(s.startTime);
        setSesDuration(s.plannedDurationMinutes);
        setSesRepeat(s.repeat);
        setSesGoal(s.goal || '');
      }
    } else {
      setActiveTab(addModalInitialType);
      setRemTitle('');
      setRemDesc('');
      setRemDate(getTodayDateString());
      setRemTime('19:00');
      setRemPriority('high');
      setRemRepeat('daily');

      setEvtTitle('');
      setEvtDesc('');
      setEvtDate(getTodayDateString());
      setEvtStartTime('09:00');
      setEvtEndTime('11:00');
      setEvtCategory('exam');
      setEvtLocation('');
      setEvtReminders([30]);

      setSesSubject('');
      setSesTopic('');
      setSesDate(getTodayDateString());
      setSesStartTime('19:00');
      setSesDuration(60);
      setSesGoal('');
    }
  }, [editingItem, addModalInitialType, isAddModalOpen]);

  const toggleEventReminderOffset = (mins: number) => {
    setEvtReminders((prev) =>
      prev.includes(mins) ? prev.filter((m) => m !== mins) : [...prev, mins]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (activeTab === 'reminder') {
      const validation = validateReminderInput({
        title: remTitle,
        date: remDate,
        time: remTime,
        priority: remPriority,
        snoozeMinutes: remSnooze,
      });

      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }

      if (isEditing && editingItem && 'priority' in editingItem) {
        await updateReminder({
          ...(editingItem as Reminder),
          title: remTitle.trim(),
          description: remDesc.trim() || undefined,
          date: remDate,
          time: remTime,
          priority: remPriority,
          repeat: remRepeat,
          snoozeMinutes: remSnooze,
          notificationEnabled: remNotif,
          tags: remTags ? remTags.split(',').map((t) => t.trim()) : undefined,
        });
      } else {
        await createReminder({
          title: remTitle.trim(),
          description: remDesc.trim() || undefined,
          date: remDate,
          time: remTime,
          priority: remPriority,
          repeat: remRepeat,
          snoozeMinutes: remSnooze,
          notificationEnabled: remNotif,
          tags: remTags ? remTags.split(',').map((t) => t.trim()) : undefined,
        });
      }
    } else if (activeTab === 'event') {
      const validation = validateEventInput({
        title: evtTitle,
        date: evtDate,
        startTime: evtStartTime,
        endTime: evtEndTime,
        category: evtCategory,
      });

      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }

      const remindersArr = evtReminders.length > 0 ? evtReminders : [30];

      if (isEditing && editingItem && 'category' in editingItem) {
        await updateEvent({
          ...(editingItem as Event),
          title: evtTitle.trim(),
          description: evtDesc.trim() || undefined,
          date: evtDate,
          startTime: evtStartTime,
          endTime: evtEndTime,
          category: evtCategory,
          location: evtLocation.trim() || undefined,
          reminderMinutesBefore: remindersArr,
        });
      } else {
        await createEvent({
          title: evtTitle.trim(),
          description: evtDesc.trim() || undefined,
          date: evtDate,
          startTime: evtStartTime,
          endTime: evtEndTime,
          category: evtCategory,
          location: evtLocation.trim() || undefined,
          reminderMinutesBefore: remindersArr,
        });
      }
    } else {
      const validation = validateStudySessionInput({
        subject: sesSubject,
        date: sesDate,
        startTime: sesStartTime,
        plannedDurationMinutes: Number(sesDuration),
      });

      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }

      if (isEditing && editingItem && !('priority' in editingItem) && !('category' in editingItem)) {
        await updateStudySession({
          ...(editingItem as StudySession),
          subject: sesSubject.trim(),
          topic: sesTopic.trim() || undefined,
          date: sesDate,
          startTime: sesStartTime,
          plannedDurationMinutes: Number(sesDuration),
          repeat: sesRepeat,
          goal: sesGoal.trim() || undefined,
        });
      } else {
        await createStudySession({
          subject: sesSubject.trim(),
          topic: sesTopic.trim() || undefined,
          date: sesDate,
          startTime: sesStartTime,
          plannedDurationMinutes: Number(sesDuration),
          repeat: sesRepeat,
          goal: sesGoal.trim() || undefined,
        });
      }
    }

    closeAddModal();
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={closeAddModal}
      title={isEditing ? 'Edit Item' : 'Create New'}
      subtitle={
        isEditing
          ? 'Modify your study reminder or schedule'
          : 'Add a new study session, reminder, or event'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector (if creating new) */}
        {!isEditing && (
          <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('reminder');
                setFormErrors({});
              }}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'reminder'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Reminder</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('event');
                setFormErrors({});
              }}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'event'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Event</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('study_session');
                setFormErrors({});
              }}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'study_session'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study</span>
            </button>
          </div>
        )}

        {/* Global Error Notice */}
        {Object.keys(formErrors).length > 0 && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Please correct the errors in the form below.</span>
          </div>
        )}

        {/* ================= REMINDER FORM ================= */}
        {activeTab === 'reminder' && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reminder Title *
              </label>
              <input
                type="text"
                value={remTitle}
                onChange={(e) => setRemTitle(e.target.value)}
                placeholder="e.g. Study Electronics (Op-Amps)"
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                  formErrors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
              />
              {formErrors.title && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description / Notes
              </label>
              <textarea
                rows={2}
                value={remDesc}
                onChange={(e) => setRemDesc(e.target.value)}
                placeholder="Key topics to cover, problem sheet numbers..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={remDate}
                  onChange={(e) => setRemDate(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.date ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={remTime}
                  onChange={(e) => setRemTime(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.time ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={remPriority}
                  onChange={(e) => setRemPriority(e.target.value as ReminderPriority)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white capitalize"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🔵 Medium</option>
                  <option value="low">⚪ Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Repeat Schedule
                </label>
                <select
                  value={remRepeat}
                  onChange={(e) => setRemRepeat(e.target.value as RepeatFrequency)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white capitalize"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Every day</option>
                  <option value="weekdays">Every weekday (Mon-Fri)</option>
                  <option value="weekends">Every weekend (Sat-Sun)</option>
                  <option value="weekly">Every week</option>
                  <option value="monthly">Every month</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={remNotif}
                  onChange={(e) => setRemNotif(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                />
                <span>Enable Sound & Alarm</span>
              </label>

              <div className="flex items-center gap-1 text-slate-500">
                <span>Default Snooze:</span>
                <select
                  value={remSnooze}
                  onChange={(e) => setRemSnooze(Number(e.target.value))}
                  className="bg-transparent border-b border-slate-300 dark:border-slate-700 text-xs py-0.5"
                >
                  <option value={5}>5m</option>
                  <option value={10}>10m</option>
                  <option value={15}>15m</option>
                  <option value={30}>30m</option>
                  <option value={60}>1h</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= EVENT FORM ================= */}
        {activeTab === 'event' && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={evtTitle}
                onChange={(e) => setEvtTitle(e.target.value)}
                placeholder="e.g. Digital Electronics Exam"
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                  formErrors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
              />
              {formErrors.title && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={evtCategory}
                  onChange={(e) => setEvtCategory(e.target.value as EventCategory)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white capitalize"
                >
                  <option value="exam">📕 Exam</option>
                  <option value="lecture">📘 Lecture</option>
                  <option value="assignment">📙 Assignment Due</option>
                  <option value="study_group">👥 Study Group</option>
                  <option value="personal">👤 Personal</option>
                  <option value="deadline">⏰ Deadline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={evtDate}
                  onChange={(e) => setEvtDate(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.date ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={evtStartTime}
                  onChange={(e) => setEvtStartTime(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.startTime ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={evtEndTime}
                  onChange={(e) => setEvtEndTime(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.endTime ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
                />
              </div>
            </div>
            {formErrors.endTime && (
              <p className="text-[11px] text-rose-500">{formErrors.endTime}</p>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location / Room / Link
              </label>
              <input
                type="text"
                value={evtLocation}
                onChange={(e) => setEvtLocation(e.target.value)}
                placeholder="e.g. Hall B2 / Zoom"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            {/* Multiple Reminders selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Event Alarm Offsets
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: '30 mins before', val: 30 },
                  { label: '2 hours before', val: 120 },
                  { label: '1 day before', val: 1440 },
                  { label: '2 days before', val: 2880 },
                ].map((item) => {
                  const isChecked = evtReminders.includes(item.val);
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => toggleEventReminderOffset(item.val)}
                      className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Description
              </label>
              <textarea
                rows={2}
                value={evtDesc}
                onChange={(e) => setEvtDesc(e.target.value)}
                placeholder="Notes, required stationery or syllabus details..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              />
            </div>
          </div>
        )}

        {/* ================= STUDY SESSION FORM ================= */}
        {activeTab === 'study_session' && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                value={sesSubject}
                onChange={(e) => setSesSubject(e.target.value)}
                placeholder="e.g. Mathematics / Electronics / Physics"
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                  formErrors.subject ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
              />
              {formErrors.subject && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Topic / Chapter
              </label>
              <input
                type="text"
                value={sesTopic}
                onChange={(e) => setSesTopic(e.target.value)}
                placeholder="e.g. 2nd Order Differential Equations"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={sesDate}
                  onChange={(e) => setSesDate(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.date ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={sesStartTime}
                  onChange={(e) => setSesStartTime(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.startTime ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Minutes)
                </label>
                <select
                  value={sesDuration}
                  onChange={(e) => setSesDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes (1 Hour)</option>
                  <option value={90}>90 Minutes (1.5 Hours)</option>
                  <option value={120}>120 Minutes (2 Hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Repeat Schedule
                </label>
                <select
                  value={sesRepeat}
                  onChange={(e) => setSesRepeat(e.target.value as RepeatFrequency)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white capitalize"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily routine</option>
                  <option value="weekdays">Weekdays (Mon-Fri)</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Study Goal / Target
              </label>
              <textarea
                rows={2}
                value={sesGoal}
                onChange={(e) => setSesGoal(e.target.value)}
                placeholder="e.g. Solve 10 problems without referring to solution manual"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              />
            </div>
          </div>
        )}

        {/* Modal Submit Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={closeAddModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            leftIcon={isEditing ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          >
            {isEditing ? 'Save Changes' : 'Save & Schedule'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
