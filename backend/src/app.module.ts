import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AssessmentModule } from './assessment/assessment.module';
import { JournalModule } from './journal/journal.module';
import { MoodModule } from './mood/mood.module';
import { StressModule } from './stress/stress.module';
import { SleepModule } from './sleep/sleep.module';
import { MindfulModule } from './mindful/mindful.module';
import { MentorModule } from './mentor/mentor.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule, AssessmentModule, JournalModule, MoodModule, StressModule, SleepModule, MindfulModule, MentorModule, ChatModule, AiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
