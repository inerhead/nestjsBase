import { BaseEntity } from 'src/common/entity/base';
import { Product } from 'src/products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  fullName: string;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.ownerid, {
    eager: false,
  })
  products: Product[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  emailToLowerCaseOnUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
