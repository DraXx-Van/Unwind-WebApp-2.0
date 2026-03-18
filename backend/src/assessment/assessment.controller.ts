
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';

@Controller('assessment')
export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) { }

    @Post()
    create(@Body() createAssessmentDto: CreateAssessmentDto) {
        return this.assessmentService.create(createAssessmentDto);
    }

    @Get()
    findAll() {
        return this.assessmentService.findAll();
    }
}
