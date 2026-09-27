export type KybStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type UserRole = 'COMPANY' | 'ADMIN';

export interface CompanyProfile {
  id: string;
  name: {
    ru: string;
    fa: string;
    en: string;
  };
  country: 'RU' | 'IR';
  nationalIdOrInn: string;
  registrationNumberOrOgrn?: string;
  kpp?: string;
  contactEmail: string;
  passwordHash: string;
  salt: string;
  phone?: string;
  kybStatus: KybStatus;
  isGoldenListMember: boolean;
  role: UserRole;
  createdAt: string;
}

export interface RegisterCompanyDto {
  name: {
    ru: string;
    fa: string;
    en: string;
  };
  country: 'RU' | 'IR';
  nationalIdOrInn: string;
  registrationNumberOrOgrn?: string;
  kpp?: string;
  contactEmail: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  company: {
    id: string;
    name: {
      ru: string;
      fa: string;
      en: string;
    };
    country: 'RU' | 'IR';
    nationalIdOrInn: string;
    contactEmail: string;
    kybStatus: KybStatus;
    isGoldenListMember: boolean;
    role: UserRole;
  };
}
