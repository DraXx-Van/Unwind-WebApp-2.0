import { Module } from '@nestjs/common';
import { StressService } from './stress.service';
import { StressController } from './stress.controller';

@Module({
  controllers: [StressController],
  providers: [StressService],
})
export class StressModule {}
