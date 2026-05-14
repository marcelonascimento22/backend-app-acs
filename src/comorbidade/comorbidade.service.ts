import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { Comorbidade } from './entities/comorbidade.entity';
import { CreateComorbidadeDto } from './dto/create-comorbidade.dto';
import { UpdateComorbidadeDto } from './dto/update-comorbidade.dto';

@Injectable()
export class ComorbidadeService {
  constructor(
    @InjectRepository(Comorbidade)
    private repo: Repository<Comorbidade>,
  ) {}

  // 🟢 CRIAR
  async create(dto: CreateComorbidadeDto) {
    const existe = await this.repo.findOne({
      where: { nome: dto.nome },
    });

    if (existe) {
      throw new BadRequestException('Comorbidade já cadastrada');
    }

    const comorbidade = this.repo.create(dto);
    return this.repo.save(comorbidade);
  }

  // 🟢 LISTAR TODAS
  async findAll(nome?: string) {
    if (nome) {
      return this.repo.find({
        where: { nome: ILike(`%${nome}%`) },
        order: { nome: 'ASC' },
      });
    }

    return this.repo.find({
      order: { nome: 'ASC' },
    });
  }

  // 🟢 BUSCAR UMA
  async findOne(id: number) {
    const comorbidade = await this.repo.findOneBy({ id });

    if (!comorbidade) {
      throw new NotFoundException('Comorbidade não encontrada');
    }

    return comorbidade;
  }

  // 🟢 ATUALIZAR
  async update(id: number, dto: UpdateComorbidadeDto) {
    const comorbidade = await this.findOne(id);

    if (dto.nome !== undefined) {
      comorbidade.nome = dto.nome;
    }

    if (dto.descricao !== undefined) {
      comorbidade.descricao = dto.descricao;
    }

    if (dto.cid !== undefined) {
      comorbidade.cid = dto.cid;
    }

    if (dto.ativo !== undefined) {
      comorbidade.ativo = dto.ativo;
    }

    return this.repo.save(comorbidade);
  }

  // 🟢 REMOVER (soft delete lógico)
  async remove(id: number) {
    const comorbidade = await this.findOne(id);

    comorbidade.ativo = false;

    return this.repo.save(comorbidade);
  }
}