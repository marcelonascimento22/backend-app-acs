import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";
import { Pessoa } from "../../pessoa/entities/pessoa.entity";
import { Prenatal } from "../../prenatal/entities/prenatal.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Agendamento } from "../../agendamento/entities/agendamento.entity";
import { Profissional } from "../../profissional/entities/profissional.entity";
import { Agenda } from "../../agenda/entities/agenda.entity";

@Entity('consulta')
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profissional_id' })
  profissionalId: number;

  @Column({ 
    name: 'data_consulta',
    type: 'date', 
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataConsulta?: string | Date;

  @Column()
  tipo: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  observacoes: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ nullable: true })
  diagnostico: string;

  @Column({ nullable: true })
  prescricao: string;

  @ManyToOne(() => Pessoa)
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoa;

  @OneToOne(() => Prenatal, (prenatal) => prenatal.consulta)
  prenatal: Prenatal;

  @OneToMany(() => Profissional, (profissional) => profissional.consultas)
  profissional?: Profissional;

  @ManyToOne(() => Agendamento)
  @JoinColumn({ name: 'agendamento_id' })
  agendamento: Agendamento;
}

