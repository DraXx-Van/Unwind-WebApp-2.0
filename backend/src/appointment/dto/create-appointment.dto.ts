import { IsNotEmpty, IsString, IsISO8601, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    mentorId: string;

    @IsNotEmpty()
    @IsISO8601()
    startTime: string;

    @IsOptional()
    @IsString()
    topic?: string;
}
