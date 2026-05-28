import { Profissional } from '../../profissional/entities/profissional.entity';
import { UsuariosZona } from '../../usuarios_zonas/entities/usuarios_zona.entity';
import { Visita } from '../../visita/entities/visita.entity';
import { Zona } from '../../zonas/entities/zona.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nome?: string;

  @Column({ nullable: true, unique: true })
  cpf?: string;

  @Column({ unique: true })
  email?: string;

  @Column()
  telefone?: string;

  @Column()
  senha_hash?: string;

  @Column({ default: 'ACS' })
  perfil?: string;

  @Column({ default: true })
  ativo?: boolean;

  @OneToOne(() => Profissional, (profissional) => profissional.usuario)
  profissional?: Profissional;

  @OneToMany(() => UsuariosZona, uz => uz.usuario)
  usuariosZona?: UsuariosZona[];

  @ManyToMany(() => Zona, zona => zona.usuarios, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'usuarios_zona',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'zona_id', referencedColumnName: 'id' },
  })
  zonas?: Zona[];

  @OneToMany(() => Visita, (visita) => visita.acs)
  visitas: Visita[];
}