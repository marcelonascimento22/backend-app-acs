import { Test, TestingModule } from '@nestjs/testing';
import { ComorbidadeController } from './comorbidade.controller';
import { ComorbidadeService } from './comorbidade.service';

describe('ComorbidadeController', () => {
  let controller: ComorbidadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComorbidadeController],
      providers: [ComorbidadeService],
    }).compile();

    controller = module.get<ComorbidadeController>(ComorbidadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
