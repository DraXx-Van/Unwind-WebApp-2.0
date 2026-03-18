import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MoodService } from './mood.service';

@Controller('mood')
export class MoodController {
    constructor(private readonly moodService: MoodService) { }

    @Post()
    async createMood(@Body() body: { mood: string; date?: string }) {
        // Hardcoded userId for now, similar to other modules
        const userId = 'user-1';
        return this.moodService.createOrUpdateMood(userId, body.mood, body.date);
    }

    @Get('today')
    async getTodayMood() {
        const userId = 'user-1';
        return this.moodService.getMoodByDate(userId);
    }

    @Get('history')
    async getHistory() {
        const userId = 'user-1';
        return this.moodService.getMoodHistory(userId);
    }
}
