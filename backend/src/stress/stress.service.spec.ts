import { Test, TestingModule } from '@nestjs/testing';
import { StressService } from './stress.service';

describe('StressService', () => {
  let service: StressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StressService],
    }).compile();

    service = module.get<StressService>(StressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
