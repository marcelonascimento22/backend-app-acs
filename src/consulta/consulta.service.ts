import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Consulta } from './entities/consulta.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { Prenatal } from '../prenatal/entities/prenatal.entity';
import { Gestacao } from '../gestacao/entities/gestacao.entity';
import { StatusAgendamento } from './enum/StatusAgemdamento';

import { CreateConsultaDto } from './dto/create-consulta.dto';
import { Agendamento } from 'src/agendamento/entities/agendamento.entity';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta)
    private consultaRepo: Repository<Consulta>,

    @InjectRepository(Pessoa)
    private pessoaRepo: Repository<Pessoa>,

    @InjectRepository(Prenatal)
    private prenatalRepo: Repository<Prenatal>,

    @InjectRepository(Gestacao)
    private gestacaoRepo: Repository<Gestacao>,

    @InjectRepository(Agendamento)
    private agendamentoRepo: Repository<Agendamento>,
  ) {}

  // ✅ Criar consulta genérica
  async create(dto: CreateConsultaDto) {
    const pessoa = await this.pessoaRepo.findOne({
      where: { id: dto.pessoaId },
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    const consulta = this.consultaRepo.create({
      pessoa,
      profissionalId: dto.profissionalId,
      dataConsulta: dto.dataConsulta,
      tipo: dto.tipo,
      status: dto.status,
      observacoes: dto.observacoes,
    });

    return this.consultaRepo.save(consulta);
  }

  // 🔥 Criar consulta de pré-natal (fluxo completo)
  async criarConsultaPrenatal(
    pessoaId: number,
    gestacaoId: number,
    dto: any,
  ) {
    const pessoa = await this.pessoaRepo.findOne({
      where: { id: pessoaId },
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    const gestacao = await this.gestacaoRepo.findOne({
      where: { id: gestacaoId },
    });

    if (!gestacao) {
      throw new NotFoundException('Gestação não encontrada');
    }

    // 1️⃣ cria consulta
    const consulta = await this.consultaRepo.save({
      pessoa,
      dataConsulta: dto.dataConsulta,
      tipo: 'prenatal',
      status: 'realizada',
      observacoes: dto.observacoes,
    });

    // 2️⃣ cria prenatal (extensão)
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

    return {
      consulta,
      prenatal,
    };
  }

  // 📋 Listar todas (com filtro opcional)
  async findAll(tipo?: string) {
    return this.consultaRepo.find({
      where: tipo ? { tipo } : {},
      relations: ['pessoa'],
      order: {
        dataConsulta: 'DESC',
      },
    });
  }

  // 📋 Histórico da pessoa
  async findByPessoa(pessoaId: number) {
    ////console.log('Consultas da Pessoa Id:', pessoaId)
    return this.consultaRepo.find({
      where: {
        pessoa: { id: pessoaId },
      },
      order: {
        dataConsulta: 'DESC',
      },
    });
  }

  // 🔍 Buscar uma
  async findOne(id: number) {
    const consulta = await this.consultaRepo.findOne({
      where: { id },
      relations: ['pessoa', 'prenatal'],
    });

    if (!consulta) {
      throw new NotFoundException('Consulta não encontrada');
    }

    return consulta;
  }

  // ✏️ Atualizar
  async update(id: number, dto: Partial<CreateConsultaDto>) {
    const consulta = await this.findOne(id);

    Object.assign(consulta, dto);

    return this.consultaRepo.save(consulta);
  }

  // ❌ Cancelar (melhor prática)
  async cancelar(id: number) {
    const consulta = await this.findOne(id);

    consulta.status = 'cancelada';

    return this.consultaRepo.save(consulta);
  }

  // ❌ Remover
  async remove(id: number) {
    const consulta = await this.findOne(id);

    return this.consultaRepo.remove(consulta);
  }

  async atender(dto: CreateConsultaDto) {
    ////console.log('DTO: ', dto)
    const agendamento = await this.agendamentoRepo.findOne({
      where: { id: dto.agendamentoId },
      relations: ['pessoa'],
    });

    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    // cria consulta
    const consulta = this.consultaRepo.create({
      pessoa: agendamento.pessoa,
      agendamento,
      profissionalId: dto.profissionalId,
      dataConsulta: dto.dataConsulta,
      tipo: dto.tipo,
      status: dto.status,
      descricao: dto.descricao,
      diagnostico: dto.diagnostico,
      prescricao: dto.prescricao,
    });

    await this.consultaRepo.save(consulta);

    // atualiza status
    agendamento.status = StatusAgendamento.CONCLUIDO;
    await this.agendamentoRepo.save(agendamento);

    return consulta;
  }
}