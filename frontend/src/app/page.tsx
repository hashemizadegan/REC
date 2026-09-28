'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchCatalog,
  fetchNews,
  submitRfq,
  CatalogProduct,
  NewsItem,
  CreateRfqPayload,
} from '../services/api';

type Language = 'fa' | 'ru' | 'en';

interface FallbackProduct extends CatalogProduct {
  description: Record<Language, string>;
  minOrder: string;
}

const STATIC_FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: 'prod-pistachio-akbari',
    name: 'پسته اکبری صادراتی',
    category: 'خشکبار / صیفی‌جات',
    origin: 'ایران (رفسنجان/کرمان)',
    hsCode: '080251',
    specs: 'انس ۲۰-۲۲، رطوبت کمتر از ۵٪، گواهی تست آفلاتوکسین منفی',
    standard: 'GOST 32287 / ISIRI',
    priceIndication: '$11,500 - $12,800 / MT (FOB Anzali)',
    minOrder: '20 MT (1 FCL)',
    description: {
      fa: 'تولید دست‌اول باغ‌های پسته رفسنجان مطابق با استاندارد سلامت نباتی و ایمنی غذایی فدراسیون روسیه.',
      ru: 'Экспортные фисташки Акбари высшего качества, сертифицированные по стандартам фитосанитарии РФ.',
      en: 'Premium Akbari Pistachios fully tested for aflatoxins and certified for Russian retail networks.',
    },
  },
  {
    id: 'prod-dates-mazafati',
    name: 'خرما مضافتی بم (درجه یک)',
    category: 'محصولات خرمایی',
    origin: 'ایران (بم/جیرفت)',
    hsCode: '080410',
    specs: 'رطوبت ۲۸-۳۲٪، بسته‌بندی ۵۰۰ گرمی شرینک در کارتن مادر',
    standard: 'GOST 6882 / Halal / ISO 22000',
    priceIndication: '$1,850 - $2,200 / MT (CFR Astrakhan)',
    minOrder: '22 MT (Reefer Container)',
    description: {
      fa: 'خرمای مضافتی مرغوب آماده صادرات مستقیم به زنجیره‌های خرده‌فروشی روسیه نظیر Magnit و X5.',
      ru: 'Иранские финики Мазафати высшего сорта в экспортной упаковке для торговых сетей РФ.',
      en: 'Top-grade Mazafati Dates packed in reefer containers for direct customs clearance at Astrakhan.',
    },
  },
  {
    id: 'prod-fertilizer-urea',
    name: 'اوره گرانول ۴۶٪ صادراتی',
    category: 'محصولات شیمیایی و پتروشیمی',
    origin: 'ایران (عسلویه)',
    hsCode: '310210',
    specs: 'نیتروژن ۴۶٪، بیورت حداکثر ۱٪، رطوبت ۰.۵٪',
    standard: 'GOST 2081 / International Grade',
    priceIndication: '$340 - $370 / MT (FOB Bandar Abbas/Anzali)',
    minOrder: '500 MT',
    description: {
      fa: 'کود کشاورزی با استاندارد بین‌المللی برای تامین نیازمندی‌های کشت و صنعت اوراسیا.',
      ru: 'Гранулированный карбамид (мочевина 46%) для сельскохозяйственных предприятий.',
      en: 'Granular Urea 46% for large-scale agricultural and trade partnerships within INSTC.',
    },
  },
];

