import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gestacao } from './entities/gestacao.entity';
import { CreateGestacaoDto } from './dto/create-gestacao.dto';
import { UpdateGestacaoDto } from './dto/update-gestacao.dto';
import { Pessoa } from '../pessoa/entities/pessoa.entity';

@Injectable()
export class GestacaoService {

  constructor(
    @InjectRepository(Gestacao)
    private gestacaoRepository: Repository<Gestacao>,

    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
  ) {}

  async create(createGestacaoDto: CreateGestacaoDto) {

    const gestacao = this.gestacaoRepository.create({
      ...createGestacaoDto,
      pessoa: { id: createGestacaoDto.pessoaId },
    });

    return this.gestacaoRepository.save(gestacao);
  }

  async findAll() {
    return this.gestacaoRepository.find({
      relations: ['pessoa'],
    });
  }

  async findOne(id: number) {
    return this.gestacaoRepository.findOne(
      {
        where: { id },
        relations: ['pessoa']
      }
    );
  }

  async findByPessoa(pessoaId: number){
    return this.gestacaoRepository.find(
      {
        where : {
          pessoa : {
            id: pessoaId
          }
        }
      }
    )
  }


  async update(id: number, updateGestacaoDto: UpdateGestacaoDto) {

    await this.gestacaoRepository.update(id, {
      ...updateGestacaoDto,
      pessoa: updateGestacaoDto.pessoaId
        ? { id: updateGestacaoDto.pessoaId }
        : undefined,
    });

    return this.gestacaoRepository.findOne({
      where: { id },
      relations: ['pessoa'],
    });
  }

  async remove(id: number) {
    return this.gestacaoRepository.delete(id);
  }

}