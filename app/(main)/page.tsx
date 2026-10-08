import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FestiveHero from "@/components/sections/FestiveHero";
import HeroBanner from "@/components/sections/HeroBanner";
import AdBannerSlider from "@/components/sections/AdBannerSlider";
import DealStrip, { type DealStripItem } from "@/components/sections/DealStrip";
import TileGridCard, { type TileItem } from "@/components/sections/TileGridCard";
import PromoCta from "@/components/sections/PromoCta";
import BrandSpotlight from "@/components/sections/BrandSpotlight";
import ShortcutRow from "@/components/sections/ShortcutRow";
import ProductFeed from "@/components/sections/ProductFeed";
import type { RailProduct } from "@/components/sections/ProductRail";
import { formatInr, type FkVariant } from "@/components/sections/fk-theme";
import JsonLd from "@/components/seo/JsonLd";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
} from "@/lib/schema";
import {
  getHomepageCategories,
  getBrands,
  getHeroSliderBanners,
  getAdBanners,
  getBestSellers,
  getMostPopular,
  getHotBrands,
  getNewArrivals,
  getCuratedSections,
} from "@/lib/data";

// Render on demand instead of prerendering at build time.
//
// Next.js gives every statically generated page a hard 60s budget. Product
// images and brand logos are stored in Mongo as inline base64 data URIs, so the
// homepage rails transfer megabytes and blow past that budget. Rendering on
// demand makes the build independent of the database; freshness and speed still
// come from the per-query `unstable_cache` wrappers in lib/data.ts.
//
// `revalidate` alone does NOT skip the build: the route is still prerendered at
// build time and hits the 60s limit ("Failed to build /(main)/page: / after 3
// attempts"). `force-dynamic` is what actually keeps the build off the database.
export const dynamic = "force-dynamic";

// Resolve a data fetch, falling back to an empty list if it fails, so a
// transient MongoDB error never aborts the build or blanks the page.
async function safeList<T>(
  load: () => Promise<T[]>,
  label: string
): Promise<T[]> {
  // Document transfer (inline base64 images) dominates query time, so the cap
  // stays well above the real cost of these queries.
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error("Homepage data fetch timed out")),
        60000
      );
    });
    return await Promise.race([load(), timeout]);
  } catch (error) {
    console.error(`[v0] Homepage data fetch failed (${label}):`, error);
    return [];
  } finally {
    // Always cancel the timer, otherwise it holds the request open for the full
    // timeout even when every query has already resolved.
    clearTimeout(timer);
  }
}

// The Mongo pool is capped at `maxPoolSize: 5` and keeps one socket warm, so
// firing every fetch at once forces several slow TLS handshakes in parallel and
// the last fetches time out empty. Running a few at a time reuses warm sockets.
const HOMEPAGE_FETCH_CONCURRENCY = 2;

// Run the homepage fetches in small batches, preserving result order.
async function loadInBatches<T>(
  tasks: (() => Promise<T[]>)[]
): Promise<T[][]> {
  const results: T[][] = new Array(tasks.length);
  let next = 0;

  const workers = Array.from(
    { length: Math.min(HOMEPAGE_FETCH_CONCURRENCY, tasks.length) },
    async () => {
      while (true) {
        const index = next++;
        if (index >= tasks.length) return;
        results[index] = await tasks[index]();
      }
    }
  );

  await Promise.all(workers);
  return results;
}

