import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SleepEntry } from '@prisma/client';

@Injectable()
export class SleepService {
  constructor(private prisma: PrismaService) {}

  async createEntry(userId: string, data: { duration: number; sleepTime: string; wakeTime: string; quality: number }): Promise<SleepEntry> {
    return this.prisma.sleepEntry.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async getLatestEntry(userId: string): Promise<SleepEntry | null> {
    return this.prisma.sleepEntry.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getHistory(userId: string): Promise<SleepEntry[]> {
    return this.prisma.sleepEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
