import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateAptoDto } from './create-apto.dto';

export class CreateBloqueTorreDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  aptos?: CreateAptoDto[];
}
