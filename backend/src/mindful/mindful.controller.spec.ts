import { Test, TestingModule } from '@nestjs/testing';
import { MindfulController } from './mindful.controller';

describe('MindfulController', () => {
  let controller: MindfulController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MindfulController],
    }).compile();

    controller = module.get<MindfulController>(MindfulController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
