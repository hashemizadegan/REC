import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './modules/catalog/catalog.module';
import { RfqModule } from './modules/rfq/rfq.module';
import { TranslationModule } from './modules/translation/translation.module';

@Module({
  imports: [CatalogModule, RfqModule, TranslationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
