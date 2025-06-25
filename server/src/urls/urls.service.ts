import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';
import { Repository } from 'typeorm';
import { IpEntity } from 'src/ips/entities/ip.entity';
import { IpsService } from '../ips/ips.service';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly repository: Repository<UrlEntity>,
    private readonly ipService: IpsService,
  ) {}
  async create(createUrlDto: CreateUrlDto, userId: number) {
    const linkId = Array(8)
      .fill(null)
      .map(() => Math.round(Math.random() * 36).toString(36))
      .join('');

    const shortUrl = `http://localhost:3000/${linkId}`;

    const url = await this.repository.save({
      ...createUrlDto,
      shortUrl,
      user: { id: userId },
    });

    return {
      shortUrl: url.shortUrl,
    };
  }

  async findOne(shortUrl: string, ip: string) {
    const url = await this.repository.findOne({
      where: {
        shortUrl,
      },
    });

    if (!url) {
      throw new Error('Url not found');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new Error('Url expired');
    }

    ++url.clickCount;

    if (!url.ips.find((i) => i.ip === ip)) {
    }

    await this.repository.save(url);

    return url;
  }

  async findInfo(shortUrl: string) {
    const url = await this.repository.findOne({
      where: {
        shortUrl,
      },
    });

    if (!url) {
      throw new Error('Url not found');
    }

    return {
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    };
  }

  getAnalytics(shortUrl: string) {
    return `This action returns a ${shortUrl} url analytics`;
  }

  remove(shortUrl: string) {
    return `This action removes a #${shortUrl} url`;
  }
}
