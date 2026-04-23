import { Controller, Get, Post, Body, Query, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { SleepService } from './sleep.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sleep')
@UseGuards(JwtAuthGuard)
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  // --- Schedule ---
  @Post('schedule')
  async setSchedule(@Req() req: any, @Body() body: { isEveryday: boolean; isToday: boolean; sleepTime: string; wakeTime: string; snoozeLength: number; autoStats: boolean; autoAlarm: boolean }) {
    const userId = req.user.sub;
    return this.sleepService.setSchedule(userId, body);
  }

  @Get('schedule')
  async getSchedule(@Req() req: any) {
    const userId = req.user.sub;
    return this.sleepService.getSchedule(userId);
  }

  // --- Entries ---
  @Post()
  async createEntry(@Req() req: any, @Body() body: { duration: number; sleepTime: string; wakeTime: string; quality?: number; rem?: number; core?: number; post?: number }) {
    const userId = req.user.sub;
    return this.sleepService.createEntry(userId, {
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
  async getLatestEntry(@Req() req: any) {
    const userId = req.user.sub;
    return this.sleepService.getLatestEntry(userId);
  }

  @Get('weekly-quality')
  async getWeeklyQuality(@Req() req: any) {
    const userId = req.user.sub;
    const score = await this.sleepService.getWeeklyQualityScore(userId);
    return { score };
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user.sub;
    return this.sleepService.getHistory(userId);
  }
}

