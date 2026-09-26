import { Injectable } from '@nestjs/common';
import { TranslationRequestDto, TranslationResponse } from './translation.interface';

@Injectable()
export class TranslationService {
  // واژه‌نامه پایه اصطلاحات تخصصی تجارت ایران و روسیه
  private readonly agriculturalGlossary: Record<string, { fa: string; ru: string; en: string }> = {
    dates: {
      fa: 'خرمای مضافتی',
      ru: 'Финики Мазафати',
      en: 'Mazafati Dates',
    },
    pistachio: {
      fa: 'پسته کله‌قوچی/فندقی',
      ru: 'Фисташки натуральные',
      en: 'Natural Pistachios',
    },
    phytosanitary: {
      fa: 'گواهی بهداشت نباتی (فیتوسانیتری)',
      ru: 'Фитосанитарный сертификат',
      en: 'Phytosanitary Certificate',
    },
    customs_clearance: {
      fa: 'ترخیص گمرکی',
      ru: 'Таможенное оформление',
      en: 'Customs Clearance',
    },
  };

  async translateText(dto: TranslationRequestDto): Promise<TranslationResponse> {
    const { text, sourceLang, targetLang } = dto;

    // تطبیق ساده با گلاسری در صورت وجود کلمه کلیدی
    let translated = `[${targetLang.toUpperCase()}] ${text}`;
    let glossaryApplied = false;

    for (const item of Object.values(this.agriculturalGlossary)) {
      if (text.includes(item[sourceLang])) {
        translated = text.replace(item[sourceLang], item[targetLang]);
        glossaryApplied = true;
        break;
      }
    }

    return {
      originalText: text,
      translatedText: translated,
      sourceLang,
      targetLang,
      glossaryApplied,
      timestamp: new Date().toISOString(),
    };
  }
}
