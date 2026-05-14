import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsuariosZona } from './entities/usuarios_zona.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Zona } from '../zonas/entities/zona.entity';

@Injectable()
export class UsuariosZonasService {
  constructor(
    @InjectRepository(UsuariosZona)
    private readonly usuariosZonasRepository: Repository<UsuariosZona>,

    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,

    @InjectRepository(Zona)
    private readonly zonasRepository: Repository<Zona>,
  ) {}

  // 🔹 Vincular usuário a zona (COM PROTEÇÃO DE DUPLICIDADE)
  async vincularUsuarioZona(usuarioId: number, zonaId: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const zona = await this.zonasRepository.findOne({
      where: { id: zonaId },
    });

    if (!zona) {
      throw new NotFoundException('Zona não encontrada');
    }

    // 🔥 evita duplicidade
    const existente = await this.usuariosZonasRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        zona: { id: zonaId },
      },
      relations: {
        usuario: true,
        zona: true,
      },
    });

    if (existente) {
      return existente;
    }

    const vinculo = this.usuariosZonasRepository.create({
      usuario,
      zona,
    });

    return await this.usuariosZonasRepository.save(vinculo);
  }

  // 🔹 Listar zonas de um usuário (OTIMIZADO)
  async listarZonasPorUsuario(usuarioId: number) {
    return await this.usuariosZonasRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: {
        zona: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  // 🔹 Listar usuários de uma zona (OTIMIZADO)
  async listarUsuariosPorZona(zonaId: number) {
    return await this.usuariosZonasRepository.find({
      where: {
        zona: { id: zonaId },
      },
      relations: {
        usuario: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  // 🔹 Remover vínculo
async removerPorZona(zonaId: number) {
  return this.usuariosZonasRepository.delete({
    zona: { id: zonaId }
  });
}

  async removerVinculo(id: number) {
    const vinculo = await this.usuariosZonasRepository.findOne({
      where: { id },
    });

    if (!vinculo) {
      throw new NotFoundException('Vínculo não encontrado');
    }

    return await this.usuariosZonasRepository.remove(vinculo);
  }

  async substituirUsuarioDaZona(usuarioId: number, zonaId: number) {
    await this.removerPorZona(zonaId);

    return this.vincularUsuarioZona(usuarioId, zonaId);
  }
}