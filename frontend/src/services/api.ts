export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// --- انواع داده RFQ ---
export interface CreateRfqPayload {
  companyName: string;
  productId: string;
  productName: string;
  volumeMT: number;
  destinationPort: string;
  sourceLang: 'fa' | 'ru' | 'en';
}

export interface RfqResponse {
  id: string;
  companyName: string;
  productName: string;
  volumeMT: number;
  destinationPort: string;
  status: string;
  createdAt: string;
  translations?: Record<string, string>;
}

// --- انواع داده کاتالوگ و اخبار ---
export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  origin: string;
  hsCode: string;
  specs: string;
  standard: string;
  priceIndication?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  date: string;
  category: string;
}

// --- دریافت کاتالوگ محصولات ---
export async function fetchCatalog(lang: string = 'fa'): Promise<CatalogProduct[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/catalog?lang=${encodeURIComponent(lang)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch catalog: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Backend catalog API unreachable, falling back to static data:', error);
    return null;
  }
}

// --- ثبت درخواست استعلام قیمت (RFQ) ---
export async function submitRfq(data: CreateRfqPayload): Promise<RfqResponse> {
  const res = await fetch(`${API_BASE_URL}/rfq`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`RFQ submission failed with status: ${res.status}`);
  }

  return await res.json();
}

// --- دریافت اخبار و تحلیل‌ها ---
export async function fetchNews(lang: string = 'fa'): Promise<NewsItem[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/news?lang=${encodeURIComponent(lang)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch news: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Backend news API unreachable, falling back to static data:', error);
    return null;
  }
}
