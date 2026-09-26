import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { CreateRfqDto, RfqStatus } from './rfq.interface';

@Controller('rfq')
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  @Get()
  getAllRfqs() {
    return this.rfqService.findAll();
  }

  @Get(':id')
  getRfqById(@Param('id') id: string) {
    return this.rfqService.findById(id);
  }

  @Post()
  createRfq(@Body() dto: CreateRfqDto) {
    return this.rfqService.create(dto);
  }

  @Patch(':id/status')
  updateRfqStatus(
    @Param('id') id: string,
    @Body('status') status: RfqStatus,
  ) {
    return this.rfqService.updateStatus(id, status);
  }
}
