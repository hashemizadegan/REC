'use client';

import React, { useState, useEffect } from 'react';

type LangCode = 'fa' | 'ru' | 'en';
type ModalType = 'login' | 'register' | null;

interface UserAccount {
  id: string;
  companyName: string;
  email: string;
  country: 'IR' | 'RU';
  taxId: string;
  kybStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  isGoldenList: boolean;
  role: 'COMPANY' | 'ADMIN';
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorEmail: string;
  details: string;
}

const DICT = {
  fa: {
    siteTitle: 'سامانه بازرگانی ایران و روسیه (REC)',
    siteSubtitle: 'مرکز تسویه ارزی و ثبت سفارشات کالایی B2B',
    tabCatalog: 'کاتالوگ کالاهای صادراتی',
    tabRfq: 'ثبت استعلام رسمی (RFQ)',
    tabAdmin: '🛡️ پنل مدیریت و لاگ وقایع (Admin)',
    adminBadge: 'مدیر سیستم',
    kybVerified: 'احراز هویت شده (KYB تایید)',
    kybPending: 'در انتظار بررسی مدارک',
    kybRejected: 'رد شده',
    logout: 'خروج',
    login: 'ورود',
    registerKyb: 'ثبت‌نام شرکت (KYB)',
    catalogNotice: 'برای مشاهده قیمت قطعی و ارسال استعلام رسمی RFQ باید وارد حساب کاربری خود شوید.',
    loginToOrder: 'ورود جهت سفارش',
    rfqBtn: 'درخواست پیش‌فاکتور (RFQ)',
    minVolume: 'حداقل حجم: ۲۰ تن متری',
    rfqTitle: 'فرم درخواست استعلام قیمت و قرارداد (RFQ)',
    rfqSubtitle: 'سفارشات مستقیماً در کارتابل مدیریت و کلیرینگ ارزی ثبت می‌شوند.',
    rfqSuccessPrefix: 'درخواست شما با موفقیت ثبت گردید. شماره استعلام:',
    rfqLoginPrompt: 'برای ارسال استعلام رسمی باید وارد سامانه شوید.',
    loginToAccount: 'ورود به حساب',
    productLabel: 'کالای انتخابی',
    volumeLabel: 'حجم سفارش (تن)',
    incotermsLabel: 'اینکوترمز',
    targetPriceLabel: 'قیمت پیشنهادی (USD/MT)',
    submitRfq: 'ثبت رسمی استعلام RFQ',
    adminQueueTitle: '📋 کارتابل تأیید هویت شرکت‌ها (KYB Review)',
    companiesCount: 'تعداد شرکت‌ها:',
    thCompany: 'نام شرکت',
    thCountry: 'کشور',
    thTaxId: 'شناسه ملی / ИНН',
    thContact: 'ایمیل و تلفن',
    thStatus: 'وضعیت فعلی',
    thAction: 'عملیات ادمین',
    verifyAction: 'تأیید هویت',
    rejectAction: 'رد مدارک',
    adminLogsTitle: '📜 گزارش زنده رویدادهای سیستم (Audit & Activity Logs)',
    modalLoginTitle: 'ورود به حساب کاربری / پنل ادمین',
    modalRegTitle: 'ثبت‌نام شرکت و ارسال مدارک (KYB)',
    emailLabel: 'ایمیل رسمی',
    passwordLabel: 'رمز عبور',
    companyNameLabel: 'نام رسمی شرکت',
    countryLabel: 'کشور',
    taxIdLabel: 'شناسه ملی / ИНН',
    phoneLabel: 'تلفن تماس',
    modalLoginBtn: 'ورود',
    modalRegBtn: 'ارسال مدارک برای بررسی KYB',
    modalSwitchToReg: 'ثبت‌نام شرکت جدید (KYB)',
    iran: 'ایران (IR)',
    russia: 'روسیه (RU)',
    p1Name: 'پسته اکبری اعلا (Super Long)',
    p1Desc: 'مطابق GOST روسیه و استانداردهای EAEU - سورتینگ تمام لیزری',
    p1Origin: 'ایران (رفسنجان)',
    p2Name: 'خرمای مضافتی ممتاز',
    p2Desc: 'دارای گواهی استاندارد بهداشت فیتوسانیتری و قرنطینه گمرکی',
    p2Origin: 'ایران (بم)',
  },
  ru: {
    siteTitle: 'Торговая платформа Россия–Иран (REC)',
    siteSubtitle: 'B2B клиринг, взаиморасчеты и экспортно-импортные поставки',
    tabCatalog: 'Каталог экспортных товаров',
    tabRfq: 'Подать официальный запрос (RFQ)',
    tabAdmin: '🛡️ Панель администратора и аудит (Admin)',
    adminBadge: 'Администратор',
    kybVerified: 'Верифицирован (KYB одобрен)',
    kybPending: 'На проверке документов',
    kybRejected: 'Отклонен',
    logout: 'Выход',
    login: 'Вход',
    registerKyb: 'Регистрация компании (KYB)',
    catalogNotice: 'Для просмотра фиксированных цен и подачи котировок RFQ необходимо войти в систему.',
    loginToOrder: 'Войти для заказа',
    rfqBtn: 'Запросить счет (RFQ)',
    minVolume: 'Мин. партия: 20 тонн',
    rfqTitle: 'Форма запроса коммерческого предложения (RFQ)',
    rfqSubtitle: 'Заказы направляются напрямую в клиринговый шлюз и торговый реестр.',
    rfqSuccessPrefix: 'Ваш запрос успешно зарегистрирован. Номер RFQ:',
    rfqLoginPrompt: 'Для подачи официального запроса необходимо авторизоваться.',
    loginToAccount: 'Войти в аккаунт',
    productLabel: 'Выбор товара',
    volumeLabel: 'Объем партии (тонн)',
    incotermsLabel: 'Условия Инкотермс',
    targetPriceLabel: 'Целевая цена (USD/MT)',
    submitRfq: 'Отправить официальный запрос RFQ',
    adminQueueTitle: '📋 Реестр верификации компаний (KYB Review)',
    companiesCount: 'Всего компаний:',
    thCompany: 'Компания',
    thCountry: 'Страна',
    thTaxId: 'ИНН / Tax ID',
    thContact: 'Контакты',
    thStatus: 'Статус',
    thAction: 'Действие',
    verifyAction: 'Подтвердить',
    rejectAction: 'Отклонить',
    adminLogsTitle: '📜 Журнал аудита операций в реальном времени (Audit Logs)',
    modalLoginTitle: 'Вход в аккаунт / Панель администратора',
    modalRegTitle: 'Регистрация компании и загрузка документов (KYB)',
    emailLabel: 'Корпоративный Email',
    passwordLabel: 'Пароль',
    companyNameLabel: 'Официальное наименование компании',
    countryLabel: 'Страна юрисдикции',
    taxIdLabel: 'ИНН / ОГРН',
    phoneLabel: 'Номер телефона',
    modalLoginBtn: 'Войти в систему',
    modalRegBtn: 'Подать заявку на KYB',
    modalSwitchToReg: 'Регистрация нового участника (KYB)',
    iran: 'Иран (IR)',
    russia: 'Россия (RU)',
    p1Name: 'Фисташки сорта Акбари (Super Long)',
    p1Desc: 'Соответствие ГОСТ и техрегламентам ЕАЭС, лазерная калибровка',
    p1Origin: 'Иран (Рафсанджан)',
    p2Name: 'Финики Мазафати высший сорт',
    p2Desc: 'Фитосанитарный сертификат, таможенная очистка без задержек',
    p2Origin: 'Иран (Бам)',
  },
  en: {
    siteTitle: 'Iran-Russia Trade Gateway (REC)',
    siteSubtitle: 'B2B Currency Clearing & Commodity Trading Platform',
    tabCatalog: 'Export Goods Catalog',
    tabRfq: 'Request for Quotation (RFQ)',
    tabAdmin: '🛡️ Admin Audit & Control Panel',
    adminBadge: 'System Admin',
    kybVerified: 'Verified (KYB Approved)',
    kybPending: 'KYB Under Review',
    kybRejected: 'Rejected',
    logout: 'Sign Out',
    login: 'Sign In',
    registerKyb: 'Company Registration (KYB)',
    catalogNotice: 'Please sign in to view locked pricing and submit official RFQs.',
    loginToOrder: 'Sign In to Trade',
    rfqBtn: 'Request Quote (RFQ)',
    minVolume: 'Min. Order: 20 MT',
    rfqTitle: 'Official RFQ Submission Form',
    rfqSubtitle: 'Orders are directly routed to the central FX clearing hub.',
    rfqSuccessPrefix: 'Your RFQ has been submitted successfully. RFQ ID:',
    rfqLoginPrompt: 'You must sign in to submit official trade requests.',
    loginToAccount: 'Sign In',
    productLabel: 'Select Product',
    volumeLabel: 'Volume (Metric Tons)',
    incotermsLabel: 'Incoterms 2020',
    targetPriceLabel: 'Target Price (USD/MT)',
    submitRfq: 'Submit Official RFQ',
    adminQueueTitle: '📋 Company Verification Queue (KYB Review)',
    companiesCount: 'Total Companies:',
    thCompany: 'Company Name',
    thCountry: 'Country',
    thTaxId: 'Tax ID / INN',
    thContact: 'Contact Info',
    thStatus: 'KYB Status',
    thAction: 'Admin Action',
    verifyAction: 'Verify Company',
    rejectAction: 'Reject',
    adminLogsTitle: '📜 Live System Audit & Security Logs',
    modalLoginTitle: 'Sign In / Admin Access',
    modalRegTitle: 'Company KYB Onboarding Form',
    emailLabel: 'Corporate Email',
    passwordLabel: 'Password',
    companyNameLabel: 'Registered Company Name',
    countryLabel: 'Jurisdiction',
    taxIdLabel: 'Tax ID / INN / Registration No.',
    phoneLabel: 'Phone Number',
    modalLoginBtn: 'Sign In',
    modalRegBtn: 'Submit KYB Documents',
    modalSwitchToReg: 'Register New Company (KYB)',
    iran: 'Iran (IR)',
    russia: 'Russia (RU)',
    p1Name: 'Premium Akbari Pistachios (Super Long)',
    p1Desc: 'Compliant with GOST & EAEU technical regulations, laser sorted',
    p1Origin: 'Iran (Rafsanjan)',
    p2Name: 'Grade-A Mazafati Fresh Dates',
    p2Desc: 'Phytosanitary certified, optimized cold chain shipping',
    p2Origin: 'Iran (Bam)',
  },
};

