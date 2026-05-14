import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Prenatal } from './entities/prenatal.entity';
import { Gestacao } from '../gestacao/entities/gestacao.entity';
import { Agenda } from '../agenda/entities/agenda.entity';

import { CreatePrenatalDto } from './dto/create-prenatal.dto';
import { Consulta } from 'src/consulta/entities/consulta.entity';

@Injectable()
export class PrenatalService {
  constructor(
    @InjectRepository(Prenatal)
    private prenatalRepo: Repository<Prenatal>,

    @InjectRepository(Gestacao)
    private gestacaoRepo: Repository<Gestacao>,

    @InjectRepository(Agenda)
    private agendaRepo: Repository<Agenda>,

    @InjectRepository(Consulta)
    private consultaRepo: Repository<Consulta>,
  ) {}

  // ✅ Criar consulta de pré-natal
  async create(gestacaoId: number, dto: CreatePrenatalDto) {
    const gestacao = await this.gestacaoRepo.findOne({
      where: { id: gestacaoId },
      relations: ['pessoa'], // 🔥 importante
    });

    if (!gestacao) {
      throw new NotFoundException('Gestação não encontrada');
    }

    const pessoa = gestacao.pessoa;

    // 1️⃣ cria consulta (CORE)
    const consulta = await this.consultaRepo.save({
      pessoa,
      dataConsulta: dto.dataConsulta,
      tipo: 'prenatal',
      status: 'realizada',
      observacoes: dto.observacoes,
    });

    // 2️⃣ cria prenatal (DETALHE)
    const prenatal = await this.prenatalRepo.save({
      consulta,
      gestacao,
      idadeGestacional: dto.idadeGestacional,
      pesoGestante: dto.pesoGestante,
      pressaoArterial: dto.pressaoArterial,
      alturaUterina: dto.alturaUterina,
      batimentosFetais: dto.batimentosFetais,
      examesSolicitados: dto.examesSolicitados,
    });

    // 🔥 3️⃣ vincula agenda corretamente
    await this.vincularAgenda(pessoa.id, consulta);

    return {
      consulta,
      prenatal,
    };
  }

  // 🔗 Vincular com agenda (marcar como realizado)
  private async vincularAgenda(
    pessoaId: number,
    consulta: Consulta,
  ) {
    const agenda = await this.agendaRepo.findOne({
      where: {
        pessoa: { id: pessoaId },
        tipo: 'prenatal',
        status: 'pendente',
      },
      order: {
        dataPrevista: 'ASC',
      },
    });

    if (!agenda) return;

    agenda.status = 'realizado';
    agenda.consulta = consulta;

    await this.agendaRepo.save(agenda);
  }

  // 📋 Listar todos de uma gestação
  async findByGestacao(gestacaoId: number) {
    return this.prenatalRepo.find({
      where: {
        gestacao: { id: gestacaoId },
      },
      order: {
        dataConsulta: 'ASC',
      },
    });
  }

  // 🔍 Buscar um
  async findOne(id: number) {
    const prenatal = await this.prenatalRepo.findOne({
      where: { id },
      relations: ['gestacao'],
    });

    if (!prenatal) {
      throw new NotFoundException('Pré-natal não encontrado');
    }

    return prenatal;
  }

  // ✏️ Atualizar
  async update(id: number, dto: Partial<CreatePrenatalDto>) {
    const prenatal = await this.findOne(id);

    Object.assign(prenatal, dto);

    return this.prenatalRepo.save(prenatal);
  }

  // ❌ Remover
  async remove(id: number) {
    const prenatal = await this.findOne(id);

    return this.prenatalRepo.remove(prenatal);
  }
}