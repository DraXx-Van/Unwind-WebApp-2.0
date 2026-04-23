import { Controller, Post, Get, Delete, Body, UseGuards, Req, Param } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorGuard } from './mentor.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mentor')
export class MentorController {
    constructor(private readonly mentorService: MentorService) { }

    @Post('register')
    async register(@Body() body: { name: string; email: string; password: string; specialization?: string }) {
        return this.mentorService.register(body.name, body.email, body.password, body.specialization);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        return this.mentorService.login(body.email, body.password);
    }

    @UseGuards(MentorGuard)
    @Get('me')
    async getProfile(@Req() req: any) {
        return this.mentorService.getProfile(req.user.sub);
    }

    @UseGuards(MentorGuard)
    @Post('code/generate')
    async generateCode(@Req() req: any) {
        return this.mentorService.generateCode(req.user.sub);
    }

    @UseGuards(MentorGuard)
    @Get('code/active')
    async getActiveCode(@Req() req: any) {
        return this.mentorService.getActiveCode(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Post('code/join')
    async joinWithCode(@Req() req: any, @Body() body: { code: string }) {
        return this.mentorService.joinWithCode(req.user.sub, body.code);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-mentors')
    async getMyMentors(@Req() req: any) {
        return this.mentorService.getMyMentors(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('disconnect/:mentorId')
    async disconnectMentor(@Req() req: any, @Param('mentorId') mentorId: string) {
        return this.mentorService.disconnectMentor(req.user.sub, mentorId);
    }

    @UseGuards(MentorGuard)
    @Get('students')
    async getStudents(@Req() req: any) {
        return this.mentorService.getStudents(req.user.sub);
    }

    @UseGuards(MentorGuard)
    @Get('students/:userId/details')
    async getStudentDetail(@Req() req: any, @Param('userId') userId: string) {
        return this.mentorService.getStudentDetail(req.user.sub, userId);
    }
}
