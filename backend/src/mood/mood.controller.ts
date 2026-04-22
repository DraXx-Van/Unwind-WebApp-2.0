import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { MoodService } from './mood.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mood')
@UseGuards(JwtAuthGuard)
export class MoodController {
    constructor(private readonly moodService: MoodService) { }

    @Post()
    async createMood(@Req() req: any, @Body() body: { mood: string; date?: string }) {
        return this.moodService.createOrUpdateMood(req.user.sub, body.mood, body.date);
    }

    @Get('today')
    async getTodayMood(@Req() req: any) {
        return this.moodService.getMoodByDate(req.user.sub);
    }

    @Get('history')
    async getHistory(@Req() req: any) {
        return this.moodService.getMoodHistory(req.user.sub);
    }
}
