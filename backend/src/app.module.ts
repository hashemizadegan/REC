import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { RfqModule } from './modules/rfq/rfq.module';
import { TranslationModule } from './modules/translation/translation.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [AuthModule, CatalogModule, RfqModule, TranslationModule, NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