const STATIC_FALLBACK_NEWS: Record<Language, NewsItem[]> = {
  fa: [
    {
      id: 'news-1',
      title: 'اجرای موافقت‌نامه تجارت آزاد ایران و اتحادیه اقتصادی اوراسیا (EAEU)',
      summary: 'تسهیل تعرفه‌ای ۹۰ درصد از اقلام کشاورزی و صنعتی میان ایران و ۵ کشور عضو اوراسیا از ماه آینده آغاز می‌شود.',
      date: '۱۴۰۳/۰۷/۰۵',
      category: 'گمرک و تعرفه',
    },
    {
      id: 'news-2',
      title: 'افتتاح خط منظم کانتینری یخچال‌دار در کریدور خزر (امیرآباد - آستاراخان)',
      summary: 'امکان ترانزیت کالا‌های فاسدشدنی و میوه و صیفی‌جات در کمتر از ۴۸ ساعت با هماهنگی سازمان بنادر دو کشور فراهم شد.',
      date: '۱۴۰۳/۰۷/۰۱',
      category: 'لجستیک و ترانزیت',
    },
    {
      id: 'news-3',
      title: 'پروتکل پذیرش متقابل استانداردهای سلامت نباتی (Rosselkhoznadzor)',
      summary: 'آزمایشگاه‌های مرجع ایران برای صدور گواهی استاندارد بهداشتی محصولات صادراتی به روسیه تایید صلاحیت شدند.',
      date: '۱۴۰۳/۰۶/۲۵',
      category: 'استاندارد و ایمنی',
    },
  ],
  ru: [
    {
      id: 'news-1',
      title: 'Вступление в силу соглашения о свободной торговле Иран-ЕАЭС',
      summary: 'Снижение пошлин на 90% товарных позиций в сфере агропромышленного комплекса и машиностроения.',
      date: '2026-09-25',
      category: 'Таможня и пошлины',
    },
    {
      id: 'news-2',
      title: 'Запуск регулярной рефрижераторной линии на Каспии (Амирабад — Астрахань)',
      summary: 'Транзитное время сократилось до 48 часов для скоропортящейся продукции.',
      date: '2026-09-20',
      category: 'Логистика',
    },
    {
      id: 'news-3',
      title: 'Протокол Россельхознадзора по взаимному признанию фитосанитарных норм',
      summary: 'Упрощенный ввоз фисташек, фиников и плодоовощной продукции через специализированные пограничные терминалы.',
      date: '2026-09-15',
      category: 'Стандарты и безопасность',
    },
  ],
  en: [
    {
      id: 'news-1',
      title: 'Full Implementation of Iran-EAEU Free Trade Agreement',
      summary: 'Tariff elimination on over 90% of bilateral agricultural and industrial commodity exchanges.',
      date: '2026-09-25',
      category: 'Tariff & Policy',
    },
    {
      id: 'news-2',
      title: 'Dedicated Caspian Reefer Container Service Launched',
      summary: 'Direct express maritime route between Amirabad and Astrakhan operational for fresh produce exporters.',
      date: '2026-09-20',
      category: 'Logistics',
    },
    {
      id: 'news-3',
      title: 'Phytosanitary Alignment Between Rosselkhoznadzor & Standard Org',
      summary: 'Accredited testing labs streamline customs release times at border terminals.',
      date: '2026-09-15',
      category: 'Compliance',
    },
  ],
};

