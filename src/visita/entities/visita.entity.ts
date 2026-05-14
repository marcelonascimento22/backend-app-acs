import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Familia } from 'src/familia/entities/familia.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('visita') // Explicitly naming the table to match your DB
export class Visita {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ 
    name: 'data_visita', type: 'date'
  })
  dataVisita?: string | Date;

  @Column({ name: 'tipo_visita', length: 100 })
  tipoVisita?: string;

  @Column({ name: 'situacao_familia', type: 'text', nullable: true })
  situacaoFamilia?: string;

  @Column({ type: 'boolean', default: false })
  encaminhamento?: boolean;

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  @ManyToOne(() => Familia)
  @JoinColumn({ name: 'familia_id'})
  familia?: Familia;

  @ManyToOne(() => Pessoa)
  @JoinColumn({ name: 'pessoa_id' })
  pessoa?: Pessoa;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'acs_id' })
  acs?: Usuario;
}