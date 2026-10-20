import Hero from '@/components/Hero';
import BrandMarquee from '@/components/BrandMarquee';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import HowItWorks from '@/components/HowItWorks';
import Diagnostics from '@/components/Diagnostics';
import CasesPreview from '@/components/CasesPreview';
import Reviews from '@/components/Reviews';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <Services />
      <Pricing />
      <HowItWorks showMoreLink />
      <Diagnostics />
      <CasesPreview />
      <Reviews />
    </>
  );
}
