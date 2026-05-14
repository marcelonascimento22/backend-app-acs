import { Test, TestingModule } from '@nestjs/testing';
import { PessoaComorbidadeService } from './pessoa-comorbidade.service';

describe('PessoaComorbidadeService', () => {
  let service: PessoaComorbidadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PessoaComorbidadeService],
    }).compile();

    service = module.get<PessoaComorbidadeService>(PessoaComorbidadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
