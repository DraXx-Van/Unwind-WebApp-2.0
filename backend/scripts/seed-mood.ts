import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // 1. Clear existing data to avoid conflicts (optional but safer for testing)
    await prisma.dailyMood.deleteMany({});
    console.log('Cleared existing mood data.');

    // 2. Create mood for yesterday
    const mood = await prisma.dailyMood.create({
        data: {
            userId: 'user-1',
            date: yesterday,
            mood: 'HAPPY',
        },
    });

    console.log('Created mood for yesterday:', mood);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
