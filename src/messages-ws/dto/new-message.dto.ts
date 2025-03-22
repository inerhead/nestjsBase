import { IsString, MinLength } from 'class-validator';

export class NewMessageDto {
  @IsString()
  id: string;

  @IsString()
  @MinLength(2)
  message: string;
}