const SECONDARY_BANNERS = [
  {
    id: "laptop-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laptop%20Banner.jpg-aZ74t8huDopt1RRCwikZSJznyGUZMl.jpeg",
    imageMobile: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laptop%20%20%20banner%20350x150_.jpg-QwzNwHKG7YQDTvQgMNUyfQLCw9HszO.jpeg",
    alt: "High-performance portability tailored for creators, students, and professionals on the move",
    href: "/category/laptops",
  },
  {
    id: "storage-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Storage%20%20Banner.jpg-Br2pDtXHqxUP0A7rMmWIwC6BKzMrRy.jpeg",
    imageMobile: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/storage%20banner%20350x150_.jpg-MiKzFE7Di0afXQ8issISTZNHQzHSIn.jpeg",
    alt: "Secure your digital life with high-speed SSDs, massive hard drives, and reliable cloud-ready solutions",
    href: "/category/storage",
  },
  {
    id: "networking-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Networking%20Banner.jpg-8TJO7lyqPmcGBoBLNeboJBiU5xTj4p.jpeg",
    imageMobile: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/networking%20%20%20banner%20350x150_.jpg-4tbfFBsFp1vevULnC5LZYs1nq9kc0T.jpeg",
    alt: "Blazing fast internet starts here - Stay connected, stay ahead",
    href: "/category/networking",
  },
  {
    id: "mobility-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mobility%20Banner.jpg-fIVom9upVU5bdAYHsa9o5xGUeVS5U1.jpeg",
    imageMobile: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobility%20%20%20banner%20350x150_.jpg-iA1gann5XrBSjK81afumysLvLYvfKh.jpeg",
    alt: "Never run out of power - Smart, fast and portable charging solutions",
    href: "/category/mobility",
  },
  {
    id: "security-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Security%20Banner.jpg-placeholder.jpeg",
    imageMobile: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/security%20%20banner%20350x150_.jpg-qZz8kztQHrIl0siABkWDjIOduswvgK.jpeg",
    alt: "Comprehensive protection for your data and hardware with advanced software and physical locks",
    href: "/category/security",
  },
];

