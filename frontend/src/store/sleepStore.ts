import { create } from 'zustand';

export interface SleepEntry {
  id: string;
  userId: string;
  duration: number;
  sleepTime: string;
  wakeTime: string;
  quality: number;
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

  fetchLatest: (userId?: string) => Promise<void>;
  fetchHistory: (userId?: string) => Promise<void>;
  fetchSchedule: (userId?: string) => Promise<void>;
  fetchWeeklyQuality: (userId?: string) => Promise<void>;
  setSchedule: (userId: string, data: Partial<SleepSchedule>) => Promise<void>;
  addEntry: (userId: string, data: { duration: number; sleepTime: string; wakeTime: string }) => Promise<void>;

  // Sleep timer actions
  initTimer: () => void;
  startSleep: () => void;
  endSleep: (userId?: string) => Promise<void>;

  // Fallback: log sleep based purely on schedule (for users who didn't open app)
  endSleepFromSchedule: (userId?: string) => Promise<void>;
}

const API_BASE_URL = 'http://localhost:4000/sleep';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the ISO date string for today (YYYY-MM-DD) */
function todayDateStr() {
  return new Date().toISOString().slice(0, 10);
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

/** Returns true if today's sleep is already in latestEntry (same calendar day) */
export function sleptToday(latestEntry: SleepEntry | null): boolean {
  if (!latestEntry) return false;
  return latestEntry.createdAt.slice(0, 10) === todayDateStr();
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

  fetchLatest: async (userId = 'user-1') => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/latest?userId=${userId}`);
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

  fetchHistory: async (userId = 'user-1') => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/history?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      set({ history: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchSchedule: async (userId = 'user-1') => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/schedule?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        set({ schedule: data && data.userId ? data : null, isLoading: false });
      } else {
        set({ schedule: null, isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchWeeklyQuality: async (userId = 'user-1') => {
    try {
      const response = await fetch(`${API_BASE_URL}/weekly-quality?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        set({ weeklyQuality: data.score || 0 });
      }
    } catch (error) {
      console.error(error);
    }
  },

  setSchedule: async (userId: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });
      if (!response.ok) throw new Error('Failed to set schedule');
      const savedSchedule = await response.json();
      set({ schedule: savedSchedule, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (userId: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
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
    // Only restore if it's from today (don't carry over yesterday's stale timer)
    if (stored) {
      const startDate = stored.slice(0, 10);
      if (startDate === todayDateStr()) {
        set({ activeSleepStart: stored });
      } else {
        localStorage.removeItem('sleep_start_time');
      }
    }
  },

  startSleep: () => {
    const { latestEntry } = get();
    // Guard: already slept today
    if (sleptToday(latestEntry)) return;

    const now = new Date().toISOString();
    if (typeof window !== 'undefined') localStorage.setItem('sleep_start_time', now);
    set({ activeSleepStart: now });
  },

  endSleep: async (userId = 'user-1') => {
    const { activeSleepStart, addEntry, latestEntry } = get();

    // Guard: already logged today
    if (sleptToday(latestEntry)) {
      if (typeof window !== 'undefined') localStorage.removeItem('sleep_start_time');
      set({ activeSleepStart: null });
      return;
    }

    if (!activeSleepStart) return;

    const sleepStart = new Date(activeSleepStart);
    const wakeNow = new Date();
    const durationHours = parseFloat(
      ((wakeNow.getTime() - sleepStart.getTime()) / (1000 * 60 * 60)).toFixed(2)
    );

    await addEntry(userId, {
      duration: Math.max(0.1, durationHours), // min 0.1h to avoid zero
      sleepTime: fmt(sleepStart),
      wakeTime: fmt(wakeNow),
    });

    if (typeof window !== 'undefined') localStorage.removeItem('sleep_start_time');
    set({ activeSleepStart: null });
  },

  /**
   * Fallback logger: if user didn't open the app but had a schedule,
   * log the sleep based purely on scheduled sleep/wake times.
   * Call this from a "Did you sleep?" prompt or a daily check.
   */
  endSleepFromSchedule: async (userId = 'user-1') => {
    const { schedule, latestEntry, addEntry } = get();
    if (!schedule || sleptToday(latestEntry)) return;

    const sleepDate = parseHHMM(schedule.sleepTime);
    const wakeDate = parseHHMM(schedule.wakeTime);

    // If wake is before sleep (crosses midnight) — treat wake as next day
    if (wakeDate <= sleepDate) wakeDate.setDate(wakeDate.getDate() + 1);

    const durationHours = parseFloat(
      ((wakeDate.getTime() - sleepDate.getTime()) / (1000 * 60 * 60)).toFixed(2)
    );

    await addEntry(userId, {
      duration: durationHours,
      sleepTime: schedule.sleepTime,
      wakeTime: schedule.wakeTime,
    });

    if (typeof window !== 'undefined') localStorage.removeItem('sleep_start_time');
    set({ activeSleepStart: null });
  },
}));
