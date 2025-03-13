import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base';
import { BloqueTorre } from './bloque_torre.entity';

@Entity({ name: 'aptos' })
export class Apto extends BaseEntity {
  @Column('text', { unique: true })
  numero: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  active: boolean;

  @ManyToOne(() => BloqueTorre, (bloque) => bloque.aptos, {
    onDelete: 'CASCADE',
  })
  bloqueTorre: BloqueTorre;
}
