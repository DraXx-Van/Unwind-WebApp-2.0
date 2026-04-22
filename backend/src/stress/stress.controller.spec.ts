import { Test, TestingModule } from '@nestjs/testing';
import { StressController } from './stress.controller';

describe('StressController', () => {
  let controller: StressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StressController],
    }).compile();

    controller = module.get<StressController>(StressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
