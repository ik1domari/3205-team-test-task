import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { IpsService } from './ips.service';
import { CreateIpDto } from './dto/create-ip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('ips')
@ApiTags('ips')
@ApiBearerAuth()
export class IpsController {
  constructor(private readonly ipsService: IpsService) {}

  @Post()
  create(@Body() createIpDto: CreateIpDto) {
    return this.ipsService.create(createIpDto);
  }

  @Get()
  findAll() {
    return this.ipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ipsService.findOne(+id);
  }
}
