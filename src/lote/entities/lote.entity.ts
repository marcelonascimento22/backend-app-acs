// lote.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vacina } from '../../vacina/entities/vacina.entity';

@Entity('lote')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column({ type: 'date' })
  validade: string;

  @Column({ type: 'int', default: 0 })
  quantidade: number;

  @ManyToOne(() => Vacina, vacina => vacina.lotes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vacina_id' })
  vacina?: Vacina;
}