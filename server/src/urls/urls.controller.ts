import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get(':shortUrl')
  findOne(@Body('shortUrl') shortUrl: string) {
    return this.urlsService.findOne(shortUrl);
  }

  @Get('info/:shortUrl')
  findInfo(@Body('shortUrl') shortUrl: string) {
    return this.urlsService.findInfo(shortUrl);
  }

  @Delete(':shortUrl')
  remove(@Body('shortUrl') shortUrl: string) {
    return this.urlsService.remove(shortUrl);
  }

  @Get('analytics/:shortUrl')
  getAnalytics(@Body('shortUrl') shortUrl: string) {
    return this.urlsService.getAnalytics(shortUrl);
  }
}
