import { IsOptional, IsString, MinLength } from 'class-validator';

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
}
