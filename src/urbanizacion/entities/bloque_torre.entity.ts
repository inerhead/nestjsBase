import { Entity, Column, ManyToOne, BeforeInsert, OneToMany } from 'typeorm';
import { Apto, Urbanizacion } from './';
import { BaseEntity } from 'src/common/entity/base';

@Entity({ name: 'bloquestorres' })
export class BloqueTorre extends BaseEntity {
  @Column('text', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  active: boolean;

  @OneToMany(() => Apto, (ap) => ap.bloqueTorre, {
    cascade: true,
    eager: true,
  })
  aptos?: Apto[];

  @ManyToOne(() => Urbanizacion, (urban) => urban.bloqueTorres, {
    onDelete: 'CASCADE',
  })
  urbanizacion: Urbanizacion;

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
