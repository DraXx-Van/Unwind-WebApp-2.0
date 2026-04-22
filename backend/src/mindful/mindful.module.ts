import { Module } from '@nestjs/common';
import { MindfulService } from './mindful.service';
import { MindfulController } from './mindful.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MindfulController],
  providers: [MindfulService, PrismaService],
})
export class MindfulModule {}
