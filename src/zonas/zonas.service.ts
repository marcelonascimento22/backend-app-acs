import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Zona } from './entities/zona.entity';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { UsuariosZona } from 'src/usuarios_zonas/entities/usuarios_zona.entity';

@Injectable()
export class ZonasService {

  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,

    @InjectRepository(UsuariosZona)
    private readonly usuariosZonaRepository: Repository<UsuariosZona>,
  ) {}

  // LISTAR TODAS AS ZONAS
  async findAll() {

    return this.zonaRepository.query(`
      SELECT
        z.id,
        z.nome,
        z.descricao,
        ST_AsGeoJSON(z.geometria)::json AS geometria
      FROM zonas z
    `);

  }

  // BUSCAR ZONA POR ID
  async findOne(id: number) {

    const zona = await this.zonaRepository.query(`
      SELECT
        z.id,
        z.nome,
        z.descricao,
        ST_AsGeoJSON(z.geometria)::json AS geometria
      FROM zonas z
      WHERE z.id = $1
    `, [id]);

    if (!zona.length) {
      throw new NotFoundException('Zona não encontrada');
    }

    return zona[0];

  }

  // CRIAR ZONA
  async create(createZonaDto: CreateZonaDto) {

    const { nome, descricao, geometria } = createZonaDto;

    //console.log("DTO recebido:", createZonaDto);
    //console.log("Geometria recebida:", geometria);

    try {
      const result = await this.zonaRepository.query(
        `
          INSERT INTO zonas (nome, descricao, geometria)
          VALUES (
            $1,
            $2,
            ST_SetSRID(ST_GeomFromGeoJSON($3),4326)
          )
          RETURNING id
        `,
        [
          nome,
          descricao,
          JSON.stringify(geometria)
        ]
      );

      return result[0];

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // ATUALIZAR GEOMETRIA DA ZONA
  async updateGeometria(id: number, geometria: any) {

    const result = await this.zonaRepository.query(`
      UPDATE zonas
      SET geometria = ST_SetSRID(ST_GeomFromGeoJSON($1),4326)
      WHERE id = $2
    `,
    [
      JSON.stringify(geometria),
      id
    ]);

    if (!result) {
      throw new NotFoundException('Zona não encontrada');
    }

    return { message: 'Geometria atualizada com sucesso' };

  }

  // ATUALIZAR DADOS DA ZONA (NOME, DESCRIÇÃO, ACS)
  async update(id: number, dto: UpdateZonaDto) {

    const zona = await this.zonaRepository.findOne({
      where: { id },
    });

    if (!zona) {
      throw new NotFoundException('Zona não encontrada');
    }

    if (dto.nome !== undefined) {
      zona.nome = dto.nome;
    }

    if (dto.descricao !== undefined) {
      zona.descricao = dto.descricao;
    }

    await this.zonaRepository.save(zona);

    // atualizar geometria se enviada
    if (dto.geometria !== undefined) {

      await this.zonaRepository.query(`
        UPDATE zonas
        SET geometria = ST_SetSRID(ST_GeomFromGeoJSON($1),4326)
        WHERE id = $2
      `,
      [
        JSON.stringify(dto.geometria),
        id
      ]);

    }

    return { message: 'Zona atualizada com sucesso' };

  }

  // REMOVER ZONA
  async remove(id: number) {
    const zona = await this.zonaRepository.findOne({
      where: { id },
    });

    if (!zona) {
      throw new NotFoundException('Zona não encontrada');
    }

    // Corrigido para o TypeORM entender a relação baseada no seu @JoinColumn
    await this.usuariosZonaRepository.delete({
      zona: { id: id } // Passando o objeto com o id interno que ele resolverá para 'zona_id'
    });

    // remove zona
    await this.zonaRepository.delete(id);

    return {
      message: 'Zona removida com sucesso',
    };
  }

}