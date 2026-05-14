import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosZonasController } from './usuarios_zonas.controller';
import { UsuariosZonasService } from './usuarios_zonas.service';

describe('UsuariosZonasController', () => {
  let controller: UsuariosZonasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosZonasController],
      providers: [UsuariosZonasService],
    }).compile();

    controller = module.get<UsuariosZonasController>(UsuariosZonasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
