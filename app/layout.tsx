import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { CartWishlistProvider } from "@/components/providers/CartWishlistProvider";

export const metadata: Metadata = {
  title: {
    default: "Sabka Tech Bazar - Computer Accessories, CCTV & IT Solutions",
    template: "%s | Sabka Tech Bazar",
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
  ],
  authors: [{ name: "Sabka Tech Bazar" }],
  creator: "Sabka Tech Bazar",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sabkatechbazar.com",
    siteName: "Sabka Tech Bazar",
    title: "Sabka Tech Bazar - Computer Accessories, CCTV & IT Solutions",
    description:
      "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sabka Tech Bazar - Computer Accessories, CCTV & IT Solutions",
    description:
      "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#DC2626",
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
