export type CountryCode = 'IR' | 'RU';
export type KybStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface CompanyProfile {
  id: string;
  name: {
    fa: string;
    ru: string;
    en: string;
  };
  country: CountryCode;
  nationalIdOrInn: string; // شناسه ملی برای ایران / INN برای روسیه
  ogrnOrRegistrationNumber?: string; // OGRN برای روسیه / شماره ثبت برای ایران
  kpp?: string; // فقط روسیه
  contactEmail: string;
  phone: string;
  kybStatus: KybStatus;
  isGoldenListMember: boolean;
  createdAt: string;
}

export interface RegisterCompanyDto {
  name: {
    fa: string;
    ru: string;
    en: string;
  };
  country: CountryCode;
  nationalIdOrInn: string;
  ogrnOrRegistrationNumber?: string;
  kpp?: string;
  contactEmail: string;
  phone: string;
}