const UI_TEXT = {
  fa: {
    portalTitle: 'پورتال ملی تجارت دوجانبه ایران و روسیه (REC)',
    portalSubtitle: 'سامانه یکپارچه اعتبارسنجی تأمین‌کنندگان، استعلام مستقیم قیمت (RFQ) و ره‌گیری مبادلات کریدور شمال-جنوب',
    searchPlaceholder: 'جستجو بر اساس نام محصول، کد تعرفه (HS Code) یا گواهینامه...',
    allCategories: 'همه دسته‌ها',
    viewCatalog: 'کاتالوگ ارزیابی‌شده',
    verifiedBadge: 'تأییدشده در لیست طلایی (Golden List)',
    submitRfqBtn: 'ارسال استعلام رسمی (RFQ)',
    corridorStatus: 'وضعیت کریدور تجاری',
    tickerRates: 'شاخص روبل/ریال: توافقی بانکی | پایانه آستارا: روان | بندر انزلی-آستاراخان: فعال | تعرفه EAEU: ترجیحی ۰٪',
    pillarsTitle: 'چهار رکن عملیاتی پورتال تجاری',
    pillar1Title: 'اعتبارسنجی حقوقی و KYB',
    pillar1Desc: 'بررسی رسمی صلاحیت ثبت شرکت‌ها، توان تولید و گواهی‌های حسن انجام کار.',
    pillar2Title: 'تسویه چندارزی و بریکس',
    pillar2Desc: 'پشتیبانی از پروتکل‌های تسویه مستقیم روبل-ریال و پیام‌رسان‌های مالی غیروابسته.',
    pillar3Title: 'استاندارد GOST و قرنطینه',
    pillar3Desc: 'تطبیق آزمایشگاهی با موازین روس‌سلخوزنادزور (Rosselkhoznadzor) و سازمان ملی استاندارد.',
    pillar4Title: 'ترانزیت و زنجیره سرد INSTC',
    pillar4Desc: 'تضمین کانتینرهای یخچالی و رهگیری بارنامه از مبدا تا پایانه مقصد.',
    newsHubTitle: 'مرکز تحلیل و اخبار بازرگانی اوراسیا',
    newsHubSubtitle: 'تازه‌ترین دستورالعمل‌های گمرکی، عوارض صادراتی و فرصت‌های سرمایه‌گذاری متقابل',
    rfqModalTitle: 'ثبت استعلام رسمی قیمت و قرارداد تأمین (RFQ)',
    companyLabel: 'نام شرکت / شخصیت حقوقی خریدار',
    volumeLabel: 'حجم درخواستی (تن متریک)',
    portLabel: 'بندر / پایانه تحویل نهایی',
    selectProduct: 'محصول مورد نظر را انتخاب فرمایید',
    cancel: 'انصراف',
    send: 'ثبت و ارسال استعلام',
    successMsg: 'استعلام شما با موفقیت ثبت شد و در سیستم تطبیق کالا قرار گرفت.',
    errorMsg: 'خطا در ثبت استعلام. لطفاً دوباره تلاش کنید.',
  },
  ru: {
    portalTitle: 'Российско-Иранский B2B Торговый Портал (REC)',
    portalSubtitle: 'Единая платформа верификации поставщиков, прямых запросов котировок (RFQ) и логистики коридора «Север–Юг»',
    searchPlaceholder: 'Поиск по названию товара, коду ТН ВЭД (HS Code) или ГОСТ...',
    allCategories: 'Все категории',
    viewCatalog: 'Верифицированный каталог',
    verifiedBadge: 'Проверено в «Золотом списке»',
    submitRfqBtn: 'Подать официальный запрос (RFQ)',
    corridorStatus: 'Статус торгового коридора',
    tickerRates: 'Курс Рубль/Риал: межбанковский | Терминал Астара: штатно | Астрахань-Энзели: активен | Пошлины ЕАЭС: 0%',
    pillarsTitle: 'Четыре ключевых опоры торговой платформы',
    pillar1Title: 'Верификация контрагентов (KYB)',
    pillar1Desc: 'Официальный скоринг правоспособности юридических лиц и мощностей производства.',
    pillar2Title: 'Мультивалютные расчеты',
    pillar2Desc: 'Расчеты в национальных валютах (рубль/риал) и прямые межбанковские шлюзы.',
    pillar3Title: 'Стандарты ГОСТ и фитосанитария',
    pillar3Desc: 'Полная интеграция с требованиями Россельхознадзора и национальных регуляторов.',
    pillar4Title: 'Логистика и рефрижераторы МТК',
    pillar4Desc: 'Морские и железнодорожные перевозки с контролем холодовой цепи.',
    newsHubTitle: 'Центр торговой аналитики и новостей ЕАЭС',
    newsHubSubtitle: 'Свежие таможенные предписания, изменения пошлин и экспортные директивы',
    rfqModalTitle: 'Официальный запрос коммерческого предложения (RFQ)',
    companyLabel: 'Наименование компании-покупателя',
    volumeLabel: 'Объем партии (метрических тонн)',
    portLabel: 'Порт назначения / Таможенный терминал',
    selectProduct: 'Выберите необходимый товар',
    cancel: 'Отмена',
    send: 'Отправить запрос',
    successMsg: 'Ваш запрос успешно отправлен и зарегистрирован в реестре сделок.',
    errorMsg: 'Ошибка отправки запроса. Пожалуйста, повторите попытку.',
  },
  en: {
    portalTitle: 'Iran–Russia B2B Strategic Trade Portal (REC)',
    portalSubtitle: 'Integrated gateway for supplier verification, official RFQ sourcing, and INSTC trade compliance',
    searchPlaceholder: 'Search by product name, HS Code, or GOST standard...',
    allCategories: 'All Categories',
    viewCatalog: 'Verified Golden Catalog',
    verifiedBadge: 'Golden List Verified',
    submitRfqBtn: 'Issue Official RFQ',
    corridorStatus: 'Trade Corridor Status',
    tickerRates: 'RUB/IRR: Direct Bank Settled | Astara Border: Flowing | Anzali-Astrakhan: Operational | EAEU FTA: Active',
    pillarsTitle: 'Strategic Pillars of the Trade Portal',
    pillar1Title: 'KYB & Corporate Auditing',
    pillar1Desc: 'Comprehensive cross-border legal due diligence and factory production verification.',
    pillar2Title: 'Multi-Currency Clearing',
    pillar2Desc: 'Sanction-resilient bilateral currency clearing mechanisms (Ruble-Rial & BRICS frameworks).',
    pillar3Title: 'GOST & Regulatory Compliance',
    pillar3Desc: 'Laboratory testing compliance with Rosselkhoznadzor phytosanitary standards.',
    pillar4Title: 'INSTC Multimodal Logistics',
    pillar4Desc: 'Seamless maritime and rail freight logistics with strict cold-chain supervision.',
    newsHubTitle: 'Trade Intelligence & Eurasian News Hub',
    newsHubSubtitle: 'Real-time customs rulings, tariff updates, and bilateral commercial insights',
    rfqModalTitle: 'Issue Official Request for Quotation (RFQ)',
    companyLabel: 'Buyer Legal Entity / Corporate Name',
    volumeLabel: 'Order Volume (Metric Tons)',
    portLabel: 'Destination Port / Border Terminal',
    selectProduct: 'Select targeted commodity',
    cancel: 'Cancel',
    send: 'Submit RFQ Document',
    successMsg: 'RFQ has been submitted successfully to the trading network.',
    errorMsg: 'Submission failed. Please check network connectivity and retry.',
  },
};

