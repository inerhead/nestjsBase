import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBloqueTorreDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
