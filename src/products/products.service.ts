import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { handleDBExceptions } from 'src/common/helpers/exceptions';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      console.log(user);
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        ownerid: user,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return this.plainProductImages(product);
    } catch (error) {
      handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const prods = await this.productRepository.find({
      take: limit,
      skip: offset,
      where: { active: true },
      relations: { images: true },
    });
    return prods.map((prod) => this.plainProductImages(prod));
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('Product.images', 'images')
        .getOne();
    }
    return (
      this.plainProductImages(product) ||
      new NotFoundException(`Product with term: ${term} not found`)
    );
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdateProduct } = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...toUpdateProduct,
    });
    if (!product)
      return new NotFoundException(`Product with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images?.length > 0) {
        await queryRunner.manager.delete(ProductImage, { productid: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      } else {
        product.images = await this.productImageRepository.findBy({
          productid: { id },
        });
      }
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      // await this.productRepository.save(product);
      return this.plainProductImages(product);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const data = await this.productRepository.update(id, { active: false });
    if (data.affected) return { message: 'Product inactived' };
    return { message: `Product with id: ${id} not found` };
  }

  private plainProductImages(product: Product) {
    return {
      ...product,
      images: product.images.map((img) => img.url),
    };
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder();
    try {
      // return await query.delete().where({ active: false }).execute();
      return await query.delete().where({}).execute();
    } catch (error) {
      handleDBExceptions(error);
    }
  }
}
