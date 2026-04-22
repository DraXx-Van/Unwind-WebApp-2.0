
import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [AssessmentController, InsightsController],
    providers: [AssessmentService, InsightsService, PrismaService],
})
export class AssessmentModule { }
