import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Familia } from '../../familia/entities/familia.entity';
import { Visita } from '../../visita/entities/visita.entity';
import { Vacinacao } from '../../vacinacao/entities/vacinacao.entity';
import { PessoaComorbidade } from '../../pessoa-comorbidade/entities/pessoa-comorbidade.entity';
import { Gestacao } from '../../gestacao/entities/gestacao.entity';
import { Agendamento } from '../../agendamento/entities/agendamento.entity';


@Entity()
export class Pessoa {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: '' })
  nome?: string;

  @Column({ nullable: true })
  cpf?: string;

  @Column({ nullable: true })
  sus?: string;

  @Column({ 
    name: 'data_nascimento',
    type: 'date',
    nullable: true
  })
  dataNascimento?: string | Date;

  @Column({ nullable: true })
  sexo?: string;

  @Column({ nullable: true })
  telefone?: string;

  @ManyToOne(() => Familia, (familia) => familia.pessoas)
  @JoinColumn({ name: 'familia_id' })
  familia?: Familia;

  @OneToMany(() => Visita, visita => visita.pessoa)
  visitas?: Visita[];

  @OneToMany(() => Vacinacao, vacinacao => vacinacao.pessoa)
  vacinacoes?: Vacinacao[];

  @OneToMany(() => Gestacao, gestacao => gestacao.pessoa)
  gestacao?: Gestacao[];

  @OneToMany(
  () => PessoaComorbidade,
    (pc) => pc.pessoa,
  )
  comorbidades?: PessoaComorbidade[];

  @OneToMany(() => Agendamento, (agendamento) => agendamento.pessoa)
  agendamentos?: Agendamento[];

}