export default async function HomePage() {
  const [
    categories,
    brands,
    heroSliderBanners,
    adBanners,
    bestSellers,
    mostPopular,
    hotBrands,
    newArrivals,
    curatedSections,
  ] = (await loadInBatches<any>([
    () => safeList(getHomepageCategories, "homepageCategories"),
    () => safeList(getBrands, "brands"),
    () => safeList(getHeroSliderBanners, "heroSliderBanners"),
    () => safeList(getAdBanners, "adBanners"),
    () => safeList(getBestSellers, "bestSellers"),
    () => safeList(getMostPopular, "mostPopular"),
    () => safeList(getHotBrands, "hotBrands"),
    () => safeList(getNewArrivals, "newArrivals"),
    () => safeList(getCuratedSections, "curatedSections"),
  ])) as [
    Awaited<ReturnType<typeof getHomepageCategories>>,
    Awaited<ReturnType<typeof getBrands>>,
    Awaited<ReturnType<typeof getHeroSliderBanners>>,
    Awaited<ReturnType<typeof getAdBanners>>,
    Awaited<ReturnType<typeof getBestSellers>>,
    Awaited<ReturnType<typeof getMostPopular>>,
    Awaited<ReturnType<typeof getHotBrands>>,
    Awaited<ReturnType<typeof getNewArrivals>>,
    Awaited<ReturnType<typeof getCuratedSections>>,
  ];

  // The homepage rails come solely from the category configuration in
  // lib/section-matching.ts; the admin `homepage_sections` collection is
  // deliberately not rendered here.
  const [leadSections, restSections] = [
    curatedSections.slice(0, 2),
    curatedSections.slice(2),
  ];

  const priceOf = (p: RailProduct) => Number(p.priceB2C) || 0;
  const discountOf = (p: RailProduct) => {
    const price = priceOf(p);
    const mrp = Number(p.mrp) || 0;
    return mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  };

  // Each product is shown once above the fold so the page never repeats itself
  // and the image payload (inline base64) stays small.
  const used = new Set<string>();
  const takeUnique = (list: RailProduct[], count: number): RailProduct[] => {
    const out: RailProduct[] = [];
    for (const product of list) {
      if (out.length >= count) break;
      if (!product.image || used.has(product.id)) continue;
      used.add(product.id);
      out.push(product);
    }
    return out;
  };

  const toStripItem = (p: RailProduct): DealStripItem => ({
    id: p.id,
    image: p.image,
    title: p.name,
    label: priceOf(p) > 0 ? formatInr(priceOf(p)) : "View",
    href: `/product/${p.slug}`,
  });

  const toTile = (p: RailProduct): TileItem => {
    const discount = discountOf(p);
    return {
      id: p.id,
      image: p.image,
      label: p.brand || p.name,
      caption:
        discount >= 5
          ? `Min. ${discount}% Off`
          : priceOf(p) > 0
            ? `From ${formatInr(priceOf(p))}`
            : "Shop now",
      href: `/product/${p.slug}`,
    };
  };

  const topTech = takeUnique(bestSellers, 8).map(toStripItem);

  // "Deals you can't miss": one tile per category rail with its best discount.
  const dealTiles: TileItem[] = curatedSections
    .map((section) => {
      const lead = section.products.find((p) => p.image && !used.has(p.id));
      if (!lead) return null;
      used.add(lead.id);
      const prices = section.products.map(priceOf).filter((price) => price > 0);
      const maxDiscount = Math.max(0, ...section.products.map(discountOf));
      return {
        id: section.slug,
        image: lead.image,
        label: section.title,
        caption:
          maxDiscount >= 5
            ? `Up to ${maxDiscount}% Off`
            : prices.length > 0
              ? `From ${formatInr(Math.min(...prices))}`
              : "Explore",
        href: `/category/${section.slug}`,
      } satisfies TileItem;
    })
    .filter((tile): tile is TileItem => tile !== null)
    .slice(0, 4);

  const festiveArrivals = takeUnique(newArrivals, 8).map(toStripItem);
  const popularGadgets = takeUnique(mostPopular, 4).map(toTile);
  const peopleAlsoViewed = takeUnique(mostPopular, 4).map(toTile);

  const sectionVariants: FkVariant[] = ["blue", "purple"];
  const categoryTiles = curatedSections.slice(0, 3).map((section, index) => ({
    slug: section.slug,
    title: section.title,
    variant: sectionVariants[index % sectionVariants.length],
    tiles: takeUnique(section.products, 4).map(toTile),
  }));

  const feedProducts = takeUnique(
    [
      ...mostPopular,
      ...bestSellers,
      ...newArrivals,
      ...curatedSections.flatMap((section) => section.products),
    ],
    20
  );

  const brandList = hotBrands.length > 0 ? hotBrands : brands;

  const schemas = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateLocalBusinessSchema(),
  ];

  const isEmpty =
    curatedSections.length === 0 &&
    newArrivals.length === 0 &&
    bestSellers.length === 0 &&
    mostPopular.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#FFF3C4_0px,#FFFFFF_360px)]">
      <Header />
      <main className="flex-1 pb-4">
        <JsonLd data={schemas} />

        <FestiveHero />

        <HeroBanner banners={heroSliderBanners.length > 0 ? heroSliderBanners : undefined} />

        <AdBannerSlider banners={adBanners} />

        <DealStrip
          title="Top tech deals revealed"
          href="/products?sortBy=bestselling"
          items={topTech}
          variant="blue"
        />

        <TileGridCard title="Deals you can't miss" href="/categories" items={dealTiles} variant="blue" />

        <DealStrip
          title="Festive arrivals"
          href="/products?sortBy=newest"
          items={festiveArrivals}
          variant="festive"
        />

        <PromoCta eyebrow="Festive season" title="Gift guide revealed" href="/products?sortBy=bestselling" />

        <BrandSpotlight brands={brandList} />

        <ShortcutRow />

        <TileGridCard
          title="Best gadgets & more"
          href="/products"
          items={popularGadgets}
          variant="purple"
        />

        {categoryTiles.map((section) => (
          <TileGridCard
            key={section.slug}
            title={section.title}
            href={`/category/${section.slug}`}
            items={section.tiles}
            variant={section.variant}
          />
        ))}

        <AdBannerSlider banners={SECONDARY_BANNERS} />

        <TileGridCard title="People also viewed" href="/products" items={peopleAlsoViewed} variant="blue" />

        <ProductFeed products={feedProducts} />

        {isEmpty && (
          <div className="mx-auto max-w-7xl px-4 py-20 text-center">
            <h2 className="mb-2 text-2xl font-bold text-fk-ink">No Products Available</h2>
            <p className="text-sm text-fk-grey">
              Products will appear here once they are added to the database.
              Configure homepage sections in the admin panel.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
