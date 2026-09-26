import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'REC Platform | پلتفرم تجاری ایران و روسیه | Российско-Иранская Платформа',
  description: 'B2B Trade Platform connecting Iranian Exporters and Russian Buyers (Dates & Pistachios)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
