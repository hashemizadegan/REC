import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCompanyDto, KybStatus } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('companies')
  getAllCompanies() {
    return this.authService.findAll();
  }

  @Get('companies/:id')
  getCompany(@Param('id') id: string) {
    return this.authService.findById(id);
  }

  @Post('register')
  register(@Body() dto: RegisterCompanyDto) {
    return this.authService.register(dto);
  }

  @Patch('companies/:id/kyb')
  updateKyb(
    @Param('id') id: string,
    @Body('status') status: KybStatus,
    @Body('isGoldenListMember') isGoldenListMember?: boolean,
  ) {
    return this.authService.updateKybStatus(id, status, isGoldenListMember);
  }
}
