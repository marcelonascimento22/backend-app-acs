import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PessoaComorbidade } from '../../pessoa-comorbidade/entities/pessoa-comorbidade.entity';

@Entity('comorbidade')
export class Comorbidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ length: 10, nullable: true })
  cid: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(
    () => PessoaComorbidade,
    (pc) => pc.comorbidade,
  )
  pessoas: PessoaComorbidade[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}