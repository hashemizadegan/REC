import { Controller, Post, Body } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationRequestDto, TranslationResponse } from './translation.interface';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post('translate')
  async translate(@Body() dto: TranslationRequestDto): Promise<TranslationResponse> {
    return this.translationService.translateText(dto);
  }
}
