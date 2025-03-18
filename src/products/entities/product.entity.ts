import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ProductImage } from './';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (image) => image.productid, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @Column('boolean', { default: true })
  active: boolean;

  @ManyToOne(() => User, (user) => user.products)
  ownerid: User;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replace(/\s+/g, '_') // Remueve caracteres especiales
      .replace(/[^\w\-]+/g, ''); // Reemplaza espacios en blanco por _
  }

  @BeforeUpdate()
  generateUpdateSlug() {
    this.slug = this.slug
      .toLowerCase()
      .replace(/\s+/g, '_') // Remueve caracteres especiales
      .replace(/[^\w\-]+/g, ''); // Reemplaza espacios en blanco por _
  }
}
