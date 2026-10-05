// src/utils/validationUtils.ts - Strict data validation layer for StudyMate

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateReminderInput(data: {
  title: string;
  date: string;
  time: string;
  priority?: string;
  snoozeMinutes?: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Title validation
  if (!data.title || !data.title.trim()) {
    errors.title = 'Reminder title is required.';
  } else if (data.title.trim().length > 120) {
    errors.title = 'Title must be 120 characters or less.';
  }

  // Date validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!data.date || !dateRegex.test(data.date)) {
    errors.date = 'Valid date (YYYY-MM-DD) is required.';
  }

  // Time validation (HH:mm)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!data.time || !timeRegex.test(data.time)) {
    errors.time = 'Valid time (HH:mm in 24h format) is required.';
  }

  // Snooze validation
  if (data.snoozeMinutes !== undefined && (data.snoozeMinutes < 1 || data.snoozeMinutes > 120)) {
    errors.snoozeMinutes = 'Snooze duration must be between 1 and 120 minutes.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEventInput(data: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Event title is required.';
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!data.date || !dateRegex.test(data.date)) {
    errors.date = 'Valid date (YYYY-MM-DD) is required.';
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!data.startTime || !timeRegex.test(data.startTime)) {
    errors.startTime = 'Valid start time (HH:mm) is required.';
  }

  if (!data.endTime || !timeRegex.test(data.endTime)) {
    errors.endTime = 'Valid end time (HH:mm) is required.';
  }

  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    errors.endTime = 'End time must be after start time.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStudySessionInput(data: {
  subject: string;
  date: string;
  startTime: string;
  plannedDurationMinutes: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.subject || !data.subject.trim()) {
    errors.subject = 'Subject name is required.';
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!data.date || !dateRegex.test(data.date)) {
    errors.date = 'Valid date (YYYY-MM-DD) is required.';
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!data.startTime || !timeRegex.test(data.startTime)) {
    errors.startTime = 'Valid start time (HH:mm) is required.';
  }

  if (!data.plannedDurationMinutes || data.plannedDurationMinutes < 5 || data.plannedDurationMinutes > 720) {
    errors.plannedDurationMinutes = 'Duration must be between 5 and 720 minutes.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
