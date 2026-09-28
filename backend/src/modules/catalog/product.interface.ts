export interface LocalizedString {
  en: string;
  ru: string;
  fa: string;
}

export interface Product {
  id: string;
  hsCode: string;
  category: string;
  origin: string;
  specs?: string;
  standard?: string;
  targetMarkets?: string[];
  name: LocalizedString;
  description: LocalizedString;
}

export interface CatalogItemResponse {
  id: string;
  name: string;
  category: string;
  origin: string;
  hsCode: string;
  specs?: string;
  standard?: string;
  description: string;
}
