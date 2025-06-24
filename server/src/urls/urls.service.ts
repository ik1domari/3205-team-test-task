import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly repository: Repository<UrlEntity>,
  ) {}
  create(createUrlDto: CreateUrlDto) {
    console.log(createUrlDto);

    return 'This action adds a new url';
  }

  findOne(shortUrl: string) {
    return `This action returns a ${shortUrl} url`;
  }

  findInfo(shortUrl: string) {
    return `This action returns a ${shortUrl} url info`;
  }

  getAnalytics(shortUrl: string) {
    return `This action returns a ${shortUrl} url analytics`;
  }

  remove(shortUrl: string) {
    return `This action removes a #${shortUrl} url`;
  }
}
