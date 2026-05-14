import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateProfissionalDto } from "./dto/update-profissional.dto";
import { CreateProfissionalDto } from "./dto/create-profissional.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Profissional } from "./entities/profissional.entity";
import { Repository } from "typeorm";
import { Usuario } from "src/usuarios/entities/usuario.entity";

@Injectable()
export class ProfissionalService {
  constructor(
    @InjectRepository(Profissional) // ESSENCIAL
    private profissionalRepository: Repository<Profissional>,
  ) {}

  async create(createDto: CreateProfissionalDto) {
    const profissional = this.profissionalRepository.create({
      ...createDto,
      usuario: { id: createDto.usuarioId } as Usuario, 
    });
    
    return await this.profissionalRepository.save(profissional);
  }

  findAll() {
    return this.profissionalRepository.find({
      relations: ['usuario'],
    });
  }

  findOne(id: number) {
    return this.profissionalRepository.findOne({
      where: { id },
      relations: ['usuario', 'usuario.profissional'],
    });
  }

  async update(id: number, dto: UpdateProfissionalDto) {
    const profissional = await this.findOne(id);

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    profissional.especialidade = dto.especialidade ??  profissional.especialidade;

    profissional.conselho = dto.conselho ?? profissional.conselho;

    profissional.numeroRegistro = dto.numeroRegistro ?? profissional.numeroRegistro;

    return this.profissionalRepository.save(profissional);
  }

  async remove(id: number) {
    const profissional = await this.findOne(id);

    if (!profissional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    return this.profissionalRepository.remove(profissional);
  }
}