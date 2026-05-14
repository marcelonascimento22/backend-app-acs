import { Test, TestingModule } from '@nestjs/testing';
import { VacinaService } from './vacina.service';

describe('VacinaService', () => {
  let service: VacinaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacinaService],
    }).compile();

    service = module.get<VacinaService>(VacinaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
