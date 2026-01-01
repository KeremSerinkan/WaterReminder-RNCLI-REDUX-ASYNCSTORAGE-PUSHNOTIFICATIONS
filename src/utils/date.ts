import {
  format,
  parseISO,
  startOfDay,
  isToday,
  isYesterday,
  differenceInDays,
} from 'date-fns';

// Get current date in YYYY-MM-DD format (for storage keys)
export const getTodayKey = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Format date for display (e.g., "Mon, Jan 1")
export const formatDateShort = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'EEE, MMM d');
};

// Format date for headers (e.g., "Monday, January 1")
export const formatDateFull = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'EEEE, MMMM d');
};

// Format time from ISO string (e.g., "9:30 AM")
export const formatTime = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, 'h:mm a');
};

// Format time in 24h format (e.g., "09:30")
export const formatTime24 = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, 'HH:mm');
};

// Get relative date label (Today, Yesterday, or formatted date)
export const getRelativeDateLabel = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  const daysAgo = differenceInDays(new Date(), date);
  if (daysAgo < 7) {
    return format(date, 'EEEE'); // Day name (e.g., "Wednesday")
  }

  return format(date, 'MMM d'); // Short date (e.g., "Jan 1")
};

// Get greeting based on time of day
export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning!';
  } else if (hour < 17) {
    return 'Good afternoon!';
  } else if (hour < 21) {
    return 'Good evening!';
  } else {
    return 'Stay hydrated!';
  }
};

// Get current ISO timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Parse date string to Date object
export const parseDate = (dateString: string): Date => {
  return parseISO(dateString);
};

// Check if a date string is today
export const checkIsToday = (dateString: string): boolean => {
  return isToday(parseISO(dateString));
};

// Get the start of today
export const getStartOfToday = (): Date => {
  return startOfDay(new Date());
};

// Format for history card (e.g., "1" for day, "Jan" for month)
export const formatDayNumber = (dateString: string): string => {
  return format(parseISO(dateString), 'd');
};

export const formatMonthShort = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM');
};

// Get time period for notifications
export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export const getTimePeriod = (): TimePeriod => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
};
