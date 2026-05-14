import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany 
} from 'typeorm'; // ✅ Importe sempre da raiz
import { IsString, IsOptional, IsBoolean, IsNumber, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ViaAdministracao } from './viaAdministracao.enum';
import { Vacinacao } from 'src/vacinacao/entities/vacinacao.entity'; // ✅ Use o path do src
import { Lote } from 'src/lote/entities/lote.entity';

@Entity('vacina')
export class Vacina {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  nome: string;

  @Column()
  @IsString()
  descricao: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  codigo?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  fabricante?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  lote?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validade?: Date;

  @Column({ name: 'dose_recomendada', nullable: true })
  @IsOptional()
  @IsString()
  doseRecomendada?: string;

  @Column({
    name: 'via_administracao',
    type: 'enum',
    enum: ViaAdministracao,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(ViaAdministracao)
  viaAdministracao?: ViaAdministracao;

  @Column({ name: 'grupo_alvo', nullable: true })
  @IsOptional()
  @IsString()
  grupoAlvo?: string;

  @Column({ name: 'intervalo_doses', nullable: true })
  @IsOptional()
  @IsNumber()
  intervaloDoses?: number;

  @Column({ default: true })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;

  @OneToMany(() => Vacinacao, (vacinacao) => vacinacao.vacina)
  vacinacoes?: Vacinacao[];

  @OneToMany(() => Lote, lote => lote.vacina)
 lotes?: Lote[];
}