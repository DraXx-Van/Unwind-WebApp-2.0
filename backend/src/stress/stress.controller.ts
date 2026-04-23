import { Controller, Get, Post, Body, Query, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { StressService } from './stress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stress')
@UseGuards(JwtAuthGuard)
export class StressController {
  constructor(private readonly stressService: StressService) {}

  @Post()
  async createEntry(@Req() req: any, @Body() body: { value: number; stressor: string; impact: string }) {
    const userId = req.user.sub;
    return this.stressService.createEntry(userId, {
      value: body.value,
      stressor: body.stressor,
      impact: body.impact,
    });
  }

  @Get('latest')
  async getLatestEntry(@Req() req: any) {
    const userId = req.user.sub;
    return this.stressService.getLatestEntry(userId);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user.sub;
    return this.stressService.getHistory(userId);
  }
}
