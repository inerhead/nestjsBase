import { Module } from '@nestjs/common';
import { UrbanizacionService } from './urbanizacion.service';
import { UrbanizacionController } from './urbanizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Urbanizacion } from './entities/urbanizacion.entity';

@Module({
  controllers: [UrbanizacionController],
  providers: [UrbanizacionService],
  imports: [TypeOrmModule.forFeature([Urbanizacion])],
})
export class UrbanizacionModule {}
