import { create } from 'zustand';
import { authFetch } from '@/lib/api';

export interface SleepEntry {
  id: string;
  userId: string;
  duration: number;
  sleepTime: string;
  wakeTime: string;
  quality: number;
  rem?: number;
  core?: number;
  post?: number;
  createdAt: string;
}

export interface SleepSchedule {
  id: string;
  userId: string;
  isEveryday: boolean;
  isToday: boolean;
  sleepTime: string;
  wakeTime: string;
  snoozeLength: number;
  autoStats: boolean;
  autoAlarm: boolean;
}

interface SleepState {
  latestEntry: SleepEntry | null;
  history: SleepEntry[];
  schedule: SleepSchedule | null;
  weeklyQuality: number;
  isLoading: boolean;
  error: string | null;

  // Active sleep timer — ISO string or null
  activeSleepStart: string | null;

  fetchLatest: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchSchedule: () => Promise<void>;
  fetchWeeklyQuality: () => Promise<void>;
  setSchedule: (data: Partial<SleepSchedule>) => Promise<void>;
  addEntry: (data: { duration: number; sleepTime: string; wakeTime: string; quality?: number; rem?: number; core?: number; post?: number }) => Promise<void>;

  // Sleep timer actions
  initTimer: () => void;
  startSleep: () => void;
  endSleep: () => Promise<void>;
  clearSleep: () => void;

  // Fallback: log sleep based purely on schedule (for users who didn't open app)
  endSleepFromSchedule: () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the ISO date string for TODAY in the device's LOCAL timezone (YYYY-MM-DD) */
function todayDateStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Format a Date as "HH:MM" */
function fmt(d: Date) {
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

/** Parse "HH:MM" string into a Date (today's date at that time) */
function parseHHMM(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

/** Returns true if today's sleep is already logged AND was at least 30 minutes long. */
export function sleptToday(latestEntry: SleepEntry | null): boolean {
  if (!latestEntry) return false;
  if (latestEntry.duration < 0.5) return false;
  const entryDate = new Date(latestEntry.createdAt);
  const y = entryDate.getFullYear();
  const m = String(entryDate.getMonth() + 1).padStart(2, '0');
  const day = String(entryDate.getDate()).padStart(2, '0');
  const entryLocalDate = `${y}-${m}-${day}`;
  return entryLocalDate === todayDateStr();
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSleepStore = create<SleepState>((set, get) => ({
  latestEntry: null,
  history: [],
  schedule: null,
  weeklyQuality: 0,
  isLoading: false,
  error: null,
  activeSleepStart: null,

  fetchLatest: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch('/sleep/latest');
      if (response.ok) {
        const data = await response.json();
        set({ latestEntry: data, isLoading: false });
      } else {
        set({ latestEntry: null, isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch('/sleep/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      set({ history: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchSchedule: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch('/sleep/schedule');
      if (response.ok) {
        const data = await response.json();
        set({ schedule: data && data.id ? data : null, isLoading: false });
      } else {
        set({ schedule: null, isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchWeeklyQuality: async () => {
    try {
      const response = await authFetch('/sleep/weekly-quality');
      if (response.ok) {
        const data = await response.json();
        set({ weeklyQuality: data.score || 0 });
      }
    } catch (error) {
      console.error(error);
    }
  },

  setSchedule: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch('/sleep/schedule', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to set schedule');
      const savedSchedule = await response.json();
      set({ schedule: savedSchedule, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authFetch('/sleep', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add entry');
      const newEntry = await response.json();
      set((state) => ({
        latestEntry: newEntry,
        history: [newEntry, ...state.history],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // ─── Sleep Timer ─────────────────────────────────────────────────────────────

  initTimer: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('sleep_start_time');
    if (stored) {
      const storedDate = new Date(stored);
      const y = storedDate.getFullYear();
      const m = String(storedDate.getMonth() + 1).padStart(2, '0');
      const day = String(storedDate.getDate()).padStart(2, '0');
      const startDate = `${y}-${m}-${day}`;
      if (startDate === todayDateStr()) {
        set({ activeSleepStart: stored });
      } else {
        localStorage.removeItem('sleep_start_time');
      }
    }
  },

  startSleep: () => {
    const { latestEntry } = get();
    if (sleptToday(latestEntry)) return;
    const now = new Date().toISOString();
    if (typeof window !== 'undefined') localStorage.setItem('sleep_start_time', now);
    set({ activeSleepStart: now });
  },

  endSleep: async () => {
    const { activeSleepStart, addEntry, latestEntry } = get();
    if (sleptToday(latestEntry)) {
      if (typeof window !== 'undefined') localStorage.removeItem('sleep_start_time');
      set({ activeSleepStart: null });
      return;
    }
    if (!activeSleepStart) return;
    const sleepStart = new Date(activeSleepStart);
    const wakeNow = new Date();
    const durationHours = parseFloat(((wakeNow.getTime() - sleepStart.getTime()) / (1000 * 60 * 60)).toFixed(2));
    await addEntry({
      duration: durationHours,
      sleepTime: fmt(sleepStart),
      wakeTime: fmt(wakeNow),
    });
    if (typeof window !== 'undefined') localStorage.removeItem('sleep_start_time');
    set({ activeSleepStart: null });
  },

  clearSleep: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('sleep_start_time');
    set({ activeSleepStart: null });
  },

  endSleepFromSchedule: async () => {
    const { schedule, latestEntry, addEntry } = get();
    if (!schedule || sleptToday(latestEntry)) return;
    const sleepDate = parseHHMM(schedule.sleepTime);
    const wakeDate = parseHHMM(schedule.wakeTime);
    if (wakeDate <= sleepDate) wakeDate.setDate(wakeDate.getDate() + 1);
    const durationHours = parseFloat(((wakeDate.getTime() - sleepDate.getTime()) / (1000 * 60 * 60)).toFixed(2));
    await addEntry({
      duration: durationHours,
      sleepTime: schedule.sleepTime,
      wakeTime: schedule.wakeTime,
    });
    if (typeof window !== 'undefined') localStorage.removeItem('sleep_start_time');
    set({ activeSleepStart: null });
  },
}));
