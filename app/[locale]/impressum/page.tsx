import { setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Breadcrumbs items={[{ label: 'Impressum' }]} />
      <h1 className="text-4xl font-semibold tracking-tight">Impressum</h1>
      <p className="mt-6 text-muted">
        Здесь размещаются реальные юридические данные владельца бизнеса: имя,
        адрес, контакт, USt-ID. Не заполнять шаблонными реквизитами.
      </p>
    </div>
  );
}
