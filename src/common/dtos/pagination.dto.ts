import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
}
