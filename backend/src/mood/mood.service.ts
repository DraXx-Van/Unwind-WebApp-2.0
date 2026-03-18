import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailyMood } from '@prisma/client';

@Injectable()
export class MoodService {
    constructor(private prisma: PrismaService) { }

    async createOrUpdateMood(userId: string, mood: string, dateStr?: string): Promise<DailyMood> {
        // Use provided date or default to today (start of day in UTC)
        const date = dateStr ? new Date(dateStr) : new Date();
        date.setHours(0, 0, 0, 0);

        // Check if mood exists for this date
        const existingMood = await this.prisma.dailyMood.findFirst({
            where: {
                userId,
                date: date,
            },
        });

        if (existingMood) {
            return this.prisma.dailyMood.update({
                where: { id: existingMood.id },
                data: { mood },
            });
        }

        return this.prisma.dailyMood.create({
            data: {
                userId,
                date: date,
                mood,
            },
        });
    }

    async getMoodByDate(userId: string, dateStr?: string): Promise<DailyMood | null> {
        const date = dateStr ? new Date(dateStr) : new Date();
        date.setHours(0, 0, 0, 0);

        return this.prisma.dailyMood.findFirst({
            where: {
                userId,
                date: date,
            },
        });
    }

    async getMoodHistory(userId: string): Promise<DailyMood[]> {
        return this.prisma.dailyMood.findMany({
            where: { userId },
            orderBy: { date: 'asc' },
        });
    }
}
