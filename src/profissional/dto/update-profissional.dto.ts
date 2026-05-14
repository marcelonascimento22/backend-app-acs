import { PartialType } from '@nestjs/mapped-types';
import { CreateProfissionalDto } from './create-profissional.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProfissionalDto {
      @IsOptional()
      @IsString()
      especialidade?: string;
    
      @IsOptional()
      @IsString()
      conselho?: string;
    
      @IsOptional()
      @IsString()
      numeroRegistro?: string;
    
      @IsOptional()
      @IsBoolean()
      ativo?: boolean;
}
