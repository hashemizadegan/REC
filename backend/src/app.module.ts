import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './modules/catalog/catalog.module';
import { RfqModule } from './modules/rfq/rfq.module';

@Module({
  imports: [CatalogModule, RfqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
