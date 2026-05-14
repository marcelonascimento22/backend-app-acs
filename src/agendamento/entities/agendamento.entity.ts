import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Slot } from '../../slot/entities/slot.entity';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';




@Entity('agendamento')
@Unique(['pessoa', 'slot'])
export class Agendamento {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Pessoa, (pessoa) => pessoa.agendamentos, {
    nullable: false,
  })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa?: Pessoa;


  @ManyToOne(() => Slot, (slot) => slot.agendamentos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'slot_id' })
  slot?: Slot;

  @Column({ default: 'AGENDADO' })
  status?: String;



  // ✅ CORREÇÃO PRINCIPAL
  @Column({ type: 'date' })
  data?: string | Date;

  // ✅ corrigido
  @Column({ type: 'text', nullable: true })
  observacao?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}