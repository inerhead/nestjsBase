import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateAptoDto {
  @IsString()
  @MinLength(3)
  numero: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  bloqueTorreId: string;
}
