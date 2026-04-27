import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/auth",
          "/auth/*",
          "/cart",
          "/checkout",
          "/checkout/*",
          "/account",
          "/account/*",
          "/wishlist",
          "/orders",
          "/orders/*",
          "/_next",
          "/_next/*",
          "/private",
          "/private/*",
          "/*.json$",
          "/*?*", // Disallow URLs with query parameters (to prevent duplicate content)
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/auth",
          "/auth/*",
          "/cart",
          "/checkout",
          "/checkout/*",
          "/account",
          "/account/*",
          "/wishlist",
          "/orders",
          "/orders/*",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/auth",
          "/auth/*",
          "/cart",
          "/checkout",
          "/checkout/*",
          "/account",
          "/account/*",
          "/wishlist",
          "/orders",
          "/orders/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
