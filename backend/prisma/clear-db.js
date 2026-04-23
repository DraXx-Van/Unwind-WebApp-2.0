const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function clear() {
  await p.stressEntry.deleteMany({});
  await p.sleepEntry.deleteMany({});
  await p.mindfulSession.deleteMany({});
  await p.dailyMood.deleteMany({});
  await p.journal.deleteMany({});
  await p.sleepSchedule.deleteMany({});
  await p.assessment.deleteMany({});
  await p.user.deleteMany({});
  console.log('✅ DB cleared!');
  await p.$disconnect();
}

clear().catch(e => { console.error(e); process.exit(1); });
