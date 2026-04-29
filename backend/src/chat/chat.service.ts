import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async saveMessage(data: { content: string, senderType: string, studentId: string, mentorId: string, type?: string, appointmentId?: string }) {
        return this.prisma.message.create({
            data: {
                content: data.content,
                senderType: data.senderType,
                studentId: data.studentId,
                mentorId: data.mentorId,
                type: data.type || 'text',
                appointmentId: data.appointmentId,
            }
        });
    }

    async getHistory(studentId: string, mentorId: string) {
        return this.prisma.message.findMany({
            where: {
                studentId,
                mentorId,
            },
            orderBy: {
                createdAt: 'asc',
            }
        });
    }
}
