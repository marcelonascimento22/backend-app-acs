import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Familia } from './entities/familia.entity';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';

@Injectable()
export class FamiliaService {

  constructor(
    @InjectRepository(Familia)
    private readonly familiaRepository: Repository<Familia>,
  ) {}

  async create(createFamiliaDto: CreateFamiliaDto) {
    //console.log('createFamiliaDto recebido no service:', createFamiliaDto);

    const familia = this.familiaRepository.create(createFamiliaDto);

    return this.familiaRepository.save(familia);
  }

  async findAll() {
    return this.familiaRepository.find({
      relations: ['pessoas'],
      order: {
      id: 'ASC', // ou 'DESC'
      },
    });
  }

  async findOne(id: number) {
    const familia = await this.familiaRepository.findOne({
      where: { id },
      relations: ['pessoas'],
    });

    if (!familia) {
      throw new NotFoundException(`Família com ID ${id} não encontrada`);
    }
    return familia;
  }

  async update(id: number, updateFamiliaDto: UpdateFamiliaDto) {
    //console.log('updateFamiliaDto recebido no service:', updateFamiliaDto);

    await this.familiaRepository.update(id, updateFamiliaDto);

    return this.familiaRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    return this.familiaRepository.delete(id);
  }

  async searchByEndereco(search: string) {
    return this.familiaRepository
      .createQueryBuilder('familia')
      .where('LOWER(familia.endereco) LIKE LOWER(:search)', {
        search: `%${search}%`,
      })
      .limit(10) 
      .getMany();
  }

}