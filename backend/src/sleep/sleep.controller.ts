import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { SleepService } from './sleep.service';

@Controller('sleep')
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  // --- Schedule ---
  @Post('schedule')
  async setSchedule(@Body() body: { userId: string; isEveryday: boolean; isToday: boolean; sleepTime: string; wakeTime: string; snoozeLength: number; autoStats: boolean; autoAlarm: boolean }) {
    if (!body.userId) throw new BadRequestException('userId is required');
    return this.sleepService.setSchedule(body.userId, body);
  }

  @Get('schedule')
  async getSchedule(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.sleepService.getSchedule(userId);
  }

  // --- Entries ---
  @Post()
  async createEntry(@Body() body: { userId: string; duration: number; sleepTime: string; wakeTime: string; quality?: number; rem?: number; core?: number; post?: number }) {
    if (!body.userId) throw new BadRequestException('userId is required');
    return this.sleepService.createEntry(body.userId, {
      duration: body.duration,
      sleepTime: body.sleepTime,
      wakeTime: body.wakeTime,
      quality: body.quality,
      rem: body.rem,
      core: body.core,
      post: body.post
    });
  }

  @Get('latest')
  async getLatestEntry(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.sleepService.getLatestEntry(userId);
  }

  @Get('weekly-quality')
  async getWeeklyQuality(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    const score = await this.sleepService.getWeeklyQualityScore(userId);
    return { score };
  }

  @Get('history')
  async getHistory(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.sleepService.getHistory(userId);
  }
}

