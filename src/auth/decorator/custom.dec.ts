import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user: User = ctx.switchToHttp().getRequest().user;
    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);

export const GetRawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.rawHeaders[data];
    }
    return request.rawHeaders;
  },
);
