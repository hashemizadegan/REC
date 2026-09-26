import { Injectable } from '@nestjs/common';
import { Product } from './product.interface';

@Injectable()
export class CatalogService {
  private readonly pilotProducts: Product[] = [
    {
      id: 'prod-dates-001',
      hsCode: '080410',
      title: {
        fa: 'خرمای مضافتی درجه یک',
        ru: 'Финики Мазафати высший сорт',
        en: 'Premium Mazafati Dates',
      },
      description: {
        fa: 'بسته‌بندی مناسب صادرات به فدراسیون روسیه و اوراسیا',
        ru: 'Экспортная упаковка, адаптированная для рынка РФ и ЕАЭС',
        en: 'Export-grade packaging compliant with EAEU standards',
      },
      origin: 'Iran (Bam / Kerman)',
      category: 'Agri-food',
      targetMarkets: ['RU', 'EAEU', 'MENA'],
    },
    {
      id: 'prod-pistachio-002',
      hsCode: '080251',
      title: {
        fa: 'پسته فندقی خندان',
        ru: 'Фисташки натурального раскрытия (Фандоги)',
        en: 'Natural Open Fandoghi Pistachios',
      },
      description: {
        fa: 'سایز ۲۸/۳۰ با گواهی سلامت و افلاتوکسین کنترل‌شده',
        ru: 'Калибр 28/30 с фитосанитарным сертификатом и контролем афлатоксинов',
        en: 'Caliber 28/30 with verified phytosanitary & aflatoxin testing',
      },
      origin: 'Iran (Rafsanjan / Kerman)',
      category: 'Agri-food',
      targetMarkets: ['RU', 'EAEU', 'EU'],
    },
  ];

  findAll(): Product[] {
    return this.pilotProducts;
  }

  findById(id: string): Product | undefined {
    return this.pilotProducts.find((p) => p.id === id);
  }
}
