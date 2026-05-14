import { PartialType } from '@nestjs/mapped-types';
import { CreatePrenatalDto } from './create-prenatal.dto';

export class UpdatePrenatalDto extends PartialType(CreatePrenatalDto) {}
