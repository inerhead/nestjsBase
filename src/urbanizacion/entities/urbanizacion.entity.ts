import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base';
import { BloqueTorre } from './';

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

  @OneToMany(() => BloqueTorre, (bt) => bt.urbanizacion, {
    cascade: true,
    eager: true,
  })
  bloqueTorres?: BloqueTorre[];
}
