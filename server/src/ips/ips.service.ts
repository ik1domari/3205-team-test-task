import { Injectable } from '@nestjs/common';
import { CreateIpDto } from './dto/create-ip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpEntity } from './entities/ip.entity';

@Injectable()
export class IpsService {
  constructor(
    @InjectRepository(IpEntity)
    private readonly repository: Repository<IpEntity>,
  ) {}

  async create(createIpDto: CreateIpDto) {
    const exists = await this.repository.findOne({
      where: {
        urlId: createIpDto.urlId,
        ip: createIpDto.ip,
      },
    });

    if (!exists) {
      await this.repository.save({
        ip: createIpDto.ip,
        urlId: createIpDto.urlId,
      });
    }
  }

  async remove(id: number) {
    return this.repository.delete({
      id,
    });
  }
}
