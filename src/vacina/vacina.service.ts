import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vacina } from './entities/vacina.entity';
import { CreateVacinaDto } from './dto/create-vacina.dto';
import { UpdateVacinaDto } from './dto/update-vacina.dto';
import { Console } from 'console';

@Injectable()
export class VacinaService {
  constructor(
    @InjectRepository(Vacina)
    private vacinaRepository: Repository<Vacina>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateVacinaDto) {
    //console.log('Criando vacina com dados:', dto);
    const existe = await this.vacinaRepository.findOne({
      where: { 
                nome: dto.nome,
                lotes: {
                  codigo: dto.lote,
                }
              },
    });

    if (existe) {
      throw new NotFoundException('Vacina já cadastrada');
    }

    const vacina = this.vacinaRepository.create(dto);
    return this.vacinaRepository.save(vacina);
  }

  // ✅ LISTAR TODAS
  async findAll() {
    return this.vacinaRepository
      .createQueryBuilder('vacina')
      .leftJoinAndSelect('vacina.lotes', 'lotes')
      .orderBy('vacina.nome', 'ASC')
      .getMany();
  }

  // ✅ BUSCAR POR ID
  async findOne(id: number) {
    const vacina = await this.vacinaRepository.findOne({
      where: { id },
    });

    if (!vacina) {
      throw new NotFoundException('Vacina não encontrada');
    }

    return vacina;
  }

  // ✅ UPDATE
  async update(id: number, updateDto: UpdateVacinaDto) {
    const vacina = await this.findOne(id);

    if (updateDto.validade) {
      vacina.validade = new Date(updateDto.validade);
    }

    Object.assign(vacina, {
      nome: updateDto.nome ?? vacina.nome,
      codigo: updateDto.codigo ?? vacina.codigo,
      descricao: updateDto.descricao ?? vacina.descricao,
      fabricante: updateDto.fabricante ?? vacina.fabricante,
      lote: updateDto.lote ?? vacina.lote,
      doseRecomendada: updateDto.doseRecomendada ?? vacina.doseRecomendada,
      viaAdministracao: updateDto.viaAdministracao ?? vacina.viaAdministracao,
      grupoAlvo: updateDto.grupoAlvo ?? vacina.grupoAlvo,
      intervaloDoses: updateDto.intervaloDoses ?? vacina.intervaloDoses,
      ativa: updateDto.ativa ?? vacina.ativa,
    });

    return this.vacinaRepository.save(vacina);
  }

  // ✅ DELETE
  async remove(id: number) {
    const result = await this.vacinaRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Vacina não encontrada');
    }

    return { message: 'Vacina removida com sucesso' };
  }
}