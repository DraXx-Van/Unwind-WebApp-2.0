import { Module } from '@nestjs/common';
import { SleepService } from './sleep.service';
import { SleepController } from './sleep.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SleepController],
  providers: [SleepService, PrismaService],
})
export class SleepModule {}
