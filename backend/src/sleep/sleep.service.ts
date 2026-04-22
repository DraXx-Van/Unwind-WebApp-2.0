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
    // Algorithm: Determine Sleep Quality (Out of 100)
    // 50 base points + up to 50 duration points
    // Ideal sleep is ~8 hours.
    const optimalDuration = 8;
    const deviation = Math.abs(optimalDuration - data.duration);
    let durationScore = 50;
    
    if (deviation <= 1) {
      durationScore = 50; // Perfect duration score
    } else {
      durationScore = Math.max(0, 50 - (deviation * 15));
    }
    
    // In a full app, consistency bonus (matching schedule) would go here.
    const finalQuality = Math.round(50 + durationScore);

    return this.prisma.sleepEntry.create({
      data: {
        userId,
        duration: data.duration,
        sleepTime: data.sleepTime,
        wakeTime: data.wakeTime,
        quality: Math.min(100, finalQuality),
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

