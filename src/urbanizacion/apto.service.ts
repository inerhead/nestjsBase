import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAptoDto } from './dto/create-apto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Apto, BloqueTorre } from './entities';
import { handleDBExceptions } from 'src/common/helpers/exceptions';

@Injectable()
export class AptoService {
  private readonly logger = new Logger(AptoService.name);

  constructor(
    @InjectRepository(Apto)
    private readonly aptoRepository: Repository<Apto>,
    @InjectRepository(BloqueTorre)
    private readonly bloqueTorreRepository: Repository<BloqueTorre>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createAptoDto: CreateAptoDto) {
    const { bloqueTorreId } = createAptoDto;
    const bloqueTorre = await this.bloqueTorreRepository.findOneBy({
      id: bloqueTorreId,
    });
    if (!bloqueTorre) {
      throw new NotFoundException(
        `BloqueTorre with id ${bloqueTorreId} not found`,
      );
    }
    try {
      const apto = this.aptoRepository.create({
        ...createAptoDto,
        bloqueTorre: bloqueTorre,
      });
      const newRecord = await this.aptoRepository.save(apto);
      return newRecord;
    } catch (error) {
      handleDBExceptions(error);
    }
  }
}
