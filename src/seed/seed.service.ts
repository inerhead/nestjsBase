import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed.data';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}
  async runSeed(user: User) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });
    await Promise.all(insertPromises);
    return {
      code: '001',
      msg: 'Seed executed successfully',
      records: products.length,
      images: products.reduce((acc, curr) => acc + curr.images.length, 0),
    };
  }

  async deleteAllProducts() {
    await this.productsService.deleteAllProducts();
    return {
      code: '002',
      msg: 'All products deleted',
    };
  }
}
