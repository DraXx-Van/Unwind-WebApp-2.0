import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { MindfulService } from './mindful.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mindful')
@UseGuards(JwtAuthGuard)
export class MindfulController {
  constructor(private readonly mindfulService: MindfulService) {}

  @Post()
  async createEntry(@Req() req: any, @Body() body: { activity: string; duration: number; plannedDuration: number; category: string; timeOfDay: string }) {
    const userId = req.user.sub;
    return this.mindfulService.createEntry(userId, {
      activity: body.activity,
      duration: body.duration,
      plannedDuration: body.plannedDuration,
      category: body.category,
      timeOfDay: body.timeOfDay,
    });
  }

  @Put(':id')
  async updateEntry(@Param('id') id: string, @Body() body: { additionalDuration: number }) {
    if (!body.additionalDuration) throw new BadRequestException('additionalDuration is required');
    return this.mindfulService.updateEntry(id, body.additionalDuration);
  }

  @Delete(':id')
  async deleteEntry(@Param('id') id: string) {
    if (!id) throw new BadRequestException('id is required');
    return this.mindfulService.deleteEntry(id);
  }

  @Get('latest')
  async getLatestEntry(@Req() req: any) {
    const userId = req.user.sub;
    return this.mindfulService.getLatestEntry(userId);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user.sub;
    return this.mindfulService.getHistory(userId);
  }
}
