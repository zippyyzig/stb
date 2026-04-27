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
} from "lucide-react";

const infoLinks = [
  { name: "About Us", href: "/about" },
  { name: "Shipping Info", href: "/shipping" },
  { name: "Refund Policy", href: "/refund-policy" },
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

  return (
    <footer className="bg-stb-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 md:flex-row md:items-center md:py-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Stay in the Loop</h3>
            <p className="mt-0.5 text-[11px] text-white/50">New products, deals &amp; exclusive offers</p>
          </div>
          {subscribeStatus === "success" ? (
            <div className="flex items-center gap-2 rounded-xl bg-stb-success/20 px-4 py-2.5 text-stb-success">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">You&apos;re subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm overflow-hidden rounded-xl border border-white/15 bg-white/8 md:rounded-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="flex h-11 shrink-0 items-center justify-center gap-1.5 bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-stb-red-dark disabled:opacity-70 press-active"
              >
                {subscribeStatus === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Subscribe</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Mobile Footer — compact grid layout */}
      <div className="md:hidden">
        {/* Brand + contact */}
        <div className="border-b border-white/10 px-4 py-5">
          <Image src="/logo.png" alt="Smart Tech Bazaar" width={110} height={36} className="h-8 w-auto object-contain brightness-0 invert" />
          <div className="mt-3 flex flex-col gap-2.5">
            <a href="tel:+919353919299" className="flex items-center gap-2.5 text-xs text-white/70 press-active">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Phone className="h-3.5 w-3.5 text-primary" />
              </div>
              +91 93539 19299
            </a>
            <a href="mailto:sales@smarttechbazaar.com" className="flex items-center gap-2.5 text-xs text-white/70 press-active">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Mail className="h-3.5 w-3.5 text-primary" />
              </div>
              sales@smarttechbazaar.com
            </a>
          </div>
        </div>

        {/* Two-column link grid */}
        <div className="grid grid-cols-2 gap-0 border-b border-white/10">
          <div className="border-r border-white/10 px-4 py-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">Quick Links</p>
            <div className="flex flex-col gap-1">
              {infoLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="py-2 text-xs text-white/60 hover:text-primary press-active"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="px-4 py-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">Categories</p>
            <div className="flex flex-col gap-1">
              {categoryLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="py-2 text-xs text-white/60 hover:text-primary press-active"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
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
