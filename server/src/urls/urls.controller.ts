import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../decorators/user-id.decorator';
import { PublicEndpoint } from '../decorators/public-endpoint.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
@ApiTags('urls')
@ApiBearerAuth()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  create(@Body() createUrlDto: CreateUrlDto, @UserId() userId: number) {
    return this.urlsService.create(createUrlDto, userId);
  }

  @PublicEndpoint()
  @Get(':shortUrl')
  findOne(@Param('shortUrl') shortUrl: string, @Query('ip') ip: string) {
    return this.urlsService.findOne(shortUrl, ip);
  }

  @Get('urls/getall')
  findAll(@UserId() userId: number, @Query('take') take?: number) {
    return this.urlsService.findAll(userId, take);
  }

  @Get('info/:shortUrl')
  findInfo(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.findInfo(shortUrl);
  }

  @Delete(':shortUrl')
  remove(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.remove(shortUrl);
  }

  @Get('analytics/:shortUrl')
  getAnalytics(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.getAnalytics(shortUrl);
  }
}
