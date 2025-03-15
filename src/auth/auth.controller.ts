import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, GetRawHeaders } from './decorator/custom.dec';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import {
  RoleProtected,
  ValidRolesEnum,
} from './decorator/role-protected.decorator';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  // privateRoute(@Req() request: Express.Request) {
  privateRoute(
    @GetUser('email') user: User,
    @GetRawHeaders() headers: string[],
  ) {
    //console.log(request.user);
    console.log(user);
    console.log('headers', headers);
    return {
      ok: true,
      message: 'This is a private route',
    };
  }

  @Get('private2')
  @RoleProtected(AuthService, ValidRolesEnum.ADMIN, ValidRolesEnum.USER)
  //@SetMetadata(META_ROLES, ['admin', 'user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      user: user,
      message: 'This is a private route',
    };
  }
}
