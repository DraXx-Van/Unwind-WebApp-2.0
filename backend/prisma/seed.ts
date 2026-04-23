import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Returns a Date anchored to IST April 22 2026 (today during presentation).
 * daysBack=1 → Apr 21, daysBack=7 → Apr 15, etc.
 * TODAY (Apr 22) is left empty → logged live during the demo.
 */
function pastDate(daysBack: number, hour = 10, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(hour, minute, 0, 0);
  return d;
}

/** Midnight of a past day (for dailyMood.date unique key) */
function pastMidnight(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function main() {
  console.log('🗑️  Clearing all existing data...');
  // Delete in dependency order — User last since others reference it
  await prisma.stressEntry.deleteMany({});
  await prisma.sleepEntry.deleteMany({});
  await prisma.mindfulSession.deleteMany({});
  await prisma.dailyMood.deleteMany({});
  await prisma.journal.deleteMany({});
  await prisma.sleepSchedule.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ DB cleared\n');

  // ═══════════════════════════════════════════════════════════════════
  // USER — create the demo user first (required by auth schema)
  // ═══════════════════════════════════════════════════════════════════
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@unwind.app',
      password: hashedPassword,
    },
  });
  const userId = user.id;
  console.log(`✅ User created: ${user.email} (id: ${userId})\n`);

  // ═══════════════════════════════════════════════════════════════════
  // MOOD  — 8 days
  // Arc: crash → struggle → turning point → recovery → thriving
  // ═══════════════════════════════════════════════════════════════════
  const moodData = [
    { daysBack: 7, mood: 'LOW' },
    { daysBack: 6, mood: 'OVERWHELMED' },
    { daysBack: 5, mood: 'LOW' },
    { daysBack: 4, mood: 'LOW' },
    { daysBack: 3, mood: 'NEUTRAL' },
    { daysBack: 2, mood: 'HAPPY' },
    { daysBack: 1, mood: 'HAPPY' },
    { daysBack: 0, mood: 'HAPPY' }, // Today
  ];

  for (const m of moodData) {
    await prisma.dailyMood.upsert({
      where: { userId_date: { userId, date: pastMidnight(m.daysBack) } },
      update: { mood: m.mood },
      create: { userId, date: pastMidnight(m.daysBack), mood: m.mood },
    });
  }
  console.log('✅ Mood: 8 entries (Apr 15-22) — LOW→OVERWHELMED→LOW→NEUTRAL→HAPPY');

  // ═══════════════════════════════════════════════════════════════════
  // STRESS — 8 days with stressor context
  // ═══════════════════════════════════════════════════════════════════
  const stressData = [
    { daysBack: 7, value: 4, stressor: 'Academic workload',  impact: 'High',     hour: 12 }, // Mar 13
    { daysBack: 6, value: 5, stressor: 'Exam pressure',      impact: 'High',     hour: 11 }, // Mar 14
    { daysBack: 5, value: 5, stressor: 'Academic workload',  impact: 'High',     hour: 10 }, // Mar 15
    { daysBack: 4, value: 4, stressor: 'Project deadline',   impact: 'High',     hour: 11 }, // Mar 16
    { daysBack: 3, value: 3, stressor: 'Social obligations', impact: 'Moderate', hour: 13 }, // Mar 17
    { daysBack: 2, value: 2, stressor: 'Minor tasks',        impact: 'Low',      hour: 10 }, // Mar 18
    { daysBack: 1, value: 2, stressor: 'Presentation prep',  impact: 'Low',      hour: 9  }, // Mar 19
    { daysBack: 0, value: 1, stressor: 'None',               impact: 'None',     hour: 8  }, // Today
  ];

  for (const s of stressData) {
    await prisma.stressEntry.create({
      data: {
        userId,
        value: s.value,
        stressor: s.stressor,
        impact: s.impact,
        createdAt: pastDate(s.daysBack, s.hour),
      },
    });
  }
  console.log('✅ Stress: 8 entries — 4,5,5,4,3,2,2,1 — perfect downward arc for stats chart');

  // ═══════════════════════════════════════════════════════════════════
  // SLEEP — 8 days
  // Bad early week (exam nights) → great recovery later in the week
  // ═══════════════════════════════════════════════════════════════════
  const sleepData = [
    { daysBack: 7, duration: 6.0, sleepTime: '01:00', wakeTime: '07:00', quality: 55 }, // Mar 13
    { daysBack: 6, duration: 4.5, sleepTime: '02:00', wakeTime: '06:30', quality: 35 }, // Mar 14 — worst
    { daysBack: 5, duration: 5.0, sleepTime: '01:30', wakeTime: '06:30', quality: 40 }, // Mar 15
    { daysBack: 4, duration: 7.5, sleepTime: '23:00', wakeTime: '06:30', quality: 80 }, // Mar 16 — recovery
    { daysBack: 3, duration: 8.0, sleepTime: '22:45', wakeTime: '06:45', quality: 88 }, // Mar 17
    { daysBack: 2, duration: 7.0, sleepTime: '23:30', wakeTime: '06:30', quality: 78 }, // Mar 18
    { daysBack: 1, duration: 7.5, sleepTime: '23:00', wakeTime: '06:30', quality: 85 }, // Mar 19
    { daysBack: 0, duration: 8.0, sleepTime: '23:00', wakeTime: '07:00', quality: 90 }, // Today
  ];

  for (const s of sleepData) {
    await prisma.sleepEntry.create({
      data: {
        userId,
        duration: s.duration,
        sleepTime: s.sleepTime,
        wakeTime: s.wakeTime,
        quality: s.quality,
        createdAt: pastDate(s.daysBack, 7),
      },
    });
  }
  console.log('✅ Sleep: 8 entries — 4.5h→8h recovery arc, big variance triggers insights');

  // ═══════════════════════════════════════════════════════════════════
  // MINDFUL SESSIONS — 9 sessions across 6 days
  // ═══════════════════════════════════════════════════════════════════
  const mindfulData = [
    { daysBack: 4, activity: 'Box Breathing',        duration: 5,  category: 'Breathing',   timeOfDay: 'Evening',   hour: 21, minute: 30 },
    { daysBack: 3, activity: '4-7-8 Breathing',      duration: 7,  category: 'Breathing',   timeOfDay: 'Morning',   hour: 8,  minute: 0  },
    { daysBack: 3, activity: 'Body Scan',             duration: 10, category: 'Relaxation',  timeOfDay: 'Evening',   hour: 22, minute: 0  },
    // Mar 18 — two sessions
    { daysBack: 2, activity: 'Gratitude Meditation',  duration: 10, category: 'Mindfulness', timeOfDay: 'Morning',   hour: 8,  minute: 30 },
    { daysBack: 2, activity: 'Deep Breathing',        duration: 8,  category: 'Breathing',   timeOfDay: 'Afternoon', hour: 14, minute: 0  },
    // Mar 19 — three sessions (best day)
    { daysBack: 1, activity: 'Morning Meditation',    duration: 15, category: 'Mindfulness', timeOfDay: 'Morning',   hour: 7,  minute: 45 },
    { daysBack: 1, activity: 'Focus Timer',           duration: 25, category: 'Focus',       timeOfDay: 'Afternoon', hour: 15, minute: 0  },
    { daysBack: 1, activity: 'Evening Wind Down',     duration: 12, category: 'Relaxation',  timeOfDay: 'Evening',   hour: 21, minute: 15 },
  ];

  for (const m of mindfulData) {
    await prisma.mindfulSession.create({
      data: {
        userId,
        activity: m.activity,
        duration: m.duration,
        plannedDuration: m.duration,
        category: m.category,
        timeOfDay: m.timeOfDay,
        createdAt: pastDate(m.daysBack, m.hour, m.minute),
      },
    });
  }
  console.log('✅ Mindful: 8 sessions — 0 during stress peak, growing habit after');

  // ═══════════════════════════════════════════════════════════════════
  // JOURNAL ENTRIES — 6 entries with real student voice
  // Full emotional arc from breakdown to breakthrough
  // ═══════════════════════════════════════════════════════════════════
  const journalData = [
    {
      daysBack: 7,
      title: "Feeling the pressure building",
      content: "Exams next week and I haven't even finished half the syllabus. Stress is creeping in — the kind that makes it hard to concentrate on anything. Tried to study for 3 hours and retained maybe 20 minutes of it. I need to get a grip before this spirals.",
      emotion: 'anxious',
      hour: 23,
    },
    {
      daysBack: 6,
      title: "Can't keep up anymore",
      content: "Everything hit me at once today. Exams, the group project, and I barely slept again. I feel completely overwhelmed and don't know where to start. Just writing this to get it out of my head. Mood is rock bottom. I need a plan tomorrow — something, anything.",
      emotion: 'depressed',
      hour: 23,
    },
    {
      daysBack: 5,
      title: "Another rough night",
      content: "Slept barely 5 hours again. Stress is still at peak. Skipped lunch because I was deep in the assignment. I need to remember that burning out doesn't actually help me deliver better work. Tried 4-7-8 breathing before bed tonight — helped more than I expected.",
      emotion: 'sad',
      hour: 22,
    },
    {
      daysBack: 3,
      title: "Turning it around",
      content: "The deadline passed. It wasn't my best work, but I got it done and submitted. Did a 10-minute body scan meditation tonight for the first time — genuinely felt different after. Mood is still not great but I feel like I can breathe again. Small things are starting to help.",
      emotion: 'neutral',
      hour: 22,
    },
    {
      daysBack: 2,
      title: "3 things I'm grateful for today",
      content: "1. Slept a full 7 hours for the first time all week — woke up feeling almost human. 2. My roommate made food and we had a proper conversation, first time in days. 3. Finished a 25-min focus timer without touching my phone once. Small wins, but they're mine. Progress is still progress.",
      emotion: 'happy',
      hour: 21,
    },
    {
      daysBack: 1,
      title: "Ready for tomorrow",
      content: "Looking back at this week through Unwind — the stress chart dropping from 5 to 2, mood flipping from overwhelmed to happy, sleep back to 7.5h — it's actually visible. The mindfulness habit is starting to stick. Did an evening wind-down session tonight. Feeling calm about the presentation. Whatever happens, I showed up for myself every day this week.",
      emotion: 'calm',
      hour: 22,
    },
  ];

  for (const j of journalData) {
    await prisma.journal.create({
      data: {
        userId,
        title: j.title,
        content: j.content,
        emotion: j.emotion,
        createdAt: pastDate(j.daysBack, j.hour),
      },
    });
  }
  console.log('✅ Journal: 6 entries (Apr 15-21) — anxious→depressed→sad→neutral→happy→calm');

  // ═══════════════════════════════════════════════════════════════════
  // SLEEP SCHEDULE — target bedtime
  // ═══════════════════════════════════════════════════════════════════
  await prisma.sleepSchedule.create({
    data: {
      userId,
      isEveryday: true,
      isToday: true,
      sleepTime: '23:30',
      wakeTime: '07:00',
      snoozeLength: 10,
      autoStats: true,
      autoAlarm: false,
    },
  });

  // ═══════════════════════════════════════════════════════════════════
  // ASSESSMENT — initial health data
  // ═══════════════════════════════════════════════════════════════════
  await prisma.assessment.create({
    data: {
      userId,
      goal: 'Reduce stress and improve sleep',
      gender: 'Male',
      age: 22,
      mood: 4,
      sleepQuality: 4,
      stressLevel: 2,
    }
  });

  console.log('\n🎯 PRESENTATION DEMO DATA READY');
  console.log('══════════════════════════════════════════════════════════');
  console.log('📅  Today: April 22 2026 — EMPTY (log live during demo!)');
  console.log('');
  console.log('📈  NARRATIVE ARC (Apr 15 → 21):');
  console.log('   Apr 15: Low mood, stress 4/5, sleep 6h — pressure building');
  console.log('   Apr 16: OVERWHELMED, stress 5/5, sleep 4.5h — worst day');
  console.log('   Apr 17: Low mood, stress 5/5, sleep 5h — still struggling');
  console.log('   Apr 18: Low mood, stress 4/5, sleep 7.5h — first mindful session');
  console.log('   Apr 19: NEUTRAL mood, stress 3/5, sleep 8h — turning point');
  console.log('   Apr 20: HAPPY, stress 2/5, sleep 7h — recovering well');
  console.log('   Apr 21: HAPPY, stress 2/5, sleep 7.5h — ready for presentation');
  console.log('');
  console.log('🎬  FEATURES THIS DATA SHOWCASES:');
  console.log('   📊 Mood Stats    — clear LOW→OVERWHELMED→HAPPY trend chart');
  console.log('   ⚡ Stress Stats  — 5→2 decline, stressors visible (exam, deadline)');
  console.log('   😴 Sleep Stats   — 4.5h→8h recovery, inconsistency insight fires');
  console.log('   🧘 Mindful Stats — 0 sessions during stress, 8 sessions post-recovery');
  console.log('   📓 Journal       — 6 emotional entries, authentic student voice');
  console.log('   💡 Insights      — trend insights fire (stress down, mood up)');
  console.log('   ✅ Tasks         — stress-driven today (mindful + journal + physical)');
  console.log('');
  console.log('🚀  DEMO FLOW:');
  console.log('   1. Open app → show dashboard (score, trends from history)');
  console.log('   2. Insights page → shows "Log data" prompts (empty today)');
  console.log('   3. Log mood → 1 real insight + 2 CTAs appear');
  console.log('   4. Log stress → 2 real insights + 1 CTA appear');
  console.log('   5. Log sleep → all 3 real insights + 3 tasks appear');
  console.log('   6. Show journal entries — emotional arc visible');
  console.log('   7. Show mood/stress/sleep stats — charts tell the story');
  console.log('   8. Show mindful sessions — habit building visible');
  console.log('══════════════════════════════════════════════════════════');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
