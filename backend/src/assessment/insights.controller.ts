import { Controller, Get, Query } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('today')
  async getTodayInsights(@Query('userId') userId = 'user-1') {
    return this.insightsService.getTodayInsights(userId);
  }
}
