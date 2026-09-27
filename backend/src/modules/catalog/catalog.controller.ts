import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getCatalog(@Query('lang') lang: string = 'en') {
    return this.catalogService.getCatalog(lang);
  }

  @Get('products')
  getProducts(@Query('lang') lang: string = 'en') {
    return this.catalogService.getCatalog(lang);
  }
}
