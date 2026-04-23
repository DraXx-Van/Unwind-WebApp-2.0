'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMoodStore } from '@/store/moodStore';
import { useJournalStore } from '@/store/journalStore';
import { useStressStore } from '@/store/stressStore';
import { useSleepStore, sleptToday } from '@/store/sleepStore';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import {
  Sun, Moon, Sparkles, CheckCircle2, ArrowRight,
  ChevronRight, Zap, BedDouble, Wind, PenLine, ThumbsUp, Leaf
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

  if (sleepDuration !== null && sleepDuration < 6 && hour >= 6 && hour < 12) return 'poor_sleep';
  if (sleepDuration === null && hour >= 6 && hour < 12 && !isSleepingNow) return 'no_sleep';
  if (stressValue !== null && stressValue >= 4) return 'high_stress';
  if (!moodLogged) return 'morning';
  if (hour >= 18 && moodLogged) return 'evening';
  if (moodLogged && hasJournalToday) return 'completed';
  return 'midday';
}

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

// Reusable Prompt Card Component
const PromptCard = ({ icon: Icon, tag, title, subtitle, actionLabel, actionLink, onDismiss, color, bg, secondaryAction }: any) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="mx-6 mb-4 bg-white rounded-[32px] p-6 shadow-[0_15px_40px_rgba(75,52,37,0.08)] border border-[#4B3425]/5 flex flex-col relative overflow-hidden"
  >
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className={`${color} text-[10px] font-black uppercase tracking-[0.2em]`}>{tag}</p>
          <h3 className="text-[#4B3425] font-black text-xl leading-tight mt-1">{title}</h3>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="w-8 h-8 rounded-full bg-[#4B3425]/5 flex items-center justify-center text-[#4B3425]/30 hover:bg-[#4B3425]/10 transition-colors">
           ✕
        </button>
      )}
    </div>

    <p className="text-[#4B3425]/50 text-sm font-bold mb-6 leading-relaxed">
      {subtitle}
    </p>

    <div className="flex gap-3">
      <Link href={actionLink} className="flex-1 bg-[#4B3425] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
        {actionLabel} <ArrowRight className="w-4 h-4" />
      </Link>
      {secondaryAction && (
        <Link href={secondaryAction.link} className="px-5 py-4 rounded-2xl bg-[#4B3425]/5 text-[#4B3425] font-black text-sm flex items-center justify-center transition-colors hover:bg-[#4B3425]/10">
          {secondaryAction.label}
        </Link>
      )}
    </div>
  </motion.div>
);

