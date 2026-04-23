import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Returns a Date anchored to TODAY.
 * daysBack=1 → yesterday, daysBack=7 → 7 days ago.
 */
function pastDate(daysBack: number, hour = 10, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function pastMidnight(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function main() {
  // ─── Find user by email ───────────────────────────────────────────────────
  const targetEmail = process.argv[2] || 'demo@unwind.app';
  console.log(`\n🔍 Looking up user: ${targetEmail}`);

  const user = await prisma.user.findFirst({ where: { email: targetEmail } });
  if (!user) {
    console.error(`❌ No user found with email: ${targetEmail}`);
    console.error('   Register through the app first, then run: npx ts-node prisma/seed-for-user.ts your@email.com');
    process.exit(1);
  }

  const userId = user.id;
  console.log(`✅ Found user: ${user.name} (id: ${userId})\n`);

  // ─── Clear existing data for THIS user only ───────────────────────────────
  console.log('🗑️  Clearing existing data for this user...');
  await prisma.stressEntry.deleteMany({ where: { userId } });
  await prisma.sleepEntry.deleteMany({ where: { userId } });
  await prisma.mindfulSession.deleteMany({ where: { userId } });
  await prisma.dailyMood.deleteMany({ where: { userId } });
  await prisma.journal.deleteMany({ where: { userId } });
  await prisma.sleepSchedule.deleteMany({ where: { userId } });
  await prisma.assessment.deleteMany({ where: { userId } });
  console.log('✅ User data cleared\n');

  // ─── MOOD ─────────────────────────────────────────────────────────────────
  const moodData = [
    { daysBack: 7, mood: 'LOW' },
    { daysBack: 6, mood: 'OVERWHELMED' },
    { daysBack: 5, mood: 'LOW' },
    { daysBack: 4, mood: 'LOW' },
    { daysBack: 3, mood: 'NEUTRAL' },
    { daysBack: 2, mood: 'HAPPY' },
    { daysBack: 1, mood: 'HAPPY' },
    // daysBack: 0 = today is intentionally EMPTY (log live during demo)
  ];

  for (const m of moodData) {
    await prisma.dailyMood.upsert({
      where: { userId_date: { userId, date: pastMidnight(m.daysBack) } },
      update: { mood: m.mood },
      create: { userId, date: pastMidnight(m.daysBack), mood: m.mood },
    });
  }
  console.log('✅ Mood: 7 entries (last 7 days) — LOW→OVERWHELMED→LOW→NEUTRAL→HAPPY');

  // ─── STRESS ───────────────────────────────────────────────────────────────
  const stressData = [
    { daysBack: 7, value: 4, stressor: 'Academic workload',  impact: 'High',     hour: 12 },
    { daysBack: 6, value: 5, stressor: 'Exam pressure',      impact: 'High',     hour: 11 },
    { daysBack: 5, value: 5, stressor: 'Academic workload',  impact: 'High',     hour: 10 },
    { daysBack: 4, value: 4, stressor: 'Project deadline',   impact: 'High',     hour: 11 },
    { daysBack: 3, value: 3, stressor: 'Social obligations', impact: 'Moderate', hour: 13 },
    { daysBack: 2, value: 2, stressor: 'Minor tasks',        impact: 'Low',      hour: 10 },
    { daysBack: 1, value: 2, stressor: 'Presentation prep',  impact: 'Low',      hour: 9  },
    // daysBack: 0 = today is intentionally EMPTY (log live during demo)
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
  console.log('✅ Stress: 7 entries — 4,5,5,4,3,2,2 — downward arc');

  // ─── SLEEP ────────────────────────────────────────────────────────────────
  const sleepData = [
    { daysBack: 7, duration: 6.0, sleepTime: '01:00', wakeTime: '07:00', quality: 55 },
    { daysBack: 6, duration: 4.5, sleepTime: '02:00', wakeTime: '06:30', quality: 35 },
    { daysBack: 5, duration: 5.0, sleepTime: '01:30', wakeTime: '06:30', quality: 40 },
    { daysBack: 4, duration: 7.5, sleepTime: '23:00', wakeTime: '06:30', quality: 80 },
    { daysBack: 3, duration: 8.0, sleepTime: '22:45', wakeTime: '06:45', quality: 88 },
    { daysBack: 2, duration: 7.0, sleepTime: '23:30', wakeTime: '06:30', quality: 78 },
    { daysBack: 1, duration: 7.5, sleepTime: '23:00', wakeTime: '06:30', quality: 85 },
    // daysBack: 0 = today is intentionally EMPTY (log live during demo)
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
  console.log('✅ Sleep: 7 entries — 4.5h→8h recovery arc');

  // ─── MINDFUL SESSIONS ─────────────────────────────────────────────────────
  const mindfulData = [
    { daysBack: 4, activity: 'Box Breathing',       duration: 5,  category: 'Breathing',   timeOfDay: 'Evening',   hour: 21, minute: 30 },
    { daysBack: 3, activity: '4-7-8 Breathing',     duration: 7,  category: 'Breathing',   timeOfDay: 'Morning',   hour: 8,  minute: 0  },
    { daysBack: 3, activity: 'Body Scan',            duration: 10, category: 'Relaxation',  timeOfDay: 'Evening',   hour: 22, minute: 0  },
    { daysBack: 2, activity: 'Gratitude Meditation', duration: 10, category: 'Mindfulness', timeOfDay: 'Morning',   hour: 8,  minute: 30 },
    { daysBack: 2, activity: 'Deep Breathing',       duration: 8,  category: 'Breathing',   timeOfDay: 'Afternoon', hour: 14, minute: 0  },
    { daysBack: 1, activity: 'Morning Meditation',   duration: 15, category: 'Mindfulness', timeOfDay: 'Morning',   hour: 7,  minute: 45 },
    { daysBack: 1, activity: 'Focus Timer',          duration: 25, category: 'Focus',       timeOfDay: 'Afternoon', hour: 15, minute: 0  },
    { daysBack: 1, activity: 'Evening Wind Down',    duration: 12, category: 'Relaxation',  timeOfDay: 'Evening',   hour: 21, minute: 15 },
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
  console.log('✅ Mindful: 8 sessions across last 4 days');

  // ─── JOURNAL ──────────────────────────────────────────────────────────────
  const journalData = [
    { daysBack: 7, title: 'Feeling the pressure building', content: 'Exams next week and I haven\'t even finished half the syllabus. Stress is creeping in — the kind that makes it hard to concentrate on anything. Tried to study for 3 hours and retained maybe 20 minutes of it. I need to get a grip before this spirals.', emotion: 'anxious', hour: 23 },
    { daysBack: 6, title: 'Can\'t keep up anymore', content: 'Everything hit me at once today. Exams, the group project, and I barely slept again. I feel completely overwhelmed and don\'t know where to start. Just writing this to get it out of my head. Mood is rock bottom.', emotion: 'depressed', hour: 23 },
    { daysBack: 5, title: 'Another rough night', content: 'Slept barely 5 hours again. Stress is still at peak. Skipped lunch because I was deep in the assignment. Tried 4-7-8 breathing before bed tonight — helped more than I expected.', emotion: 'sad', hour: 22 },
    { daysBack: 3, title: 'Turning it around', content: 'The deadline passed. Did a 10-minute body scan meditation tonight for the first time — genuinely felt different after. Mood is still not great but I feel like I can breathe again.', emotion: 'neutral', hour: 22 },
    { daysBack: 2, title: '3 things I\'m grateful for today', content: '1. Slept a full 7 hours for the first time all week. 2. My roommate made food and we had a proper conversation. 3. Finished a 25-min focus timer without touching my phone once. Small wins.', emotion: 'happy', hour: 21 },
    { daysBack: 1, title: 'Ready for tomorrow', content: 'Looking back at this week through Unwind — the stress chart dropping from 5 to 2, mood flipping from overwhelmed to happy, sleep back to 7.5h — it\'s actually visible. The mindfulness habit is starting to stick.', emotion: 'calm', hour: 22 },
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
  console.log('✅ Journal: 6 entries — anxious→depressed→sad→neutral→happy→calm');

  // ─── SLEEP SCHEDULE ───────────────────────────────────────────────────────
  await prisma.sleepSchedule.create({
    data: {
      userId,
      isEveryday: true,
      isToday: true,
      sleepTime: '23:30',
      wakeTime: '07:00',
      snoozeLength: 3,
      autoStats: true,
      autoAlarm: false,
    },
  });
  console.log('✅ Sleep schedule: 11:30 PM → 7:00 AM everyday');

  // ─── ASSESSMENT (baseline Mental Score) ──────────────────────────────────
  await prisma.assessment.create({
    data: {
      userId,
      goal: 'Reduce stress and improve sleep',
      gender: 'Male',
      age: 22,
      mood: 4,           // 4/5 → 80 pts
      sleepQuality: 4,   // 4/5 → 80 pts
      stressLevel: 2,    // 2/5 → (6-2)*20 = 80 pts
    }
  });
  console.log('✅ Assessment: mood=4, sleep=4, stress=2 → Mental Score ~80%\n');

  console.log('🎯 DEMO DATA READY FOR:', user.name, `(${user.email})`);
  console.log('═══════════════════════════════════════════════════');
  console.log('📅 Today is EMPTY — log mood/stress/sleep live during demo!');
  console.log('📈 Narrative Arc: LOW stress week → recovery → HAPPY');
  console.log('🧘 Mindful sessions: growing habit from Day 4 onward');
  console.log('😴 Sleep: poor 4.5h early week → healthy 7.5h recovery');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
