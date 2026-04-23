
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';

@Injectable()
export class AssessmentService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createAssessmentDto: CreateAssessmentDto) {
        return this.prisma.assessment.create({
            data: {
                ...createAssessmentDto,
                userId,
            },
        });
    }

    async findLatest(userId: string) {
        return this.prisma.assessment.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAll(userId: string) {
        return this.prisma.assessment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(userId: string, id: number, data: any) {
        return this.prisma.assessment.update({
            where: { id: Number(id), userId },
            data,
        });
    }
}
