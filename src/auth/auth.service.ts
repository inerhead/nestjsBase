import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleDBExceptions } from 'src/common/helpers/exceptions';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { IJwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { UserJwt } from './interfaces/user-jwt';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserJwt> {
    try {
      const { password, ...userDetail } = createUserDto;
      const salt = await bcrypt.genSalt(10);

      const user = this.userRepository.create({
        ...userDetail,
        password: bcrypt.hashSync(password, salt),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        user,
        token: this.getJwtToken({ userId: user.id }),
      };
      // TODO retornar JWT de acceso.
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserJwt> {
    const { password, email } = loginUserDto;
    // const salt = await bcrypt.genSalt(10);

    const user = await this.userRepository.findOne({
      where: { email },
      select: { password: true, email: true, id: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid password');
    return {
      user,
      token: this.getJwtToken({ userId: user.id }),
    };
    // TODO retornar JWT de acceso DONE.
  }

  private getJwtToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  /*update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }*/

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
