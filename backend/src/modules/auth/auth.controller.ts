import { Controller, Get, Post, Patch, Body, Param, Headers, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCompanyDto, LoginDto, KybStatus } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterCompanyDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('توکن احراز هویت ارسال نشده است.');
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.authService.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است.');
    }
    return this.authService.getCompanyById(decoded.id);
  }

  @Get('companies')
  async getAllCompanies(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('دسترسی مجاز نیست.');
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.authService.verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      throw new ForbiddenException('فقط مدیر سامانه اجازه مشاهده لیست کلیه شرکت‌ها را دارد.');
    }
    return this.authService.getAllCompanies();
  }

  @Get('audit-logs')
  async getAuditLogs(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('دسترسی مجاز نیست.');
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.authService.verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      throw new ForbiddenException('تنها مدیر سامانه می‌تواند لاگ وقایع را ببیند.');
    }
    return this.authService.getAuditLogs();
  }

  @Patch('companies/:id/kyb')
  async updateKyb(
    @Param('id') id: string,
    @Body('status') status: KybStatus,
    @Body('isGoldenListMember') isGoldenListMember: boolean,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('دسترسی غیرمجاز.');
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.authService.verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      throw new ForbiddenException('فقط مدیر سامانه (Admin) اجازه تغییر وضعیت KYB را دارد.');
    }
    return this.authService.updateKybStatus(id, status, isGoldenListMember, decoded.email);
  }
}
