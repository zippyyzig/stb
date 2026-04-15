"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/products" },
    { name: "Desktop", href: "/category/desktop" },
    { name: "Laptop", href: "/category/laptop" },
    { name: "Security", href: "/category/security" },
    { name: "Networking", href: "/category/networking" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "B2B Portal", href: "/b2b" },
    { name: "Dealer Registration", href: "/auth/register?type=dealer" },
    { name: "Careers", href: "/careers" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Track Order", href: "/track" },
    { name: "FAQs", href: "/faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ],
};

const contactDetails = [
  { department: "Sales", number: "9876543210" },
  { department: "Support", number: "9876543212" },
  { department: "CCTV", number: "9876543213" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-card">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-md">
            <h3 className="heading-lg">Stay in the loop</h3>
            <p className="body-md mt-2 text-muted-foreground">
              Subscribe to get special offers, new arrivals, and expert tech tips.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 rounded-full bg-muted px-5"
            />
            <Button size="lg" className="h-12 gap-2 rounded-full px-6">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
                <span className="font-serif text-lg text-background">S</span>
              </div>
              <span className="font-serif text-xl tracking-tight">Sabka Tech Bazar</span>
            </Link>
            <p className="body-md mt-4 max-w-xs text-muted-foreground">
              Your trusted partner for computer accessories, CCTV cameras, networking equipment, and all your technology needs.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="mailto:sales@sabkatechbazar.com"
                className="body-sm flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                sales@sabkatechbazar.com
              </a>
              <div className="body-sm flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Industrial Area, Jaipur - 302006
              </div>
            </div>
            {/* Social Links */}
            <div className="mt-6 flex gap-2">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="heading-sm mb-4">Shop</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="body-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="heading-sm mb-4">Company</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="body-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="heading-sm mb-4">Support</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="body-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="heading-sm mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              {contactDetails.map((contact) => (
                <a
                  key={contact.department}
                  href={`tel:${contact.number}`}
                  className="body-sm flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5 text-stb-success" />
                  <span className="font-medium text-foreground">{contact.department}:</span>
                  {contact.number}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Copyright Bar */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <p className="body-sm text-muted-foreground">
          © 2025 Sabka Tech Bazar. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {footerLinks.legal.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="body-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="h-10 w-10 rounded-full"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </footer>
  );
}
