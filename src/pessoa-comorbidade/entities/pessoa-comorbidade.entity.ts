import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, Unique } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Comorbidade } from '../../comorbidade/entities/comorbidade.entity';

@Entity('pessoa_comorbidade')
@Unique(['pessoa', 'comorbidade'])
export class PessoaComorbidade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pessoa, (p) => p.comorbidades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoa;

  @ManyToOne(() => Comorbidade, (c) => c.pessoas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comorbidade_id' })
  comorbidade: Comorbidade;

  @Column({
    name: 'data_diagnostico', // 👈 ESSENCIAL
    type: 'date',
    nullable: true,
  })
  dataDiagnostico: Date | null;


  @Column({ type: 'text', nullable: true })
  observacao: string;

  @Column({ default: 'ativo' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}