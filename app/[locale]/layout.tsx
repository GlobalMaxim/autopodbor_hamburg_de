import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Manrope } from 'next/font/google';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RouteProgress from '@/components/RouteProgress';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'AutoPodbor Hamburg — Подбор и проверка автомобилей в Германии',
  description:
    'Подбор и проверка автомобилей под ключ с сопровождением покупки. Кейсы, видео, личный эксперт в Гамбурге.'
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-ink font-sans text-paper antialiased">
        <NextIntlClientProvider messages={messages}>
          <RouteProgress />
          <Header locale={locale} />
          {/* шапка fixed на мобильных (<768px) — компенсируем её высоту здесь, один раз, а не на каждой странице.
              На десктопе шапка sticky и сама резервирует место в потоке, доп. отступ не нужен. */}
          <main className="pt-14 md:pt-0">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
