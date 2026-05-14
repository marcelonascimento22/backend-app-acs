import { Test, TestingModule } from '@nestjs/testing';
import { PrenatalController } from './prenatal.controller';
import { PrenatalService } from './prenatal.service';

describe('PrenatalController', () => {
  let controller: PrenatalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrenatalController],
      providers: [PrenatalService],
    }).compile();

    controller = module.get<PrenatalController>(PrenatalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
