import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const handleDBExceptions = (error: any) => {
  if (error.code === '23505') throw new BadRequestException(error.detail);
  if (error.code === '23502') throw new BadRequestException(error.message);

  throw new InternalServerErrorException('Unexpected error, check server logs');
};
