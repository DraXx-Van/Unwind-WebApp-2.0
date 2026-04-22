import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AssessmentModule } from './assessment/assessment.module';
import { JournalModule } from './journal/journal.module';
import { MoodModule } from './mood/mood.module';

@Module({
  imports: [AuthModule, AssessmentModule, JournalModule, MoodModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
