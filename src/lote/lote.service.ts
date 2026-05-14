import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Vacina } from '../vacina/entities/vacina.entity';
import { Lote } from './entities/lote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoteService {
  constructor(
    @InjectRepository(Lote)
    private loteRepository: Repository<Lote>,
    @InjectRepository(Vacina)
    private vacinaRepository: Repository<Vacina>,
  ) {}
  async create(dto: CreateLoteDto) {
  const vacina = await this.vacinaRepository.findOne({
    where: { id: dto.vacinaId },
  });

  if (!vacina) {
    throw new NotFoundException('Vacina não encontrada');
  }

  const existe = await this.loteRepository.findOne({
    where: {
      codigo: dto.codigo,
      vacina: { id: dto.vacinaId },
    },
  });

  if (existe) {
    throw new NotFoundException('Lote já existe para essa vacina');
  }

  const lote = this.loteRepository.create({
    codigo: dto.codigo,
    validade: dto.validade,
    quantidade: dto.quantidade,
    vacina,
  });

  return this.loteRepository.save(lote);
}

  findAll() {
    return `This action returns all lote`;
  }

  findOne(id: number) {
    return this.loteRepository.findOne({
      where: { id },
      relations: ['vacina'],
    });
  }

  findByVacina(id: number) {
    return this.loteRepository.find({
      where: { vacina: { id } },
      relations: ['vacina'],
    });
  }

  update(id: number, updateLoteDto: UpdateLoteDto) {
    return `This action updates a #${id} lote`;
  }

  remove(id: number) {
    return `This action removes a #${id} lote`;
  }
}
