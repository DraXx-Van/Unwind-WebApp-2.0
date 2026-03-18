
const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        console.log('Connected to database successfully');
        const journals = await prisma.journal.findMany();
        console.log('Journals found:', journals.length);
    } catch (e) {
        console.error('Error connecting using PrismaClient directly:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
