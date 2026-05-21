import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaComorbidade } from './entities/pessoa-comorbidade.entity';
import { Module } from '@nestjs/common';
import { PessoaComorbidadeService } from './pessoa-comorbidade.service';
import { PessoaComorbidadeController } from './pessoa-comorbidade.controller';
import { Comorbidade } from '../comorbidade/entities/comorbidade.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PessoaComorbidade,
      Pessoa,          
      Comorbidade,     
    ]),
  ],
  controllers: [PessoaComorbidadeController],
  providers: [PessoaComorbidadeService],
})
export class PessoaComorbidadeModule {}