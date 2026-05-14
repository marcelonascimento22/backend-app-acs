import { Test, TestingModule } from '@nestjs/testing';
import { ComorbidadeService } from './comorbidade.service';

describe('ComorbidadeService', () => {
  let service: ComorbidadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComorbidadeService],
    }).compile();

    service = module.get<ComorbidadeService>(ComorbidadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
