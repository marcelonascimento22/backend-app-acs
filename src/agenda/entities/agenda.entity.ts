import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';
import { Slot } from '../../slot/entities/slot.entity';

@Entity('agenda')
@Unique(['dataPrevista', 'profissional'])
export class Agenda {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Pessoa, { eager: true })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa?: Pessoa;

  @Column({ name: 'data_prevista', type: 'date' })
  dataPrevista?: string | Date;

  @Column({ length: 50 })
  tipo?: string; 
  // ex: prenatal, vacina, visita_domiciliar

  @Column({ length: 20, default: 'ATIVO' })
  status?: string;

  @Column({ default: true })
  ativo?: boolean;

  @ManyToOne(() => Consulta, { nullable: true })
  @JoinColumn({ name: 'consulta_id' })
  consulta?: Consulta;

  @Column({ nullable: true })
  observacoes?: string;

  @Column({ default: 'normal' })
  prioridade?: string;

  @Column({ name: 'quatidade_atendimentos', nullable: true })
  quantidadeAtendimentos?: number;

  @Column({ name: 'hora_inicio', nullable: true })
  horaInicio?: string;

  @Column({ name: 'hora_fim', nullable: true })
  horaFim?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @ManyToOne(() => Profissional, (profissional) => profissional.agendas, {
    nullable: false,
  })
  @JoinColumn({ name: 'profissional_id' })
  profissional?: Profissional;


  @OneToMany(() => Slot, (slot) => slot.agenda, {
    cascade: true,
  })
  slots?: Slot[];
}