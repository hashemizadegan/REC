'use client';

import React, { useState, useEffect } from 'react';

type Language = 'fa' | 'ru' | 'en';
type AuthMode = 'login' | 'register' | null;

interface UserSession {
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
  const [user, setUser] = useState<UserSession | null>(null);

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

    // لاگین مدیر سیستم
    if (loginEmail === 'admin@rec-trade.com' && loginPassword === 'Admin@2026!Rec') {
      const adminSession: UserSession = {
        id: 'admin-1',
        companyName: 'مدیریت سامانه بازرگانی REC',
        email: 'admin@rec-trade.com',
        country: 'IR',
        taxId: '10100000000',
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
    const session: UserSession = {
      id: `comp-${Date.now()}`,
      companyName: loginEmail.includes('ru') ? 'ООО Трейд Экспресс' : 'شرکت بازرگانی توسعه پارس',
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

    // افزودن به لیست شرکت‌ها برای بررسی توسط ادمین
    setPendingCompanies((prev) => [newCompany, ...prev]);

    // ثبت در لاگ زنده سیستم
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('fa-IR'),
        action: 'REGISTER',
        actorEmail: regEmail,
        details: `شرکت جدید "${regName}" (${regCountry === 'IR' ? 'ایران' : 'روسیه'}) فرم KYB را ثبت کرد.`,
      },
      ...prev,
    ]);

    const session: UserSession = {
      id: newCompany.id,
      companyName: regName,
      email: regEmail,
      country: regCountry,
      taxId: regTaxId,
      kybStatus: 'PENDING',
      isGoldenList: false,
      role: 'COMPANY',
    };

    setUser(session);
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
    if (!user) return;

    const rfqId = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setRfqSuccess(rfqId);

    setAuditLogs((prev) => [
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

  // تأیید یا رد مدرک توسط مدیر
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
        details: `وضعیت شرکت با شناسه ${companyId} توسط مدیر به "${newStatus === 'VERIFIED' ? 'تأیید شده' : 'رد شده'}" تغییر یافت.`,
      },
      ...prev,
    ]);
  };

  const isRtl = lang === 'fa';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
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
                    <label className="block text-slate-300 mb-1.5 font-medium">اینکوترمز</label>
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
                  <label className="block text-slate-300 mb-1.5 font-medium">قیمت پیشنهادی (USD/MT)</label>
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
                  ثبت رسمی استعلام RFQ
                </button>
              </form>
            )}
          </div>
        )}

        {/* پنل نظارت و ادمین (Admin View) */}
        {activeTab === 'admin' && user?.role === 'ADMIN' && (
          <div className="space-y-8">
            {/* جدول بررسی و احراز هویت شرکت‌ها (KYB Verification Queue) */}
            <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                <span>📋 کارتابل تأیید هویت شرکت‌ها (KYB Review)</span>
                <span className="text-xs font-normal text-slate-400">تعداد شرکت‌ها: {pendingCompanies.length}</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">نام شرکت</th>
                      <th className="p-3">کشور</th>
                      <th className="p-3">شناسه ملی / ИНН</th>
                      <th className="p-3">ایمیل و تلفن</th>
                      <th className="p-3">وضعیت فعلی</th>
                      <th className="p-3 text-center">عملیات ادمین</th>
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
                            {c.country === 'IR' ? 'ایران (IR)' : 'روسیه (RU)'}
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
                              ? 'تأیید شده'
                              : c.kybStatus === 'REJECTED'
                              ? 'رد شده'
                              : 'در انتظار مدارک'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateKyb(c.id, 'VERIFIED')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs transition"
                            >
                              تأیید هویت
                            </button>
                            <button
                              onClick={() => handleUpdateKyb(c.id, 'REJECTED')}
                              className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 px-2.5 py-1 rounded text-xs transition"
                            >
                              رد
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* لاگ زنده تمام اتفاقات سایت (Audit Log) */}
            <div className="border border-slate-800 bg-slate-950/60 p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-4">
                📜 گزارش زنده رویدادهای سیستم (Audit & Activity Logs)
              </h2>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-emerald-400 font-semibold">{log.action}</span>
                        <span className="text-slate-500 text-[11px]">{log.actorEmail}</span>
                      </div>
                      <p className="text-slate-200">{log.details}</p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* مدال ورود و ثبت‌نام */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {authModal === 'login' ? 'ورود به حساب کاربری / پنل ادمین' : 'ثبت‌نام شرکت و ارسال مدارک (KYB)'}
              </h3>
              <button onClick={() => setAuthModal(null)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            {authModal === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1.5">ایمیل رسمی</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@rec-trade.com یا ایمیل شرکتی"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5">رمز عبور</label>
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
                  ورود
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModal('register')}
                    className="text-emerald-400 hover:underline text-xs"
                  >
                    ثبت‌نام شرکت جدید (KYB)
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">نام رسمی شرکت</label>
                  <input
                    type="text"
                    required
                    placeholder="نام ثبتی در روزنامه رسمی یا ЕГРЮЛ"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">کشور</label>
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
                    <label className="block text-slate-300 mb-1">شناسه ملی / ИНН</label>
                    <input
                      type="text"
                      required
                      value={regTaxId}
                      onChange={(e) => setRegTaxId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">ایمیل شرکتی</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">تلفن تماس</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">رمز عبور</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition"
                >
                  ارسال مدارک برای بررسی KYB
                </button>
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
