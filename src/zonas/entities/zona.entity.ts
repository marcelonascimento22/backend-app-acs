import { Usuario } from '../../usuarios/entities/usuario.entity';
import { UsuariosZona } from '../../usuarios_zonas/entities/usuarios_zona.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, ManyToMany, OneToMany } from 'typeorm';

@Entity('zonas')
export class Zona {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  geometria: object;

  @OneToMany(() => UsuariosZona, uz => uz.zona)
  usuariosZona: UsuariosZona[];

  @ManyToMany(() => Usuario, usuario => usuario.zonas)
  usuarios: Usuario[];
}