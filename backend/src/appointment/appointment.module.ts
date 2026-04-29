import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatModule } from '../chat/chat.module';

@Module({
    imports: [PrismaModule, ChatModule],
    controllers: [AppointmentController],
    providers: [AppointmentService],
})
export class AppointmentModule {}
