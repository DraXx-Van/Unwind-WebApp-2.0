import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ConfirmAppointmentDto {
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    meetLink: string;
}
