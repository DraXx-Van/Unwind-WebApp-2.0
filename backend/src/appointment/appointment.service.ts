import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ConfirmAppointmentDto } from './dto/confirm-appointment.dto';
import { ChatService } from '../chat/chat.service';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class AppointmentService {
    constructor(
        private prisma: PrismaService,
        private chatService: ChatService,
        private chatGateway: ChatGateway,
    ) {}

    async create(userId: string, dto: CreateAppointmentDto) {
        const appointment = await this.prisma.appointment.create({
            data: {
                studentId: userId,
                mentorId: dto.mentorId,
                startTime: new Date(dto.startTime),
                topic: dto.topic,
                status: 'PENDING',
            },
        });

        // Create a special message in the chat
        const savedMessage = await this.chatService.saveMessage({
            content: `Appointment Request: ${dto.topic || 'General Session'} at ${new Date(dto.startTime).toLocaleString()}`,
            senderType: 'student',
            type: 'appointment_request',
            studentId: userId,
            mentorId: dto.mentorId,
            appointmentId: appointment.id,
        });

        // Broadcast to the room
        const roomName = `room_${userId}_${dto.mentorId}`;
        this.chatGateway.server.to(roomName).emit('newMessage', savedMessage);

        return appointment;
    }

    async confirm(mentorId: string, id: string, dto: ConfirmAppointmentDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) throw new NotFoundException('Appointment not found');
        if (appointment.mentorId !== mentorId) throw new ForbiddenException('Not authorized');

        const updated = await this.prisma.appointment.update({
            where: { id },
            data: {
                status: 'CONFIRMED',
                meetLink: dto.meetLink,
            },
        });

        // Create a special message in the chat
        const savedMessage = await this.chatService.saveMessage({
            content: `Appointment Confirmed! Join here: ${dto.meetLink}`,
            senderType: 'mentor',
            type: 'appointment_confirmed',
            studentId: appointment.studentId,
            mentorId: appointment.mentorId,
            appointmentId: updated.id,
        });

        // Broadcast to the room
        const roomName = `room_${appointment.studentId}_${appointment.mentorId}`;
        this.chatGateway.server.to(roomName).emit('newMessage', savedMessage);

        return updated;
    }

    async findAll(userId: string, role: 'student' | 'mentor') {
        return this.prisma.appointment.findMany({
            where: role === 'student' ? { studentId: userId } : { mentorId: userId },
            include: {
                student: { select: { name: true, email: true } },
                mentor: { select: { name: true, email: true } },
            },
            orderBy: { startTime: 'desc' },
        });
    }
}
