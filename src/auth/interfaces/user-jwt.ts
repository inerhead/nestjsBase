import { User } from '../entities/user.entity';
export interface UserJwt {
  token: string;
  user: User;
}
