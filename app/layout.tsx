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
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://smarttechbazaar.com",
    siteName: "Smart Tech Bazaar",
    title: "Smart Tech Bazaar - Computer Accessories, CCTV & IT Solutions",
    description:
      "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs.",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Tech Bazaar - Computer Accessories, CCTV & IT Solutions",
    description:
      "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs.",
  },
  robots: {
    index: true,
    follow: true,
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
