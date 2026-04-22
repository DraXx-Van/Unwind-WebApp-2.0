
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
    constructor(private readonly journalService: JournalService) { }

    @Post()
    async create(@Req() req: any, @Body() journalData: { title?: string; content: string; emotion: string }) {
        return this.journalService.create(req.user.sub, journalData);
    }

    @Get('count')
    async count(@Req() req: any) {
        return this.journalService.count(req.user.sub);
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        return this.journalService.findOne(req.user.sub, id);
    }

    @Get()
    async findAll(@Req() req: any) {
        return this.journalService.findAll(req.user.sub);
    }

    @Delete(':id')
    async delete(@Req() req: any, @Param('id') id: string) {
        return this.journalService.delete(req.user.sub, id);
    }
}
