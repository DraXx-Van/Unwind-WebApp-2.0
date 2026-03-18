import { Test, TestingModule } from '@nestjs/testing';
import { MindfulService } from './mindful.service';

describe('MindfulService', () => {
  let service: MindfulService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MindfulService],
    }).compile();

    service = module.get<MindfulService>(MindfulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
