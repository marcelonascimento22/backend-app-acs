import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vacinacao } from './entities/vacinacao.entity';
import { UpdateVacinacaoDto } from './dto/update-vacinacao.dto';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { Vacina } from 'src/vacina/entities/vacina.entity';
import { CreateVacinacaoDto } from './dto/create-vacinacao.dto';

@Injectable()
export class VacinacaoService {

  constructor(
    @InjectRepository(Vacinacao)
    private vacinacaoRepository: Repository<Vacinacao>,

    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,

    @InjectRepository(Vacina)
    private vacinaRepository: Repository<Vacina>,
  ) {}

async create(dto: CreateVacinacaoDto) {
  const pessoa = await this.pessoaRepository.findOne({
    where: { id: dto.pessoaId },
  });

  if (!pessoa) {
    throw new NotFoundException('Pessoa não encontrada');
  }

  const vacina = await this.vacinaRepository.findOne({
    where: { id: dto.vacinaId },
  });

  if (!vacina) {
    throw new NotFoundException('Vacina não encontrada');
  }

  const jaExiste = await this.vacinacaoRepository.findOne({
    where: {
      pessoa: { id: dto.pessoaId },
      vacina: { id: dto.vacinaId },
      dose: dto.dose,
    },
  });

  if (jaExiste) {
    throw new NotFoundException('Essa dose já foi registrada');
}

  const vacinacao = this.vacinacaoRepository.create({
    pessoa,
    vacina,
    dose: dto.dose,
    dataAplicacao: dto.dataAplicacao,
    lote: dto.lote,
  });

  return this.vacinacaoRepository.save(vacinacao);
}

  findAll() {
    return this.vacinacaoRepository.find({
      relations: ['pessoa', 'vacina'],
      order: { dataAplicacao: 'DESC' },
    });
  }

  async findOne(id: number) {
    const vacinacao = await this.vacinacaoRepository.findOne({
      where: { id },
      relations: ['pessoa', 'vacina'],
    });

    if (!vacinacao) {
      throw new NotFoundException('Registro não encontrado');
    }

    return vacinacao;
  }

  findByPessoa(pessoaId: number) {
    return this.vacinacaoRepository.find({
      where: {
        pessoa: {
          id: pessoaId
        }
      },
      relations: ['vacina'],
      order: { dataAplicacao: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateVacinacaoDto) {
    const vacinacao = await this.findOne(id);

    if (!vacinacao) {
      throw new NotFoundException('Registro não encontrado');
    }

    if (updateDto.pessoaId) {
      const pessoa = await this.pessoaRepository.findOne({
        where: { id: updateDto.pessoaId },
      });

      if (!pessoa) {
        throw new NotFoundException('Pessoa não encontrada');
      }

      vacinacao.pessoa = pessoa;
    }

    if (updateDto.vacinaId) {
      const vacina = await this.vacinaRepository.findOne({
        where: { id: updateDto.vacinaId },
      });

      if (!vacina) {
        throw new NotFoundException('Vacina não encontrada');
      }

      vacinacao.vacina = vacina;
    }

    if (updateDto.dataAplicacao) {
      vacinacao.dataAplicacao = new Date(updateDto.dataAplicacao);
    }

    if (updateDto.dose) {
      vacinacao.dose = updateDto.dose;
    }

    if (updateDto.lote) {
      vacinacao.lote = updateDto.lote;
    }

    return this.vacinacaoRepository.save(vacinacao);
  }

  async remove(id: number) {
    const result = await this.vacinacaoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Registro não encontrado');
    }

    return { message: 'Registro removido com sucesso' };
  }




}