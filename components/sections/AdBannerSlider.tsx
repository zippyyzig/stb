import BannerCarousel, { type BannerItem } from "./BannerCarousel";

interface AdBannerSliderProps {
  banners?: BannerItem[];
}

// Renders only what the caller passes in: there is deliberately no hardcoded
// fallback, so removed or unpublished banners never reappear.
export default function AdBannerSlider({ banners }: AdBannerSliderProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <BannerCarousel
      banners={banners}
      label="Promotional banners"
      desktopRatio="5 / 1"
      mobileRatio="16 / 5"
      className="mt-8 md:mt-10"
    />
  );
}
