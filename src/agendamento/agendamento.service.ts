import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateAgendamentoDto } from "./dto/update-agendamento.dto";
import { CreateAgendamentoDto } from "./dto/create-agendamento.dto";
import { Pessoa } from "../pessoa/entities/pessoa.entity";
import { Between, DataSource, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Slot } from "../slot/entities/slot.entity";
import {
  Agendamento
} from "./entities/agendamento.entity";

@Injectable()
export class AgendamentoService {
  constructor(
    @InjectRepository(Agendamento)
    private repo: Repository<Agendamento>,

    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    @InjectRepository(Pessoa)
    private pessoaRepo: Repository<Pessoa>,

    private dataSource: DataSource
  ) {}

  // =========================
  // CREATE
  // =========================
  async create(dto: CreateAgendamentoDto) {
    ////console.log("Criando agendamento com dados:", dto);

    const pessoa = await this.pessoaRepo.findOne({
      where: { id: dto.pessoaId },
    });

    if (!pessoa) {
      throw new NotFoundException("Pessoa não encontrada");
    }

    const slot = await this.slotRepo.findOne({
      where: { id: dto.slotId },
    });

    if (!slot) {
      throw new NotFoundException("Slot não encontrado");
    }

    // 🔒 Conta real no banco (fonte da verdade)
    const ocupados = await this.repo.count({
      where: {
        slot: { id: dto.slotId },
        status: Not('CANCELADO'),
      },
    });

    if (ocupados >= slot.capacidade) {
      throw new BadRequestException("Sem vagas");
    }


    // 🔁 Evita duplicidade
    const existe = await this.repo.findOne({
      where: {
        pessoa: { id: dto.pessoaId },
        slot: { id: dto.slotId },
        status: Not('CANCELADO'),
      },
    });

    if (existe) {
      throw new BadRequestException("Já agendado");
    }

    try {
      const agendamento = this.repo.create({
        pessoa,
        slot,
        observacao: dto.observacao,
        data: dto.data,
        status: dto.status ?? 'AGENDADO',
      });

      await this.slotRepo.increment(
        { id: dto.slotId },
        "ocupados",
        1
      );


      return await this.repo.save(agendamento);
    } catch (error) {
      // 🔥 fallback da trigger
      if (error.code === "P0001") {
        throw new BadRequestException("Esse horário já está lotado");
      }
      throw error;
    }
  }

  // =========================
  // LISTAR TODOS
  // =========================
  findAll() {
    return this.repo.find({
      relations: ["pessoa", "slot", "slot.agenda"],
      order: { createdAt: "DESC" },
    });
  }

  // =========================
  // BUSCAR UM
  // =========================
  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ["pessoa", "slot", "slot.agenda"],
    });
  }

  // =========================
  // POR PESSOA
  // =========================
  findByPessoa(pessoaId: number) {
    return this.repo.find({
      where: { 
        pessoa: { id: pessoaId },
        status: 'AGENDADO',
      },
      relations: [
        'pessoa',
        'slot',
        'slot.agenda',
        'slot.agenda.profissional',
        'slot.agenda.profissional.usuario',
      ],
    });
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, dto: UpdateAgendamentoDto) {
    const agendamento = await this.repo.findOne({
      where: { id },
      relations: ["slot", "pessoa"],
    });

    if (!agendamento) {
      throw new NotFoundException("Agendamento não encontrado");
    }

    // 🔁 Troca de slot
    if (dto.slotId) {
      const novoSlot = await this.slotRepo.findOne({
        where: { id: dto.slotId },
      });

      if (!novoSlot) {
        throw new NotFoundException("Slot não encontrado");
      }

      const ocupados = await this.repo.count({
        where: {
          slot: { id: dto.slotId },
          status: Not('CANCELADO'),
        },
      });

      if (ocupados >= novoSlot.capacidade) {
        throw new BadRequestException("Sem vagas");
      }

      const existe = await this.repo.findOne({
        where: {
          pessoa: { id: agendamento.pessoa?.id },
          slot: { id: dto.slotId },
          status: Not('CANCELADO'),
        },
      });

      if (existe) {
        throw new BadRequestException("Já agendado nesse horário");
      }

      agendamento.slot = novoSlot;
    }

    if (dto.status) {
      agendamento.status = dto.status;
    }

    if (dto.observacao !== undefined) {
      agendamento.observacao = dto.observacao;
    }

    return this.repo.save(agendamento);
  }

  async updateStatus(id: number, status: string) {
    ////console.log("satus recebido para atualização:", status);
    const agendamento = await this.repo.findOne({
      where: { id },
      relations: ["slot", "pessoa"],
    });

    if (!agendamento) {
      throw new NotFoundException("Agendamento não encontrado");
    }

    agendamento.status = status ?? 'CONCLUIDO';

    return this.repo.save(agendamento);
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const agendamento = await this.repo.findOne({
      where: { id },
    });

    if (!agendamento) {
      throw new NotFoundException("Agendamento não encontrado");
    }

    return this.repo.remove(agendamento);
  }

  // =========================
  // CANCELAR (SEM mexer em ocupados)
  // =========================
  async cancelarAgendamento(id: number) {
    ////console.log("Cancelando agendamento com ID:", id);

    return this.dataSource.transaction(async (manager) => {
      const agendamento = await manager.findOne(Agendamento, {
        where: { id },
      });

      if (!agendamento) {
        throw new NotFoundException("Agendamento não encontrado");
      }

      if (agendamento.status === 'CANCELADO') {
        throw new BadRequestException("Já está cancelado");
      }

      agendamento.status = 'CANCELADO';

      return await manager.save(agendamento);
    });
  }

  async cancelamentoAgenda(agendaId: number, Obs: string) {
  const agendamentos = await this.repo.find({
    where: {
      slot: {
        agenda: {
          id: agendaId
        }
      }
    },
    relations: ['slot', 'slot.agenda']
  });

  for (const agendamento of agendamentos) {
    agendamento.observacao = `CANCELADO: ${Obs}`;
  }

  await this.repo.save(agendamentos);
}

  async buscarPorDataEUsuario(data: string, userId: number) {
    return this.repo.find({
      where: {
        data: data,
        slot: {
          agenda: {
            profissional: {
              usuario: {
                id: userId,
              },
            },
          },
        },
      },
      relations: [
        'pessoa',
        'slot',
        'slot.agenda',
        'slot.agenda.profissional',
        'slot.agenda.profissional.usuario',
      ],
      order: {
        slot: {
          horario: 'ASC',
        },
      },
    });
  }

  async findByDate(data: string) {
    const inicio = new Date(data);
    const fim = new Date(data);

    fim.setHours(23, 59, 59, 999);

    return this.repo.find({
      where: {
        data: Between(inicio, fim),
      },
      relations: ['pessoa', 'slot'],
      order: {
        slot: { horario: 'ASC' },
      },
    });
  }

  async datasComAgendamento() {
    const result = await this.repo
      .createQueryBuilder('agendamento')
      .select('DATE(agendamento.data)', 'data')
      .groupBy('data')
      .getRawMany();

    return result.map(r => r.data);
  }
}