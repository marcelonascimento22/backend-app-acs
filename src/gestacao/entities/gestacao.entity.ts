import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from 'src/pessoa/entities/pessoa.entity';
import { Prenatal } from 'src/prenatal/entities/prenatal.entity';

@Entity()
export class Gestacao {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'data_ultima_menstruacao', type: 'date' })
  dataUltimaMenstruacao: Date;

  @Column({ name: 'data_prevista_parto', type: 'date', nullable: true })
  dataPrevistaParto: Date;

  @Column({ name: 'alto_risco', type: 'boolean', default: false })
  altoRisco: boolean;

  @Column({ name: 'observacoes', type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Pessoa)
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoa;

  @OneToMany(() => Prenatal, (prenatal) => prenatal.gestacao)
  prenatais: Prenatal[];
}