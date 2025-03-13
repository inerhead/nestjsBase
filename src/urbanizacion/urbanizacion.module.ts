import { Module } from '@nestjs/common';
import { UrbanizacionService } from './urbanizacion.service';
import { AptoService } from './apto.service';
import { UrbanizacionController } from './urbanizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Urbanizacion, BloqueTorre, Apto } from './entities/';

@Module({
  controllers: [UrbanizacionController],
  providers: [UrbanizacionService, AptoService],
  imports: [TypeOrmModule.forFeature([Urbanizacion, BloqueTorre, Apto])],
})
export class UrbanizacionModule {}
