import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "../../usuarios/entities/usuario.entity";
import { Zona } from "../../zonas/entities/zona.entity";

@Entity('usuarios_zonas')
export class UsuariosZona {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.usuariosZona)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Zona, zona => zona.usuariosZona)
  @JoinColumn({ name: 'zona_id' })
  zona: Zona;
}
