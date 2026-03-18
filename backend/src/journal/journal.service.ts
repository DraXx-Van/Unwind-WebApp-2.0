
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Journal, Prisma } from '@prisma/client';

@Injectable()
export class JournalService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.JournalCreateInput): Promise<Journal> {
        return this.prisma.journal.create({
            data,
        });
    }

    async findAll(): Promise<Journal[]> {
        return this.prisma.journal.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async delete(id: string): Promise<Journal> {
        return this.prisma.journal.delete({
            where: { id },
        });
    }
}
