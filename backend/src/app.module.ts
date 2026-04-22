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

@Module({
  imports: [AuthModule, AssessmentModule, JournalModule, MoodModule, StressModule, SleepModule, MindfulModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
