import { Controller, Post, Body, UseGuards, Request, Patch, Param, Get } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ConfirmAppointmentDto } from './dto/confirm-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Post()
    async create(@Request() req, @Body() dto: CreateAppointmentDto) {
        return this.appointmentService.create(req.user.sub, dto);
    }

    @Patch(':id/confirm')
    async confirm(@Request() req, @Param('id') id: string, @Body() dto: ConfirmAppointmentDto) {
        return this.appointmentService.confirm(req.user.sub, id, dto);
    }

    @Get()
    async findAll(@Request() req) {
        // Assuming role is attached to req.user during JWT validation
        const role = req.user.role || 'student'; 
        return this.appointmentService.findAll(req.user.sub, role as any);
    }
}
