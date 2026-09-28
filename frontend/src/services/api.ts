export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://rec-production.up.railway.app';

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  origin: string;
  hsCode: string;
  specs?: string;
  standard?: string;
  description: string;
  priceIndication?: string; // <-- اضافه شد
}

export interface NewsItem {
  id: string;
  date: string;
  category: string;
  title: string;
  summary: string;
}

export interface CreateRfqPayload {
  companyName: string;
  productId?: string;
  productName?: string;
  volumeMT?: number;
  destinationPort?: string;
  sourceLang?: string;
  // فیلدهای قبلی/اختیاری جهت سازگاری با سایر بخش‌ها
  productTitle?: string;
  quantity?: string;
  targetPrice?: string;
  deliveryTerms?: string;
  destination?: string;
  preferredLanguage?: string;
  notes?: string;
  [key: string]: unknown; // برای جلوگیری از خطای strict object literal
}

export interface RfqResponse {
  id: string;
  status: string;
  createdAt: string;
  message?: string;
}

// دریافت محصولات کاتالوگ بر اساس زبان انتخابی
export async function fetchCatalog(lang: string = 'fa'): Promise<CatalogProduct[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/catalog?lang=${lang}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.warn(`Catalog API returned status: ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return [];
  }
}

// دریافت اخبار تجاری و مقررات بر اساس زبان
export async function fetchNews(lang: string = 'fa'): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/news?lang=${lang}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.warn(`News API returned status: ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// ثبت RFQ
export async function submitRfq(payload: CreateRfqPayload): Promise<RfqResponse> {
  const res = await fetch(`${API_BASE_URL}/api/rfq`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit RFQ');
  }

  return res.json();
}
