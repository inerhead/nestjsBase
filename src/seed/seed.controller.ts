import { Controller, Delete, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeeSeed() {
    return this.seedService.runSeed();
  }

  @Delete()
  deleteAllProducts() {
    return this.seedService.deleteAllProducts();
  }
}
