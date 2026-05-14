import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CreatePessoaComorbidadeDto } from './dto/create-pessoa-comorbidade.dto';
import { UpdatePessoaComorbidadeDto } from './dto/update-pessoa-comorbidade.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PessoaComorbidade } from './entities/pessoa-comorbidade.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { Comorbidade } from '../comorbidade/entities/comorbidade.entity';

@Injectable()
export class PessoaComorbidadeService {
  constructor(
    @InjectRepository(PessoaComorbidade)
    private repo: Repository<PessoaComorbidade>,

    @InjectRepository(Pessoa)
    private pessoaRepo: Repository<Pessoa>,

    @InjectRepository(Comorbidade)
    private comorbidadeRepo: Repository<Comorbidade>,
  ) {}

  // 🔥 PRINCIPAL (vínculo)
  async vincular(dto: CreatePessoaComorbidadeDto) {
    const pessoa = await this.pessoaRepo.findOneBy({ id: dto.pessoaId });
    const comorbidade = await this.comorbidadeRepo.findOneBy({ id: dto.comorbidadeId });

    //console.log('Data Enviada para o Backend:', dto.dataDiagnostico);

    if (!pessoa || !comorbidade) {
      throw new Error('Pessoa ou comorbidade não encontrada');
    }

    const existe = await this.repo.findOne({
      where: {
        pessoa: { id: dto.pessoaId },
        comorbidade: { id: dto.comorbidadeId },
      },
    });

    if (existe) {
      throw new Error('Já vinculado');
    }

    const relacao = this.repo.create({
      pessoa,
      comorbidade,
      dataDiagnostico: dto.dataDiagnostico
        ? new Date(dto.dataDiagnostico + 'T00:00:00')
        : null,
      observacao: dto.observacao,
      status: dto.status || 'ativo',
    });

    //console.log('Data Convertida:', relacao.dataDiagnostico);
    return this.repo.save(relacao);
  }

  // 🔥 LISTAR POR PESSOA
  async listarPorPessoa(pessoaId: number) {
    return this.repo.find({
      where: { pessoa: { id: pessoaId } },
      relations: ['comorbidade'],
    });
  }

  // 🟢 CRUD

  async create(dto: CreatePessoaComorbidadeDto) {
    const pessoa = await this.pessoaRepo.findOneBy({
      id: dto.pessoaId,
    });

    const comorbidade = await this.comorbidadeRepo.findOneBy({
      id: dto.comorbidadeId,
    });

    if (!pessoa || !comorbidade) {
      throw new NotFoundException('Pessoa ou comorbidade não encontrada');
    }

    const relacao = this.repo.create({
      pessoa,
      comorbidade,
      dataDiagnostico: dto.dataDiagnostico,
      observacao: dto.observacao,
      status: dto.status,
    });

    return this.repo.save(relacao);
  }

  async findAll() {
    return this.repo.find({
      relations: ['pessoa', 'comorbidade'],
    });
  }

  async findOne(id: number) {
    const relacao = await this.repo.findOne({
      where: { id },
      relations: ['pessoa', 'comorbidade'],
    });

    if (!relacao) {
      throw new NotFoundException('Registro não encontrado');
    }

    return relacao;
  }

  async update(id: number, dto: UpdatePessoaComorbidadeDto) {
    const relacao = await this.findOne(id);

    if (dto.status !== undefined) {
      relacao.status = dto.status;
    }

    if (dto.observacao !== undefined) {
      relacao.observacao = dto.observacao;
    }

    if (dto.dataDiagnostico !== undefined) {
      relacao.dataDiagnostico = dto.dataDiagnostico
        ? new Date(dto.dataDiagnostico)
        : null; 
    }

    return this.repo.save(relacao);
  }

  async remove(id: number) {
    const relacao = await this.findOne(id);

    return this.repo.remove(relacao);
  }
}