import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StressEntry } from '@prisma/client';

@Injectable()
export class StressService {
  constructor(private prisma: PrismaService) {}

  async createEntry(userId: string, data: { value: number; stressor: string; impact: string }): Promise<StressEntry> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day

    const existingEntry = await this.prisma.stressEntry.findFirst({
      where: {
        userId,
        createdAt: {
          gte: today, 
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingEntry) {
      return this.prisma.stressEntry.update({
        where: { id: existingEntry.id },
        data: {
          value: data.value,
          stressor: data.stressor,
          impact: data.impact,
        },
      });
    }

    return this.prisma.stressEntry.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async getLatestEntry(userId: string): Promise<StressEntry | null> {
    return this.prisma.stressEntry.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getHistory(userId: string): Promise<StressEntry[]> {
    return this.prisma.stressEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
