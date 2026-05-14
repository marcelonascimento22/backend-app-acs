import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Agenda } from '../../agenda/entities/agenda.entity';
import { Agendamento } from '../../agendamento/entities/agendamento.entity';

@Entity('slot')
@Unique(['agenda', 'horario'])
export class Slot {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Agenda, (agenda) => agenda.slots, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'agenda_id' })
  agenda?: Agenda;

  @Column({ type: 'time' })
  horario?: string;

  @Column()
  capacidade?: number;

  @Column({ default: 0 })
  ocupados?: number;

  @OneToMany(() => Agendamento, (agendamento) => agendamento.slot)
  agendamentos?: Agendamento[];

  @Column({ name: 'status',default: true })
  status?: boolean;

  @CreateDateColumn()
  @Column({ name: 'created_at' })
  createdAt?: Date;
}