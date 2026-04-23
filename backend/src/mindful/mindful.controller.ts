import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { MindfulService } from './mindful.service';

@Controller('mindful')
export class MindfulController {
  constructor(private readonly mindfulService: MindfulService) {}

  @Post()
  async createEntry(@Body() body: { userId: string; activity: string; duration: number; plannedDuration: number; category: string; timeOfDay: string }) {
    if (!body.userId) throw new BadRequestException('userId is required');
    return this.mindfulService.createEntry(body.userId, {
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
  async getLatestEntry(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.mindfulService.getLatestEntry(userId);
  }

  @Get('history')
  async getHistory(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.mindfulService.getHistory(userId);
  }
}
