import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agenda } from '../agenda/entities/agenda.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class DisponibilidadeService {
  constructor(
    @InjectRepository(Agenda)
    private readonly agendaRepository: Repository<Agenda>,
  ) {}

  async buscar() {
    return this.agendaRepository.find(
      {
        where: {
          ativo: true,
        },
        relations: ['slots', 'profissional', "agenda"],
      }
    );
  }

  async buscarPorData(data: string) {

    ////console.log("Buscando disponibilidade para data:", data);
    ////console.log("Buscando disponibilidade para data:", new Date(data).toLocaleDateString("sv-SE"));
    const request = await this.agendaRepository.find({
      where: {
        dataPrevista: data
      },
      relations: ['slots', 'profissional', 'profissional.usuario'],
    });

    ////console.log("Disponibilidade encontrada:", request);

    return request;
  }
}