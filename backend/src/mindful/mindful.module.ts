import { Module } from '@nestjs/common';
import { MindfulService } from './mindful.service';
import { MindfulController } from './mindful.controller';

@Module({
  controllers: [MindfulController],
  providers: [MindfulService],
})
export class MindfulModule {}