export default function RECMainPage() {
  const [lang, setLang] = useState<LangCode>('fa');
  const t = DICT[lang];
  const isRtl = lang === 'fa';

  const [activeTab, setActiveTab] = useState<'catalog' | 'rfq' | 'admin'>('catalog');
  const [authModal, setAuthModal] = useState<ModalType>(null);

  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCountry, setRegCountry] = useState<'IR' | 'RU'>('IR');
  const [regTaxId, setRegTaxId] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [selectedProduct, setSelectedProduct] = useState('pistachio-akbari');
  const [volumeMt, setVolumeMt] = useState(25);
  const [incoterms, setIncoterms] = useState('FCA');
  const [targetPrice, setTargetPrice] = useState('9200');
  const [rfqSuccess, setRfqSuccess] = useState<string | null>(null);

  const [pendingCompanies, setPendingCompanies] = useState<Array<{
    id: string;
    name: string;
    country: 'IR' | 'RU';
    taxId: string;
    email: string;
    phone: string;
    kybStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
    isGoldenList: boolean;
  }>>([
    {
      id: 'comp-102',
      name: 'بازرگانی پارس آریا',
      country: 'IR',
      taxId: '10103456789',
      email: 'info@parsaria.ir',
      phone: '+98 21 88990011',
      kybStatus: 'PENDING',
      isGoldenList: false,
    },
    {
      id: 'comp-103',
      name: 'ООО Волга Трейд',
      country: 'RU',
      taxId: '7722334455',
      email: 'export@volgatrade.ru',
      phone: '+7 844 233-11-22',
      kybStatus: 'PENDING',
      isGoldenList: false,
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      action: 'LOGIN',
      actorEmail: 'admin@rec-trade.com',
      details: 'Administrator logged in to oversight dashboard.',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      action: 'REGISTER',
      actorEmail: 'export@volgatrade.ru',
      details: 'ООО Волга Трейд uploaded KYB documentation.',
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('rec_user_session');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setActiveUser(u);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    setActiveUser(null);
    localStorage.removeItem('rec_user_session');
    setActiveTab('catalog');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    if (loginEmail === 'admin@rec-trade.com' && loginPassword === 'Admin@2026!Rec') {
      const adminSession: UserAccount = {
        id: 'admin-1',
        companyName: 'REC Platform Central Authority',
        email: 'admin@rec-trade.com',
        country: 'IR',
        taxId: '10100000000',
        kybStatus: 'VERIFIED',
        isGoldenList: true,
        role: 'ADMIN',
      };
      setActiveUser(adminSession);
      localStorage.setItem('rec_user_session', JSON.stringify(adminSession));
      setActiveTab('admin');
      setAuthModal(null);
      setLoginPassword('');
      return;
    }

    const session: UserAccount = {
      id: `comp-${Date.now()}`,
      companyName: loginEmail.includes('ru') ? 'ООО Трейд Экспресс' : 'شرکت بازرگانی توسعه پارس',
      email: loginEmail,
      country: loginEmail.includes('ru') ? 'RU' : 'IR',
      taxId: loginEmail.includes('ru') ? '7701234567' : '10103456789',
      kybStatus: 'VERIFIED',
      isGoldenList: true,
      role: 'COMPANY',
    };

    setActiveUser(session);
    localStorage.setItem('rec_user_session', JSON.stringify(session));
    setAuthModal(null);
    setLoginPassword('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regTaxId || !regPassword) return;

    const newCompany = {
      id: `comp-${Date.now()}`,
      name: regName,
      country: regCountry,
      taxId: regTaxId,
      email: regEmail,
      phone: regPhone,
      kybStatus: 'PENDING' as const,
      isGoldenList: false,
    };

    setPendingCompanies((prev) => [newCompany, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: 'REGISTER',
        actorEmail: regEmail,
        details: `New company "${regName}" (${regCountry}) submitted KYB profile.`,
      },
      ...prev,
    ]);

    const session: UserAccount = {
      id: newCompany.id,
      companyName: regName,
      email: regEmail,
      country: regCountry,
      taxId: regTaxId,
      kybStatus: 'PENDING',
      isGoldenList: false,
      role: 'COMPANY',
    };

    setActiveUser(session);
    localStorage.setItem('rec_user_session', JSON.stringify(session));
    setAuthModal(null);
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegTaxId('');
    setRegPhone('');
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    const rfqId = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setRfqSuccess(rfqId);

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: 'RFQ_CREATED',
        actorEmail: activeUser.email,
        details: `RFQ ${rfqId} submitted for ${selectedProduct} (${volumeMt} MT) by ${activeUser.companyName}`,
      },
      ...prev,
    ]);
  };

  const handleUpdateKyb = (companyId: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    setPendingCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, kybStatus: newStatus } : c))
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: 'KYB_UPDATE',
        actorEmail: activeUser?.email || 'admin@rec-trade.com',
        details: `Company ID ${companyId} status changed to ${newStatus}.`,
      },
      ...prev,
    ]);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* هدر */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-emerald-600 flex items-center justify-center font-bold text-lg text-white">
              REC
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">{t.siteTitle}</h1>
              <p className="text-xs text-slate-400">{t.siteSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* انتخاب زبان */}
            <div className="flex rounded-md bg-slate-800 p-1 border border-slate-700 text-xs">
              {(['fa', 'ru', 'en'] as LangCode[]).map((l) => (
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

            {/* پروفایل / ورود */}
            {activeUser ? (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {activeUser.companyName}
                    {activeUser.role === 'ADMIN' && (
                      <span className="bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded border border-rose-500/30">
                        {t.adminBadge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        activeUser.kybStatus === 'VERIFIED' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-[11px] text-slate-300">
                      {activeUser.kybStatus === 'VERIFIED'
                        ? t.kybVerified
                        : activeUser.kybStatus === 'REJECTED'
                        ? t.kybRejected
                        : t.kybPending}
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
                  {t.registerKyb}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* محتوا */}
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
          {activeUser?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-3 font-semibold transition border-b-2 ${
                activeTab === 'admin'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabAdmin}
            </button>
          )}
        </div>

        {/* کاتالوگ */}
        {activeTab === 'catalog' && (
          <div>
            {!activeUser && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex flex-wrap items-center justify-between gap-3">
                <span>{t.catalogNotice}</span>
                <button
                  onClick={() => setAuthModal('login')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition"
                >
                  {t.loginToOrder}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-2.5 py-1 rounded">HS: 080251</span>
                    <span className="text-xs text-slate-400">{t.p1Origin}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.p1Name}</h3>
                  <p className="text-xs text-slate-300">{t.p1Desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{t.minVolume}</span>
                  <button
                    onClick={() => {
                      setSelectedProduct('pistachio-akbari');
                      setActiveTab('rfq');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition"
                  >
                    {t.rfqBtn}
                  </button>
                </div>
              </div>

              <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-2.5 py-1 rounded">HS: 080410</span>
                    <span className="text-xs text-slate-400">{t.p2Origin}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.p2Name}</h3>
                  <p className="text-xs text-slate-300">{t.p2Desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{t.minVolume}</span>
                  <button
                    onClick={() => {
                      setSelectedProduct('dates-mazafati');
                      setActiveTab('rfq');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition"
                  >
                    {t.rfqBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* فرم استعلام RFQ */}
        {activeTab === 'rfq' && (
          <div className="max-w-2xl mx-auto border border-slate-800 bg-slate-950/60 p-8 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2">{t.rfqTitle}</h2>
            <p className="text-xs text-slate-400 mb-6">{t.rfqSubtitle}</p>

            {rfqSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm">
                {t.rfqSuccessPrefix} <strong className="font-mono text-white">{rfqSuccess}</strong>
              </div>
            )}

            {!activeUser ? (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                <p className="text-sm text-slate-300 mb-4">{t.rfqLoginPrompt}</p>
                <button
                  onClick={() => setAuthModal('login')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
                >
                  {t.loginToAccount}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-medium">{t.productLabel}</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pistachio-akbari">{t.p1Name} (HS 080251)</option>
                    <option value="dates-mazafati">{t.p2Name} (HS 080410)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1.5 font-medium">{t.volumeLabel}</label>
                    <input
                      type="number"
                      value={volumeMt}
                      onChange={(e) => setVolumeMt(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1.5 font-medium">{t.incotermsLabel}</label>
                    <select
                      value={incoterms}
                      onChange={(e) => setIncoterms(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="FCA">FCA (Anzali / Astara)</option>
                      <option value="CPT">CPT (Astrakhan / Moscow)</option>
                      <option value="FOB">FOB (Amirabad Port)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5 font-medium">{t.targetPriceLabel}</label>
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
                  {t.submitRfq}
                </button>
              </form>
            )}
          </div>
        )}

        {/* پنل مدیریت ادمین */}
        {activeTab === 'admin' && activeUser?.role === 'ADMIN' && (
          <div className="space-y-8">
            <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                <span>{t.adminQueueTitle}</span>
                <span className="text-xs font-normal text-slate-400">
                  {t.companiesCount} {pendingCompanies.length}
                </span>
              </h2>

              <div className="overflow-x-auto">
                <table className={`w-full text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">{t.thCompany}</th>
                      <th className="p-3">{t.thCountry}</th>
                      <th className="p-3">{t.thTaxId}</th>
                      <th className="p-3">{t.thContact}</th>
                      <th className="p-3">{t.thStatus}</th>
                      <th className="p-3 text-center">{t.thAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {pendingCompanies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-semibold text-white">{c.name}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              c.country === 'IR' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {c.country === 'IR' ? t.iran : t.russia}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{c.taxId}</td>
                        <td className="p-3 text-slate-400">
                          <div>{c.email}</div>
                          <div className="text-[10px] text-slate-500">{c.phone}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              c.kybStatus === 'VERIFIED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : c.kybStatus === 'REJECTED'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {c.kybStatus === 'VERIFIED'
                              ? t.kybVerified
                              : c.kybStatus === 'REJECT
