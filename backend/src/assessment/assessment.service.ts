
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';

@Injectable()
export class AssessmentService {
    constructor(private prisma: PrismaService) { }

    async create(createAssessmentDto: CreateAssessmentDto) {
        return this.prisma.assessment.create({
            data: createAssessmentDto,
        });
    }

    async findAll() {
        return this.prisma.assessment.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
}
