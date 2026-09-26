import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyProfile, RegisterCompanyDto, KybStatus } from './auth.interface';

@Injectable()
export class AuthService {
  private companies: CompanyProfile[] = [
    {
      id: 'comp-rus-01',
      name: {
        fa: 'شرکت بازرگانی آستراخان اوراسیا',
        ru: 'ООО Астрахань Евразия Трейд',
        en: 'Astrakhan Eurasia Trade LLC',
      },
      country: 'RU',
      nationalIdOrInn: '7701234567',
      ogrnOrRegistrationNumber: '1027700123456',
      kpp: '770101001',
      contactEmail: 'trade@astrakhan-eurasia.ru',
      phone: '+7 8512 000000',
      kybStatus: 'VERIFIED',
      isGoldenListMember: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'comp-ir-01',
      name: {
        fa: 'بازرگانی خرما و پسته زرین کویر',
        ru: 'ООО Заррин Кавир Экспорт',
        en: 'Zarrin Kavir Export Trading Co.',
      },
      country: 'IR',
      nationalIdOrInn: '14001234567',
      ogrnOrRegistrationNumber: '54321',
      contactEmail: 'export@zarrinkavir.ir',
      phone: '+98 21 88888888',
      kybStatus: 'VERIFIED',
      isGoldenListMember: true,
      createdAt: new Date().toISOString(),
    },
  ];

  register(dto: RegisterCompanyDto): CompanyProfile {
    const newCompany: CompanyProfile = {
      id: `comp-${Date.now()}`,
      ...dto,
      kybStatus: 'PENDING',
      isGoldenListMember: false,
      createdAt: new Date().toISOString(),
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  findAll(): CompanyProfile[] {
    return this.companies;
  }

  findById(id: string): CompanyProfile {
    const found = this.companies.find((c) => c.id === id);
    if (!found) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return found;
  }

  updateKybStatus(id: string, status: KybStatus, isGoldenListMember?: boolean): CompanyProfile {
    const company = this.findById(id);
    company.kybStatus = status;
    if (typeof isGoldenListMember === 'boolean') {
      company.isGoldenListMember = isGoldenListMember;
    }
    return company;
  }
}
