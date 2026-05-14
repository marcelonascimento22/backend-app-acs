import { Test, TestingModule } from '@nestjs/testing';
import { VacinacaoService } from './vacinacao.service';

describe('VacinacaoService', () => {
  let service: VacinacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacinacaoService],
    }).compile();

    service = module.get<VacinacaoService>(VacinacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
