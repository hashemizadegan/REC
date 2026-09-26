export type SupportedLanguage = 'fa' | 'ru' | 'en';

export interface TranslationRequestDto {
  text: string;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  context?: 'agri_spec' | 'legal_contract' | 'rfq_negotiation' | 'general';
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  glossaryApplied: boolean;
  timestamp: string;
}
