import { Controller, Delete, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorator/auth';
import { GetUser } from 'src/auth/decorator/custom.dec';
import { User } from 'src/auth/entities/user.entity';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth()
  executeeSeed(@GetUser() user: User) {
    return this.seedService.runSeed(user);
  }

  @Delete()
  deleteAllProducts() {
    return this.seedService.deleteAllProducts();
  }
}
