
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('assessment')
@UseGuards(JwtAuthGuard)
export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) { }

    @Post()
    create(@Req() req: any, @Body() createAssessmentDto: CreateAssessmentDto) {
        return this.assessmentService.create(req.user.sub, createAssessmentDto);
    }

    @Get('latest')
    findLatest(@Req() req: any) {
        return this.assessmentService.findLatest(req.user.sub);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.assessmentService.findAll(req.user.sub);
    }
}
