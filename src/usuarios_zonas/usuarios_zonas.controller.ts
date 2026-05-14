import { Controller, Post, Get, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { UsuariosZonasService } from './usuarios_zonas.service';
import { CreateUsuariosZonaDto } from './dto/create-usuarios_zona.dto';

@Controller('usuarios-zonas')
export class UsuariosZonasController {
  constructor(
    private readonly usuariosZonasService: UsuariosZonasService,
  ) {}

  // 🔹 Vincular usuário a zona
  
  @Post()
  vincular(@Body() dto: CreateUsuariosZonaDto) {
    return this.usuariosZonasService.vincularUsuarioZona(dto.usuarioId, dto.zonaId);
  }

  // 🔹 Listar zonas de um usuário
  @Get('usuario/:usuarioId')
  listarZonasPorUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.usuariosZonasService.listarZonasPorUsuario(usuarioId);
  }

  // 🔹 Listar usuários de uma zona
  @Get('zona/:zonaId')
  listarUsuariosPorZona(
    @Param('zonaId', ParseIntPipe) zonaId: number,
  ) {
    return this.usuariosZonasService.listarUsuariosPorZona(zonaId);
  }

  // 🔹 Remover vínculo
@Delete('zona/:zonaId')
removerPorZona(@Param('zonaId') zonaId: number) {
  return this.usuariosZonasService.removerPorZona(zonaId);
}
}