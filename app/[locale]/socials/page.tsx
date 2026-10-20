import SocialLinks from '@/components/SocialLinks';

export default function SocialsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Соцсети</h1>
      <p className="mt-3 text-muted">
        Есть вопросы по подбору? Напишите нам напрямую.
      </p>
      <div className="mt-10">
        <SocialLinks />
      </div>
    </div>
  );
}
