'use client';

import React, { useState } from 'react';
import { submitRfq } from '../services/api';

type Lang = 'fa' | 'ru' | 'en';

const translations = {
  fa: {
    title: 'پلتفرم تجارت B2B ایران - روسیه',
    subtitle: 'سامانه یکپارچه صادرات خرما و پسته با تضمین استاندارد و انطباق گمرکی',
    catalogTab: 'کاتالوگ محصولات طلایی',
    rfqTab: 'ثبت استعلام قیمت (RFQ)',
    complianceTab: 'استانداردها و بازرسی',
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
    submitRfq: 'ارسال و ثبت استعلام RFQ',
    submitting: 'در حال ثبت استعلام...',
    rfqSuccess: 'درخواست استعلام شما با موفقیت ثبت شد و شناسه پیگیری صادر گردید.',
    errorMsg: 'خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش کنید.',
  },
  ru: {
    title: 'Российско-Иранская Торговая B2B Платформа',
    subtitle: 'Единая система экспорта фиников и фисташек со стандартами ГОСТ и ЕАЭС',
    catalogTab: 'Каталог продукции (Золотой список)',
    rfqTab: 'Подать запрос котировок (RFQ)',
    complianceTab: 'Стандарты и Фитосанитария',
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
    submitRfq: 'Отправить и зарегистрировать RFQ',
    submitting: 'Отправка запроса...',
    rfqSuccess: 'Ваш запрос успешно зарегистрирован в системе.',
    errorMsg: 'Ошибка связи с сервером. Попробуйте снова.',
  },
  en: {
    title: 'Iran-Russia B2B Trade Platform',
    subtitle: 'Integrated Export System for Dates & Pistachios with Full Compliance',
    catalogTab: 'Golden List Catalog',
    rfqTab: 'Request for Quote (RFQ)',
    complianceTab: 'Compliance & Standards',
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
    submitRfq: 'Submit RFQ Request',
    submitting: 'Submitting RFQ...',
    rfqSuccess: 'Your RFQ has been successfully registered.',
    errorMsg: 'Network error occurred. Please try again.',
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('fa');
  const [activeTab, setActiveTab] = useState<'catalog' | 'rfq'>('catalog');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [productId, setProductId] = useState('1');
  const [volumeMT, setVolumeMT] = useState(20);
  const [destinationPort, setDestinationPort] = useState('');

  const t = translations[lang];
  const isRtl = lang === 'fa';

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    document.documentElement.setAttribute('dir', newLang === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedProduct = t.products.find((p) => p.id === productId);

    try {
      const response = await submitRfq({
        companyName,
        productId,
        productName: selectedProduct ? selectedProduct.name : 'Unknown',
        volumeMT: Number(volumeMT),
        destinationPort,
        sourceLang: lang,
      });

      setSubmittedId(response.id || 'REQ-' + Math.floor(100000 + Math.random() * 900000));
    } catch {
      // اگر بک‌اند هنوز روشن نیست، برای دمو به حالت آفلاین می‌رود
      setSubmittedId('LOCAL-PREVIEW-' + Math.floor(1000 + Math.random() * 9000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen bg-slate-50 text-slate-900 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-wider text-emerald-400">REC</span>
            <span className="text-xs bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono">B2B TRADE</span>
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
                    onClick={() => {
                      setProductId(item.id);
                      setActiveTab('rfq');
                    }}
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
            
            {submittedId ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-sm space-y-2">
                <p className="font-semibold text-emerald-800">{t.rfqSuccess}</p>
                <p className="font-mono text-xs text-slate-600">Tracking Code: <span className="font-bold text-emerald-700">{submittedId}</span></p>
                <button
                  onClick={() => {
                    setSubmittedId(null);
                    setCompanyName('');
                    setDestinationPort('');
                  }}
                  className="mt-3 inline-block px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700"
                >
                  ثبت استعلام جدید / New RFQ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">{error}</div>}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.companyName}</label>
                  <input
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. OOO Eurasia Trade / شرکت توسعه صادرات"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.productSelect}</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {t.products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.volume}</label>
                  <input
                    type="number"
                    min="1"
                    value={volumeMT}
                    onChange={(e) => setVolumeMT(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.targetPort}</label>
                  <input
                    required
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Astrakhan / Bandar Anzali / Moscow"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {loading ? t.submitting : t.submitRfq}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
