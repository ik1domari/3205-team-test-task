import {
  BadRequestException,
  GoneException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from './entities/url.entity';
import { Repository } from 'typeorm';
import { IpsService } from '../ips/ips.service';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { IpEntity } from '../ips/entities/ip.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly repository: Repository<UrlEntity>,
    private readonly ipService: IpsService,
  ) {}
  async create(createUrlDto: CreateUrlDto, userId: number) {
    const shortUrl = Array(8)
      .fill(null)
      .map(() => Math.round(Math.random() * 36).toString(36))
      .join('');

    if (createUrlDto.alias && createUrlDto.alias?.length > 20) {
      throw new NotAcceptableException('Too long alias');
    }

    const url = await this.repository.save({
      ...createUrlDto,
      shortUrl,
      user: { id: userId },
    });

    return {
      shortUrl: url.shortUrl,
    };
  }

  async findAll(userId: number, take?: number) {
    return this.repository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'desc',
      },
      take,
    });
  }

  async findOne(shortUrl: string, ip: string) {
    const url = await this.repository.findOne({
      where: {
        shortUrl,
      },
    });

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new GoneException('Url expired');
    }

    url.clickCount++;

    await this.ipService.create({
      ip,
      urlId: url.id,
    });

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
      throw new NotFoundException('Url not found');
    }

    return {
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    };
  }

  async getAnalytics(shortUrl: string): Promise<AnalyticsResponseDto> {
    const url = await this.repository.findOne({
      where: { shortUrl },
      relations: ['ips'],
      order: {
        ips: {
          createdAt: 'DESC',
        },
      },
    });

    if (!url) {
      throw new Error('Url not found');
    }

    const lastIps = url.ips.slice(0, 5).map((ip) => ip.ip);

    return {
      clickCount: url.clickCount,
      lastIps,
    };
  }

  async remove(shortUrl: string) {
    const url = await this.repository.findOne({
      where: { shortUrl },
      relations: ['ips'],
    });

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    return this.repository.manager.transaction(
      async (transactionalEntityManager) => {
        if (url.ips && url.ips.length > 0) {
          await transactionalEntityManager.delete(IpEntity, {
            url: { id: url.id },
          });
        }

        await transactionalEntityManager.delete(UrlEntity, { id: url.id });

        return { message: 'URL and all related IPs deleted successfully' };
      },
    );
  }
}
