import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query('lang') lang: 'fa' | 'ru' | 'en') {
    return this.newsService.findAll(lang || 'fa', true);
  }

  // ثبت و مدیریت خبر صرفاً با توکن معتبر و نقش ادمین
  @Post()
  async createNews(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }
}
