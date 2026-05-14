import { Test, TestingModule } from '@nestjs/testing';
import { GestacaoService } from './gestacao.service';

describe('GestacaoService', () => {
  let service: GestacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GestacaoService],
    }).compile();

    service = module.get<GestacaoService>(GestacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
