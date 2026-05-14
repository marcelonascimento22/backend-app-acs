import { InjectRepository } from "@nestjs/typeorm";
import { DataSource } from 'typeorm';
import { Agenda } from "./entities/agenda.entity";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { Profissional } from "src/profissional/entities/profissional.entity";
import { CreateAgendaDto } from "./dto/create-agenda.dto";
import { UpdateAgendaDto } from "./dto/update-agenda.dto";
import { Slot } from "src/slot/entities/slot.entity";
import { from } from "rxjs";
import { Agendamento } from "src/agendamento/entities/agendamento.entity";

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda)
    private repo: Repository<Agenda>,

    @InjectRepository(Profissional)
    private profissionalRepo: Repository<Profissional>,

    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    private dataSource: DataSource,
  ) {}

  async create(dto: CreateAgendaDto) {
    ////console.log('DTO recebido:', dto);

    const profissional = await this.profissionalRepo.findOne({
      where: { id: dto.profissionalId },
    });

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    // ✅ Corrige problema de timezone (NUNCA muda o dia)
    const [ano, mes, dia] = String(dto.dataPrevista)
      .split('-')
      .map(Number);

    const data = new Date(ano, mes - 1, dia);
    data.setHours(0, 0, 0, 0);

    // Função auxiliar
    const toMinutes = (hora: string) => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };

    const inicioMin = toMinutes(String(dto.horaInicio));
    const fimMin = toMinutes(String(dto.horaFim));
    const quantidade = Number(dto.quantidadeAtendimentos);

    // ✅ Validações
    if (fimMin <= inicioMin) {
      throw new BadRequestException(
        'Hora fim deve ser maior que hora início',
      );
    }

    if (quantidade <= 0) {
      throw new BadRequestException('Quantidade inválida');
    }

    // ✅ Verifica duplicidade
    const existe = await this.repo.findOne({
      where: {
        dataPrevista: data,
        profissional: { id: dto.profissionalId },
        horaInicio: dto.horaInicio,
        horaFim: dto.horaFim,
        status: 'ATIVO',
      },
    });

    if (existe) {
      throw new BadRequestException(
        'Agenda já existe para esse dia e horário',
      );
    }

    const totalMinutos = fimMin - inicioMin;
    const intervalo = totalMinutos / quantidade;

    if (intervalo <= 0) {
      throw new BadRequestException('Intervalo inválido');
    }

    // ✅ Cria agenda
    const agenda = this.repo.create({
      dataPrevista: data,
      profissional,
      observacoes: dto.observacoes,
      createdAt: new Date(),
      ativo: true,
      horaInicio: dto.horaInicio,
      horaFim: dto.horaFim,
    });

    const agendaSalva = await this.repo.save(agenda);
    ////console.log('Agenda criada:', agendaSalva);

    // ✅ Geração de slots segura
    const slots: Slot[] = [];
    const horariosGerados = new Set<string>();

    for (let i = 0; i < quantidade; i++) {
      const minutos = Math.round(inicioMin + i * intervalo);

      if (minutos >= fimMin) break;

      const horas = Math.floor(minutos / 60)
        .toString()
        .padStart(2, '0');

      const mins = (minutos % 60)
        .toString()
        .padStart(2, '0');

      const horario = `${horas}:${mins}`;

      // evita horários duplicados
      if (horariosGerados.has(horario)) continue;

      horariosGerados.add(horario);

      slots.push(
        this.slotRepo.create({
          agenda: agendaSalva,
          horario,
          capacidade: 1,
          ocupados: 0,
        }),
      );
    }

    await this.slotRepo.save(slots);

    // ✅ Retorna completo com relações
    return await this.repo.findOne({
      where: { id: agendaSalva.id },
      relations: ['slots', 'profissional', 'profissional.usuario'],
    });
  }

  findAll() {
  return this.repo.find({
    relations: ['profissional', 'profissional.usuario', 'slots'],
    order: {
      dataPrevista: 'ASC',
      slots: {
        horario: 'ASC', 
      },
    },
  });
  }

  findBydataPrevista(dataPrevista: string) {
    ////console.log('findBydataPrevista ', dataPrevista)
    return this.repo.find({
      where: { 
        dataPrevista: new Date(dataPrevista).toLocaleDateString("sv-SE")
      },
      relations: ['slots', 'slots.agendamentos'],
    });
  }

  async findByPessoa(pessoaId: number) {
  return this.repo.find({
    where: { pessoa: { id: pessoaId } },
    relations: ['pessoa'],
    order: { dataPrevista: 'ASC' },
  });
  }

  async findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['pessoa'],
    });
  }

  async cancelar(id: number) {
    const agenda = await this.findOne(id);

    if (!agenda) throw new Error('Agenda não encontrada');

    agenda.status = 'CANCELADO';

    return this.repo.save(agenda);
  }

  async realizarAtendimento(id: number) {
    const agenda = await this.findOne(id);

    if (!agenda) throw new Error('Agenda não encontrada');

    agenda.status = 'REALIZADO';

    return this.repo.save(agenda);
  }

  async update(id: number, dto: UpdateAgendaDto) {
    const agenda = await this.repo.findOne({
      where: { id },
      relations: ['slots', 'slots.agendamentos'],
    });

    if (!agenda) {
      throw new NotFoundException('Agenda não encontrada');
    }

    const temAgendamento = agenda.slots.some(
      (slot) => slot.agendamentos.length > 0,
    );

    if (temAgendamento) {
      throw new BadRequestException(
        'Não pode alterar agenda com agendamentos',
      );
    }

    Object.assign(agenda, dto);
    return this.repo.save(agenda);
  }

  async remove(id: number) {
    // 1. Atualiza os slots da agenda
    await this.slotRepo.update(
      { agenda: { id } },
      { status: 'CANCELADO' }
    );

    // 2. Busca a agenda
    const agenda = await this.repo.findOne({
      where: { id },
      relations: ['slots'], // opcional (caso queira garantir carregamento)
    });

    if (!agenda) {
      throw new NotFoundException('Agenda não encontrada');
    }

    // 3. Remove a agenda
    return await this.repo.remove(agenda);
  }

  async cancelamentoAgenda(agendaId: number, obs: string) {
  await this.dataSource.transaction(async (manager) => {

    // 1. Cancela a agenda
    await manager.update('agenda', agendaId, {
      status: 'CANCELADO',
      observacoes: `CANCELADO: ${obs}`,
    });

    // 2. Busca os slots da agenda
    const slots = await manager.find(Slot, {
      where: {
        agenda: { id: agendaId }
      }
    });

    const slotIds = slots.map(s => s.id);

    if (slotIds.length === 0) return;

    // 3. Cancela os slots + zera ocupação
    await manager.update('slot',
      { id: In(slotIds) },
      {
        status: false,
        ocupados: 0
      }
    );

    // 4. Cancela os agendamentos vinculados
    await manager
    .createQueryBuilder()
    .update(Agendamento)
    .set({
      status: 'CANCELADO',
      observacao: `CANCELADO PELA UNIDADE: ${obs}`
    })
    .where('slot_id IN (:...slotIds)', { slotIds })
    .execute();

  });
}

  async getDisponibilidade(data: string) {

    return this.repo.find({
      where: { dataPrevista: new Date(data).toLocaleDateString("sv-SE") },
      relations: ['agendamentos'],
    });
  }

async getDiasDisponiveis(): Promise<string[]> {
  const result = await this.repo
    .createQueryBuilder('agenda')
    .innerJoin('agenda.slots', 'slot')
    .where('slot.ocupados < slot.capacidade and agenda.ativo = true')
    .select("agenda.data_prevista::date", "data")
    .distinct(true)
    .orderBy("agenda.data_prevista::date", "ASC")
    .getRawMany();

  ////console.log('Dias disponíveis:', result);
  return result.map((r) => r.data);
}
}