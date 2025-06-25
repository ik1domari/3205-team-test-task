import { Module } from '@nestjs/common';
import { IpsService } from './ips.service';
import { IpsController } from './ips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpEntity } from './entities/ip.entity';

@Module({
  controllers: [IpsController],
  providers: [IpsService],
  imports: [TypeOrmModule.forFeature([IpEntity])],
  exports: [IpsService],
})
export class IpsModule {}
