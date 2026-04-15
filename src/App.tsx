import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/sections/AnnouncementBar";
import HeroBanner from "@/components/sections/HeroBanner";
import PromoGrid from "@/components/sections/PromoGrid";
import TopCategories from "@/components/sections/TopCategories";
import ProductSection from "@/components/sections/ProductSection";
import BrandScroller from "@/components/sections/BrandScroller";
import { productSections } from "@/data/products";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <AnnouncementBar />

      <main className="flex-1">
        <HeroBanner />
        <PromoGrid />
        <TopCategories />
        {productSections.map((section) => (
          <ProductSection key={section.title} section={section} />
        ))}
        <BrandScroller />
      </main>

      <Footer />
    </div>
  );
}
