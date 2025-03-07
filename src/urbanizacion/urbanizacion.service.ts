import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUrbanizacionDto } from './dto/create-urbanizacion.dto';
import { UpdateUrbanizacionDto } from './dto/update-urbanizacion.dto';
import { Urbanizacion } from './entities/urbanizacion.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';
import { handleDBExceptions } from 'src/common/helpers/exceptions';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class UrbanizacionService {
  private readonly logger = new Logger(UrbanizacionService.name);

  constructor(
    @InjectRepository(Urbanizacion)
    private readonly urbanizacionRepository: Repository<Urbanizacion>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createUrbanizacionDto: CreateUrbanizacionDto) {
    try {
      const { ...urbDetails } = createUrbanizacionDto;
      const urban = this.urbanizacionRepository.create({
        ...urbDetails,
      });
      const newRecord = await this.urbanizacionRepository.save(urban);
      return newRecord;
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, active = 1 } = paginationDto;
    const urbans = await this.urbanizacionRepository.find({
      take: limit,
      skip: offset,
      where: { active: !!active },
      relations: {},
    });
    return urbans;
  }

  async findOne(term: string) {
    let urban: Urbanizacion;
    if (isUUID(term)) {
      urban = await this.urbanizacionRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.urbanizacionRepository.createQueryBuilder();
      urban = await queryBuilder
        .where('UPPER(name) =:name or UPPER(code) =:code', {
          name: term.toUpperCase(),
          code: term.toUpperCase(),
        })
        .getOne();
    }
    return (
      urban ||
      new NotFoundException(`Urbanización with term: ${term} not found`)
    );
  }

  async update(id: string, updateUrbanizacionDto: UpdateUrbanizacionDto) {
    const { ...toUpdateProduct } = updateUrbanizacionDto;

    const urban = await this.urbanizacionRepository.preload({
      id: id,
      ...toUpdateProduct,
    });
    if (!urban)
      return new NotFoundException(`Urbanización with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(urban);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return urban;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const data = await this.urbanizacionRepository.update(id, {
      active: false,
    });
    if (data.affected) return { message: 'Urbanización inactived' };
    return { message: `Urbanización with id: ${id} not found` };
  }
}
