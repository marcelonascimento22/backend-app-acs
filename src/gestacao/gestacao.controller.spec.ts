import { Test, TestingModule } from '@nestjs/testing';
import { GestacaoController } from './gestacao.controller';
import { GestacaoService } from './gestacao.service';

describe('GestacaoController', () => {
  let controller: GestacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GestacaoController],
      providers: [GestacaoService],
    }).compile();

    controller = module.get<GestacaoController>(GestacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
