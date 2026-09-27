'use client';

import React, { useState, useEffect } from 'react';

type Language = 'fa' | 'ru' | 'en';
type AuthMode = 'login' | 'register' | null;

interface CompanyUser {
  id: string;
  companyName: string;
  email: string;
  country: 'IR' | 'RU';
  taxId: string;
  kybStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  isGoldenList: boolean;
  role: 'COMPANY' | 'ADMIN';
  token?: string;
}

interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  actorEmail: string;
  details: string;
}

export default function HomePage() {
  const [lang, setLang] = useState<Language>('fa');
  const [activeTab, setActiveTab] = useState<'catalog' | 'rfq' | 'admin'>('catalog');
  const [authModal, setAuthModal] = useState<AuthMode>(null);

  // وضعیت کاربر لاگین‌شده
  const [user, setUser] = useState<CompanyUser | null>(null);

  // فرم لاگین
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // فرم ثبت‌نام شرکت (KYB)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCountry, setRegCountry] = useState<'IR' | 'RU'>('IR');
  const [regTaxId, setRegTaxId] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // فرم استعلام RFQ
  const [selectedProduct, setSelectedProduct] = useState('pistachio-akbari');
  const [volumeMt, setVolumeMt] = useState(25);
  const [incoterms, setIncoterms] = useState('FCA');
  const [targetPrice, setTargetPrice] = useState('9200');
  const [rfqSuccess, setRfqSuccess] = useState<string | null>(null);

  // داده‌های پنل ادمین
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([
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

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString('fa-IR'),
      action: 'LOGIN',
      actorEmail: 'admin@rec-trade.com',
      details: 'مدیر سامانه وارد پنل نظارتی گردید.',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString('fa-IR'),
      action: 'REGISTER',
      actorEmail: 'export@volgatrade.ru',
      details: 'شرکت روسی ООО Волга Трейд مدارک خود را برای KYB ارسال کرد.',
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('rec_user_session');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rec_user_session');
    setActiveTab('catalog');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    // ورود به عنوان ادمین سامانه
    if (loginEmail === 'admin@rec-trade.com' && loginPassword === 'Admin@2026!Rec') {
      const adminSession: CompanyUser = {
        id: 'admin-1',
        companyName: 'مدیریت سامانه REC',
        email: 'admin@rec-trade.com',
        country: 'IR',
        taxId: '0000000000',
        kybStatus: 'VERIFIED',
        isGoldenList: true,
        role: 'ADMIN',
      };
      setUser(adminSession);
      localStorage.setItem('rec_user_session', JSON.stringify(adminSession));
      setActiveTab('admin');
      setAuthModal(null);
      setLoginPassword('');
      return;
    }

    // ورود شرکت‌های عادی
    const session: CompanyUser = {
      id: `comp-${Date.now()}`,
      companyName: loginEmail.includes('ru') ? 'ООО Трейд Экспресс' : 'بازرگانی پارس آریا',
      email: loginEmail,
      country: loginEmail.includes('ru') ? 'RU' : 'IR',
      taxId: loginEmail.includes('ru') ? '7701234567' : '10103456789',
      kybStatus: 'VERIFIED',
      isGoldenList: true,
      role: 'COMPANY',
    };

    setUser(session);
    localStorage.setItem('rec_user_session', JSON.stringify(session));
    setAuthModal(null);
    setLoginPassword('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regVERIFIED',
        isGoldenList: true,
        role: 'ADMIN',
      };
      setUser(adminSession);
      localStorage.setItem('rec_user_session', JSON.stringify(adminSession));
      setActiveTab('admin');
      setAuthModal(null);
      setLoginPassword('');
      return;
    }

    // ورود شرکت‌های عادی
    const session: CompanyUser = {
      id: `comp-${Date.now()}`,
      companyName: loginEmail.includes('ru') ? 'ООО Трейд Экспресс' : 'بازرگانی پارس آریا',
      email: loginEmail,
      country: loginEmail.includes('ru') ? 'RU' : 'IR',
      taxId: loginEmail.includes('ru') ? '7701234567' : '10103456789',
      kybStatus: 'VERIFIED',
      isGoldenList: true,
      role: 'COMPANY',
    };

    setUser(session);
    localStorage.setItem('rec_user_session', JSON.stringify(session));
    setAuthModal(null);
    setLoginPassword('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regTaxId || !regPassword) return;

    const newCompany: any = {
      id: `comp-${Date.now()}`,
      name: regName,
      country: regCountry,
      taxId: regTaxId,
      email: regEmail,
      phone: regPhone,
      kybStatus: 'PENDING',
      isGoldenList: false,
    };

    // اضافه کردن به لیست در انتظار بررسی ادمین
    setPendingCompanies((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('fa-IR'),
        action: 'RFQ_CREATED',
        actorEmail: user.email,
        details: `ثبت استعلام جدید ${rfqId} برای ${selectedProduct} به حجم ${volumeMt} تن توسط ${user.companyName}`,
      },
      ...prev,
    ]);
  };

  // عملیات ادمین برای تغییر وضعیت KYB
  const handleUpdateKyb = (companyId: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    setPendingCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, kybStatus: newStatus } : c))
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('fa-IR'),
        action: 'KYB_UPDATE',
        actorEmail: user?.email || 'admin@rec-trade.com',
        details: `وضعیت شرکت با شناسه ${companyId} توسط مدیر سامانه به "${newStatus === 'VERIFIED' ? 'تأیید شده' : 'رد شده'}" تغییر یافت.`,
      },
      ...prev,
    ]);
  };

  const isRtl = lang === 'fa';

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
              <h1 className="text-lg font-bold tracking-tight text-white">سامانه بازرگانی ایران و روسیه (REC)</h1>
              <p className="text-xs text-slate-400">مرکز تسویه ارزی و ثبت سفارشات کالایی B2B</p>
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

            {/* بخش ورود / پروفایل شرکت یا ادمین */}
            {user ? (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {user.companyName}
                    {user.role === 'ADMIN' && (
                      <span className="bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded border border-rose-500/30">
                        مدیر سیستم
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        user.kybStatus === 'VERIFIED' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-[11px] text-slate-300">
                      {user.kybStatus === 'VERIFIED' ? 'احراز هویت شده (KYB تایید)' : 'در انتظار بررسی مدارک'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-rose-400 hover:text-rose-300 text-xs border border-rose-900/50 hover:bg-rose-950 px-2 py-1 rounded transition"
                >
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal('login')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium px-3.5 py-2 rounded-lg transition"
                >
                  ورود
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-2 rounded-lg transition"
                >
                  ثبت‌نام شرکت (KYB)
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
            کاتالوگ کالاهای صادراتی
          </button>
          <button
            onClick={() => setActiveTab('rfq')}
            className={`pb-3 font-semibold transition border-b-2 ${
              activeTab === 'rfq'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ثبت استعلام رسمی (RFQ)
          </button>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-3 font-semibold transition border-b-2 ${
                activeTab === 'admin'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              🛡️ پنل مدیریت و لاگ وقایع (Admin)
            </button>
          )}
        </div>

        {/* نمای کاتالوگ */}
        {activeTab === 'catalog' && (
          <div>
            {!user && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex flex-wrap items-center justify-between gap-3">
                <span>برای مشاهده قیمت قطعی و ارسال درخواست رسمی RFQ باید وارد حساب کاربری خود شوید.</span>
                <button
                  onClick={() => setAuthModal('login')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition"
                >
                  ورود جهت مشاهده و سفارش
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-2.5 py-1 rounded">HS: 080251</span>
                    <span className="text-xs text-slate-400">ایران (رفسنجان)</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">پسته اکبری اعلا (Super Long)</h3>
                  <p className="text-xs text-slate-300">مطابق GOST روسیه و EAEU - سورتینگ تمام‌لیزری</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">حداقل حجم: ۲۰ تن متری</span>
                  <button
                    onClick={() => {
                      setSelectedProduct('pistachio-akbari');
                      setActiveTab('rfq');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition"
                  >
                    درخواست پیش‌فاکتور (RFQ)
                  </button>
                </div>
              </div>

              <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono bg-slate-800 text-emerald-400 px-2.5 py-1 rounded">HS: 080410</span>
                    <span className="text-xs text-slate-400">ایران (بم)</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">خرمای مضافتی درجه یک</h3>
                  <p className="text-xs text-slate-300">دارای گواهی استاندارد بهداشت فیتوسانیتری و قرنطینه</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">حداقل حجم: ۲۰ تن متری</span>
                  <button
                    onClick={() => {
                      setSelectedProduct('dates-mazafati');
                      setActiveTab('rfq');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition"
                  >
                    درخواست پیش‌فاکتور (RFQ)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* نمای RFQ */}
        {activeTab === 'rfq' && (
          <div className="max-w-2xl mx-auto border border-slate-800 bg-slate-950/60 p-8 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2">فرم درخواست استعلام قیمت و قرارداد (RFQ)</h2>
            <p className="text-xs text-slate-400 mb-6">
              سفارشات مستقیماً در کارتابل مدیریت و کلیرینگ ارزی ثبت می‌شوند.
            </p>

            {rfqSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm">
                درخواست شما با موفقیت ثبت گردید. شماره استعلام: <strong className="font-mono text-white">{rfqSuccess}</strong>
              </div>
            )}

            {!user ? (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                <p className="text-sm text-slate-300 mb-4">برای ارسال استعلام رسمی باید وارد سامانه شوید.</p>
                <button
                  onClick={() => setAuthModal('login')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
                >
                  ورود به حساب
                </button>
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
                    <label className="block text-slate-300 mb-1.5 font-medium">حجم سفارش (تن)</label>
                    <input
                      type="number"
                      value={volumeMt}
                      onChange={(e) => setVolumeMt(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label
