import { BadRequestException, Get, Injectable, NotFoundException, Query } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PerfilUsuario } from './enum/PerfilUsuario';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>,
  ) {}

async create(dto: CreateUsuarioDto) {
  // 🔍 Verificar email duplicado
  const emailExiste = await this.repo.findOne({
    where: { email: dto.email },
  });

  if (emailExiste) {
    throw new BadRequestException('Email já cadastrado');
  }

  // 🔍 Verificar CPF duplicado (se informado)
  if (dto.cpf) {
    const cpfExiste = await this.repo.findOne({
      where: { cpf: dto.cpf },
    });

    if (cpfExiste) {
      throw new BadRequestException('CPF já cadastrado');
    }
  }

  // 🔐 Hash da senha
  const senhaHash = await bcrypt.hash(dto.senha, 10);

  // 🧹 Normalização (importante no teu cenário)
  const telefone = dto.telefone?.replace(/\D/g, '');
  const cpf = dto.cpf?.replace(/\D/g, '');

  const usuario = this.repo.create({
    nome: dto.nome,
    telefone,
    cpf,
    email: dto.email.toLowerCase().trim(),
    senha_hash: senhaHash,
    perfil: dto.perfil || PerfilUsuario.ACS,
    ativo: dto.ativo ?? true,
  });

  return this.repo.save(usuario);
}
 

  async findAll(@Query('perfil') perfil?: PerfilUsuario) {
    return this.repo.find({
      where: perfil ? { perfil } : {},
      //select: ['id', 'nome', 'email', 'telefone', 'perfil'],
    });
  }

  async findOne(id: number) {
    console.log("ID: ", id)
    const user = await this.repo.findOne({ 
      where: { id },
      relations: ['profissional', 'profissional.usuario']
    });
    console.log("User: ", user)

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findByEmail(email: string) {
    //console.log("Buscando email:", email);
    
    return this.repo.findOne({
      where: { email },
    });
  }

  async findMe(id: number) {
    return this.repo.findOne({
      where: { id: id },
    });
  }

  async UpdateMe(id: number, data: any) {
    return this.repo.update(id, data);
  }

async alterarSenha(id: number, atual: string, nova: string) {
  const user = await this.repo.findOne({ where: { id } });

  if (!user) throw new NotFoundException('Usuário não encontrado');

  const senhaValida = await bcrypt.compare(atual, user.senha_hash);

  if (!senhaValida) {
    throw new BadRequestException('Senha atual incorreta');
  }

  const novaHash = await bcrypt.hash(nova, 10);

  await this.repo.update(id, {
    senha_hash: novaHash,
  });

  return { message: 'Senha alterada com sucesso' };
}

  async update(id: number, data: UpdateUsuarioDto) {
      const usuario = await this.repo.findOneBy({ id });

      if (!usuario) {
          throw new NotFoundException();
      }

      usuario.nome = data.nome ?? usuario.nome;
      usuario.cpf = data.cpf ?? usuario.cpf;
      usuario.telefone = data.telefone ?? usuario.telefone;
      usuario.email = data.email ?? usuario.email;
      usuario.perfil = data.perfil ?? usuario.perfil;
      usuario.ativo = data.ativo ?? usuario.ativo;

      return this.repo.save(usuario);
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}