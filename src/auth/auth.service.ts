import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usuariosService: UsuariosService,
  ) {}

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      profissionalId: user.profissional?.id,
    };

    //const usuario = await this.usuariosService.findByEmail(user.email);

    return {
      usuario: {
        id: user.id,
        nome: user.nome,
        perfil: user.perfil
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, senha: string) {
    ////console.log("Email:", email);
    ////console.log("Senha digitada:", senha);

    const user = await this.usuariosService.findByEmail(email);

    ////console.log("Usuário encontrado:", user);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!user.senha_hash) {
      throw new UnauthorizedException('Usuário sem senha cadastrada');
    }

    const senhaValida = await bcrypt.compare(
      senha,
      user.senha_hash
    );

    //console.log("Senha válida?", senhaValida);

    if (!senhaValida) {
      throw new UnauthorizedException('Senha inválida');
    }

    return user;
  }
}