'use client';

import React, { useState, useEffect } from 'react';

type Language = 'fa' | 'ru' | 'en';
type AuthMode = 'login' | 'register' | null;

interface UserSession {
  companyName: string;
  email: string;
  country: 'IR' | 'RU';
  taxId: string; // شناسه ملی یا ИНН
  kybStatus: 'VERIFIED' | 'PENDING';
  isGoldenList: boolean;
}

export default function HomePage() {
  const [lang, setLang] = useState<Language>('fa');
  const [activeTab, setActiveTab] = useState<'catalog' | 'rfq'>('catalog');
  const [authModal, setAuthModal] = useState<AuthMode>(null);

  // وضعیت نشست کاربر (Session)
  const [user, setUser] = useState<UserSession | null>(null);

  // فیلدهای فرم لاگین
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // فیلدهای فرم ثبت‌نام شرکت (KYB)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCountry, setRegCountry] = useState<'IR' | 'RU'>('IR');
  const [regTaxId, setRegTaxId] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // فرم RFQ
  const [selectedProduct, setSelectedProduct] = useState('pistachio-akbari');
  const [volumeMt, setVolumeMt] = useState(25);
  const [incoterms, setIncoterms] = useState('FCA');
  const [targetPrice, setTargetPrice] = useState('9200');
  const [rfqSuccess, setRfqSuccess] = useState<string | null>(null);

  // بازیابی نشست از لوکال‌استوریج
  useEffect(() => {
    const saved = localStorage.getItem('rec_user_session');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rec_user_session');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    // شبیه‌سازی ورود شرکت نمونه یا کاربر ثبت‌شده
    const session: UserSession = {
      companyName: loginEmail.includes('ru') ? 'ООО Трейд Экспресс' : 'بازرگانی پارس آریا',
      email: loginEmail,
      country: loginEmail.includes('ru') ? 'RU' : 'IR',
      taxId: loginEmail.includes('ru') ? '7701234567' : '10103456789',
      kybStatus: 'VERIFIED',
      isGoldenList: true,
    };

    setUser(session);
    localStorage.setItem('rec_user_session', JSON.stringify(session));
    setAuthModal(null);
    setLoginPassword('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regTaxId || !regPassword) return;

    const newSession: UserSession = {
      companyName: regName,
      email: regEmail,
      country: regCountry,
      taxId: regTaxId,
      kybStatus: 'PENDING', // تا زمان بررسی اسناد در وضعیت در انتظار بررسی قرار می‌گیرد
      isGoldenList: false,
    };

    setUser(newSession);
    localStorage.setItem('rec_user_session', JSON.stringify(newSession));
    setAuthModal(null);
    setRegPassword('');
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModal('login');
      return;
    }
    const rfqId = `RFQ-REC-${Date.now().toString().slice(-6)}`;
    setRfqSuccess(rfqId);
  };

  const isRtl = lang === 'fa';

  const t = {
    fa: {
      platformTitle: 'پلتفرم تجارت B2B ایران و روسیه',
      platformSub: 'مرکز تسویه و تبادلات کالایی بر پایه استانداردهای اوراسیا (EAEU)',
      login: 'ورود به حساب تجاری',
      register: 'ثبت‌نام شرکت (KYB)',
      logout: 'خروج',
      statusVerified: 'احراز هویت شده (KYB تایید)',
      statusPending: 'در انتظار تأیید مدارک تجاری',
      tabCatalog: 'کاتالوگ محصولات صادراتی',
      tabRfq: 'ثبت استعلام رسمی (RFQ)',
      needLoginMsg: 'برای مشاهده قیمت قطعی و ارسال درخواست رسمی RFQ باید وارد حساب کاربری خود شوید.',
      loginToProceed: 'ورود جهت ثبت درخواست',
      products: [
        {
          id: 'pistachio-akbari',
          name: 'پسته اکبری اعلا',
          hs: 'HS: 080251',
          origin: 'ایران (رفسنجان)',
          compliance: 'مطابق GOST روسیه و EAEU (آفلاتوکسین مجاز)',
          standard: 'استاندارد بین‌المللی صادراتی',
        },
        {
          id: 'dates-mazafati',
          name: 'خرمای مضافتی ممتاز',
          hs: 'HS: 080410',
          origin: 'ایران (بم)',
          compliance: 'سورتینگ و بسته‌بندی مکانیزه EAEU Compliant',
          standard: 'گواهی سلامت نباتی فیتوسانیتری',
        },
      ],
      actionRfq: 'درخواست پیش‌فاکتور (RFQ)',
      loginModalTitle: 'ورود به پنل شرکتی B2B',
      regModalTitle: 'ثبت‌نام تجاری و احراز هویت شرکت (KYB)',
      emailLabel: 'ایمیل رسمی / کاربری',
      passwordLabel: 'رمز عبور',
      companyNameLabel: 'نام ثبتی شرکت',
      countryLabel: 'کشور مبدا',
      taxIdLabel: 'شناسه ملی شرکت / ИНН روسیه',
      phoneLabel: 'تلفن تماس بین‌المللی',
      submitLogin: 'ورود به پنل',
      submitRegister: 'ارسال مدارک و ساخت حساب',
      close: 'بستن',
      rfqTitle: 'فرم درخواست رسمی استعلام قیمت و سفارش (RFQ)',
      rfqSuccessMsg: 'درخواست شما با موفقیت ثبت گردید. شماره رهگیری:',
    },
    ru: {
      platformTitle: 'B2B Торговая Платформа Иран – Россия',
      platformSub: 'Клиринговый центр и сырьевая биржа по стандартам ЕАЭС',
      login: 'Вход для компаний',
      register: 'Регистрация (KYB)',
      logout: 'Выход',
      statusVerified: 'Верифицирован (KYB Пройден)',
      statusPending: 'На проверке документов',
      tabCatalog: 'Каталог продукции',
      tabRfq: 'Подать запрос котировок (RFQ)',
      needLoginMsg: 'Для доступа к оптовым ценам и подаче RFQ требуется авторизация.',
      loginToProceed: 'Войти для подачи заявки',
      products: [
        {
          id: 'pistachio-akbari',
          name: 'Фисташки Акбари Премиум',
          hs: 'ТН ВЭД: 080251',
          origin: 'Иран (Рафсанджан)',
          compliance: 'Соответствие ГОСТ и техрегламентам ЕАЭС',
          standard: 'Экспортный сертификат качества',
        },
        {
          id: 'dates-mazafati',
          name: 'Финики Мазафати',
          hs: 'ТН ВЭД: 080410',
          origin: 'Иран (Бам)',
          compliance: 'Механизированная сортировка по нормам ЕАЭС',
          standard: 'Фитосанитарный сертификат',
        },
      ],
      actionRfq: 'Запросить котировку (RFQ)',
      loginModalTitle: 'Вход в торговую систему',
      regModalTitle: 'Регистрация компании и проверка KYB',
      emailLabel: 'Корпоративный Email',
      passwordLabel: 'Пароль',
      companyNameLabel: 'Наименование организации (ООО/АО)',
      countryLabel: 'Страна юрисдикции',
      taxIdLabel: 'ИНН организации / ОГРН',
      phoneLabel: 'Контактный телефон',
      submitLogin: 'Войти',
      submitRegister: 'Зарегистрироваться',
      close: 'Закрыть',
      rfqTitle: 'Официальный запрос коммерческого предложения (RFQ)',
      rfqSuccessMsg: 'Запрос успешно зарегистрирован. Номер заявки:',
    },
    en: {
      platformTitle: 'Iran – Russia B2B Trade Gateway',
      platformSub: 'Cross-Border Clearing & Settlement under EAEU Regulatory Standards',
      login: 'Company Login',
      register: 'Corporate Registration (KYB)',
      logout: 'Sign Out',
      statusVerified: 'Verified Enterprise (KYB Passed)',
      statusPending: 'Verification In Review',
      tabCatalog: 'Export Catalog',
      tabRfq: 'Submit RFQ',
      needLoginMsg: 'Please sign in with your corporate account to access pricing and submit RFQ.',
      loginToProceed: 'Sign in to Submit',
      products: [
        {
          id: 'pistachio-akbari',
          name: 'Super Long Akbari Pistachio',
          hs: 'HS Code: 080251',
          origin: 'Iran (Rafsanjan)',
          compliance: 'EAEU & GOST Compliant (Verified Aflatoxin Limits)',
          standard: 'Export Grade Premium',
        },
        {
          id: 'dates-mazafati',
          name: 'Mazafati Fresh Dates',
          hs: 'HS Code: 080410',
          origin: 'Iran (Bam)',
          compliance: 'EAEU Certified Packaging & Sorting',
          standard: 'Phytosanitary Certified',
        },
      ],
      actionRfq: 'Request for Quote (RFQ)',
      loginModalTitle: 'Corporate Portal Login',
      regModalTitle: 'Corporate KYB Registration',
      emailLabel: 'Corporate Email',
      passwordLabel: 'Password',
      companyNameLabel: 'Company Legal Name',
      countryLabel: 'Jurisdiction',
      taxIdLabel: 'Tax ID / INN / National Code',
      phoneLabel: 'Business Phone',
      submitLogin: 'Login',
      submitRegister: 'Submit for KYB Verification',
      close: 'Close',
      rfqTitle: 'Request for Quotation (RFQ)',
      rfqSuccessMsg: 'Your RFQ has been successfully logged. Tracking ID:',
    },
  }[lang];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* هدر بالایی */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-emerald-600 flex items-center justify-center font-bold text-lg text-white">
              REC
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">{t.platformTitle}</h1>
              <p className="text-xs text-slate-400">{t.platformSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* انتخاب زبان */}
            <div className="flex rounded-md bg-slate-800 p-1 border border-slate-700 text-xs">
              {(['fa', 'ru', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded transition ${
                    lang === l ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* بخش ورود / پروفایل شرکت */}
            {user ? (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                <div>
                  <div className="font-semibold text-white">{user.companyName}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        user.kybStatus === 'VERIFIED' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-[11px] text-slate-300">
                      {user.kybStatus === 'VERIFIED' ? t.statusVerified : t.statusPending}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-rose-400 hover:text-rose-300 text-xs border border-rose-900/50 hover:bg-rose-950 px-2 py-1 rounded transition"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal('login')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium px-3.5 py-2 rounded-lg transition"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-2 rounded-lg transition"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* تب‌های اصلی صفحه */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="flex border-b border-slate-800 mb-8 gap-6 text-sm">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 font-semibold transition border-b-2 ${
              activeTab === 'catalog'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.tabCatalog}
          </button>
          <button
            onClick={() => setActiveTab('rfq')}
            className={`pb-3 font-semibold transition border-b-2 ${
              activeTab === 'rfq'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.tabRfq}
          </button>
        </div>

        {/* نمای کاتالوگ */}
        {activeTab === 'catalog' && (
          <div>
            {!user && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex flex-wrap items-center justify-between gap-3">
                <span>{t.needLoginMsg}</span>
                <button
                  onClick={() => setAuthModal('login')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition"
                >
                  {t.loginToProceed}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.products.map((prod) => (
                <div
                  key={prod.id}
                  className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-2.5 py-1 rounded">
                        {prod.hs}
                      </span>
                      <span className="text-xs text-slate-400">{prod.origin}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{prod.name}</h3>
                    <div className="space-y-1.5 text-xs text-slate-300 mt-4 border-t border-slate-800/80 pt-3">
                      <div>✓ {prod.compliance}</div>
                      <div>✓ {prod.standard}</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500">حداقل سفارش: </span>
                      <span className="text-xs text-slate-300 font-semibold">20 MT (کانتینر FCL)</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(prod.id);
                        setActiveTab('rfq');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition"
                    >
                      {t.actionRfq}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نمای RFQ */}
        {activeTab === 'rfq' && (
          <div className="max-w-2xl mx-auto border border-slate-800 bg-slate-950/60 p-8 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2">{t.rfqTitle}</h2>
            <p className="text-xs text-slate-400 mb-6">
              اسناد استعلام بر اساس قراردادهای استاندارد بازرگانی ایران و فدراسیون روسیه پردازش می‌شوند.
            </p>

            {rfqSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm">
                {t.rfqSuccessMsg} <strong className="font-mono text-white">{rfqSuccess}</strong>
              </div>
            )}

            {!user ? (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                <p className="text-sm text-slate-300 mb-4">{t.needLoginMsg}</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setAuthModal('login')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
                  >
                    {t.login}
                  </button>
                  <button
                    onClick={() => setAuthModal('register')}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
                  >
                    {t.register}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-medium">کالای انتخابی</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pistachio-akbari">پسته اکبری اعلا (HS 080251)</option>
                    <option value="dates-mazafati">خرمای مضافتی ممتاز (HS 080410)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1.5 font-medium">حجم سفارش (تن متری)</label>
                    <input
                      type="number"
                      value={volumeMt}
                      onChange={(e) => setVolumeMt(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5 font-medium">اینکوترمز تحویل</label>
                    <select
                      value={incoterms}
                      onChange={(e) => setIncoterms(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="FCA">FCA (انزلی / آستارا)</option>
                      <option value="CPT">CPT (آستراخان روسیه)</option>
                      <option value="FOB">FOB (بندر امیرآباد)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5 font-medium">قیمت پیشنهادی مدنظر (USD / MT)</label>
                  <input
                    type="text"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition"
                >
                  ثبت رسمی درخواست استعلام RFQ
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* مدال ورود و ثبت‌نام */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {authModal === 'login' ? t.loginModalTitle : t.regModalTitle}
              </h3>
              <button
                onClick={() => setAuthModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {authModal === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1.5">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    placeholder="trade@company.ir"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5">{t.passwordLabel}</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition"
                >
                  {t.submitLogin}
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModal('register')}
                    className="text-emerald-400 hover:underline text-xs"
                  >
                    حساب تجاری ندارید؟ ثبت‌نام شرکت (KYB)
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">{t.companyNameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="نام رسمی ثبت‌شده در روزنامه رسمی / ЕГРЮЛ"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">{t.countryLabel}</label>
                    <select
                      value={regCountry}
                      onChange={(e) => setRegCountry(e.target.value as 'IR' | 'RU')}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="IR">ایران (IR)</option>
                      <option value="RU">روسیه (RU)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">{t.taxIdLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={regCountry === 'IR' ? 'شناسه ۱۰ رقمی' : 'ИНН 10/12 знаков'}
                      value={regTaxId}
                      onChange={(e) => setRegTaxId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    placeholder="corporate@domain.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    placeholder="+98 / +7 ..."
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{t.passwordLabel}</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition"
                >
                  {t.submitRegister}
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModal('login')}
                    className="text-emerald-400 hover:underline text-xs"
                  >
                    قبلاً ثبت‌نام کرده‌اید؟ ورود
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* فوتر */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        REC Platform &copy; 2026 — Russia-Iran Cross-Border Settlement & Trade Gateway
      </footer>
    </div>
  );
}
