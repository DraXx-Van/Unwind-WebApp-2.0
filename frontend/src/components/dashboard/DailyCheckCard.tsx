'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMoodStore } from '@/store/moodStore';
import { useJournalStore } from '@/store/journalStore';
import { useStressStore } from '@/store/stressStore';
import { useSleepStore, sleptToday } from '@/store/sleepStore';
import { useAuthStore } from '@/store/authStore';
import {
  Sun, Moon, Sparkles, CheckCircle2, ArrowRight,
  ChevronRight, Zap, BedDouble, Wind, ThumbsUp, Leaf
} from 'lucide-react';

// ─── Mood helpers ─────────────────────────────────────────────────────────────
const MOOD_LABELS: Record<string, string> = {
  OVERWHELMED: 'Overwhelmed', LOW: 'Low', NEUTRAL: 'Calm',
  HAPPY: 'Happy', OVERJOYED: 'Overjoyed',
};
const MOOD_COLORS: Record<string, string> = {
  OVERWHELMED: '#A18FFF', LOW: '#FE814B', NEUTRAL: '#926247',
  HAPPY: '#FFCE5C', OVERJOYED: '#9BB068',
};

// ─── Formatting helpers ───────────────────────────────────────────────────────
function formatDuration(h: number) {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}
function isFromToday(dateStr: string) {
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

// ─── Priority type ────────────────────────────────────────────────────────────
type Priority =
  | 'poor_sleep'
  | 'no_sleep'
  | 'high_stress'
  | 'morning'
  | 'midday'
  | 'evening'
  | 'completed';

// ─── Priority logic ───────────────────────────────────────────────────────────
function derivePriority(opts: {
  hour: number;
  moodLogged: boolean;
  hasJournalToday: boolean;
  stressValue: number | null;
  sleepDuration: number | null;
  isSleepingNow: boolean;
}): Priority {
  const { hour, moodLogged, hasJournalToday, stressValue, sleepDuration, isSleepingNow } = opts;

  // 1a. Poor sleep — only surface in morning window (6AM-12PM)
  if (sleepDuration !== null && sleepDuration < 6 && hour >= 6 && hour < 12) return 'poor_sleep';

  // 1b. No sleep logged — only surface in morning window, and not while timer running
  if (sleepDuration === null && hour >= 6 && hour < 12 && !isSleepingNow) return 'no_sleep';

  // 2. High stress (>= 4)
  if (stressValue !== null && stressValue >= 4) return 'high_stress';

  // 3. Mood not logged → morning card
  if (!moodLogged) return 'morning';

  // 4. After 6 PM + mood logged → evening reflection
  if (hour >= 18 && moodLogged) return 'evening';

  // 5. All done
  if (moodLogged && hasJournalToday) return 'completed';

  // 6. Midday nudge
  return 'midday';
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DailyCheckCard() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const { todayMood, fetchTodayMood } = useMoodStore();
  const { journals, fetchJournals } = useJournalStore();
  const { latestEntry: stressEntry, fetchLatest: fetchStress } = useStressStore();
  const { latestEntry: sleepEntry, fetchLatest: fetchSleep, activeSleepStart, initTimer } = useSleepStore();

  // Only render on client (prevents hydration mismatch from localStorage reads)
  const [mounted, setMounted] = useState(false);
  // Dismissed cards: loaded from localStorage after mount
  const [gone, setGone] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Rehydrate dismissed set from localStorage (1-hour snooze)
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    const keys = ['poor_sleep', 'no_sleep', 'high_stress', 'midday', 'evening'];
    const goneSet = new Set<string>();

    keys.forEach((k) => {
      const stored = localStorage.getItem(`ucd_${k}`);
      if (stored) {
        const timestamp = parseInt(stored, 10);
        // If parsed correctly and less than 1 hour passed -> it remains gone
        if (!isNaN(timestamp) && (now - timestamp < ONE_HOUR)) {
          goneSet.add(k);
        }
      }
    });

    setGone(goneSet);
    setMounted(true);

    // Fetch all data fresh each time the dashboard mounts
    initTimer();
    fetchTodayMood();
    fetchJournals();
    if (userId) {
      fetchStress(userId);
      fetchSleep(userId);
    }
  }, [fetchTodayMood, fetchJournals, fetchStress, fetchSleep, initTimer, userId]);

  const dismiss = (key: string) => {
    localStorage.setItem(`ucd_${key}`, Date.now().toString());
    setGone((prev) => new Set([...prev, key]));
  };
  const isGone = (key: string) => gone.has(key);

  // Don't render anything until mounted (avoids SSR/client mismatch)
  if (!mounted) return null;

  // ── Derived state ──
  const moodLogged = !!todayMood?.mood;
  const moodLabel = moodLogged ? (MOOD_LABELS[todayMood.mood] ?? todayMood.mood) : '';
  const moodColor = moodLogged ? (MOOD_COLORS[todayMood.mood] ?? '#926247') : '#926247';

  const hasJournalToday = journals.some((j) => isFromToday(j.createdAt));

  const stressToday = stressEntry && isFromToday(stressEntry.createdAt)
    ? stressEntry.value : null;

  const sleepLoggedToday = sleptToday(sleepEntry);
  const sleepDuration = sleepLoggedToday ? (sleepEntry?.duration ?? null) : null;
  const isSleepingNow = !!activeSleepStart;

  const hour = new Date().getHours();

  const priority = derivePriority({
    hour, moodLogged, hasJournalToday,
    stressValue: stressToday,
    sleepDuration,
    isSleepingNow,
  });

  // ── COMPLETED ─────────────────────────────────────────────────────────────
  if (priority === 'completed') {
    return (
      <div className="mx-6 mb-2 rounded-[24px] overflow-hidden">
        <div className="bg-[#F0F7E8] border border-[#C5DDA5] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9BB068] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[#3B5C1A] font-bold text-[13px] flex items-center gap-1">You've completed today's check-ins <ThumbsUp className="w-3.5 h-3.5" /></p>
              <p className="text-[#3B5C1A]/60 text-[11px] font-medium">
                Feeling {moodLabel}
                {stressToday !== null ? ` · Stress ${stressToday}/5` : ''}
                {' · Journal done'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── POOR SLEEP ────────────────────────────────────────────────────────────
  if (priority === 'poor_sleep' && !isGone('poor_sleep')) {
    return (
      <div className="mx-6 mb-2 rounded-[28px] overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-[#1A1A3E] to-[#2E2060] px-5 py-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-[#A89CFC]" />
              <span className="text-[#A89CFC] text-[11px] font-bold uppercase tracking-widest">Sleep Insight</span>
            </div>
            <button onClick={() => dismiss('poor_sleep')} className="text-white/30 text-xs hover:text-white/60 transition-colors">✕</button>
          </div>
          <h3 className="text-white font-bold text-[17px] leading-snug mb-1 flex items-center gap-1.5">
            You slept {formatDuration(sleepDuration!)} last night <BedDouble className="w-5 h-5 opacity-80" />
          </h3>
          <p className="text-white/60 text-[12px] mb-5">
            That's below the recommended 7–8 hours. Take it slow today.
          </p>
          <div className="flex gap-3">
            <Link href="/mindful/add"
              className="flex-1 bg-white text-[#2E2060] py-3 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all">
              Try a mindful break <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/sleep/stats"
              className="px-4 py-3 rounded-full bg-white/10 text-white/70 font-bold text-[12px] flex items-center justify-center hover:bg-white/20 transition-colors">
              View Stats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── NO SLEEP LOGGED (6AM–12PM only) ───────────────────────────────────────
  if (priority === 'no_sleep' && !isGone('no_sleep')) {
    return (
      <div className="mx-6 mb-2 rounded-[28px] overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-[#2E2060] to-[#4B3425] px-5 py-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#A89CFC]" />
              <span className="text-[#A89CFC] text-[11px] font-bold uppercase tracking-widest">Sleep Awareness</span>
            </div>
            <button onClick={() => dismiss('no_sleep')} className="text-white/30 text-xs hover:text-white/60 transition-colors">✕</button>
          </div>
          <h3 className="text-white font-bold text-[17px] leading-snug mb-1 flex items-center gap-1.5">
            We couldn't track your sleep last night <Moon className="w-5 h-5 opacity-80" />
          </h3>
          <p className="text-white/60 text-[12px] mb-5">
            Set a sleep schedule so Unwind can help you build a consistent routine.
          </p>
          <Link href="/sleep/schedule"
            className="w-full bg-white text-[#4B3425] py-3 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all">
            Set sleep schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ── HIGH STRESS ───────────────────────────────────────────────────────────
  if (priority === 'high_stress' && !isGone('high_stress')) {
    return (
      <div className="mx-6 mb-2 rounded-[28px] overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-[#5C1A0A] to-[#A4431B] px-5 py-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFCE5C]" />
              <span className="text-[#FFCE5C] text-[11px] font-bold uppercase tracking-widest">Stress Alert</span>
            </div>
            <button onClick={() => dismiss('high_stress')} className="text-white/30 text-xs hover:text-white/60 transition-colors">✕</button>
          </div>
          <h3 className="text-white font-bold text-[17px] leading-snug mb-1 flex items-center gap-1.5">
            You seem a bit stressed today <Zap className="w-5 h-5 text-[#FFCE5C]" />
          </h3>
          <p className="text-white/60 text-[12px] mb-5">
            Stress level at {stressToday}/5
            {stressEntry?.stressor && stressEntry.stressor !== 'None' ? ` · ${stressEntry.stressor}` : ''}.
            {' '}Writing it out or taking a breather can help.
          </p>
          <div className="flex gap-3">
            <Link href="/journal/new"
              className="flex-1 bg-white text-[#A4431B] py-3 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all">
              Write it out <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/mindful/add"
              className="px-4 py-3 rounded-full bg-white/10 text-white/80 font-bold text-[12px] flex items-center justify-center gap-1 hover:bg-white/20 transition-colors">
              <Wind className="w-3.5 h-3.5" /> Breathe
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── EVENING ───────────────────────────────────────────────────────────────
  if (priority === 'evening' && !isGone('evening')) {
    const stressNotLogged = stressToday === null;
    const journalMissing = !hasJournalToday;
    const logsMissing = stressNotLogged || journalMissing;

    return (
      <div className="mx-6 mb-2 rounded-[28px] overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-[#2E2060] to-[#4B3425] px-5 py-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-white/70" />
              <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Evening Reflection</span>
            </div>
            <button onClick={() => dismiss('evening')} className="text-white/30 text-xs hover:text-white/60 transition-colors">✕</button>
          </div>
          <h3 className="text-white font-bold text-[17px] leading-snug mb-1">How did your day go?</h3>
          <p className="text-white/60 text-[12px] mb-5">
            You logged feeling{' '}
            <span style={{ color: moodColor }} className="font-bold">{moodLabel}</span>
            {' '}this morning.
            {logsMissing
              ? " But you still haven't finished your daily logs! Take a moment before bed."
              : " Want to update it?"}
          </p>

          {/* Missing Logs Prompts */}
          {journalMissing && (
            <Link href="/journal/new"
              className="w-full bg-[#FE814B] text-white py-2.5 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all mb-3">
              Write Daily Journal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {stressNotLogged && (
            <Link href="/stress/add"
              className="w-full border border-white/20 bg-transparent text-[#FFCE5C] py-2.5 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors mb-5">
              <Zap className="w-3.5 h-3.5" /> Log Stress Level
            </Link>
          )}
          <div className="flex gap-3">
            <Link href="/mood/check-in"
              className="flex-1 bg-white text-[#4B3425] py-3 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all">
              Update Mood <ChevronRight className="w-4 h-4" />
            </Link>
            <button onClick={() => dismiss('evening')}
              className="px-4 py-3 rounded-full bg-white/10 text-white/70 font-bold text-[12px] hover:bg-white/20 transition-colors">
              Keep same
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MIDDAY ────────────────────────────────────────────────────────────────
  if (priority === 'midday' && !isGone('midday')) {
    const stressNotLogged = stressToday === null;
    const bothMissing = stressNotLogged && !hasJournalToday;

    return (
      <div className="mx-6 mb-2 rounded-[28px] overflow-hidden shadow-sm">
        <div className="bg-[#FFF8F0] border border-[#FDE0C8] px-5 py-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#FE814B]" />
              <span className="text-[#FE814B] text-[11px] font-bold uppercase tracking-widest">Midday Nudge</span>
            </div>
            <button onClick={() => dismiss('midday')} className="text-[#4B3425]/30 text-xs hover:text-[#4B3425]/60 transition-colors">✕</button>
          </div>
          <h3 className="text-[#4B3425] font-bold text-[16px] mb-1 flex items-center gap-1.5">
            {bothMissing ? "Your daily logs are empty" : "Take a small break today"} <Leaf className="w-4 h-4 text-[#8da666]" />
          </h3>
          <p className="text-[#4B3425]/60 text-[12px] mb-4">
            {bothMissing
              ? "You haven't logged your stress or written a journal entry yet today. Take 2 minutes to reflect."
              : stressNotLogged
                ? "Haven't logged stress yet? Take a moment to check in."
                : "Want to write how you're feeling? A quick journal entry goes a long way."}
          </p>
          <div className="flex gap-3 mb-2">
            <Link href="/journal/new"
              className="flex-1 bg-[#FE814B] text-white py-3 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all">
              Write a note <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/mindful/add"
              className="px-4 py-3 rounded-full bg-[#FE814B]/10 text-[#FE814B] font-bold text-[12px] flex items-center justify-center hover:bg-[#FE814B]/20 transition-colors">
              Be Mindful
            </Link>
          </div>
          {stressNotLogged && (
            <Link href="/stress/add"
              className="w-full border border-[#FDE0C8] bg-transparent text-[#FE814B] py-2.5 rounded-full font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-[#FE814B]/5 transition-colors">
              <Zap className="w-3.5 h-3.5" /> Log Stress Level
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ── MORNING (default — mood not logged) ───────────────────────────────────
  if (priority === 'morning') {
    return (
      <div className="mx-6 mb-2 rounded-[28px] overflow-hidden shadow-md">
        <div className="px-5 py-5"
          style={{ background: 'linear-gradient(135deg, #4F3422 0%, #7A5236 100%)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#FFCE5C]" />
            <span className="text-[#FFCE5C] text-[11px] font-bold uppercase tracking-widest">Daily Check</span>
          </div>
          <h3 className="text-white font-bold text-[19px] leading-snug mb-1">
            Start your day with a quick check-in
          </h3>
          <p className="text-white/60 text-[12px] mb-5">How are you feeling today? Takes 10 seconds.</p>
          <Link href="/mood/check-in"
            className="w-full bg-white text-[#4B3425] py-3.5 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-sm">
            Log Mood <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Dismissed or no relevant card → render nothing
  return null;
}
