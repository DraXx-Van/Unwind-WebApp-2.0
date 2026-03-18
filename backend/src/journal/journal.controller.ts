
import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { JournalService } from './journal.service';
import { Journal as JournalModel } from '@prisma/client';

@Controller('journal')
export class JournalController {
    constructor(private readonly journalService: JournalService) { }

    @Post()
    async create(@Body() journalData: { title?: string; content: string; emotion: string }): Promise<JournalModel> {
        return this.journalService.create(journalData);
    }

    @Get()
    async findAll(): Promise<JournalModel[]> {
        return this.journalService.findAll();
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<JournalModel> {
        return this.journalService.delete(id);
    }
}
