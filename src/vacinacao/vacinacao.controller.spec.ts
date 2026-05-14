import { Test, TestingModule } from '@nestjs/testing';
import { VacinacaoController } from './vacinacao.controller';
import { VacinacaoService } from './vacinacao.service';

describe('VacinacaoController', () => {
  let controller: VacinacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacinacaoController],
      providers: [VacinacaoService],
    }).compile();

    controller = module.get<VacinacaoController>(VacinacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
