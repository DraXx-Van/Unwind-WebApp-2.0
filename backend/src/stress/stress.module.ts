import { Module } from '@nestjs/common';
import { StressService } from './stress.service';
import { StressController } from './stress.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StressController],
  providers: [StressService, PrismaService],
})
export class StressModule {}