export default function TradePortalPage() {
  const [lang, setLang] = useState<Language>('fa');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [catalog, setCatalog] = useState<CatalogProduct[]>(STATIC_FALLBACK_PRODUCTS);
  const [news, setNews] = useState<NewsItem[]>(STATIC_FALLBACK_NEWS['fa']);
  const [loading, setLoading] = useState(false);

  // RFQ Modal State
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [selectedProductForRfq, setSelectedProductForRfq] = useState<CatalogProduct | null>(null);
  const [rfqForm, setRfqForm] = useState({
    companyName: '',
    volumeMT: 20,
    destinationPort: 'Astrakhan Port (Russian Federation)',
  });
  const [rfqStatus, setRfqStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const t = UI_TEXT[lang];
  const isRtl = lang === 'fa';

  // بارگذاری داده‌های کاتالوگ و اخبار از API بک‌اند
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [apiCatalog, apiNews] = await Promise.all([
          fetchCatalog(lang),
          fetchNews(lang),
        ]);

        if (isMounted) {
          if (apiCatalog && apiCatalog.length > 0) {
            setCatalog(apiCatalog);
          } else {
            setCatalog(STATIC_FALLBACK_PRODUCTS);
          }

          if (apiNews && apiNews.length > 0) {
            setNews(apiNews);
          } else {
            setNews(STATIC_FALLBACK_NEWS[lang] || STATIC_FALLBACK_NEWS.fa);
          }
        }
      } catch (err) {
        console.warn('Using portal fallback state:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [lang]);

  // دسته‌بندی‌های یکتا
  const categories = useMemo(() => {
    const list = Array.from(new Set(catalog.map((p) => p.category)));
    return ['all', ...list];
  }, [catalog]);

  // فیلتر هوشمند محصولات
  const filteredProducts = useMemo(() => {
    return catalog.filter((product) => {
      const matchCat = selectedCategory === 'all' || product.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(term) ||
        product.hsCode.toLowerCase().includes(term) ||
        (product.specs && product.specs.toLowerCase().includes(term)) ||
        (product.standard && product.standard.toLowerCase().includes(term));
      return matchCat && matchSearch;
    });
  }, [catalog, selectedCategory, searchTerm]);

  // مدیریت باز کردن مودال RFQ
  const handleOpenRfq = (product?: CatalogProduct) => {
    setSelectedProductForRfq(product || catalog[0] || null);
    setRfqStatus('idle');
    setRfqModalOpen(true);
  };

  // ثبت فرم RFQ
  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForRfq) return;

    setRfqStatus('submitting');
    try {
      const payload: CreateRfqPayload = {
        companyName: rfqForm.companyName,
        productId: selectedProductForRfq.id,
        productName: selectedProductForRfq.name,
        volumeMT: Number(rfqForm.volumeMT),
        destinationPort: rfqForm.destinationPort,
        sourceLang: lang,
      };

      await submitRfq(payload);
      setRfqStatus('success');
      setTimeout(() => {
        setRfqModalOpen(false);
        setRfqStatus('idle');
      }, 2500);
    } catch (err) {
      console.error(err);
      setRfqStatus('error');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. نوار اعلانات و شاخص‌های زنده بازار و گمرک */}
      <section className="bg-slate-950 border-b border-slate-800 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-emerald-400">{t.corridorStatus}:</span>
            <span className="text-slate-300">{t.tickerRates}</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-400">زبان / Язык / Lang:</label>
            <div className="inline-flex rounded-md shadow-sm border border-slate-700 overflow-hidden">
              <button
                onClick={() => setLang('fa')}
                className={`px-2.5 py-1 text-xs font-medium transition ${
                  lang === 'fa' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                فارسی
              </button>
              <button
                onClick={() => setLang('ru')}
                className={`px-2.5 py-1 text-xs font-medium transition ${
                  lang === 'ru' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Русский
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-medium transition ${
                  lang === 'en' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. سربرگ اصلی پورتال (Navigation Bar) */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              REC
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">REC Trade Portal</h1>
              <p className="text-xs text-slate-400">Iran–Russia Bilateral B2B Ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#catalog"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
            >
              {t.viewCatalog}
            </a>
            <button
              onClick={() => handleOpenRfq()}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/30 transition"
            >
              {t.submitRfqBtn}
            </button>
          </div>
        </div>
      </header>

      {/* 3. بخش ورودی و موتور جستجوی هوشمند تجاری (Hero & Gateway) */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block py-1 px-3 mb-4 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            Eurasian Corridor Trade Engine
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            {t.portalTitle}
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto mb-8">
            {t.portalSubtitle}
          </p>

          {/* موتور جستجوی پورتال با پشتیبانی از HS Code */}
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 shadow-2xl flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{t.allCategories}</option>
              {categories.filter((c) => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const el = document.getElementById('catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-emerald-600/30"
            >
              جستجو و تطبیق
            </button>
          </div>
        </div>
      </section>

      {/* 4. ارکان چهارگانه پورتال (Four Pillars of Cross-Border Trade) */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white mb-2">{t.pillarsTitle}</h3>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
              01
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{t.pillar1Title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{t.pillar1Desc}</p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-teal-500 group-hover:text-slate-950 transition">
              02
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{t.pillar2Title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{t.pillar2Desc}</p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-indigo-500 group-hover:text-slate-950 transition">
              03
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{t.pillar3Title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{t.pillar3Desc}</p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              04
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{t.pillar4Title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{t.pillar4Desc}</p>
          </div>
        </div>
      </section>

      {/* 5. کاتالوگ ارزیابی‌شده و استعلام کالا (Verified Golden Catalog) */}
      <section id="catalog" className="py-12 px-4 max-w-7xl mx-auto border-t border-slate-800">
        <div className="flex flex-wrap justify-between items-end mb-8 gap-4">
          <div>
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Verified Commodities</span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">{t.viewCatalog}</h3>
          </div>
          <span className="text-sm text-slate-400">
            نمایش {filteredProducts.length} کالای واجد شرایط توافق EAEU
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-slate-800/40 rounded-2xl p-12 text-center border border-slate-700 text-slate-400">
            موردی مطابق با عبارت جستجو یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/70 hover:shadow-xl hover:shadow-emerald-950/30 transition"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono font-bold bg-slate-900 text-emerald-400 px-2.5 py-1 rounded border border-emerald-900/50">
                      HS: {prod.hsCode}
                    </span>
                    <span className="text-xs bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/50">
                      {t.verifiedBadge}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2">{prod.name}</h4>
                  <p className="text-xs text-slate-400 mb-4 font-mono">{prod.category} | {prod.origin}</p>

                  <div className="bg-slate-900/80 rounded-xl p-3.5 space-y-2 mb-4 text-xs border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">استاندارد:</span>
                      <span className="font-semibold text-slate-200">{prod.standard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">مشخصات فنی:</span>
                      <span className="text-slate-300 truncate max-w-[200px]" title={prod.specs}>
                        {prod.specs}
                      </span>
                    </div>
                    {prod.priceIndication && (
                      <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                        <span>مظنه مرجع:</span>
                        <span>{prod.priceIndication}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenRfq(prod)}
                  className="w-full py-2.5 bg-slate-700 hover:bg-emerald-600 text-white font-medium text-xs rounded-xl transition duration-200 shadow"
                >
                  {t.submitRfqBtn}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. مرکز داده‌ها و تحلیل‌های بازرگانی (Trade Intelligence & News Hub) */}
      <section className="py-12 px-4 max-w-7xl mx-auto border-t border-slate-800">
        <div className="mb-8">
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Intelligence & Insights</span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">{t.newsHubTitle}</h3>
          <p className="text-sm text-slate-400 mt-1">{t.newsHubSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-800 transition"
            >
              <div>
                <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                  <span className="text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-900/50">
                    {item.category}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2 leading-snug hover:text-emerald-400 transition cursor-pointer">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-700/50 text-xs font-semibold text-emerald-400 flex items-center justify-between">
                <span>مشاهده گزارش کامل و بخشنامه</span>
                <span>←</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. فوتر رسمی و پورتال موسساتی */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-bold text-white text-sm mb-1">Russia–Iran Economic Council (REC) B2B Gateway</p>
            <p className="text-slate-500">پلتفرم راهبردی توسعه صادرات، تطبیق مقررات گمرکی و سورسینگ کالا</p>
          </div>
          <div className="flex gap-6 text-slate-400">
            <span>سازمان توسعه تجارت</span>
            <span>اتحادیه اقتصادی اوراسیا (EAEU)</span>
            <span>کریدور بین‌المللی شمال–جنوب (INSTC)</span>
          </div>
          <div className="text-slate-500">
            © {new Date().getFullYear()} REC Platform. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 8. مودال رسمی ثبت RFQ */}
      {rfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setRfqModalOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-1">{t.rfqModalTitle}</h3>
            {selectedProductForRfq && (
              <p className="text-xs text-emerald-400 mb-4 font-mono">
                {selectedProductForRfq.name} (HS: {selectedProductForRfq.hsCode})
              </p>
            )}

            {rfqStatus === 'success' ? (
              <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-4 rounded-xl text-center text-sm font-semibold my-6">
                ✓ {t.successMsg}
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t.companyLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: بازرگانی اوراسیا ترانس / ООО «Евразия Трейд»"
                    value={rfqForm.companyName}
                    onChange={(e) => setRfqForm({ ...rfqForm, companyName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.volumeLabel}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={rfqForm.volumeMT}
                      onChange={(e) => setRfqForm({ ...rfqForm, volumeMT: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {t.portLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={rfqForm.destinationPort}
                      onChange={(e) => setRfqForm({ ...rfqForm, destinationPort: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {rfqStatus === 'error' && (
                  <p className="text-xs text-rose-400">{t.errorMsg}</p>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRfqModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={rfqStatus === 'submitting'}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg disabled:opacity-50"
                  >
                    {rfqStatus === 'submitting' ? 'در حال ارسال...' : t.send}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
