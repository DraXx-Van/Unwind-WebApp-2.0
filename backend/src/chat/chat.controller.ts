import { Controller, Get, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @UseGuards(JwtAuthGuard)
    @Get('history/:studentId/:mentorId')
    async getHistory(@Req() req: any, @Param('studentId') studentId: string, @Param('mentorId') mentorId: string) {
        // Enforce basic authorization check: you must be the student or the mentor
        const userId = req.user.sub;
        if (userId !== studentId && userId !== mentorId) {
            throw new UnauthorizedException('You do not have access to this chat history');
        }

        return this.chatService.getHistory(studentId, mentorId);
    }
}
