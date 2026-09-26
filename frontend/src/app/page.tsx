'use client';

import React, { useState } from 'react';

type Lang = 'fa' | 'ru' | 'en';

const translations = {
  fa: {
    title: 'پلتفرم تجارت B2B ایران - روسیه',
    subtitle: 'سامانه یکپارچه صادرات خرما و پسته با تضمین استاندارد و انطباق گمرکی',
    catalogTab: 'کاتالوگ محصولات طلایی',
    rfqTab: 'ثبت استعلام قیمت (RFQ)',
    complianceTab: 'استانداردها و بازرسی',
    switchLang: 'تغییر زبان',
    products: [
      { id: '1', name: 'خرمای مضافتی بم (درجه یک)', hsCode: '0804.10', spec: 'رطوبت ۲۰-۲۴٪ | بسته‌بندی ۵۵۰ گرمی استاندارد صادراتی' },
      { id: '2', name: 'خرمای پیارم (مجلسی)', hsCode: '0804.10', spec: 'رطوبت زیر ۱۵٪ | دست‌چین بدون آفت | صادراتی' },
      { id: '3', name: 'پسته اکبری خندان (۲۲-۲۰)', hsCode: '0802.51', spec: 'آفلاتوکسین مطابق استاندارد EAEU/Gost | انس ۲۰-۲۲' },
      { id: '4', name: 'مغز پسته سبز سوپر (Super Green)', hsCode: '0802.52', spec: 'گرید S | بدون افلاتوکسین | مناسب صنایع شیرینی روسیه' },
    ],
    rfqFormTitle: 'درخواست استعلام قیمت بین‌المللی',
    companyName: 'نام شرکت خریدار/فروشنده',
    productSelect: 'انتخاب محصول',
    volume: 'تناژ درخواستی (تن)',
    targetPort: 'بندر/گمرک مقصد (آستاراخان / بندر انزلی / مسکو)',
    submitRfq: 'ارسال و ترجمه خودکار RFQ',
    rfqSuccess: 'درخواست استعلام شما با موفقیت ثبت شد و به زبان‌های مقصد ترجمه خواهد شد.',
  },
  ru: {
    title: 'Российско-Иранская Торговая B2B Платформа',
    subtitle: 'Единая система экспорта фиников и фисташек со стандартами ГОСТ и ЕАЭС',
    catalogTab: 'Каталог продукции (Золотой список)',
    rfqTab: 'Подать запрос котировок (RFQ)',
    complianceTab: 'Стандарты и Фитосанитария',
    switchLang: 'Выбор языка',
    products: [
      { id: '1', name: 'Финики Мазафати Бам (Премиум)', hsCode: '0804.10', spec: 'Влажность 20-24% | Экспортная упаковка 550г' },
      { id: '2', name: 'Финики Пиаром', hsCode: '0804.10', spec: 'Влажность <15% | Отборный сорт без вредителей' },
      { id: '3', name: 'Фисташки Акбари натурального раскрытия (20-22)', hsCode: '0802.51', spec: 'Афлатоксин по нормам ЕАЭС/ГОСТ | Калибр 20-22' },
      { id: '4', name: 'Фисташковые ядра супер-зеленые (Super Green)', hsCode: '0802.52', spec: 'Сорт S | Без афлатоксина | Для пищевой промышленности' },
    ],
    rfqFormTitle: 'Международный запрос котировок (RFQ)',
    companyName: 'Название компании',
    productSelect: 'Выберите продукт',
    volume: 'Объем партии (тонн)',
    targetPort: 'Порт/Пункт назначения (Астрахань / Москва / СПб)',
    submitRfq: 'Отправить и перевести RFQ',
    rfqSuccess: 'Ваш запрос успешно зарегистрирован и будет автоматически переведен.',
  },
  en: {
    title: 'Iran-Russia B2B Trade Platform',
    subtitle: 'Integrated Export System for Dates & Pistachios with Full Compliance',
    catalogTab: 'Golden List Catalog',
    rfqTab: 'Request for Quote (RFQ)',
    complianceTab: 'Compliance & Standards',
    switchLang: 'Language',
    products: [
      { id: '1', name: 'Mazafati Bam Dates (Grade A)', hsCode: '0804.10', spec: 'Moisture 20-24% | 550g Export Master Box' },
      { id: '2', name: 'Piarom Dates (Semi-Dry)', hsCode: '0804.10', spec: 'Moisture <15% | Selected pest-free' },
      { id: '3', name: 'Akbari Pistachio In-Shell (20-22)', hsCode: '0802.51', spec: 'Aflatoxin compliant with EAEU/Gost | Caliber 20-22' },
      { id: '4', name: 'Super Green Pistachio Kernels', hsCode: '0802.52', spec: 'Grade S | Zero aflatoxin | Confectionery ready' },
    ],
    rfqFormTitle: 'International RFQ Submission',
    companyName: 'Company Name',
    productSelect: 'Select Product',
    volume: 'Requested Volume (MT)',
    targetPort: 'Destination Port/Terminal (Astrakhan / Moscow / Bandar Anzali)',
    submitRfq: 'Submit & Auto-Translate RFQ',
    rfqSuccess: 'Your RFQ has been registered and sent for cross-border automated translation.',
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('fa');
  const [activeTab, setActiveTab] = useState<'catalog' | 'rfq'>('catalog');
  const [submitted, setSubmitted] = useState(false);

  const t = translations[lang];
  const isRtl = lang === 'fa';

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    document.documentElement.setAttribute('dir', newLang === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  return (
    <main className={`min-h-screen bg-slate-50 text-slate-900 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-wider text-emerald-400">REC</span>
            <span className="text-xs bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono">PILOT v1.0</span>
          </div>
          <div className="flex gap-2">
            {(['fa', 'ru', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-3 py-1 rounded text-sm font-semibold transition ${
                  lang === l ? 'bg-emerald-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-slate-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">{t.title}</h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600">{t.subtitle}</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'catalog' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.catalogTab}
            </button>
            <button
              onClick={() => setActiveTab('rfq')}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'rfq' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.rfqTab}
            </button>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'catalog' && (
          <div className="grid sm:grid-cols-2 gap-6">
            {t.products.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-1 rounded">HS: {item.hsCode}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">{item.spec}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-emerald-600 font-medium">EAEU / GOST Compliant</span>
                  <button
                    onClick={() => setActiveTab('rfq')}
                    className="text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded transition"
                  >
                    {t.rfqTab} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rfq' && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{t.rfqFormTitle}</h2>
            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm">
                {t.rfqSuccess}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.companyName}</label>
                  <input required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.productSelect}</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none">
                    {t.products.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.volume}</label>
                  <input type="number" min="1" defaultValue="20" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.targetPort}</label>
                  <input required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 transition">
                  {t.submitRfq}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
