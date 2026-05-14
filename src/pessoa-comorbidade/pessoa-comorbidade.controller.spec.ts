import { Test, TestingModule } from '@nestjs/testing';
import { PessoaComorbidadeController } from './pessoa-comorbidade.controller';
import { PessoaComorbidadeService } from './pessoa-comorbidade.service';

describe('PessoaComorbidadeController', () => {
  let controller: PessoaComorbidadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoaComorbidadeController],
      providers: [PessoaComorbidadeService],
    }).compile();

    controller = module.get<PessoaComorbidadeController>(PessoaComorbidadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
