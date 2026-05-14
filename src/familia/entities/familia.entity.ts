import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Visita } from 'src/visita/entities/visita.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity()
export class Familia {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  endereco: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column({ nullable: true })
  numero: string;

  @Column({ nullable: true })
  bairro?: string;

  @Column({ nullable: true }) 
  cep?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @OneToMany(() => Pessoa, pessoa => pessoa.familia)
  pessoas: Pessoa[];

  @OneToMany(() => Visita, (visita) => visita.familia)
  visitas: Visita[];

  @ManyToOne(() => Usuario) // Ou a entidade de ACS/Usuário que você usa
  @JoinColumn({ name: 'acs_id' })
  acs: Usuario;

  
  @Column({ name: 'acs_id' })
  acsId?: number;

}