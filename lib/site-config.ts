// Site configuration for SEO and metadata
export const siteConfig = {
  name: "Smart Tech Bazaar",
  shortName: "STB",
  description: "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs. Shop B2B and B2C with competitive prices.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://smarttechbazaar.com",
  ogImage: "/logo.png",
  locale: "en_IN",
  
  // Business information for schema markup
  business: {
    name: "Smart Tech Bazaar",
    legalName: "Smart Tech Bazaar Private Limited",
    email: "support@smarttechbazaar.com",
    phone: "+91-1234567890",
    address: {
      streetAddress: "2nd Floor, No. 94/1, Behind Sharda Theater, SP Road",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560002",
      addressCountry: "IN",
    },
    geo: {
      latitude: "12.9783",
      longitude: "77.5738",
    },
    openingHours: "Mo-Sa 09:00-21:00",
    priceRange: "₹₹",
    socialLinks: {
      facebook: "https://facebook.com/smarttechbazaar",
      twitter: "https://twitter.com/smarttechbazaar",
      instagram: "https://instagram.com/smarttechbazaar",
      linkedin: "https://linkedin.com/company/smarttechbazaar",
      youtube: "https://youtube.com/smarttechbazaar",
    },
  },
  
  // Default SEO keywords
  keywords: [
    "computer accessories",
    "CCTV cameras",
    "networking equipment",
    "printers",
    "IT solutions",
    "B2B wholesale",
    "tech products",
    "Smart Tech Bazaar",
  ],
  
  // Authors
  authors: [{ name: "Smart Tech Bazaar" }],
  creator: "Smart Tech Bazaar",
} as const;

// Helper to get full URL
export function getFullUrl(path: string = ""): string {
  const baseUrl = siteConfig.url.endsWith("/") 
    ? siteConfig.url.slice(0, -1) 
    : siteConfig.url;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

// Helper to generate canonical URL
export function getCanonicalUrl(path: string): string {
  return getFullUrl(path);
}
