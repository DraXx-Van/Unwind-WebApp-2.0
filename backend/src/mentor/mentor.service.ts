import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MentorService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // ─── Auth ────────────────────────────────────────────────────────────

    async register(name: string, email: string, password: string, specialization?: string) {
        const existing = await this.prisma.mentor.findUnique({ where: { email } });
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const mentor = await this.prisma.mentor.create({
            data: {
                name,
                email,
                password: hashedPassword,
                specialization: specialization || 'General',
            },
        });

        const payload = { sub: mentor.id, email: mentor.email, role: 'mentor' };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user: {
                id: mentor.id,
                name: mentor.name,
                email: mentor.email,
                specialization: mentor.specialization,
                role: 'mentor',
            },
        };
    }

    async login(email: string, password: string) {
        const mentor = await this.prisma.mentor.findUnique({ where: { email } });
        if (!mentor) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, mentor.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { sub: mentor.id, email: mentor.email, role: 'mentor' };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user: {
                id: mentor.id,
                name: mentor.name,
                email: mentor.email,
                specialization: mentor.specialization,
                role: 'mentor',
            },
        };
    }

    async getProfile(mentorId: string) {
        const mentor = await this.prisma.mentor.findUnique({
            where: { id: mentorId },
            select: { id: true, name: true, email: true, specialization: true, createdAt: true },
        });
        if (!mentor) throw new UnauthorizedException('Mentor not found');
        return { ...mentor, role: 'mentor' };
    }

    // ─── Code Generation ─────────────────────────────────────────────────

    private generateSixDigitCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async generateCode(mentorId: string) {
        // Expire any existing active codes for this mentor
        await this.prisma.mentorCode.updateMany({
            where: { mentorId, used: false, expiresAt: { gt: new Date() } },
            data: { used: true },
        });

        // Generate a unique code
        let code: string;
        let attempts = 0;
        do {
            code = this.generateSixDigitCode();
            const exists = await this.prisma.mentorCode.findUnique({ where: { code } });
            if (!exists) break;
            attempts++;
        } while (attempts < 10);

        // Create new code valid for 24 hours
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const mentorCode = await this.prisma.mentorCode.create({
            data: {
                code,
                mentorId,
                expiresAt,
            },
        });

        return {
            code: mentorCode.code,
            expiresAt: mentorCode.expiresAt,
        };
    }

    async getActiveCode(mentorId: string) {
        const activeCode = await this.prisma.mentorCode.findFirst({
            where: {
                mentorId,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!activeCode) return null;
        return {
            code: activeCode.code,
            expiresAt: activeCode.expiresAt,
        };
    }

    // ─── Student Join (called by student) ─────────────────────────────────

    async joinWithCode(userId: string, code: string) {
        const mentorCode = await this.prisma.mentorCode.findUnique({
            where: { code },
            include: { mentor: { select: { id: true, name: true, specialization: true } } },
        });

        if (!mentorCode) {
            throw new NotFoundException('Invalid code');
        }

        if (mentorCode.used || mentorCode.expiresAt < new Date()) {
            throw new UnauthorizedException('Code has expired');
        }

        // Check if already linked
        const existing = await this.prisma.mentorStudent.findUnique({
            where: { mentorId_userId: { mentorId: mentorCode.mentorId, userId } },
        });

        if (existing) {
            return { message: 'Already connected', mentor: mentorCode.mentor };
        }

        // Create the link
        await this.prisma.mentorStudent.create({
            data: {
                mentorId: mentorCode.mentorId,
                userId,
            },
        });

        return {
            message: 'Successfully connected to mentor',
            mentor: mentorCode.mentor,
        };
    }

    // ─── Student's Mentors (for student dashboard) ────────────────────────

    async getMyMentors(userId: string) {
        const links = await this.prisma.mentorStudent.findMany({
            where: { userId },
            include: { mentor: { select: { id: true, name: true, specialization: true } } },
            orderBy: { createdAt: 'desc' }
        });

        const mentorsWithCount = await Promise.all(
            links.map(async (link) => {
                const messageCount = await this.prisma.message.count({
                    where: {
                        studentId: userId,
                        mentorId: link.mentor.id,
                    },
                });
                return {
                    ...link.mentor,
                    messageCount,
                };
            })
        );

        return mentorsWithCount;
    }

    async disconnectMentor(userId: string, mentorId: string) {
        await this.prisma.mentorStudent.deleteMany({
            where: {
                userId,
                mentorId,
            }
        });
        return { success: true };
    }

    // ─── Student List (for mentor dashboard) ──────────────────────────────

    async getStudents(mentorId: string) {
        const links = await this.prisma.mentorStudent.findMany({
            where: { mentorId },
            include: {
                user: {
                    select: { id: true, name: true, email: true, createdAt: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // For each student, fetch summary data
        const students = await Promise.all(
            links.map(async (link) => {
                const userId = link.user.id;

                // Latest mood
                const latestMood = await this.prisma.dailyMood.findFirst({
                    where: { userId },
                    orderBy: { date: 'desc' },
                });

                // Latest stress
                const latestStress = await this.prisma.stressEntry.findFirst({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                });

                // Latest sleep
                const latestSleep = await this.prisma.sleepEntry.findFirst({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                });

                // Journal count
                const journalCount = await this.prisma.journal.count({
                    where: { userId },
                });

                return {
                    id: link.user.id,
                    name: link.user.name,
                    email: link.user.email,
                    linkedAt: link.createdAt,
                    latestMood: latestMood?.mood || null,
                    latestStress: latestStress?.value || null,
                    latestSleep: latestSleep ? { duration: latestSleep.duration, quality: latestSleep.quality } : null,
                    journalCount,
                };
            })
        );

        return students;
    }

    // ─── Student Detail (for mentor dashboard) ────────────────────────────

    async getStudentDetail(mentorId: string, userId: string) {
        // Verify this student is linked to this mentor
        const link = await this.prisma.mentorStudent.findUnique({
            where: { mentorId_userId: { mentorId, userId } },
        });
        if (!link) throw new NotFoundException('Student not found under your mentorship');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [moods, stressEntries, sleepEntries, journals, user] = await Promise.all([
            this.prisma.dailyMood.findMany({
                where: { userId, date: { gte: sevenDaysAgo } },
                orderBy: { date: 'desc' },
            }),
            this.prisma.stressEntry.findMany({
                where: { userId, createdAt: { gte: sevenDaysAgo } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.sleepEntry.findMany({
                where: { userId, createdAt: { gte: sevenDaysAgo } },
                orderBy: { createdAt: 'desc' },
            }),
            // Only titles + emotions for privacy
            this.prisma.journal.findMany({
                where: { userId, createdAt: { gte: sevenDaysAgo } },
                select: { id: true, title: true, emotion: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, email: true },
            }),
        ]);

        return {
            student: user,
            moods,
            stressEntries,
            sleepEntries,
            journals,
        };
    }
}
