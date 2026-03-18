import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { SleepService } from './sleep.service';

@Controller('sleep')
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Post()
  async createEntry(@Body() body: { userId: string; duration: number; sleepTime: string; wakeTime: string; quality: number }) {
    if (!body.userId) throw new BadRequestException('userId is required');
    return this.sleepService.createEntry(body.userId, {
      duration: body.duration,
      sleepTime: body.sleepTime,
      wakeTime: body.wakeTime,
      quality: body.quality,
    });
  }

  @Get('latest')
  async getLatestEntry(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.sleepService.getLatestEntry(userId);
  }

  @Get('history')
  async getHistory(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.sleepService.getHistory(userId);
  }
}
