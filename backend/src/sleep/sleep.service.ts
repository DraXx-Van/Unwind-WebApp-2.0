import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SleepEntry, SleepSchedule } from '@prisma/client';

@Injectable()
export class SleepService {
  constructor(private prisma: PrismaService) {}

  // --- Schedule Management ---
  async setSchedule(userId: string, data: { isEveryday: boolean; isToday: boolean; sleepTime: string; wakeTime: string; snoozeLength: number; autoStats: boolean; autoAlarm: boolean }): Promise<SleepSchedule> {
    // For MVP, we will just keep one master schedule per user. Overwrite if exists.
    const existing = await this.prisma.sleepSchedule.findFirst({ where: { userId } });
    if (existing) {
      return this.prisma.sleepSchedule.update({
        where: { id: existing.id },
        data,
      });
    }
    return this.prisma.sleepSchedule.create({
      data: { userId, ...data },
    });
  }

  async getSchedule(userId: string): Promise<SleepSchedule | null> {
    return this.prisma.sleepSchedule.findFirst({ where: { userId } });
  }

  // --- Entry Management ---
  async createEntry(userId: string, data: { duration: number; sleepTime: string; wakeTime: string }): Promise<SleepEntry> {
    // New Algorithm: Better distribution
    // 0-4h: 0-40 points
    // 4-6h: 40-70 points
    // 6-8h: 70-100 points
    // 8h+: slight decline for oversleeping
    
    let quality = 0;
    const d = data.duration;
    
    if (d < 4) {
      quality = (d / 4) * 40; // 0 to 40
    } else if (d < 7) {
      quality = 40 + ((d - 4) / 3) * 40; // 40 to 80
    } else if (d <= 9) {
      quality = 80 + ((d - 7) / 2) * 20; // 80 to 100
    } else {
      quality = Math.max(70, 100 - (d - 9) * 10); // Slight penalty for > 9h
    }

    return this.prisma.sleepEntry.create({
      data: {
        userId,
        duration: data.duration,
        sleepTime: data.sleepTime,
        wakeTime: data.wakeTime,
        quality: Math.round(quality),
      },
    });
  }

  async getLatestEntry(userId: string): Promise<SleepEntry | null> {
    // Returns the most recent sleep log
    return this.prisma.sleepEntry.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWeeklyQualityScore(userId: string): Promise<number> {
    // Get entries from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await this.prisma.sleepEntry.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo }
      }
    });

    if (entries.length === 0) return 0;
    
    // Average the quality
    const totalQuality = entries.reduce((sum, entry) => sum + entry.quality, 0);
    return Math.round(totalQuality / entries.length);
  }

  async getHistory(userId: string): Promise<SleepEntry[]> {
    return this.prisma.sleepEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

