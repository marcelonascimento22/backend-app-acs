import { Test, TestingModule } from '@nestjs/testing';
import { PrenatalService } from './prenatal.service';

describe('PrenatalService', () => {
  let service: PrenatalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrenatalService],
    }).compile();

    service = module.get<PrenatalService>(PrenatalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
