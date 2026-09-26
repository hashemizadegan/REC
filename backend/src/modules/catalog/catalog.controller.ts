import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  getAllProducts() {
    return this.catalogService.findAll();
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    const product = this.catalogService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}
