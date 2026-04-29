import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MOOD_VALUES: Record<string, number> = {
  OVERWHELMED: 1, LOW: 2, NEUTRAL: 3, HAPPY: 4, OVERJOYED: 5,
};

// ─── Task Pool ─────────────────────────────────────────────────────────────────
// type: 'mindful' | 'journal' | 'real' | 'system'
// actionLink is optional — real-life tasks have none
const TASK_POOL = {
  mindful: [
    { id: 'm1', title: 'Breathing exercise', description: 'Regulate your heart rate with 2 mins of deep box breathing.', type: 'mindful', actionLink: '/mindful/add', context: 'When you feel your heart racing, box breathing acts as a natural reset for your nervous system.' },
    { id: 'm2', title: '5-minute relaxation', description: 'A short guided session to restore your mental energy.', type: 'mindful', actionLink: '/mindful/add', context: 'Sustained focus drains your battery; 5 mins of silence restores cognitive clarity.' },
    { id: 'm3', title: 'Focus timer', description: 'Block distractions with a focused 25-min work session.', type: 'mindful', actionLink: '/mindful/add', context: 'Overwhelm often comes from multitasking. Focusing on ONE thing reduces mental friction.' },
    { id: 'm4', title: 'Body scan session', description: 'Check in with how your body feels right now.', type: 'mindful', actionLink: '/mindful/add', context: 'Stress often hides in your shoulders or jaw. Finding it is the first step to releasing it.' },
  ],
  journal: [
    { id: 'j1', title: 'Write it out', description: "Externalize what's on your mind today.", type: 'journal', actionLink: '/journal/new', context: 'Your brain is for having ideas, not for holding them. Clearing your head reduces anxiety.' },
    { id: 'j2', title: 'Gratitude journal', description: 'Write 3 things you are grateful for today.', type: 'journal', actionLink: '/journal/new', context: 'Gratitude retrains your brain to scan for positives instead of threats.' },
    { id: 'j3', title: 'Write one win', description: 'Note one small victory from today.', type: 'journal', actionLink: '/journal/new', context: 'Celebrating small wins triggers dopamine, boosting your resilience for bigger challenges.' },
    { id: 'j4', title: 'Reflect on your day', description: 'A few lines about how your day has been.', type: 'journal', actionLink: '/journal/new', context: 'Reflection turns raw experience into wisdom and perspective.' },
  ],
  real: [
    { id: 'r1', title: 'Take a 5-minute break', description: 'Step away from your screen and stretch.', type: 'real', context: 'Physical movement breaks the cycle of mental stagnation.' },
    { id: 'r2', title: 'Drink a glass of water', description: 'Hydrate to help regulate your energy.', type: 'real', context: "Dehydration mimics the symptoms of anxiety. Water is often the simplest fix." },
    { id: 'r3', title: 'Talk to someone you trust', description: 'A quick chat with a friend or family member.', type: 'real', context: 'Human connection is the fastest way to lower cortisol levels.' },
    { id: 'r4', title: 'Go for a short walk', description: '5 minutes outside can shift your perspective.', type: 'real', context: 'Changing your environment can immediately interrupt a negative thought loop.' },
    { id: 'r5', title: 'Avoid screens 20 min before bed', description: 'Wind down without your phone tonight.', type: 'real', context: 'Blue light suppresses melatonin, making it harder for your brain to truly rest.' },
    { id: 'r6', title: 'Sleep 30 minutes earlier', description: 'Small shift, big impact on tomorrow.', type: 'real', context: 'Sleep is your brain’s garbage disposal system. Give it more time to work.' },
    { id: 'r7', title: 'Take 5 deep breaths', description: 'Pause, breathe in for 4, out for 6.', type: 'real', context: 'Exhaling longer than you inhale signals safety to your brain.' },
  ],
  system: [
    { id: 's1', title: 'Log your stress level', description: 'Check your load today.', type: 'system', actionLink: '/stress/add', context: 'Awareness is 50% of the solution. Identify the stress before it identifies you.' },
    { id: 's2', title: 'Log your mood', description: 'How are you feeling right now?', type: 'system', actionLink: '/mood/check-in', context: 'Naming an emotion reduces its intensity in the brain.' },
    { id: 's3', title: 'Set a sleep schedule', description: 'Build a consistent routine.', type: 'system', actionLink: '/sleep/schedule', context: 'Circadian rhythm thrives on consistency, not just total hours.' },
  ],
};

