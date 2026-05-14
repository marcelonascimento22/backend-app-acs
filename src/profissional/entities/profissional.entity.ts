import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { Agenda } from '../../agenda/entities/agenda.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Agendamento } from 'src/agendamento/entities/agendamento.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';

@Entity('profissional')
export class Profissional {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'usuarios_id' })
  usuarioId?: number;

  @Column({ length: 100, nullable: true })
  especialidade?: string;

  @Column({ length: 20, nullable: true })
  conselho?: string;

  @Column({ name: 'numeroregistro', length: 50, nullable: true })
  numeroRegistro?: string;

  @Column({ default: true })
  ativo?: boolean;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuarios_id' })
  usuario?: Usuario;

  @OneToMany(() => Agenda, (agenda) => agenda.profissional)
  agendas?: Agenda[];

  @OneToMany(() => Consulta, (consulta) => consulta.profissional)
  consultas?: Consulta[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}