export function DailyCheckCard() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const { todayMood, fetchTodayMood } = useMoodStore();
  const { journals, fetchJournals } = useJournalStore();
  const { latestEntry: stressEntry, fetchLatest: fetchStress } = useStressStore();
  const { latestEntry: sleepEntry, fetchLatest: fetchSleep, activeSleepStart, initTimer } = useSleepStore();

  const [mounted, setMounted] = useState(false);
  const [gone, setGone] = useState<Set<string>>(new Set());

  useEffect(() => {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    const keys = ['poor_sleep', 'no_sleep', 'high_stress', 'midday', 'evening'];
    const goneSet = new Set<string>();

    keys.forEach((k) => {
      const stored = localStorage.getItem(`ucd_${k}`);
      if (stored) {
        const timestamp = parseInt(stored, 10);
        if (!isNaN(timestamp) && (now - timestamp < ONE_HOUR)) {
          goneSet.add(k);
        }
      }
    });

    setGone(goneSet);
    setMounted(true);
    initTimer();
  }, [initTimer]);

  const dismiss = (key: string) => {
    localStorage.setItem(`ucd_${key}`, Date.now().toString());
    setGone((prev) => new Set([...prev, key]));
  };
  const isGone = (key: string) => gone.has(key);

  if (!mounted) return null;

  const moodLogged = !!todayMood?.mood;
  const moodLabel = moodLogged ? (MOOD_LABELS[todayMood.mood] ?? todayMood.mood) : '';
  const hasJournalToday = journals.some((j) => isFromToday(j.createdAt));
  const stressToday = stressEntry && isFromToday(stressEntry.createdAt) ? stressEntry.value : null;
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
  if (priority === 'completed') {
    return (
      <div className="mx-6 mb-2 rounded-[28px] bg-[#9BB068]/5 border border-[#9BB068]/10 px-6 py-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#9BB068] flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-[#4B3425] font-black text-base flex items-center gap-2">All caught up! <ThumbsUp className="w-4 h-4 text-[#9BB068]" /></h4>
          <p className="text-[#4B3425]/40 text-xs font-bold mt-1">
            Feeling {moodLabel} · {stressToday !== null ? `Stress ${stressToday}/5` : 'Balanced'}
          </p>
        </div>
      </div>
    );
  }

  // ── POOR SLEEP ────────────────────────────────────────────────────────────
  if (priority === 'poor_sleep' && !isGone('poor_sleep')) {
    return (
      <PromptCard 
        icon={BedDouble}
        tag="Sleep Insight"
        title={`You slept ${formatDuration(sleepDuration!)}`}
        subtitle="That's below the recommended 7–8 hours. Take a short mindful break to recharge your focus."
        actionLabel="Recharge"
        actionLink="/library?category=sleep"
        onDismiss={() => dismiss('poor_sleep')}
        color="text-[#7C6AFF]"
        bg="bg-[#EEF0FF]"
        secondaryAction={{ label: "Stats", link: "/sleep/stats" }}
      />
    );
  }

  // ── NO SLEEP LOGGED ───────────────────────────────────────────────────────
  if (priority === 'no_sleep' && !isGone('no_sleep')) {
    return (
      <PromptCard 
        icon={Moon}
        tag="Sleep Awareness"
        title="Missed your sleep tracking?"
        subtitle="Set a sleep schedule so Unwind can help you build a consistent routine and track your recovery."
        actionLabel="Set Schedule"
        actionLink="/sleep/schedule"
        onDismiss={() => dismiss('no_sleep')}
        color="text-[#7C6AFF]"
        bg="bg-[#EEF0FF]"
      />
    );
  }

  // ── HIGH STRESS ───────────────────────────────────────────────────────────
  if (priority === 'high_stress' && !isGone('high_stress')) {
    return (
      <PromptCard 
        icon={Zap}
        tag="Stress Alert"
        title="High stress detected"
        subtitle={`Your stress level is at ${stressToday}/5. Writing it out or taking a deep breather can help calm your mind.`}
        actionLabel="Write Note"
        actionLink="/journal/new"
        onDismiss={() => dismiss('high_stress')}
        color="text-[#FE814B]"
        bg="bg-[#FFF3ED]"
        secondaryAction={{ label: "Breathe", link: "/library?category=stress" }}
      />
    );
  }

  // ── EVENING ───────────────────────────────────────────────────────────────
  if (priority === 'evening' && !isGone('evening')) {
    const logsMissing = stressToday === null || !hasJournalToday;
    return (
      <PromptCard 
        icon={Moon}
        tag="Evening Reflection"
        title="Time to unwind?"
        subtitle={logsMissing 
          ? "You haven't finished your daily logs yet. Take a moment to reflect before your day ends."
          : `You felt ${moodLabel} this morning. Want to update your mood before bed?`}
        actionLabel={logsMissing ? "Finish Logs" : "Update Mood"}
        actionLink={logsMissing ? "/journal/new" : "/mood/check-in"}
        onDismiss={() => dismiss('evening')}
        color="text-[#926247]"
        bg="bg-[#F5F0EC]"
      />
    );
  }

  // ── MIDDAY ────────────────────────────────────────────────────────────────
  if (priority === 'midday' && !isGone('midday')) {
    const stressNotLogged = stressToday === null;
    const bothMissing = stressNotLogged && !hasJournalToday;
    return (
      <PromptCard 
        icon={Sun}
        tag="Midday Nudge"
        title={bothMissing ? "Empty daily logs" : "Take a small break"}
        subtitle={bothMissing
          ? "You haven't logged your stress or written a journal entry yet today. Take 2 minutes to reflect."
          : "Feeling productive? A quick check-in helps maintain your mental clarity."}
        actionLabel="Check-in"
        actionLink="/journal/new"
        onDismiss={() => dismiss('midday')}
        color="text-[#FE814B]"
        bg="bg-[#FFF3ED]"
        secondaryAction={{ label: "Library", link: "/library" }}
      />
    );
  }

  // ── MORNING (default) ─────────────────────────────────────────────────────
  if (priority === 'morning') {
    return (
      <PromptCard 
        icon={Sparkles}
        tag="Morning Daily Check"
        title="Start your day right"
        subtitle="How are you feeling this morning? A quick mood check-in takes only 10 seconds."
        actionLabel="Log Mood"
        actionLink="/mood/check-in"
        color="text-[#9BB068]"
        bg="bg-[#F0F7E8]"
      />
    );
  }

  return null;
}
