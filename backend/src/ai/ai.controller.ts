import { Controller, Post, Get, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) {}

    @UseGuards(JwtAuthGuard)
    @Get('conversations')
    async getConversations(@Req() req: any) {
        return this.aiService.getConversations(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('conversations/:id')
    async getConversation(@Req() req: any, @Param('id') id: string) {
        return this.aiService.getConversation(id, req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Post('conversations')
    async createConversation(@Req() req: any, @Body() body: { title?: string }) {
        return this.aiService.createConversation(req.user.sub, body.title);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('conversations/:id')
    async deleteConversation(@Req() req: any, @Param('id') id: string) {
        return this.aiService.deleteConversation(id, req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Post('chat')
    async chat(@Req() req: any, @Body() body: { conversationId: string; message: string }) {
        return this.aiService.sendMessage(
            req.user.sub,
            body.conversationId,
            body.message,
            req.user.name,
        );
    }
}
