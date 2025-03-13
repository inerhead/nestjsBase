import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUrbanizacionDto } from './dto/create-urbanizacion.dto';
import { UpdateUrbanizacionDto } from './dto/update-urbanizacion.dto';
import { Urbanizacion } from './entities/urbanizacion.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';
import { handleDBExceptions } from 'src/common/helpers/exceptions';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BloqueTorre } from './entities';

@Injectable()
export class UrbanizacionService {
  private readonly logger = new Logger(UrbanizacionService.name);

  constructor(
    @InjectRepository(Urbanizacion)
    private readonly urbanizacionRepository: Repository<Urbanizacion>,
    @InjectRepository(BloqueTorre)
    private readonly bloqueTorreRepository: Repository<BloqueTorre>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createUrbanizacionDto: CreateUrbanizacionDto) {
    try {
      const { bloqueTorres = [], ...urbDetails } = createUrbanizacionDto;
      const urban = this.urbanizacionRepository.create({
        ...urbDetails,
        bloqueTorres: bloqueTorres.map((bloque) =>
          this.bloqueTorreRepository.create({ ...bloque }),
        ),
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
      where: { active: active === 1 },
      relations: { bloqueTorres: true },
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
        .where('UPPER(code) =:code', {
          code: term.toUpperCase(),
        })
        .leftJoinAndSelect('Urbanizacion.bloqueTorres', 'torres')
        .getOne();
    }
    return (
      urban ||
      new NotFoundException(`Urbanización with term: ${term} not found`)
    );
  }

  async update(id: string, updateUrbanizacionDto: UpdateUrbanizacionDto) {
    const { bloqueTorres, ...toUpdateProduct } = updateUrbanizacionDto;
    if (bloqueTorres?.length > 0) {
      throw new BadRequestException('Use endpoint to update bloqueTorres');
    }
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
      urban.bloqueTorres = await this.bloqueTorreRepository.findBy({
        urbanizacionid: { id },
      });
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
      deletedAt: new Date(),
    });
    if (data.affected) return { message: 'Urbanización inactived' };
    return { message: `Urbanización with id: ${id} not found` };
  }
}
