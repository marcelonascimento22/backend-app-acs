import { Test, TestingModule } from '@nestjs/testing';
import { VacinaController } from './vacina.controller';
import { VacinaService } from './vacina.service';

describe('VacinaController', () => {
  let controller: VacinaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacinaController],
      providers: [VacinaService],
    }).compile();

    controller = module.get<VacinaController>(VacinaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
