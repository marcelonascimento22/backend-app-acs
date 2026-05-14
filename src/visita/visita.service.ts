import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Visita } from './entities/visita.entity';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { Familia } from 'src/familia/entities/familia.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class VisitaService {

  constructor(
    @InjectRepository(Visita)
    private visitaRepository: Repository<Visita>,

    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,

    @InjectRepository(Familia)
    private familiaRepository: Repository<Familia>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

async create(dto: CreateVisitaDto) {
  // 1. Busca a Pessoa incluindo a relação com a Família
  // E dentro da Família, buscamos o ACS (assumindo que o nome da relação na Família seja 'acs')
  const pessoa = await this.pessoaRepository.findOne({
    where: { id: dto.pessoaId },
    relations: ['familia', 'familia.acs'], // Carrega as relações em cadeia
  });

  // 2. Validações de integridade
  if (!pessoa) {
    throw new NotFoundException('Pessoa não encontrada');
  }

  if (!pessoa.familia) {
    throw new NotFoundException('Esta pessoa não possui uma família vinculada.');
  }

  const familia = pessoa.familia;
  const acs = familia.acs; // O ACS que está vinculado à família

  if (!acs) {
    throw new NotFoundException('Esta família não possui um ACS responsável.');
  }

  // 3. Cria a visita com os dados encontrados
  const visita = this.visitaRepository.create({
    dataVisita: dto.dataVisita || new Date().toLocaleDateString("sv-SE"),
    tipoVisita: dto.tipoVisita,
    situacaoFamilia: dto.situacaoFamilia ?? null,
    encaminhamento: dto.encaminhamento ?? false,
    observacoes: dto.observacoes ?? null,
    
    // Atribui os objetos completos (o TypeORM salvará os IDs corretos nas colunas acs_id e familia_id)
    pessoa: pessoa,
    familia: familia,
    acs: acs,
  });

  //console.log(`Salvando visita para a família ${familia.id} com o ACS ${acs.id}`);
  
  return await this.visitaRepository.save(visita);
}

  findAll() {
    return this.visitaRepository.find({
      relations: ['pessoa']
    });
  }

  findOne(id: number) {
    return this.visitaRepository.findOne({
      where: { id },
      relations: ['pessoa']
    });
  }

  async update(id: number, updateVisitaDto: UpdateVisitaDto) {
    const updateData: any = {
      dataVisita: updateVisitaDto.dataVisita,
    };

    if (updateVisitaDto.pessoaId) {
      const pessoa = await this.pessoaRepository.findOne({
        where: { id: updateVisitaDto.pessoaId }
      });
      if (!pessoa) {
        throw new Error('Pessoa not found');
      }
      updateData.pessoa = pessoa;
    }

    await this.visitaRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.visitaRepository.delete(id);
  }

  async listarVisitas(pessoaId: number) {
    return this.pessoaRepository
      .createQueryBuilder('pessoa') // ✅ alias correto
      .leftJoin('pessoa.visitas', 'visita')
      .select([
        'pessoa.id AS id',
        'pessoa.nome AS nome',
        'MAX(visita.dataVisita) AS ultimaVisita',
      ])
      .where('pessoa.id = :pessoaId', { pessoaId }) // ✅ usa o parâmetro
      .groupBy('pessoa.id')
      .addGroupBy('pessoa.nome') // ✅ necessário
      .orderBy('MAX(visita.dataVisita)', 'ASC', 'NULLS FIRST')
      .addOrderBy('pessoa.nome', 'ASC')
      .getRawMany();
  }

  async findByUsuario(userId: number) {
    // 1. Buscar o profissional (ACS) pelo usuário
    const acs = await this.usuarioRepository.findOne({
      where: {
        id: userId,
        perfil: 'ACS', // Garante que é um ACS
      },
    });

    if (!acs) {
      throw new NotFoundException('ACS não encontrado');
    }

    // 2. Buscar visitas desse ACS
    return this.familiaRepository.find({
      where: {
        acsId: acs.id , // ou "acs"
      },
      relations: ['pessoas', 'pessoas.visitas'], 
    });
  }
}
