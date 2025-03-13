import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AptoService } from './apto.service';
import { UrbanizacionService } from './urbanizacion.service';
import { CreateUrbanizacionDto } from './dto/create-urbanizacion.dto';
import { UpdateUrbanizacionDto } from './dto/update-urbanizacion.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateAptoDto } from './dto/create-apto.dto';

@Controller('urbanizaciones')
export class UrbanizacionController {
  constructor(
    private readonly urbanizacionService: UrbanizacionService,
    private readonly aptoService: AptoService,
  ) {}

  @Post()
  create(@Body() createUrbanizacionDto: CreateUrbanizacionDto) {
    return this.urbanizacionService.create(createUrbanizacionDto);
  }

  @Post('aptos')
  createApto(@Body() createAptoDto: CreateAptoDto) {
    return this.aptoService.create(createAptoDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.urbanizacionService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.urbanizacionService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUrbanizacionDto: UpdateUrbanizacionDto,
  ) {
    return this.urbanizacionService.update(id, updateUrbanizacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.urbanizacionService.remove(id);
  }
}
