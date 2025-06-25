import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';
import { IpsModule } from 'src/ips/ips.module';

@Module({
  controllers: [UrlsController],
  providers: [UrlsService],
  imports: [TypeOrmModule.forFeature([UrlEntity]), IpsModule],
})
export class UrlsModule {}
