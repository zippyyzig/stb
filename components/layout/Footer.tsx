"use client";

import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Globe,
  MessageCircle,
  Send,
  Play,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from "lucide-react";

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
  { department: "Sales", number: "9353919299" },
  { department: "Billing", number: "9353919299" },
  { department: "Support", number: "9353919299" },
  { department: "CCTV Sales", number: "9353919299" },
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
      <div className="border-b border-white/10 bg-stb-darker">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-sm font-bold text-white md:text-base">Subscribe to Our Newsletter</h3>
            <p className="mt-0.5 text-xs text-white/50">Get updates on new products and exclusive deals</p>
          </div>
          {subscribeStatus === "success" ? (
            <div className="flex items-center gap-2 rounded-xl bg-stb-success/20 px-4 py-2.5 text-stb-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="text-xs font-medium">{"You're subscribed!"}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-9 flex-1 rounded-lg bg-white/10 px-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="h-9 rounded-lg bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-stb-red-dark disabled:opacity-70"
              >
                {subscribeStatus === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="font-heading text-xl font-bold text-white">S</span>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold tracking-wide">STB</h3>
                <p className="text-[10px] font-semibold text-primary">TECHNOLOGIES</p>
              </div>
            </div>
            <p className="mb-4 max-w-sm text-xs leading-relaxed text-white/60">
              Your trusted partner for computer accessories, CCTV cameras, printers,
              networking equipment, and all your technology needs. Serving businesses with
              quality products since 2010.
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-2 text-white/60">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-xs">2nd Floor, No. 94/1, Behind Sharda Theater, SP Road, Bangalore - 560002</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                <a href="tel:+919353919299" className="text-xs hover:text-white">+91 93539 19299</a>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                <a href="mailto:sales@sabkatechbazar.com" className="text-xs hover:text-white">sales@sabkatechbazar.com</a>
              </div>
            </div>
            {/* Social */}
            <div className="mt-5 flex gap-2">
              {[{ icon: Globe, label: "Website" }, { icon: MessageCircle, label: "WhatsApp" }, { icon: Send, label: "Telegram" }, { icon: Play, label: "YouTube" }].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {infoLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-primary"
                >
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Categories</h3>
            <nav className="flex flex-col gap-2">
              {categoryLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-primary"
                >
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Contact Us</h3>
            <div className="flex flex-col gap-2.5">
              {contactDetails.map((contact) => (
                <div key={contact.department} className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{contact.department}</span>
                  <a href={`tel:${contact.number}`} className="flex items-center gap-1 text-xs text-white/70 hover:text-primary">
                    <Phone className="h-3 w-3 text-primary" />
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/40">GSTIN</p>
              <p className="mt-1 font-mono text-xs text-white/70">29AABCU9603R1ZM</p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Copyright */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <p className="text-xs text-white/40">
          Copyright 2025, STB Technologies. All Rights Reserved.
        </p>
        <button
          onClick={scrollToTop}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-white"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
