import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UrlEntity } from '../../urls/entities/url.entity';

@Entity('ips')
export class IpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @ManyToOne(() => UrlEntity, (url) => url.ips)
  url: UrlEntity;

  @Column()
  urlId: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
