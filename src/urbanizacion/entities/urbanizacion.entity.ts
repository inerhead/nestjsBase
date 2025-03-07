import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/base';

@Entity({ name: 'urbanizaciones' })
export class Urbanizacion extends BaseEntity {
  @Column('text', { unique: true })
  code: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  active: boolean;
}
