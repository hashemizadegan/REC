import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  getNews(@Query('lang') lang: string = 'fa') {
    return this.newsService.getNews(lang);
  }
}
