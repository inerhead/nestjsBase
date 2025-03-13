import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { Urbanizacion } from './';
import { BaseEntity } from 'src/common/entity/base';

@Entity({ name: 'bloquestorres' })
export class BloqueTorre extends BaseEntity {
  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  active: boolean;

  @ManyToOne(() => Urbanizacion, (urban) => urban.bloqueTorres, {
    onDelete: 'CASCADE',
  })
  urbanizacionid: Urbanizacion;

  @BeforeInsert()
  generateCode() {
    /*if (!this.code) {
      this.code = `${this..toUpperCase()}-${this.name.toUpperCase()}`;
    }
    this.code = this.code
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\-]+/g, '');
      */
  }
}
