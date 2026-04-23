
import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';

@Module({
    controllers: [AssessmentController, InsightsController],
    providers: [AssessmentService, InsightsService],
})
export class AssessmentModule { }
