import { Injectable } from '@nestjs/common';

export interface NewsItem {
  id: string;
  date: string;
  category: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  content?: Record<string, string>;
}

@Injectable()
export class NewsService {
  private readonly news: NewsItem[] = [
    {
      id: 'news-001',
      date: '2026-09-28',
      category: 'Trade Regulations',
      title: {
        fa: 'توافق نهایی تعرفه ترجیحی اوراسیا و ایران در بخش کشاورزی',
        ru: 'Окончательное соглашение о преференциальных тарифах ЕАЭС и Ирана',
        en: 'Final Preferential Tariff Agreement between EAEU and Iran in Agriculture',
      },
      summary: {
        fa: 'کاهش عوارض گمرکی برای صادرات خشکبار و میوه تازه از مبدا ایران به مقاصد فدراسیون روسیه.',
        ru: 'Снижение таможенных пошлин на экспорт сухофруктов и свежих фруктов из Ирана в РФ.',
        en: 'Reduction of customs duties on fresh fruits and dried fruits exported from Iran to Russia.',
      },
    },
    {
      id: 'news-002',
      date: '2026-09-27',
      category: 'Logistics',
      title: {
        fa: 'افتتاح خط منظم کانتینری رو-رو در مسیر بندر انزلی – آستراخان',
        ru: 'Запуск регулярной паромной линии Ро-Ро Анзали – Астрахань',
        en: 'Launch of Regular Ro-Ro Container Service on Anzali – Astrakhan Route',
      },
      summary: {
        fa: 'بهبود زمان سیر کالاهای فاسدشدنی و کاهش زمان انتظار ترخیص کانتینرهای یخچالی.',
        ru: 'Сокращение сроков доставки скоропортящихся грузов и времени таможенного оформления.',
        en: 'Reduced transit times for perishable cargo and expedited reefer container clearance.',
      },
    },
  ];

  getNews(lang: string = 'fa') {
    const selectedLang = ['fa', 'ru', 'en'].includes(lang) ? lang : 'fa';
    return this.news.map((item) => ({
      id: item.id,
      date: item.date,
      category: item.category,
      title: item.title[selectedLang] || item.title.en,
      summary: item.summary[selectedLang] || item.summary.en,
    }));
  }
}
