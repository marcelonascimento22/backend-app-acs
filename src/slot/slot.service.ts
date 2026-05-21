import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Slot } from "./entities/slot.entity";
import { Repository } from "typeorm";
import { CreateSlotDto } from "./dto/create-slot.dto";
import { Agenda } from "../agenda/entities/agenda.entity";
import { UpdateSlotDto } from "./dto/update-slot.dto";

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private repo: Repository<Slot>,

    @InjectRepository(Agenda)
    private agendaRepo: Repository<Agenda>,
  ) {}

  async create(dto: CreateSlotDto) {
    const agenda = await this.agendaRepo.findOne({
      where: { id: dto.agendaId },
    });

    if (!agenda) {
      throw new NotFoundException('Agenda não encontrada');
    }

    const existe = await this.repo.findOne({
      where: {
        agenda: { id: dto.agendaId },
        horario: dto.horario,
      },
    });

    if (existe) {
      throw new BadRequestException('Horário já existe');
    }

    const slot = this.repo.create({
      agenda,
      horario: dto.horario,
      capacidade: dto.capacidade,
    });

    return this.repo.save(slot);
  }

  findByAgenda(agendaId: number) {
    return this.repo.find({
      where: { agenda: { id: agendaId } },
      relations: ['agendamentos'],
      order: { horario: 'ASC' },
    });
  }

  async update(id: number, dto: UpdateSlotDto) {
    const slot = await this.repo.findOne({
      where: { id },
      relations: ['agendamentos', 'agenda'],
    });

    if (!slot) {
      throw new NotFoundException('Slot não encontrado');
    }

    if (dto.ocupados !== undefined) {
      const ocupados = (dto.ocupados !== undefined) ? Number((slot.ocupados || 0) + dto.ocupados) : (slot.ocupados || 0);

      if ((slot.ocupados || 0) < ocupados) {
        throw new BadRequestException(
          'Capacidade menor que ocupados',
        );
      }
    }

    if (dto.horario) {
      const existe = await this.repo.findOne({
        where: {
          agenda: { id: slot.agenda.id },
          horario: dto.horario,
        },
      });

      if (existe && existe.id !== id) {
        throw new BadRequestException('Horário duplicado');
      }
    }

    Object.assign(slot, dto);
    return this.repo.save(slot);
  }

  async ocupar(id: number) {
  const slot = await this.repo.findOne({ where: { id } });

  if (!slot) throw new NotFoundException('Slot não encontrado');

  if (slot.ocupados >= slot.capacidade) {
    throw new BadRequestException('Slot cheio');
  }

  await this.repo.increment({ id }, 'ocupados', 1);

  return { message: 'Vaga ocupada com sucesso' };
}

  async remove(id: number) {
    const slot = await this.repo.findOne({
      where: { id },
      relations: ['agendamentos'],
    });

    if (!slot) {
      throw new NotFoundException('Slot não encontrado');
    }

    if (slot.agendamentos.length > 0) {
      throw new BadRequestException(
        'Não pode remover slot com agendamentos',
      );
    }

    return this.repo.remove(slot);
  }
}