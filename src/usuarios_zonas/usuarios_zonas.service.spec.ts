import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosZonasService } from './usuarios_zonas.service';

describe('UsuariosZonasService', () => {
  let service: UsuariosZonasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosZonasService],
    }).compile();

    service = module.get<UsuariosZonasService>(UsuariosZonasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
