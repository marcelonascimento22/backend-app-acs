import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pessoa } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {}

  // ✅ CREATE (CORRIGIDO)
  async create(dto: CreatePessoaDto) {
    if (!dto.nome) {
      throw new BadRequestException('Nome é obrigatório');
    }

    let dataParaBanco: string | undefined;

    if (dto.dataNascimento) {
      // Se vier como String "YYYY-MM-DD", usamos direto
      if (typeof dto.dataNascimento === 'string') {
        dataParaBanco = dto.dataNascimento; 
      } else {
        // ✅ CORREÇÃO: Usar métodos UTC para evitar problemas de fuso horário (Timezone)
        // O erro de "um dia a menos" ocorre porque getFullYear/getMonth/getDate usam o fuso local.
        // Se o objeto Date for criado como 00:00:00 UTC, no fuso do Brasil (UTC-3) ele vira 21:00:00 do dia anterior.
        const ano = dto.dataNascimento.getUTCFullYear();
        const mes = String(dto.dataNascimento.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(dto.dataNascimento.getUTCDate()).padStart(2, '0');
        dataParaBanco = `${ano}-${mes}-${dia}`;
      }

      // Validação simples da string gerada
      if (dataParaBanco.includes('NaN')) {
        throw new BadRequestException('Data inválida');
      }
    }

    const pessoa = this.pessoaRepository.create({
      nome: dto.nome,
      cpf: dto.cpf,
      sexo: dto.sexo,
      telefone: dto.telefone,
      sus: dto.sus ? dto.sus.replace(/\D/g, '') : undefined,
      // Passamos a string "YYYY-MM-DD" diretamente
      dataNascimento: dataParaBanco as any, 
      familia: dto.familiaId ? { id: dto.familiaId } : undefined,
    });

    return this.pessoaRepository.save(pessoa);
  }


  // ✅ FIND ALL
  async findAll() {
    return this.pessoaRepository.find({
      relations: ['familia'],
    });
  }

  // ✅ FIND ONE
  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOne({
      where: { id },
      relations: ['familia'],
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa #${id} não encontrada`);
    }

    return pessoa;
  }

 async buscarPorStatusVacina(
    vacinaId: number,
    status: 'tomou' | 'nao_tomou' | 'todos'
  ) {

    // 🔥 BASE (reutilizada)
    const qb = this.pessoaRepository
      .createQueryBuilder('pessoa')
      .leftJoinAndSelect('pessoa.familia', 'familia')
      .leftJoinAndSelect('pessoa.vacinacoes', 'vacinacoes')
      .leftJoinAndSelect('vacinacoes.vacina', 'vacina');

    // 🔹 TOMOU
    if (status === 'tomou') {
      const pessoas = await qb.getMany();

      return pessoas
        .map((p: any) => ({
          ...p,
          tomouVacina: p.vacinacoes?.some(
            (v: any) => v.vacina?.id === vacinaId
          )
        }))
        .filter(p => p.tomouVacina); // 👈 FILTRA AQUI
    }

    // 🔹 NÃO TOMOU
    if (status === 'nao_tomou') {
      const pessoas = await qb.getMany();

      return pessoas
        .map((p: any) => ({
          ...p,
          tomouVacina: p.vacinacoes?.some(
            (v: any) => v.vacina?.id === vacinaId
          )
        }))
        .filter(p => !p.tomouVacina); // 👈 FILTRA AQUI
    }

    // 🔥 TODOS
    const pessoas = await qb.getMany();

    return pessoas.map((p: any) => ({
      ...p,
      tomouVacina: p.vacinacoes?.some(
        (v: any) => v.vacina?.id === vacinaId
      )
    }));
  }

  // ✅ UPDATE (CORRIGIDO)
  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const { familiaId, sus, dataNascimento, ...rest } = updatePessoaDto;

    const data: any = {
      ...rest,
    };

    // ✅ SUS como STRING
    if (sus !== undefined) {
      data.sus = sus.replace(/\D/g, '');
    }

    // ✅ DATA convertida
    if (dataNascimento !== undefined) {
      data.dataNascimento = new Date(dataNascimento);
    }

    // ✅ RELACIONAMENTO
    if (familiaId !== undefined) {
      data.familia = { id: familiaId };
    }

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...data,
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa #${id} não encontrada`);
    }

    return this.pessoaRepository.save(pessoa);
  }

  // ✅ DELETE
  async remove(id: number) {
    const result = await this.pessoaRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Pessoa #${id} não encontrada`);
    }

    return {
      message: `Pessoa #${id} removida com sucesso`,
    };
  }

  // ✅ SEARCH
  async searchByPessoa(search: string) {
    return this.pessoaRepository
      .createQueryBuilder('pessoa')
      .where('LOWER(pessoa.nome) LIKE LOWER(:search)', {
        search: `%${search}%`,
      })
      .limit(10)
      .getMany();
  }
}