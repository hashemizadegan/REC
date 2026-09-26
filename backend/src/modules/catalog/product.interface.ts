export interface LocalizedText {
  fa: string;
  ru: string;
  en: string;
}

export interface Product {
  id: string;
  hsCode: string;
  title: LocalizedText;
  description: LocalizedText;
  origin: string;
  category: string;
  targetMarkets: string[];
}
