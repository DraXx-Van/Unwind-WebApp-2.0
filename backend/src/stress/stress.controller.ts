import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { StressService } from './stress.service';

@Controller('stress')
export class StressController {
  constructor(private readonly stressService: StressService) {}

  @Post()
  async createEntry(@Body() body: { userId: string; value: number; stressor: string; impact: string }) {
    if (!body.userId) throw new BadRequestException('userId is required');
    return this.stressService.createEntry(body.userId, {
      value: body.value,
      stressor: body.stressor,
      impact: body.impact,
    });
  }

  @Get('latest')
  async getLatestEntry(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.stressService.getLatestEntry(userId);
  }

  @Get('history')
  async getHistory(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.stressService.getHistory(userId);
  }
}
