import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { CartWishlistProvider } from "@/components/providers/CartWishlistProvider";

export const metadata: Metadata = {
  title: {
    default: "Smart Tech Bazaar - Computer Accessories, CCTV & IT Solutions",
    template: "%s | Smart Tech Bazaar",
  },
  description:
    "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs. Shop B2B and B2C with competitive prices.",
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
  authors: [{ name: "Smart Tech Bazaar" }],
  creator: "Smart Tech Bazaar",
  applicationName: "Smart Tech Bazaar",
  appleWebApp: {
    capable: true,
    title: "Smart Tech Bazaar",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://smarttechbazaar.com",
    siteName: "Smart Tech Bazaar",
    title: "Smart Tech Bazaar - Computer Accessories, CCTV & IT Solutions",
    description:
      "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Smart Tech Bazaar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Tech Bazaar - Computer Accessories, CCTV & IT Solutions",
    description:
      "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#CC0000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="min-h-screen">
        <SessionProvider>
          <CartWishlistProvider>{children}</CartWishlistProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
