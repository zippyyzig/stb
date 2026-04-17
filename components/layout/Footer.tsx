"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  ExternalLink,
  ArrowUp,
  Globe,
  MessageCircle,
  Send,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const infoLinks = [
  { name: "About Us", href: "/about" },
  { name: "Shipping Information", href: "/shipping" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Dealer Registration", href: "/auth/register?type=dealer" },
  { name: "Customer Registration", href: "/auth/register" },
];

const categoryLinks = [
  { name: "Desktop", href: "/category/desktop" },
  { name: "Laptop", href: "/category/laptop" },
  { name: "Networking", href: "/category/networking" },
  { name: "Security", href: "/category/security" },
  { name: "Printers", href: "/category/printers" },
  { name: "Software", href: "/category/software" },
];

const contactDetails = [
  { department: "Sales", number: "9876543210" },
  { department: "Billing", number: "9876543211" },
  { department: "Support", number: "9876543212" },
  { department: "CCTV Sales", number: "9876543213" },
  { department: "Networking", number: "9876543214" },
  { department: "Dispatch", number: "9876543215" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-stb-dark text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10 bg-stb-darker py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div>
            <h3 className="heading-md text-white">Subscribe to Our Newsletter</h3>
            <p className="body-sm mt-1 text-white/60">
              Get updates on new products and exclusive deals
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="rounded bg-primary px-6 hover:bg-stb-red-dark">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <span className="font-heading text-2xl font-bold text-white">S</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold tracking-wide">STB</h3>
                <p className="body-sm -mt-0.5 text-primary">TECHNOLOGIES</p>
              </div>
            </div>
            <p className="body-md mb-4 max-w-sm text-white/70">
              Your trusted partner for computer accessories, CCTV cameras, printers,
              networking equipment, and all your technology needs. Serving businesses
              with quality products since 2010.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="body-sm">
                  2nd Floor, Industrial Area, Jaipur - 302006, Rajasthan, India
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="mailto:sales@sabkatechbazar.com"
                  className="body-sm hover:text-white"
                >
                  sales@sabkatechbazar.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-primary hover:text-white"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-primary hover:text-white"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-primary hover:text-white"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-primary hover:text-white"
              >
                <Play className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="heading-sm mb-4 text-white">Quick Links</h3>
            <nav className="flex flex-col gap-2.5">
              {infoLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="body-sm flex items-center gap-1.5 text-white/60 transition-colors hover:text-primary"
                >
                  <ExternalLink className="h-3 w-3" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="heading-sm mb-4 text-white">Categories</h3>
            <nav className="flex flex-col gap-2.5">
              {categoryLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="body-sm flex items-center gap-1.5 text-white/60 transition-colors hover:text-primary"
                >
                  <ExternalLink className="h-3 w-3" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="heading-sm mb-4 text-white">Contact Us</h3>
            <div className="flex flex-col gap-3">
              {contactDetails.slice(0, 4).map((contact) => (
                <div
                  key={contact.department}
                  className="flex items-center justify-between"
                >
                  <span className="body-sm text-white/60">{contact.department}</span>
                  <a
                    href={`tel:${contact.number}`}
                    className="body-sm flex items-center gap-1.5 text-white/80 hover:text-primary"
                  >
                    <Phone className="h-3 w-3 text-primary" />
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>

            {/* Bank Details */}
            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="heading-sm text-sm text-white">Bank Details</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white/60">
                  <CreditCard className="h-3.5 w-3.5 shrink-0" />
                  <span className="body-sm">A/C: 1234567890</span>
                </div>
                <div className="body-sm text-white/60">IFSC: HDFC0001234</div>
                <div className="body-sm text-white/60">Branch: Main Branch, Jaipur</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Copyright Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <p className="body-sm text-white/50">
          Copyright 2025, STB Technologies. All Rights Reserved.
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToTop}
          className="h-10 w-10 rounded-full bg-primary/20 text-white hover:bg-primary hover:text-white"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </footer>
  );
}
