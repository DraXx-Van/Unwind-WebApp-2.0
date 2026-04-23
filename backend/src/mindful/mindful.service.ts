import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MindfulSession } from '@prisma/client';

@Injectable()
export class MindfulService {
  constructor(private prisma: PrismaService) {}

  async createEntry(userId: string, data: { activity: string; duration: number; plannedDuration: number; category: string; timeOfDay: string }): Promise<MindfulSession> {
    return this.prisma.mindfulSession.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async updateEntry(id: string, additionalDuration: number): Promise<MindfulSession> {
    const session = await this.prisma.mindfulSession.findUnique({ where: { id } });
    if (!session) throw new Error('Session not found');
    return this.prisma.mindfulSession.update({
      where: { id },
      data: { duration: session.duration + additionalDuration }
    });
  }

  async deleteEntry(id: string): Promise<MindfulSession> {
    return this.prisma.mindfulSession.delete({
      where: { id }
    });
  }

  async getLatestEntry(userId: string): Promise<MindfulSession | null> {
    return this.prisma.mindfulSession.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getHistory(userId: string): Promise<MindfulSession[]> {
    return this.prisma.mindfulSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
