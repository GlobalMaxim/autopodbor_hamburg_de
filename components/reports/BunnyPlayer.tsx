import { bunnyEmbedUrl } from '@/lib/reports/bunny';

export default function BunnyPlayer({ videoId }: { videoId: string }) {
  return (
    <iframe
      src={`${bunnyEmbedUrl(videoId)}?autoplay=true`}
      loading="lazy"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="h-full w-full rounded-2xl bg-black"
    />
  );
}
