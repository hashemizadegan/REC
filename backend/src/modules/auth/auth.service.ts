import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { CompanyProfile, RegisterCompanyDto, LoginDto, KybStatus, AuthResponse } from './auth.interface';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'rec-trade-secret-token-key-2026';

  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  private generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // پایگاه داده در حافظه (همراه با اکانت ادمین و شرکت‌های پیش‌فرض)
  private companies: CompanyProfile[] = [
    {
      id: 'admin-1',
      name: {
        ru: 'Администрация REC',
        fa: 'مدیریت سامانه REC',
        en: 'REC Platform Admin',
      },
      country: 'IR',
      nationalIdOrInn: '0000000000',
      contactEmail: 'admin@rec-trade.com',
      salt: 'e9b28a1c8f3e4d5a',
      passwordHash: crypto.pbkdf2Sync('AdminREC@2026', 'e9b28a1c8f3e4d5a', 10000, 64, 'sha512').toString('hex'),
      kybStatus: 'VERIFIED',
      isGoldenListMember: true,
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ru-company-1',
      name: {
        ru: 'ООО АгроЭкспорт Москва',
        fa: 'شرکت با مسئولیت محدود آگرو اکسپورت مسکو',
        en: 'AgroExport Moscow LLC',
      },
      country: 'RU',
      nationalIdOrInn: '7701234567',
      registrationNumberOrOgrn: '1027700123456',
      kpp: '770101001',
      contactEmail: 'trade@agroexport.ru',
      salt: 'c1a2b3d4e5f60718',
      passwordHash: crypto.pbkdf2Sync('Password123!', 'c1a2b3d4e5f60718', 10000, 64, 'sha512').toString('hex'),
      phone: '+7 495 123-45-67',
      kybStatus: 'VERIFIED',
      isGoldenListMember: true,
      role: 'COMPANY',
      createdAt: new Date().toISOString(),
    },
  ];

  private createToken(payload: { id: string; email: string; role: string }): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
    const signature = crypto
      .createHmac('sha256', this.JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    return `${header}.${body}.${signature}`;
  }

  public verifyToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const [header, body, signature] = parts;
      const expectedSig = crypto
        .createHmac('sha256', this.JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');
      if (signature !== expectedSig) return null;
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
      if (payload.exp && Date.now() > payload.exp) return null;
      return payload;
    } catch {
      return null;
    }
  }

  async register(dto: RegisterCompanyDto): Promise<AuthResponse> {
    const existing = this.companies.find((c) => c.contactEmail.toLowerCase() === dto.contactEmail.toLowerCase());
    if (existing) {
      throw new BadRequestException('شرکتی با این ایمیل قبلاً در سامانه ثبت شده است.');
    }

    const salt = this.generateSalt();
    const passwordHash = this.hashPassword(dto.password, salt);

    const newCompany: CompanyProfile = {
      id: `comp-${Date.now()}`,
      name: dto.name,
      country: dto.country,
      nationalIdOrInn: dto.nationalIdOrInn,
      registrationNumberOrOgrn: dto.registrationNumberOrOgrn,
      kpp: dto.kpp,
      contactEmail: dto.contactEmail,
      passwordHash,
      salt,
      phone: dto.phone,
      kybStatus: 'PENDING', // به صورت پیش‌فرض در وضعیت انتظار تایید
      isGoldenListMember: false,
      role: 'COMPANY',
      createdAt: new Date().toISOString(),
    };

    this.companies.push(newCompany);

    const token = this.createToken({
      id: newCompany.id,
      email: newCompany.contactEmail,
      role: newCompany.role,
    });

    return {
      token,
      company: {
        id: newCompany.id,
        name: newCompany.name,
        country: newCompany.country,
        nationalIdOrInn: newCompany.nationalIdOrInn,
        contactEmail: newCompany.contactEmail,
        kybStatus: newCompany.kybStatus,
        isGoldenListMember: newCompany.isGoldenListMember,
        role: newCompany.role,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const company = this.companies.find((c) => c.contactEmail.toLowerCase() === dto.email.toLowerCase());
    if (!company) {
      throw new UnauthorizedException('ایمیل یا کلمه عبور اشتباه است.');
    }

    const hash = this.hashPassword(dto.password, company.salt);
    if (hash !== company.passwordHash) {
      throw new UnauthorizedException('ایمیل یا کلمه عبور اشتباه است.');
    }

    const token = this.createToken({
      id: company.id,
      email: company.contactEmail,
      role: company.role,
    });

    return {
      token,
      company: {
        id: company.id,
        name: company.name,
        country: company.country,
        nationalIdOrInn: company.nationalIdOrInn,
        contactEmail: company.contactEmail,
        kybStatus: company.kybStatus,
        isGoldenListMember: company.isGoldenListMember,
        role: company.role,
      },
    };
  }

  async getAllCompanies(): Promise<CompanyProfile[]> {
    return this.companies.map(({ passwordHash, salt, ...c }) => c as CompanyProfile);
  }

  async getCompanyById(id: string): Promise<Omit<CompanyProfile, 'passwordHash' | 'salt'>> {
    const company = this.companies.find((c) => c.id === id);
    if (!company) {
      throw new NotFoundException('شرکت مورد نظر یافت نشد.');
    }
    const { passwordHash, salt, ...safeData } = company;
    return safeData;
  }

  async updateKybStatus(id: string, status: KybStatus, isGoldenListMember?: boolean): Promise<any> {
    const company = this.companies.find((c) => c.id === id);
    if (!company) {
      throw new NotFoundException('شرکت مورد نظر یافت نشد.');
    }

    company.kybStatus = status;
    if (typeof isGoldenListMember === 'boolean') {
      company.isGoldenListMember = isGoldenListMember;
    }

    const { passwordHash, salt, ...safeData } = company;
    return safeData;
  }
}
