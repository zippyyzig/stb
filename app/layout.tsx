import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { CartWishlistProvider } from "@/components/providers/CartWishlistProvider";
import { NativeAppProvider } from "@/components/providers/NativeAppProvider";

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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32x32.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/icons/icon-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
    shortcut: "/icons/icon-192x192.jpg",
    apple: [
      { url: "/icons/icon-192x192.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Smart Tech Bazaar",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://smarttechbazaar.com",
    siteName: "Smart Tech Bazaar",
    title: "Smart Tech Bazaar - Computer Accessories, CCTV & IT Solutions",
    description:
      "Your trusted partner for computer accessories, CCTV cameras, printers, networking equipment, and all your technology needs.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "Smart Tech Bazaar",
    "apple-mobile-web-app-title": "STB",
    "msapplication-TileColor": "#E31837",
    "msapplication-tap-highlight": "no",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E31837" },
    { media: "(prefers-color-scheme: dark)", color: "#E31837" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Splash screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1290-2796.png"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1179-2556.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1170-2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1125-2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-750-1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
      </head>
      <body className="min-h-screen">
        <SessionProvider>
          <CartWishlistProvider>
            <NativeAppProvider>{children}</NativeAppProvider>
          </CartWishlistProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
