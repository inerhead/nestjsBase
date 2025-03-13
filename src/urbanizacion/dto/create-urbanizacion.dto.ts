import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateBloqueTorreDto } from './create-bloque_torre.dto';

export class CreateUrbanizacionDto {
  @IsString()
  @MinLength(3)
  code: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  bloqueTorres?: CreateBloqueTorreDto[];
}
