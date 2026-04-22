
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Journal } from '@prisma/client';

@Injectable()
export class JournalService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, data: { title?: string; content: string; emotion: string }): Promise<Journal> {
        return this.prisma.journal.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async findAll(userId: string): Promise<Journal[]> {
        return this.prisma.journal.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async count(userId: string): Promise<{ count: number }> {
        const count = await this.prisma.journal.count({ where: { userId } });
        return { count };
    }

    async findOne(userId: string, id: string): Promise<Journal | null> {
        return this.prisma.journal.findFirst({
            where: { id, userId },
        });
    }

    async delete(userId: string, id: string): Promise<Journal> {
        // Ensure the journal belongs to the user before deleting
        return this.prisma.journal.delete({
            where: { id, userId },
        });
    }
}
