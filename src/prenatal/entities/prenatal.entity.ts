import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Gestacao } from '../../gestacao/entities/gestacao.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';

@Entity('prenatal')
export class Prenatal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Gestacao, (gestacao) => gestacao.prenatais, {
    onDelete: 'CASCADE',
  })

  @JoinColumn({ name: 'gestacao_id' })
  gestacao: Gestacao;

  @OneToOne(() => Consulta)
  @JoinColumn({ name: 'consulta_id' })
  consulta: Consulta;

  @Column({ type: 'date' })
  dataConsulta: Date;

  @Column({ nullable: true })
  idadeGestacional: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  pesoGestante: number;

  @Column({ length: 7, nullable: true })
  pressaoArterial: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  alturaUterina: number;

  @Column({ nullable: true })
  batimentosFetais: number;

  @Column({ type: 'text', nullable: true })
  examesSolicitados: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;
}