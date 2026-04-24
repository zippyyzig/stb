"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Send,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const infoLinks = [
  { name: "About Us", href: "/about" },
  { name: "Shipping Info", href: "/shipping" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Dealer Registration", href: "/auth/register?type=dealer" },
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
  { department: "Sales", number: "9353919299" },
  { department: "Billing", number: "9353919299" },
  { department: "Support", number: "9353919299" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || subscribeStatus === "loading") return;
    setSubscribeStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribeStatus("success");
        setEmail("");
      } else {
        setSubscribeStatus("error");
        setTimeout(() => setSubscribeStatus("idle"), 3000);
      }
    } catch {
      setSubscribeStatus("error");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-stb-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 md:flex-row md:items-center md:py-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Subscribe to Our Newsletter</h3>
            <p className="mt-0.5 text-[11px] text-white/50">Get updates on new products and exclusive deals</p>
          </div>
          {subscribeStatus === "success" ? (
            <div className="flex items-center gap-2 rounded-lg bg-stb-success/20 px-4 py-2 text-stb-success">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-9 min-w-0 flex-1 rounded border border-white/10 bg-white/5 px-3 text-xs text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded bg-primary px-4 text-xs font-medium text-white transition-colors hover:bg-stb-red-dark disabled:opacity-70"
              >
                {subscribeStatus === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Mobile Accordion Footer */}
      <div className="md:hidden">
        {/* Brand */}
        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Smart Tech Bazaar" width={110} height={36} className="h-9 w-auto object-contain brightness-0 invert" />
          </div>
          <div className="mt-3 space-y-1.5 text-[11px] text-white/60">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 shrink-0 text-primary" />
              <a href="tel:+919353919299">+91 93539 19299</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 shrink-0 text-primary" />
              <a href="mailto:sales@smarttechbazaar.com">sales@smarttechbazaar.com</a>
            </div>
          </div>
        </div>

        {/* Accordion sections */}
        {[
          { title: "Quick Links", links: infoLinks },
          { title: "Categories", links: categoryLinks },
        ].map((section) => (
          <div key={section.title} className="border-b border-white/10">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs font-medium text-white">{section.title}</span>
              <ChevronDown
                className={`h-4 w-4 text-white/50 transition-transform ${openSection === section.title ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === section.title && (
              <div className="px-4 pb-3">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-1 py-1.5 text-[11px] text-white/50 hover:text-primary"
                  >
                    <ChevronRight className="h-2.5 w-2.5" />
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Brand Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <Image src="/logo.png" alt="Smart Tech Bazaar" width={130} height={42} className="h-10 w-auto object-contain brightness-0 invert" />
              </div>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/60">
                Your trusted partner for computer accessories, CCTV cameras, printers,
                networking equipment, and all your technology needs. Serving businesses with
                quality products since 2010.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-xs text-white/60">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>2nd Floor, No. 94/1, Behind Sharda Theater, SP Road, Bangalore - 560002</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <a href="tel:+919353919299" className="hover:text-white">+91 93539 19299</a>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <a href="mailto:sales@smarttechbazaar.com" className="hover:text-white">sales@smarttechbazaar.com</a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                {infoLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-primary"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Categories */}
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white">Categories</h4>
              <nav className="flex flex-col gap-2">
                {categoryLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-primary"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white">Contact</h4>
              <div className="space-y-2">
                {contactDetails.map((contact) => (
                  <div key={contact.department} className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{contact.department}</span>
                    <a href={`tel:${contact.number}`} className="flex items-center gap-1 text-white/70 hover:text-primary">
                      <Phone className="h-3 w-3 text-primary" />
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded border border-white/10 bg-white/5 p-3">
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/40">GSTIN</p>
                <p className="mt-1 font-mono text-xs text-white/70">29AABCU9603R1ZM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
          <p className="text-[10px] text-white/40 md:text-xs">
            &copy; 2025 Smart Tech Bazaar. All Rights Reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-white md:h-8 md:w-8"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