// ─── Seeded PRNG (same output all day, resets at midnight) ──────────────────
function dateSeed(userId?: string): number {
  const d = new Date();
  const base = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  if (!userId) return base;

  // Simple hash for string userId
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  return base + Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  // Simple LCG: next = (a * seed + c) % m
  let s = seed;
  return () => {
    s = (1664525 * s + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n = 1, rng: () => number = Math.random): T[] {
  return shuffle(arr, rng).slice(0, n);
}

@Injectable()
export class InsightsService {
  constructor(private prisma: PrismaService) {}

  async getTodayInsights(userId: string) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

    const [
      todayMood, todayStress, todaySleepRaw,
      moodHistoryAll, stressHistoryAll, sleepHistoryAll,
      mindfulSessionsAll, journalEntriesAll,
      recentStress, prevStress,
      recentMood, prevMood,
      sleepSchedule, latestAssessment, lastSleepEver,
    ] = await Promise.all([
      // Today's data
      this.prisma.dailyMood.findFirst({ where: { userId, date: { gte: startOfDay } }, orderBy: { date: 'desc' } }),
      this.prisma.stressEntry.findFirst({ where: { userId, createdAt: { gte: startOfDay } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.sleepEntry.findFirst({ where: { userId, createdAt: { gte: startOfDay } }, orderBy: { createdAt: 'desc' } }),
      // 14-day history to compare Current Week vs Previous Week
      this.prisma.dailyMood.findMany({ where: { userId, date: { gte: fourteenDaysAgo } }, orderBy: { date: 'desc' } }),
      this.prisma.stressEntry.findMany({ where: { userId, createdAt: { gte: fourteenDaysAgo } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.sleepEntry.findMany({ where: { userId, createdAt: { gte: fourteenDaysAgo } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.mindfulSession.findMany({ where: { userId, createdAt: { gte: fourteenDaysAgo } } }),
      this.prisma.journal.findMany({ where: { userId, createdAt: { gte: fourteenDaysAgo } } }),
      // Trend (3-day vs 3-6 day window for granular insights)
      this.prisma.stressEntry.findMany({ where: { userId, createdAt: { gte: threeDaysAgo } } }),
      this.prisma.stressEntry.findMany({ where: { userId, createdAt: { gte: sixDaysAgo, lt: threeDaysAgo } } }),
      this.prisma.dailyMood.findMany({ where: { userId, date: { gte: threeDaysAgo } } }),
      this.prisma.dailyMood.findMany({ where: { userId, date: { gte: sixDaysAgo, lt: threeDaysAgo } } }),
      // Fallback sources
      this.prisma.sleepSchedule.findFirst({ where: { userId } }),
      this.prisma.assessment.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      this.prisma.sleepEntry.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    ]);

    // ── Split data into Current Week (0-7 days) and Previous Week (7-14 days) ──
    const filterCurrent = (list: any[]) => list.filter(item => {
      const d = new Date(item.date || item.createdAt);
      return d >= sevenDaysAgo;
    });
    const filterPrevious = (list: any[]) => list.filter(item => {
      const d = new Date(item.date || item.createdAt);
      return d < sevenDaysAgo && d >= fourteenDaysAgo;
    });

    const moodHistory = filterCurrent(moodHistoryAll);
    const stressHistory = filterCurrent(stressHistoryAll);
    const sleepHistory = filterCurrent(sleepHistoryAll);
    const mindfulSessions = filterCurrent(mindfulSessionsAll);
    const journalEntries = filterCurrent(journalEntriesAll);

    const moodHistoryPrev = filterPrevious(moodHistoryAll);
    const stressHistoryPrev = filterPrevious(stressHistoryAll);
    const sleepHistoryPrev = filterPrevious(sleepHistoryAll);
    const mindfulSessionsPrev = filterPrevious(mindfulSessionsAll);
    const journalEntriesPrev = filterPrevious(journalEntriesAll);

    // ── Sleep Fallback Logic ─────────────────────────────────────────────────
    let todaySleep = todaySleepRaw;
    let sleepIsEstimated = false;

    if (!todaySleep) {
      if (sleepSchedule) {
        const [sh, sm] = sleepSchedule.sleepTime.split(':').map(Number);
        const [wh, wm] = sleepSchedule.wakeTime.split(':').map(Number);
        let durationHours = (wh * 60 + wm - (sh * 60 + sm)) / 60;
        if (durationHours <= 0) durationHours += 24; 
        let q = 0;
        if (durationHours < 4) q = (durationHours / 4) * 40;
        else if (durationHours < 7) q = 40 + ((durationHours - 4) / 3) * 40;
        else if (durationHours <= 9) q = 80 + ((durationHours - 7) / 2) * 20;
        else q = Math.max(70, 100 - (durationHours - 9) * 10);
        todaySleep = { id: 'estimated', userId, duration: durationHours, quality: Math.round(q), sleepTime: sleepSchedule.sleepTime, wakeTime: sleepSchedule.wakeTime, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any;
        sleepIsEstimated = true;
      } else if (lastSleepEver) {
        todaySleep = lastSleepEver;
        sleepIsEstimated = true;
      } else if (latestAssessment?.sleepQuality) {
        todaySleep = { id: 'estimated', userId, duration: latestAssessment.sleepQuality * 1.5 + 3, quality: latestAssessment.sleepQuality * 20, sleepTime: '00:00', wakeTime: '07:00', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any;
        sleepIsEstimated = true;
      }
    }

    const effectiveSleepHistory = sleepHistory.length > 0 ? sleepHistory : (todaySleep ? [todaySleep] : []);
    
    // Calculate Current Score
    const currentRes = this.calculateScoreRaw({ 
      moodHistory, stressHistory, sleepHistory: effectiveSleepHistory, mindfulSessions, journalEntries 
    });

    // Calculate Previous Score for Real Trend
    const prevRes = this.calculateScoreRaw({
      moodHistory: moodHistoryPrev,
      stressHistory: stressHistoryPrev,
      sleepHistory: sleepHistoryPrev,
      mindfulSessions: mindfulSessionsPrev,
      journalEntries: journalEntriesPrev
    });

    // Real Delta: Current - Previous
    // If no previous data, delta is 0
    const delta = prevRes.value !== null ? Math.round(currentRes.value - prevRes.value) : 0;

    const hasData = !!(todayMood || todayStress || todaySleepRaw);
    const hasEnoughData = !!(todayMood && (todayStress || todaySleepRaw));

    const insights = hasData
      ? this.generateInsights({
          todayMood, todayStress, todaySleep: todaySleepRaw,
          sleepHistory, mindfulSessions, journalEntries,
          recentStress, prevStress, recentMood, prevMood,
          userId
        })
      : [];

    const tasks = hasData
      ? this.generateTasks({ todayMood, todayStress, todaySleep: todaySleepRaw, mindfulSessions, journalEntries, userId })
      : [];

    const weeklyMoodAvg = moodHistory.length > 0
      ? moodHistory.reduce((s, m) => s + (MOOD_VALUES[m.mood] ?? 3), 0) / moodHistory.length
      : null;
    const weeklyStressAvg = stressHistory.length > 0
      ? stressHistory.reduce((s, e) => s + e.value, 0) / stressHistory.length
      : null;
    const weeklySleepAvg = effectiveSleepHistory.length > 0
      ? effectiveSleepHistory.reduce((s, e) => s + e.duration, 0) / effectiveSleepHistory.length
      : null;

    return {
      score: currentRes.value ?? null,
      label: currentRes.incomplete ? null : currentRes.label,
      delta: currentRes.incomplete ? 0 : delta,
      scoreIncomplete: currentRes.incomplete,
      insights, tasks,
      sleepIsEstimated,
      today: { mood: todayMood, stress: todayStress, sleep: todaySleepRaw },
      weekly: { mood: weeklyMoodAvg, stress: weeklyStressAvg, sleep: weeklySleepAvg },
      state: !hasData ? 'empty' : !hasEnoughData ? 'partial' : 'ready',
    };
  }

  // ─── Score ──────────────────────────────────────────────────────────────────
  private calculateScoreRaw(data: { moodHistory: any[]; stressHistory: any[]; sleepHistory: any[]; mindfulSessions: any[]; journalEntries: any[] }) {
    const { moodHistory, stressHistory, sleepHistory, mindfulSessions, journalEntries } = data;

    if (moodHistory.length === 0 || stressHistory.length === 0) {
      return { value: null as any, label: 'Incomplete', incomplete: true };
    }

    const avgMood = moodHistory.reduce((s, m) => s + (MOOD_VALUES[m.mood] ?? 3), 0) / moodHistory.length;
    const moodScore = Math.round(((avgMood - 1) / 4) * 20);

    const avgStress = stressHistory.reduce((s, e) => s + e.value, 0) / stressHistory.length;
    const stressPenalty = Math.round((avgStress / 5) * 20);

    const avgSleep = sleepHistory.length > 0
      ? sleepHistory.reduce((s, e) => s + e.duration, 0) / sleepHistory.length : 6;
    const sleepScore = Math.min(20, Math.round((avgSleep / 8) * 20));

    const mindfulScore = Math.min(20, Math.round((mindfulSessions.length / 7) * 20));
    const journalScore = Math.min(20, Math.round((journalEntries.length / 7) * 20));

    const raw = moodScore + sleepScore + mindfulScore + journalScore - stressPenalty;
    const value = Math.max(0, Math.min(100, raw + 40));

    let label = 'Struggling';
    if (value >= 80) label = 'Thriving';
    else if (value >= 65) label = 'Stable';
    else if (value >= 50) label = 'Okay';
    else if (value >= 35) label = 'Low';

    return { value, label, incomplete: false };
  }

  // ─── Insights (progressive: real data + CTA log-prompts) ────────────────────
  private generateInsights(data: {
    todayMood: any; todayStress: any; todaySleep: any;
    sleepHistory: any[]; mindfulSessions: any[]; journalEntries: any[];
    recentStress: any[]; prevStress: any[];
    recentMood: any[]; prevMood: any[];
    userId?: string;
  }) {
    type Insight = { icon: string; title: string; subtitle: string; positive: boolean; isLogPrompt?: boolean; actionLink?: string };
    const real: Insight[] = [];

    const sleepDur = data.todaySleep?.duration ?? null;
    const stressVal = data.todayStress?.value ?? null;
    const moodVal = data.todayMood ? (MOOD_VALUES[data.todayMood.mood] ?? 3) : null;

    const avgRecentStress = data.recentStress.length > 0
      ? data.recentStress.reduce((s, e) => s + e.value, 0) / data.recentStress.length : null;
    const avgPrevStress = data.prevStress.length > 0
      ? data.prevStress.reduce((s, e) => s + e.value, 0) / data.prevStress.length : null;
    const avgRecentMood = data.recentMood.length > 0
      ? data.recentMood.reduce((s, m) => s + (MOOD_VALUES[m.mood] ?? 3), 0) / data.recentMood.length : null;
    const avgPrevMood = data.prevMood.length > 0
      ? data.prevMood.reduce((s, m) => s + (MOOD_VALUES[m.mood] ?? 3), 0) / data.prevMood.length : null;

    const journalStreak = this.calcJournalStreak(data.journalEntries);
    const mindfulToday = data.mindfulSessions.filter(s => {
      const d = new Date(s.createdAt);
      const today = new Date();
      return d.getFullYear() === today.getFullYear() &&
             d.getMonth() === today.getMonth() &&
             d.getDate() === today.getDate();
    });
    const mindfulTodayMins = mindfulToday.reduce((sum, s) => sum + (s.duration ?? 0), 0);
    const mindfulCount7 = data.mindfulSessions.length;

    // Day seed used to rotate copy variations once per day per user
    const seed = dateSeed(data.userId);
    const pick1 = <T>(arr: T[]): T => arr[seed % arr.length];

    const loggedCount = [data.todayMood, data.todayStress, data.todaySleep].filter(Boolean).length;
    const maxReal = loggedCount;

    const stressor = data.todayStress?.stressor && data.todayStress.stressor !== 'None'
      ? ` — ${data.todayStress.stressor}` : '';

    // ── LAYER 3: Cross-variable combos (highest priority) ────────────────────
    // Pattern: Mood dip linked to sleep
    if (real.length < maxReal && avgRecentMood !== null && avgPrevMood !== null && avgRecentMood < avgPrevMood - 0.3) {
        const avgRecentSleep = data.sleepHistory.length > 0 ? data.sleepHistory.reduce((s, e) => s + e.duration, 0) / data.sleepHistory.length : null;
        if (avgRecentSleep !== null && avgRecentSleep < 6.5) {
            real.push({ 
                icon: 'combo', 
                positive: false, 
                actionLink: '/sleep/stats',
                title: 'Sleep-Mood Correlation', 
                subtitle: `Your mood dipped this week while averaging only ${avgRecentSleep.toFixed(1)}h of sleep. Focus on rest tonight.` 
            });
        }
    }

    if (real.length < maxReal && sleepDur !== null && sleepDur < 6 && stressVal !== null && stressVal >= 4) {
      real.push({ icon: 'combo', positive: false, actionLink: '/sleep/stats', ...pick1([
        { title: 'Tough combination today', subtitle: 'Low sleep + high stress is draining. Prioritise rest and a short break today.' },
        { title: 'Running on empty today', subtitle: `${this.fmtDuration(sleepDur)} of sleep and stress at ${stressVal}/5 — go gentle with yourself.` },
      ])});
    }
    
    // Pattern: High stress linked to journal omission
    if (real.length < maxReal && stressVal !== null && stressVal >= 4 && data.journalEntries.length === 0) {
        real.push({
            icon: 'journal',
            positive: false,
            actionLink: '/journal/new',
            title: 'Unprocessed Stress',
            subtitle: "You're stressed but haven't journaled in 7 days. Writing it out can reduce the 'mental volume' of your worries."
        });
    }

    if (real.length < maxReal && moodVal !== null && moodVal <= 2 && data.journalEntries.length === 0) {
      real.push({ icon: 'mood', positive: false, actionLink: '/journal/new', ...pick1([
        { title: 'Writing could help right now', subtitle: "Your mood is low and you haven't journaled lately. Putting words to feelings helps." },
        { title: "Feeling heavy? Write it out", subtitle: "Low mood + no journaling recently — try writing one honest sentence. It helps." },
      ])});
    }
    if (real.length < maxReal && stressVal !== null && stressVal >= 4 && mindfulCount7 === 0) {
      real.push({ icon: 'stress', positive: false, actionLink: '/mindful/add', ...pick1([
        { title: 'A breather could go a long way', subtitle: "You're stressed but haven't done any mindful sessions. Even 2 minutes counts." },
        { title: 'Stress without a reset is rough', subtitle: 'No mindful sessions yet this week. A 5-min breathing exercise can shift your state.' },
      ])});
    }

    // ── LAYER 2: Trend-based (second priority — more interesting than today's snapshot) ──
    if (real.length < maxReal && avgRecentStress !== null && avgRecentStress >= 4) {
      real.push({ icon: 'stress', positive: false, actionLink: '/stress/stats', ...pick1([
        { title: "You've been stressed for a few days", subtitle: `Averaging ${avgRecentStress.toFixed(1)}/5 recently. Consistent stress signals a need for a recovery day.` },
        { title: 'Several high-stress days in a row', subtitle: "Sustained stress is tiring. Look at what's driving it — your trend shows the pattern." },
      ])});
    }
    if (real.length < maxReal && avgRecentMood !== null && avgPrevMood !== null) {
      if (avgRecentMood < avgPrevMood - 0.5) {
        real.push({ icon: 'mood', positive: false, actionLink: '/mood/stats', ...pick1([
          { title: 'Your mood has dipped this week', subtitle: 'Compared to earlier this week, things feel heavier. Something changed in your pattern.' },
          { title: 'Mood trending downward this week', subtitle: 'You were feeling better a few days ago. See your trend to understand the shift.' },
        ])});
      } else if (avgRecentMood > avgPrevMood + 0.5) {
        real.push({ icon: 'mood', positive: true, actionLink: '/mood/stats', ...pick1([
          { title: 'Your mood is improving this week', subtitle: "Things are looking up — whatever you're doing, keep it up!" },
          { title: 'Mood trending upward 📈', subtitle: "Your recent days have been better than the week before. That's real progress." },
        ])});
      }
    }
    if (real.length < maxReal && data.sleepHistory.length >= 3) {
      const durations = data.sleepHistory.slice(0, 3).map(s => s.duration);
      const variance = Math.max(...durations) - Math.min(...durations);
      if (variance >= 2) {
        real.push({ icon: 'sleep', positive: false, actionLink: '/sleep/stats', ...pick1([
          { title: 'Sleep schedule looks inconsistent', subtitle: `Your sleep has varied by ${Math.round(variance)}h recently. Your mood often follows your sleep stability.` },
          { title: 'Irregular sleep pattern detected', subtitle: `${Math.round(variance)}h swing in your sleep this week. Your body clock thrives on routine.` },
        ])});
      }
    }

    // ── LAYER 4: Positive reinforcement (journal + mindful streaks) ───────────
    if (real.length < maxReal && journalStreak >= 2) {
      real.push({ icon: 'journal', positive: true, actionLink: '/journal', ...pick1([
        { title: `${journalStreak}-day journaling streak 🔥`, subtitle: "You're building a strong reflection habit. Keep it alive." },
        { title: `${journalStreak}-day streak 📓🔥`, subtitle: "Journaling this consistently builds real self-awareness over time." },
      ])});
    }
    if (real.length < maxReal && mindfulCount7 >= 2) {
      real.push({ icon: 'mindful', positive: true, actionLink: '/mindful', ...pick1([
        { title: 'Consistent with mindfulness', subtitle: `${mindfulCount7} sessions this week. Your nervous system is thanking you.` },
        { title: `${mindfulCount7} mindful sessions this week 🌿`, subtitle: "You're making mindfulness a real habit. That takes intention." },
      ])});
    }

    // ── LAYER 1b: Today's mindful activity ────────────────────────────────────
    if (real.length < maxReal && mindfulTodayMins > 0) {
      real.push({ icon: 'mindful', positive: true, actionLink: '/mindful', ...pick1(
        mindfulTodayMins >= 20 ? [
          { title: `${mindfulTodayMins} min of mindfulness today 🧘`, subtitle: 'Solid session. Your nervous system is thanking you right now.' },
          { title: `${mindfulTodayMins}-min mindfulness session 🌿`, subtitle: "That's a real investment in your mental health. Well done." },
        ] : [
          { title: `${mindfulTodayMins} min of mindfulness so far`, subtitle: 'A good start. Even short sessions reduce cortisol levels.' },
          { title: 'You showed up for your mind today', subtitle: `${mindfulTodayMins} minutes of mindfulness logged. Consistency beats intensity.` },
        ]
      )});
    }

    // ── LAYER 1: Today-based (fallback — only if slots still unfilled) ────────
    if (real.length < maxReal && moodVal !== null) {
      if (moodVal <= 2) {
        real.push({ icon: 'mood', positive: false, actionLink: '/mood/stats', ...pick1([
          { title: 'Mood seems low today', subtitle: 'These days happen. A journal entry or short walk can shift things.' },
          { title: 'Rough day emotionally', subtitle: "Your mood logged as low — check your trend to see if it's a pattern." },
        ])});
      } else if (moodVal === 3) {
        real.push({ icon: 'mood', positive: true, actionLink: '/mood/stats', ...pick1([
          { title: 'Mood is steady today', subtitle: "You're holding steady. Little acts of self-care can tip it positive." },
          { title: "You're in a balanced place today", subtitle: 'Consistent mood is a good sign. See your weekly trend.' },
          { title: 'Middle of the road today', subtitle: 'Neutral mood — small wins today can push it positive.' },
        ])});
      } else if (moodVal === 4) {
        real.push({ icon: 'mood', positive: true, actionLink: '/mood/stats', ...pick1([
          { title: 'You look good today 😊', subtitle: 'Good headspace — see how your mood has been trending this week.' },
          { title: 'Feeling good today!', subtitle: "Your mood is up. Check your trend to see what's been helping." },
          { title: 'Positive vibes today ✨', subtitle: 'Happy mood logged. Great energy to journal or stay consistent.' },
          { title: 'Things are clicking today', subtitle: 'Happy headspace — a great day to build on your positive habits.' },
        ])});
      } else {
        real.push({ icon: 'mood', positive: true, actionLink: '/mood/stats', ...pick1([
          { title: "You're in great spirits today! 🌟", subtitle: 'One of your better days. Ride this energy.' },
          { title: 'Top-tier mood today 🔆', subtitle: "Overjoyed — let's see how your trend has been building up." },
          { title: 'Feeling amazing today!', subtitle: 'Your best mood logged. This is what consistency looks like.' },
          { title: 'Soaring emotionally today ✈️', subtitle: 'Overjoyed mood tracked. Keep building the habits that got you here.' },
        ])});
      }
    }
    if (real.length < maxReal && stressVal !== null) {
      if (stressVal >= 4) {
        real.push({ icon: 'stress', positive: false, actionLink: '/stress/stats', ...pick1([
          { title: 'Stress is elevated today', subtitle: `Level ${stressVal}/5${stressor}. Try stepping back for a few minutes.` },
          { title: 'Heavy load today', subtitle: `Stress at ${stressVal}/5${stressor}. Short breaks protect your energy.` },
          { title: 'High tension today', subtitle: `${stressVal}/5 stress${stressor}. Even 5 minutes away from it helps.` },
          { title: 'Under pressure right now', subtitle: `Stress level is ${stressVal}/5. See your trend to spot the pattern.` },
        ])});
      } else if (stressVal <= 2) {
        real.push({ icon: 'stress', positive: true, actionLink: '/stress/stats', ...pick1([
          { title: 'Stress is low today', subtitle: 'Good headspace — a great day to be productive and creative.' },
          { title: 'Calm and in control today', subtitle: `Stress at just ${stressVal}/5. Your clearest thinking happens on days like this.` },
          { title: 'Low stress, high performance day', subtitle: 'Great conditions today — make the most of the calm headspace.' },
          { title: "You're chill today 😌", subtitle: `Stress at ${stressVal}/5. Good day to tackle the things you've been putting off.` },
        ])});
      } else {
        real.push({ icon: 'stress', positive: true, actionLink: '/stress/stats', ...pick1([
          { title: 'Stress is manageable today', subtitle: `Level ${stressVal}/5. You're coping well — keep the balance going.` },
          { title: 'Handling it well today', subtitle: `${stressVal}/5${stressor}. Moderate pressure, managing fine.` },
          { title: 'Balanced stress load today', subtitle: `Stress at ${stressVal}/5 — not too high, not too low. Good place to be.` },
        ])});
      }
    }
    if (real.length < maxReal && sleepDur !== null) {
      if (sleepDur < 6) {
        real.push({ icon: 'sleep', positive: false, actionLink: '/sleep/stats', ...pick1([
          { title: "You didn't sleep enough", subtitle: `Only ${this.fmtDuration(sleepDur)} last night — below 7h. Take it slow today.` },
          { title: 'Running on low fuel today', subtitle: `${this.fmtDuration(sleepDur)} of sleep — your body needs more. Prioritise rest tonight.` },
          { title: 'Rough night?', subtitle: `${this.fmtDuration(sleepDur)} is below ideal. Check your sleep trend to spot the pattern.` },
          { title: 'Short sleep last night', subtitle: `${this.fmtDuration(sleepDur)} — fatigue affects mood and stress too. Rest when you can.` },
        ])});
      } else if (sleepDur >= 7) {
        real.push({ icon: 'sleep', positive: true, actionLink: '/sleep/stats', ...pick1([
          { title: 'Well rested today!', subtitle: `${this.fmtDuration(sleepDur)} of sleep — your brain and body will thank you.` },
          { title: "Good night's sleep 😴", subtitle: `${this.fmtDuration(sleepDur)} logged. Consistent sleep like this powers a stable mood.` },
          { title: 'Solid recovery last night', subtitle: `${this.fmtDuration(sleepDur)} of quality rest. Your body repaired a lot while you slept.` },
          { title: 'Sleep goal hit! ✓', subtitle: `${this.fmtDuration(sleepDur)} — above 7h. Peak performance window for today.` },
        ])});
      } else {
        real.push({ icon: 'sleep', positive: true, actionLink: '/sleep/stats', ...pick1([
          { title: 'Decent sleep last night', subtitle: `${this.fmtDuration(sleepDur)} — close to ideal. Just a bit more would help.` },
          { title: 'Almost there on sleep', subtitle: `${this.fmtDuration(sleepDur)} is solid — push for 7h+ tonight for full recovery.` },
          { title: 'Good-ish night of sleep', subtitle: `${this.fmtDuration(sleepDur)} logged. Small sleep debt, easy to catch up.` },
        ])});
      }
    }

    // ── CTA prompts for unlogged metrics ─────────────────────────────────────
    const cta: Insight[] = [];
    if (!data.todayMood) {
      cta.push({ icon: 'log-mood', positive: true, isLogPrompt: true, actionLink: '/mood/check-in', ...pick1([
        { title: "How are you feeling right now?", subtitle: "Log your mood to unlock personalised insights and track your emotional trends." },
        { title: "Check in on your mood today", subtitle: "A quick mood log helps us personalise everything on this page for you." },
        { title: "What's your mood today?", subtitle: "30 seconds to log it — and you'll see your emotional pattern over time." },
        { title: "Mood not logged yet today", subtitle: "Tap to check in — your daily mood shapes your insights and tasks." },
      ])});
    }
    if (!data.todayStress) {
      cta.push({ icon: 'log-stress', positive: true, isLogPrompt: true, actionLink: '/stress/add', ...pick1([
        { title: "How's your stress level today?", subtitle: "Logging stress helps you spot what's really draining your energy." },
        { title: "Log your stress for today", subtitle: "Stress patterns are invisible until you track them. Takes 10 seconds." },
        { title: "What's your load like today?", subtitle: "Log your stress level — it helps us surface the right insights for you." },
        { title: "Stress unchecked today", subtitle: "Tap to rate your stress — knowing your level is the first step to managing it." },
      ])});
    }
    if (!data.todaySleep) {
      cta.push({ icon: 'log-sleep', positive: true, isLogPrompt: true, actionLink: '/sleep', ...pick1([
        { title: "Did you sleep well last night?", subtitle: "Log your sleep to see how it connects to your mood and energy today." },
        { title: "How did you sleep?", subtitle: "Sleep affects everything — mood, stress, focus. Log it to see your patterns." },
        { title: "Sleep not logged yet", subtitle: "Tap to add last night's sleep — it unlocks your full wellness picture." },
        { title: "Track last night's sleep", subtitle: "Sleep quality is one of the biggest levers for your mental wellbeing." },
      ])});
    }

    // Combine: real insights (up to loggedCount) + CTA prompts (for each missing)
    return [...real.slice(0, maxReal), ...cta].slice(0, 3);
  }

  // ─── Tasks (scale with logged data: 1 logged → 1 task, 2 → 2, 3 → 3) ──────
  private generateTasks(data: {
    todayMood: any; todayStress: any; todaySleep: any;
    mindfulSessions: any[]; journalEntries: any[];
    userId?: string;
  }) {
    const stressVal = data.todayStress?.value ?? 0;
    const moodVal = data.todayMood ? (MOOD_VALUES[data.todayMood.mood] ?? 3) : 3;
    const sleepDur = data.todaySleep?.duration ?? 7;
    const mindfulCount = data.mindfulSessions.length;

    // Always show 3 tasks as long as at least 1 metric is logged
    const taskLimit = 3;

    // Same seed every day per user → consistent shuffle all day for that user
    const rng = seededRandom(dateSeed(data.userId));

    let pool: any[] = [];

    if (stressVal >= 4) {
      pool = [
        ...pick(TASK_POOL.mindful, 1, rng),
        ...pick(TASK_POOL.journal, 1, rng),
        ...pick(TASK_POOL.real.filter(t => ['r1', 'r3', 'r7'].includes(t.id)), 1, rng),
      ];
    } else if (moodVal <= 2) {
      pool = [
        ...pick(TASK_POOL.journal, 1, rng),
        ...pick(TASK_POOL.mindful, 1, rng),
        ...pick(TASK_POOL.real.filter(t => ['r3', 'r4', 'r2'].includes(t.id)), 1, rng),
      ];
    } else if (sleepDur < 6) {
      pool = [
        ...pick(TASK_POOL.real.filter(t => ['r1', 'r4'].includes(t.id)), 1, rng),
        ...pick(TASK_POOL.mindful, 1, rng),
        ...pick(TASK_POOL.real.filter(t => ['r5', 'r6'].includes(t.id)), 1, rng),
      ];
    } else {
      pool = [
        pick(TASK_POOL.journal.filter(t => ['j2', 'j3'].includes(t.id)), 1, rng)[0],
        ...pick(TASK_POOL.mindful, 1, rng),
        ...pick(TASK_POOL.real.filter(t => ['r2', 'r4', 'r7'].includes(t.id)), 1, rng),
      ];
    }

    if (!data.todayStress) pool.push(TASK_POOL.system[0]);
    if (mindfulCount === 0 && pool.length < 4) pool.push(TASK_POOL.mindful[1]);

    const seen = new Set<string>();
    const final: any[] = [];
    for (const t of pool) {
      if (t && !seen.has(t.id) && final.length < 3) {
        seen.add(t.id);
        
        // Smart Context Description
        let dynamicDesc = t.description;
        if (stressVal >= 4 && (t.type === 'mindful' || t.id === 'r2' || t.id === 'r7')) {
            dynamicDesc = `You've been stressed today — ${t.id === 'r2' ? 'hydration' : 'this'} can help regulate your energy levels.`;
        } else if (moodVal <= 2 && t.type === 'journal') {
            dynamicDesc = "Writing one small win helps your brain shift away from negative loops.";
        } else if (sleepDur < 6 && (t.id === 'r5' || t.id === 'r6')) {
            dynamicDesc = "You slept less than 6h — protecting tonight's sleep is your top priority.";
        }
        
        final.push({ ...t, description: dynamicDesc });
      }
    }
    
    const allTasks = [...TASK_POOL.mindful, ...TASK_POOL.journal, ...TASK_POOL.real];
    for (const t of shuffle(allTasks, rng)) {
      if (final.length >= 3) break;
      if (!seen.has(t.id)) { 
          seen.add(t.id); 
          final.push(t); 
      }
    }

    return final.slice(0, taskLimit);
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
  private calcJournalStreak(entries: any[]): number {
    if (!entries.length) return 0;
    let streak = 0;
    const check = new Date();
    check.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const dayStr = check.toDateString();
      const found = entries.some(e => new Date(e.createdAt).toDateString() === dayStr);
      if (found) streak++;
      else break;
      check.setDate(check.getDate() - 1);
    }
    return streak;
  }

  private fmtDuration(h: number) {
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
}
