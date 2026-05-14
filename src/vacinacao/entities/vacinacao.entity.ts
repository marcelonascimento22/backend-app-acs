import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Vacina } from '../../vacina/entities/vacina.entity';

@Entity()
export class Vacinacao {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'data_aplicacao', type: 'date' })
  dataAplicacao?: Date;

  @Column({ name: 'dose', nullable: true })
  dose?: string;

  @Column({ name: 'lote', nullable: true })
  lote?: string;

  @Column({ name: 'pessoa_id' })
  pessoaId?: number;

  @ManyToOne(() => Vacina, (vacina) => vacina.vacinacoes)
  @JoinColumn({ name: 'vacina_id' })
  vacina?: Vacina;

  @ManyToOne(() => Pessoa, pessoa => pessoa.vacinacoes)
  @JoinColumn({ name: 'pessoa_id' })
  pessoa?: Pessoa;

}