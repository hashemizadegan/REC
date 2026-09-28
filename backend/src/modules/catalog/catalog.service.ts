import { Injectable } from '@nestjs/common';
import { Product } from './product.interface';

@Injectable()
export class CatalogService {
  private readonly products: Product[] = [
    {
      id: 'prod-001',
      hsCode: '080410',
      category: 'Agri-food',
      origin: 'Iran',
      specs: 'Max 15% moisture, grade AAA',
      standard: 'GOST 32896-2014',
      name: {
        en: 'Mazafati Fresh Dates',
        ru: 'Финики Мазафати свежие',
        fa: 'خرمای مضافتی تازه',
      },
      description: {
        en: 'Premium export-grade Mazafati dates from Bam region',
        ru: 'Экспортные финики сорта Мазафати из региона Бам',
        fa: 'خرمای مضافتی درجه یک صادراتی منطقه بم',
      },
    },
    {
      id: 'prod-002',
      hsCode: '080251',
      category: 'Agri-food',
      origin: 'Iran',
      specs: 'Fandoghi 28-30 count/oz, natural open min 95%',
      standard: 'GOST 32288-2013',
      name: {
        en: 'Round Pistachio (Fandoghi)',
        ru: 'Фисташки круглые (Фандоги)',
        fa: 'پسته فندقی',
      },
      description: {
        en: 'Naturally opened Iranian round pistachios for processing and retail',
        ru: 'Иранские фисташки естественного раскрытия для переработки и розницы',
        fa: 'پسته فندقی خندان طبیعی صادراتی برای بسته‌بندی و فرآوری',
      },
    },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getCatalog(lang: string = 'fa') {
    const selectedLang = ['fa', 'ru', 'en'].includes(lang) ? lang : 'fa';
    return this.products.map((product) => ({
      id: product.id,
      name: product.name[selectedLang] || product.name.en,
      category: product.category,
      origin: product.origin,
      hsCode: product.hsCode,
      specs: product.specs,
      standard: product.standard,
      description: product.description[selectedLang] || product.description.en,
    }));
  }
}
