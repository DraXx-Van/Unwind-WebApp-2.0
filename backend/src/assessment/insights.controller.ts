import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('today')
  async getTodayInsights(@Req() req: any) {
    // Use the authenticated user's ID from the JWT token
    return this.insightsService.getTodayInsights(req.user.sub);
  }
}
