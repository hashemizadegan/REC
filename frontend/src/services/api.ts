export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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

export async function fetchCatalog(lang: string = 'fa') {
  try {
    const res = await fetch(`${API_BASE_URL}/catalog?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Failed to fetch catalog: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.warn('Backend catalog API unreachable, falling back to static data:', error);
    return null;
  }
}

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
