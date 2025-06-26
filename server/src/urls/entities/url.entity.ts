import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IpEntity } from '../../ips/entities/ip.entity';

@Entity('urls')
export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column()
  shortUrl: string;

  @Column({ nullable: true })
  alias?: string;

  @Column({ default: 0 })
  clickCount: number;

  @Column({ nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.urls)
  user: UserEntity;

  @OneToMany(() => IpEntity, (ip) => ip.url, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ips: IpEntity[];

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
